"use client";

import { useState } from "react";
import Image from "next/image";

interface EscudoImageProps {
  src: string;
  alt: string;
}

export default function EscudoImage({ src, alt }: EscudoImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">
        <span className="text-3xl font-bold text-emerald-400">
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={80}
      height={80}
      className="object-contain w-20 h-20"
      onError={() => setError(true)}
      unoptimized
    />
  );
}
