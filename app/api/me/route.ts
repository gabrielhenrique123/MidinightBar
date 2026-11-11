
import { identity, errorResponse } from "../../../lib/guard";
import { db } from "../../../lib/db";
import { decrypt } from "../../../lib/crypto";

export async function GET() {
  try {
    // Identifica o usuário autenticado pelo Discord.
    const discordId = await identity();
    const client = db();

    // Procura o evento de Natal.
    const { data: event, error: eventError } = await client
      .from("events")
      .select("id, status")
      .eq("slug", "christmas-2026")
      .single();

    if (eventError || !event) {
      return Response.json({
        registered: false,
        status: "unavailable",
      });
    }

    // Confirma que o usuário está inscrito.
    const { data: me, error: meError } = await client
      .from("participants")
      .select("id")
      .eq("event_id", event.id)
      .eq("discord_id", discordId)
      .maybeSingle();

    if (meError) throw meError;

    if (!me) {
      return Response.json({
        registered: false,
        status: event.status,
      });
    }

    // Antes do sorteio, não revela destinatários.
    if (event.status !== "drawn") {
      return Response.json({
        registered: true,
        status: event.status,
      });
    }

    // Busca exclusivamente o destinatário
    // associado à conta Discord autenticada.
    const { data: assignment, error: assignmentError } =
      await client
        .from("assignments")
        .select("receiver_discord_id")
        .eq("event_id", event.id)
        .eq("giver_discord_id", discordId)
        .single();

    if (assignmentError || !assignment) {
      throw new Error("Sorteio não encontrado.");
    }

    // Busca os dados do destinatário.
    const { data: recipient, error: recipientError } =
      await client
        .from("participants")
        .select(
          "id, discord_username, address_ciphertext, wishes"
        )
        .eq("event_id", event.id)
        .eq("discord_id", assignment.receiver_discord_id)
        .single();

    if (recipientError || !recipient) {
      throw new Error("Destinatário não encontrado.");
    }

    // Retorna apenas os dados do destinatário
    // para a pessoa que o sorteou.
    return Response.json(
      {
        registered: true,
        status: event.status,
        recipient: {
          code: recipient.id.slice(0, 8).toUpperCase(),
          discordName:
            recipient.discord_username || "Participante",
          address: decrypt(recipient.address_ciphertext),
          wishes: recipient.wishes,
        },
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Erro ao consultar participante:",
      error instanceof Error
        ? error.message
        : "Erro desconhecido"
    );

    return errorResponse(error);
  }
}
