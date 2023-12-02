import database from "@/features/common/database";

export async function POST(req: Request) {
  const body = await req.json();
  const key = body.key;
  const value = body.value;
  const response = await database.config.upsert({
    create: {
      key,
      value,
    },
    update: {
      key,
      value,
    },
    where: {
      key,
    },
  });
  return new Response(JSON.stringify(response));
}
