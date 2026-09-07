import React, { useEffect, useRef } from 'react';

interface BigoHlsPlayerProps {
  streamUrl: string;
}

export const BigoHlsPlayer: React.FC<BigoHlsPlayerProps> = ({ streamUrl }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    let hlsInstance: any = null;

    // Check if browser has native HLS support (iOS Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.play().catch(() => {});
    } else if (typeof window !== 'undefined') {
      const loadHls = () => {
        if ((window as any).Hls && (window as any).Hls.isSupported()) {
          hlsInstance = new (window as any).Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on((window as any).Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
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
  }, [streamUrl]);

  return (
    <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-inner group">
      <video
        ref={videoRef}
        controls
        playsInline
        muted
        autoPlay
        className="w-full h-full object-contain"
      />
    </div>
  );
};
