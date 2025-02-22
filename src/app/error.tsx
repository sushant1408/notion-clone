"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Error({ error }: { error: Error }) {
  const router = useRouter();

  const reload = () => {
    startTransition(() => {
      router.refresh();
      reload();
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 dark:bg-[#1f1f1f]">
      <Image
        src="/error.png"
        height={300}
        width={300}
        alt="error"
        className="dark:hidden"
      />
      <Image
        src="/error-dark.png"
        height={300}
        width={300}
        alt="error"
        className="hidden dark:block"
      />

      <h2 className="text-xl font-medium">Something went wrong</h2>
      
      <Button asChild>
        <Link href="/documents">Go back</Link>
      </Button>
    </div>
  );
}
