"use client";
import dynamic from "next/dynamic";

const FullMusicPlayer = dynamic(
  () =>
    import("@/components/MusicPlayer/FullMusicPlayer").then(
      (mod) => mod.FullMusicPlayer
    ),
  { ssr: false }
);

export default function FullMusicPlayerWrapper() {
  return <FullMusicPlayer />;
}
