
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function identity(): Promise<string> {
  const session = await getServerSession(authOptions);

  const discordId = (
    session as typeof session & { discordId?: string }
  )?.discordId;

  if (!discordId) {
    throw new Error("UNAUTHORIZED");
  }

  return discordId;
}

export function isAdmin(id: string): boolean {
  return (process.env.ADMIN_DISCORD_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .includes(id);
}

// Compatibilidade temporária com as rotas existentes.
// Não verifica se o usuário pertence a um servidor Discord.
export async function inGuild(id: string): Promise<boolean> {
  if (!id) {
    throw new Error("UNAUTHORIZED");
  }

  return true;
}

export function errorResponse(error: unknown): Response {
  const message =
    error instanceof Error ? error.message : "ERROR";

  const status =
    message === "UNAUTHORIZED"
      ? 401
      : message === "FORBIDDEN"
        ? 403
        : 400;

  return Response.json(
    { error: message },
    { status }
  );
}
