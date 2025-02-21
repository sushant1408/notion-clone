import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <div className="flex items-center w-full p-6 bg-background z-[50] dark:bg-[#1f1f1f]">
      <div className="shrink-0">
        <Logo />
      </div>
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
        <Button variant="link" size="sm">
          Privacy policy
        </Button>
        <Button variant="link" size="sm">
          Terms & Condition
        </Button>
      </div>
    </div>
  );
};

export { Footer };
