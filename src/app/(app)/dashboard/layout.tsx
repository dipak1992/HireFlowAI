import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Extra bottom padding on mobile so content isn't hidden behind the nav */}
      <div className="pb-20 md:pb-0">{children}</div>
      <MobileBottomNav />
    </>
  );
}
