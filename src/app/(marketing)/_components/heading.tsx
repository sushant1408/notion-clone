"use client";

import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { SignInButton } from "@clerk/clerk-react";

const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents & Plans. Unified. Welcome to{" "}
        <span className="underline">Notion Clone</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Notion Clone is the connected workspace where <br /> better, faster work
        happens.
      </h3>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            Get Notion Clone
            <ArrowRightIcon />
          </Button>
        </SignInButton>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            Enter Notion Clone
            <ArrowRightIcon />
          </Link>
        </Button>
      )}
    </div>
  );
};

export { Heading };
