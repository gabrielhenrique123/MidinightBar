
import {
  identity,
  isAdmin,
  errorResponse,
} from "../../../../lib/guard";

import { db } from "../../../../lib/db";

export async function POST() {
  try {
    const discordId = await identity();

    if (!isAdmin(discordId)) {
      throw new Error("FORBIDDEN");
    }

    const { error } = await db().rpc(
      "reset_christmas_2026"
    );

    if (error) {
      console.error("Erro ao reiniciar sorteio:", error.message);

      return Response.json(
        {
          error: "Não foi possível reiniciar o sorteio.",
        },
        { status: 400 }
      );
    }

    return Response.json({
      ok: true,
      message: "Sorteio reiniciado com sucesso! ♡",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
