"use client";

import { useEffect, useState } from "react";

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
    </>
  );
};

export { Modals };
