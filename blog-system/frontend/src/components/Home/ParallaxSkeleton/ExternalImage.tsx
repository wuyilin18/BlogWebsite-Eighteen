import Image from "next/image";

export default function ExternalImage({ url }: { url: string }) {
  return (
    <div className="relative w-full h-64">
      <Image
        src={url}
        loader={({ src }) => src}
        alt="External Image"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw" // 响应式尺寸
      />
    </div>
  );
}
