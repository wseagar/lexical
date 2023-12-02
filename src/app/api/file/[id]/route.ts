import { NextApiRequest } from "next";
import database from "@/features/common/database";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest | Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await database.chatDocument.findFirstOrThrow({
      where: {
        name: params.id as string,
      }
    });

    return new Response(result.blob, {
      headers: {
        "Content-Type": "application/pdf",
      }});

  } catch(error) {
    return new Response('Yes')
  }
}
