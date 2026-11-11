
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { identity, errorResponse } from "../../../lib/guard";
import { db } from "../../../lib/db";
import { encrypt } from "../../../lib/crypto";
import { z } from "zod";

const schema = z.object({
  address: z.string().trim().min(12).max(600),
  wishes: z.string().max(1000).default(""),
});

export async function POST(req: Request) {
  try {
    const discordId = await identity();

    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { error: "Sessão inválida." },
        { status: 401 }
      );
    }

    const discordName =
      session.user?.name?.trim();

    if (!discordName) {
      return Response.json(
        {
          error:
            "Não foi possível obter seu nome do Discord. " +
            "Saia e entre novamente.",
        },
        { status: 400 }
      );
    }

    const result = schema.safeParse(await req.json());

    if (!result.success) {
      return Response.json(
        {
          error: "Dados inválidos.",
          details: result.error.issues,
        },
        { status: 400 }
      );
    }

    const { address, wishes } = result.data;

    const client = db();

    const { data: event, error: eventError } =
      await client
        .from("events")
        .select("id, status")
        .eq("slug", "christmas-2026")
        .single();

    if (eventError || !event) {
      return Response.json(
        { error: "Evento não encontrado." },
        { status: 404 }
      );
    }

    if (event.status !== "registration") {
      return Response.json(
        { error: "Inscrições encerradas." },
        { status: 403 }
      );
    }

    const { error } = await client
      .from("participants")
      .upsert(
        {
          event_id: event.id,
          discord_id: discordId,
          discord_username: discordName,
          address_ciphertext: encrypt(address),
          wishes,
        },
        {
          onConflict: "event_id,discord_id",
        }
      );

    if (error) {
      console.error("Erro na inscrição:", error.message);

      return Response.json(
        { error: "Erro ao salvar inscrição." },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      message: "Inscrição salva com sucesso! ♡",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
