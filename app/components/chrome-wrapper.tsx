"use client";

import { usePathname } from "next/navigation";
import Header from "./header/header";
import Footer from "./footer/footer";

const BARE_ROUTES = ["/weightloss-onboard"];

function isBareRoute(path: string) {
  return BARE_ROUTES.some((r) => path === r || path.startsWith(`${r}/`));
}

export default function ChromeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  if (isBareRoute(pathname)) {
    return <main style={{ flex: 1 }}>{children}</main>;
  }

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </>
  );
}
