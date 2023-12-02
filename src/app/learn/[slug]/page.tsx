import { Card } from "@/components/ui/card";
import Quiz from "@/features/learn/quiz";

export default function Home({ params }: { params: { slug: string } }) {
  return (
    <Card className="h-full w-full overflow-y-auto px-2 py-2 gap-0.5">
      <Quiz slug={params.slug} />
    </Card>
  );
}
