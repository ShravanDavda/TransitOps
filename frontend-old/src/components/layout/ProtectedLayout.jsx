import MainLayout from "./MainLayout";

function ProtectedLayout({
  children,
  activePath = "/dashboard",
  onNavigate,
}) {
  return (
    <MainLayout
      activePath={activePath}
      onNavigate={onNavigate}
    >
      {children}
    </MainLayout>
  );
}

export default ProtectedLayout;