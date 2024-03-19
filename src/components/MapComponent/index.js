"use client";

import dynamic from "next/dynamic";

const MyAwesomeMap = dynamic(() => import("@components/ViewMap/index"), {
  ssr: false,
});

export default function MapPointer() {
  return <MyAwesomeMap />;
}
