"use client";

import dynamic from "next/dynamic";
import React from "react";

const TwikooComments = dynamic(
  () => import("./TwikooComments").then((mod) => mod.TwikooComments),
  { ssr: false }
);

interface TwikooWrapperProps {
  title?: string;
  className?: string;
}

const TwikooCommentsWrapper: React.FC<TwikooWrapperProps> = (props) => {
  return <TwikooComments {...props} />;
};

export default TwikooCommentsWrapper;
