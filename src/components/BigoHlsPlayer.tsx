import React, { useEffect, useRef, useState } from 'react';

interface BigoHlsPlayerProps {
  streamUrl: string;
}

function resolveHlsStreamUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();

  if (trimmed.startsWith('/api/')) return trimmed;

  // Extract numeric SID from Bigo link (e.g. /sid/2525959848_...)
  const sidMatch = trimmed.match(/sid\/(\d+)/);
  if (sidMatch && sidMatch[1]) {
    return `/api/bigo-stream-proxy?sid=${sidMatch[1]}`;
  }

  // Fallback: search any string of 8+ digits in Bigo URL
  const digitMatch = trimmed.match(/\/(\d{8,})/);
  if (digitMatch && digitMatch[1]) {
    return `/api/bigo-stream-proxy?sid=${digitMatch[1]}`;
  }

  if (trimmed.includes('.m3u8') || trimmed.includes('.flv')) {
    return `/api/bigo-stream-proxy?url=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}

export const BigoHlsPlayer: React.FC<BigoHlsPlayerProps> = ({ streamUrl }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const resolvedUrl = resolveHlsStreamUrl(streamUrl);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resolvedUrl) return;

    let hlsInstance: any = null;

    const playVideo = () => {
      video.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay muted fallback
        video.muted = true;
        setIsMuted(true);
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      });
    };

    // Native HLS support (iOS Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = resolvedUrl;
      playVideo();
    } else if (typeof window !== 'undefined') {
      const loadHls = () => {
        if ((window as any).Hls && (window as any).Hls.isSupported()) {
          hlsInstance = new (window as any).Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsInstance.loadSource(resolvedUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on((window as any).Hls.Events.MANIFEST_PARSED, () => {
            playVideo();
          });
          hlsInstance.on((window as any).Hls.Events.ERROR, (_event: any, data: any) => {
            if (data.fatal) {
              switch (data.type) {
                case (window as any).Hls.ErrorTypes.NETWORK_ERROR:
                  // Direct HLS fallback if CORS proxy fails
                  if (resolvedUrl.includes('/api/bigo-stream-proxy') && streamUrl) {
                    const sid = streamUrl.match(/sid\/(\d+)/)?.[1] || streamUrl.match(/\/(\d{8,})/)?.[1];
                    const directHls = sid ? `https://pull-hls.bigo.tv/live/${sid}.m3u8` : streamUrl;
                    video.src = directHls;
                    playVideo();
                  } else {
                    hlsInstance.startLoad();
                  }
                  break;
                case (window as any).Hls.ErrorTypes.MEDIA_ERROR:
                  hlsInstance.recoverMediaError();
                  break;
                default:
                  hlsInstance.destroy();
                  break;
              }
            }
          });
        }
      };

      if ((window as any).Hls) {
        loadHls();
      } else {
        const scriptId = 'hls-js-cdn-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;
        if (!script) {
          script = document.createElement('script');
          script.id = scriptId;
          script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
          script.async = true;
          script.onload = loadHls;
          document.body.appendChild(script);
        } else {
          script.addEventListener('load', loadHls);
        }
      }
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [resolvedUrl, streamUrl]);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      setIsMuted(false);
      video.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl group">
      <video
        ref={videoRef}
        controls
        playsInline
        muted={isMuted}
        autoPlay
        disablePictureInPicture
        controlsList="nodownload noplaybackrate"
        className="w-full h-full object-contain bg-black"
      />
      {isMuted && (
        <button
          type="button"
          onClick={handleUnmute}
          className="absolute bottom-3 right-3 z-30 px-3 py-1.5 rounded-full bg-red-600/90 hover:bg-red-500 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-lg backdrop-blur-md border border-white/20 transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer"
        >
          <span>🔊 Activar Sonido</span>
        </button>
      )}
    </div>
  );
};
