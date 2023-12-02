import { AdminMenu } from "@/features/admin/admin-menu/admin-menu";
import { ChatMenu } from "@/features/chat/chat-menu/chat-menu";
import { MainMenu } from "@/features/main-menu/menu";
import { SubmenuContainer } from "@/features/submenu/submenu-container";
import { AI_NAME } from "@/features/theme/customise";

export const dynamic = "force-dynamic";

export const metadata = {
  title: AI_NAME,
  description: AI_NAME,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainMenu />
      <div className="flex-1 flex rounded-md overflow-hidden bg-card/70">
        <SubmenuContainer canClose={false}>
          <AdminMenu />
        </SubmenuContainer>
        {children}
      </div>
    </>
  );
}
