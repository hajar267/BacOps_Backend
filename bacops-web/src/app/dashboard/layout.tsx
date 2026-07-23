export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background mt-16 flex flex-col items-center justify-center">
      {children}
    </div>
  );
}