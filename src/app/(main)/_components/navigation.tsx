"use client";

import {
  ChevronsLeftIcon,
  MenuIcon,
  MessageCircleQuestionIcon,
  PlusCircleIcon,
  SearchIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ComponentRef, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateDocument } from "@/features/documents/api/use-create-document";
import { useSearch } from "@/features/search/hooks/use-search";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { cn } from "@/lib/utils";
import { DocumentList } from "./document-list";
import { Item } from "./item";
import { TrashBox } from "./trash-box";
import { UserItem } from "./user-item";
import { Navbar } from "./navbar";

const Navigation = () => {
  const pathname = usePathname();
  const params = useParams();

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ComponentRef<"aside">>(null);
  const navbarRef = useRef<ComponentRef<"div">>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const search = useSearch();
  const settings = useSettings();

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const { mutate } = useCreateDocument();

  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    } else {
      resetSidebarWidth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    }
  }, [isMobile, pathname]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) {
      return;
    }

    let newWidth = e.clientX;

    if (newWidth < 240) {
      newWidth = 240;
    }

    if (newWidth > 480) {
      newWidth = 480;
    }

    if (sidebarRef.current && navbarRef.current) {
      // update the width of sidebar
      sidebarRef.current.style.width = `${newWidth}px`;

      // update the left and width of navbar
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetSidebarWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty("left", isMobile ? "0" : "240px");
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "100%" : "calc(100% - 240px)"
      );

      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const collapseSidebar = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("left", "0");
      navbarRef.current.style.setProperty("width", "100%");

      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const handleCreate = () => {
    toast.loading("Creating a new note...", { id: "new-note" });

    mutate(
      { title: "Untitled" },
      {
        onSuccess: () => {
          toast.success("New note created!", { id: "new-note" });
        },
        onError: () => {
          toast.error("Failed to create a new note.", { id: "new-note" });
        },
      }
    );
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <button
          className={cn(
            "size-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100",
            isMobile && "opacity-100"
          )}
          onClick={collapseSidebar}
        >
          <ChevronsLeftIcon className="!size-6" />
        </button>
        <div>
          <UserItem />

          <Item
            onClick={search.onOpen}
            label="Search"
            icon={SearchIcon}
            isSearch
          />
          <Item onClick={handleCreate} label="New page" icon={PlusCircleIcon} />
        </div>
        <div className="my-4">
          <DocumentList />
          <Item
            onClick={handleCreate}
            label="Add a page"
            icon={PlusCircleIcon}
          />
        </div>
        <div>
          <Item
            onClick={settings.onOpen}
            label="Settings"
            icon={SettingsIcon}
          />
          <Popover>
            <TooltipWrapper label="Restore deleted pages" side="right">
              <PopoverTrigger className="w-full">
                <Item label="Trash" icon={Trash2Icon} />
              </PopoverTrigger>
            </TooltipWrapper>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
          <Link href="mailto:gandhi.sushant1408@gmail.com">
            <Item label="Get help" icon={MessageCircleQuestionIcon} />
          </Link>
        </div>

        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={resetSidebarWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)] h-[52px]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetSidebarWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <MenuIcon
                role="button"
                onClick={resetSidebarWidth}
                className="!size-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};

export { Navigation };
