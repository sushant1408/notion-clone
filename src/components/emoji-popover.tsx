import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { ReactNode, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";

interface EmojiPopoverProps {
  children: ReactNode;
  asChild?: boolean;
  onEmojiSelect: (emoji: EmojiClickData["emoji"]) => void;
}

const themeMap = {
  "dark": Theme.DARK,
  "light": Theme.LIGHT,
}

const EmojiPopover = ({
  children,
  onEmojiSelect,
  asChild,
}: EmojiPopoverProps) => {
  const { resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap;

  const theme = themeMap[currentTheme];

  const [popoverOpen, setPopoverOpen] = useState(false);

  const onSelect = (value: EmojiClickData) => {
    onEmojiSelect(value.emoji);
    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none">
        <EmojiPicker
          theme={theme}
          height={350}
          lazyLoadEmojis
          onEmojiClick={onSelect}
        />
      </PopoverContent>
    </Popover>
  );
};

export { EmojiPopover };
