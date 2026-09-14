"use client";

import "@/i18n";
import SubscribePopup from "@/Components/SubscribePopup";

export default function Providers({ children }) {
  return (
    <>
      {children}
      <SubscribePopup />
    </>
  );
}
