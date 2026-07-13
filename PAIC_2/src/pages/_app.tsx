import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { insforge } from "@/lib/insforge";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      const isAuthPage = router.pathname.startsWith("/auth");
      if (!data?.user && !isAuthPage && router.pathname !== "/") {
        router.replace("/auth/login");
      }
      setReady(true);
    });
  }, [router]);

  if (!ready && !router.pathname.startsWith("/auth") && router.pathname !== "/") {
    return <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>Cargando...</div>;
  }

  return <Component {...pageProps} />;
}
