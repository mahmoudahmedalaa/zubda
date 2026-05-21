import type { ReactElement, ReactNode } from "react";
import { AppNav } from "@/components/app/AppNav";

export default function AppLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <>
      <AppNav />
      {children}
    </>
  );
}
