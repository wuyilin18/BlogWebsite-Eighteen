"use client";
import Image from "next/image";

export default function PostImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={900}
      height={500}
      className="w-full h-auto object-cover"
    />
  );
}
