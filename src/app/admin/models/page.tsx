import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

import ModelConfig from "@/features/admin/models/model-config";

export default async function Home() {
  return (
    <Card className="h-full items-center flex justify-center flex-1">
      <ModelConfig />
    </Card>
  );
}
