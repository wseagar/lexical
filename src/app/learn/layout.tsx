import { SubmenuContainer } from "@/features/submenu/submenu-container";
import { MainMenu } from "@/features/main-menu/menu";
import { Menu, MenuContent, MenuItem } from "@/components/menu";
import learnData from "@/components/learn/learn-data";

export const dynamic = "force-dynamic";

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
          <Menu className="p-2">
            <MenuContent>
              {learnData.map((item, index) => {
                return (
                  <MenuItem
                    key={`mi-learn-${item.slug}-${index}`}
                    className="flex items-center space-x-2"
                    href={`/learn/${item.slug}`}
                  >
                    <span>{item.name}</span>
                  </MenuItem>
                );
              })}
            </MenuContent>
          </Menu>
        </SubmenuContainer>
        {children}
      </div>
    </>
  );
}
