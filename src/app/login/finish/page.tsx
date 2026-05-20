import type { ReactElement } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { MagicLinkFinish } from "@/components/auth/MagicLinkFinish";
import { Card } from "@/components/ui/Card";

export default function LoginFinishPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main className="page-shell grid min-h-[70vh] place-items-center py-12">
        <Card className="w-full max-w-md p-6 text-right">
          <h1 className="text-3xl font-black">نخلص دخولك.</h1>
          <MagicLinkFinish />
        </Card>
      </main>
    </>
  );
}

