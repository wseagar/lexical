export async function GET(req: Request) {
  return new Response("Hello world!");
}

export async function POST(req: Request) {
  const body = await req.json();
  return new Response(JSON.stringify(body));
}
