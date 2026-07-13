import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("insforge_status");
    const type = params.get("insforge_type");

    if (status === "success" || !params.toString()) {
      router.replace("/dashboard");
    } else {
      router.replace("/auth/login?error=authentication_failed");
    }
  }, [router]);

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "sans-serif",
    }}>
      <p>Completando autenticación...</p>
    </main>
  );
}
