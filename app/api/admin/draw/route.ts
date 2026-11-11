
import {
  identity,
  isAdmin,
  errorResponse
} from "../../../../lib/guard";

import { db } from "../../../../lib/db";

export async function POST() {
  try {
    const discordId = await identity();

    if (!isAdmin(discordId)) {
      throw new Error("FORBIDDEN");
    }

    const { data, error } = await db().rpc(
      "draw_christmas_2026"
    );

    if (error) {
      console.error("Erro no sorteio:", error.message);

      return Response.json(
        {
          error: "Não foi possível realizar o sorteio. Verifique se existem pelo menos 5 participantes e se o evento está aberto."
        },
        { status: 400 }
      );
    }

    return Response.json({
      ok: true,
      count: data,
      message: "Sorteio realizado com sucesso! ♡"
    });
  } catch (error) {
    return errorResponse(error);
  }
}
