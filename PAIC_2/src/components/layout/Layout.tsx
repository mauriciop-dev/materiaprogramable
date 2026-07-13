import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Sidebar />
      <main style={{ marginLeft: "240px", flex: 1, padding: "2rem", background: "#f0f2f5" }}>
        {children}
      </main>
    </div>
  );
}
