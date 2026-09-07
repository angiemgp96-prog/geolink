import React, { useEffect, useRef, useState } from 'react';

interface BigoHlsPlayerProps {
  streamUrl: string;
}

function resolveHlsStreamUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (trimmed.includes('.m3u8') || trimmed.includes('.flv')) {
    return trimmed;
  }

  // Extract numeric SID from Bigo link (e.g. /sid/2525959848_...)
  const sidMatch = trimmed.match(/sid\/(\d+)/);
  if (sidMatch && sidMatch[1]) {
    return `https://pull-hls.bigo.tv/live/${sidMatch[1]}.m3u8`;
  }

  // Fallback: search any string of 8+ digits in Bigo URL
  const digitMatch = trimmed.match(/\/(\d{8,})/);
  if (digitMatch && digitMatch[1]) {
    return `https://pull-hls.bigo.tv/live/${digitMatch[1]}.m3u8`;
  }

  return trimmed;
}

export const BigoHlsPlayer: React.FC<BigoHlsPlayerProps> = ({ streamUrl }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const resolvedUrl = resolveHlsStreamUrl(streamUrl);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resolvedUrl) return;

    let hlsInstance: any = null;

    const playVideo = () => {
      video.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay muted fallback
        video.muted = true;
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
                  hlsInstance.startLoad();
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
  }, [resolvedUrl]);

  return (
    <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
      <video
        ref={videoRef}
        controls
        playsInline
        muted
        autoPlay
        className="w-full h-full object-contain bg-black"
      />
    </div>
  );
};
