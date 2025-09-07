"use client";

import dynamic from "next/dynamic";
import { ToastProviderProps } from "./ToastProvider";

const ToastProviderDynamic = dynamic(() => import("./ToastProvider"), {
  ssr: false,
});

export default function ToastProvider(props: ToastProviderProps) {
  return <ToastProviderDynamic {...props} />;
}
