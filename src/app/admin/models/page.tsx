import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

import ModelConfig from "@/features/admin/models/model-config";
import database from "@/features/common/database";

export default async function Home() {
  const config = await database.config.findFirst({
    where: {
      key: "llm",
    },
  });

  return (
    <Card className="h-full items-center flex justify-center flex-1">
      <ModelConfig config={config?.value as any} />
    </Card>
  );
}
