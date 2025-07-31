import React from "react";

export const metadata = {
  title: "图库 | Eighteen's Blog",
  description: "Eighteen's photography and design gallery.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
