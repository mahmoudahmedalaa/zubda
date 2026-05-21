import type { ReactElement } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { PricingClient } from "@/components/pricing/PricingClient";

export default function PricingPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main>
        <PricingClient />
      </main>
    </>
  );
}
