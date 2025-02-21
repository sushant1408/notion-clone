"use client";

import { useUser } from "@clerk/clerk-react";
import { PlusCircleIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function DocumentsPage() {
  const { user } = useUser();

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        alt="empty"
        height={300}
        width={300}
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        alt="empty"
        height={300}
        width={300}
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">Welcome to {user?.firstName}&apos;s Notion Clone</h2>
      <Button>
        <PlusCircleIcon />
        Create a note
      </Button>
    </div>
  );
}
