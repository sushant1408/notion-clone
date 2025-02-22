"use client";

import { ModeToggle } from "@/components/mode-toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSettings } from "../hooks/use-settings";

const SettingsModal = () => {
  const { isOpen, onClose } = useSettings();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-medium">My Settings</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <Label>Appearance</Label>
            <span className="text-xs text-muted-foreground">
              Customize how Notion Clone looks on your device.
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SettingsModal };
