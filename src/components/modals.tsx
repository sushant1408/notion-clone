"use client";

import { useEffect, useState } from "react";

import { CoverImageModal } from "@/features/documents/components/cover-image-modal";
import { SettingsModal } from "@/features/settings/components/settings-modal";

const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingsModal />
      <CoverImageModal />
    </>
  );
};

export { Modals };
