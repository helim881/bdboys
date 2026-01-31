"use client";

import { useEffect, useRef, useState } from "react";

export const WatermarkedImage = ({
  src,
  alt,
  siteName = "BDBOYS.COM",
}: {
  src: string;
  alt: string;
  siteName?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      // 1. Draw original image
      ctx.drawImage(img, 0, 0);

      // 2. Setup Font - scale size based on image width
      const fontSize = Math.floor(canvas.width / 30);
      ctx.font = `bold ${fontSize}px Arial`;

      // Add a subtle shadow so it's visible on any background
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 10;

      // 3. Draw Watermark Text
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";

      // Positioning: 2% padding from bottom-right
      const padding = canvas.width * 0.02;
      ctx.fillText(siteName, canvas.width - padding, canvas.height - padding);

      // 4. Set the result as the image source
      setDataUrl(canvas.toDataURL("image/jpeg", 0.9));
    };
  }, [src, siteName]);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      {dataUrl ? (
        <img src={dataUrl} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      )}
    </>
  );
};
