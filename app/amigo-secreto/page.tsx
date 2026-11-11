
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SessionProvider,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";

import Navbar from "../../components/Navbar";

type Recipient = {
  code: string;
  discordName: string;
  address: string;
  wishes: string;
};

type Me = {
  registered: boolean;
  status?: string;
  recipient?: Recipient;
};

type Admin = {
  count: number;
  status: string;
};

function Main() {
  const { data: session, status } = useSession();

  const [address, setAddress] = useState("");
  const [wishes, setWishes] = useState("");

  const [me, setMe] = useState<Me | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Atualiza as informações do participante e do admin.
  const refresh = useCallback(async () => {
    try {
      const [meResponse, adminResponse] =
        await Promise.all([
          fetch("/api/me", {
            cache: "no-store",
          }),
          fetch("/api/admin/status", {
            cache: "no-store",
          }),
        ]);

      if (!meResponse.ok) {
        throw new Error("Erro ao consultar inscrição.");
      }

      const meData: Me = await meResponse.json();
      setMe(meData);

      if (adminResponse.ok) {
        const adminData: Admin =
          await adminResponse.json();

        setAdmin(adminData);
      } else {
        setAdmin(null);
      }
    } catch {
      setMessage(
        "Não foi possível carregar suas informações. ♡"
      );
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      setFetching(true);
      void refresh();
    }

    if (status === "unauthenticated") {
      setMe(null);
      setAdmin(null);
      setAddress("");
      setWishes("");
      setMessage("");
      setFetching(false);
    }
  }, [status, refresh]);

  // Cadastro e atualização do participante.
  async function register() {
    if (loading) return;

    if (address.trim().length < 12) {
      setMessage(
        "Por favor, informe um endereço mais completo. ♡"
      );
      return;
    }

    setLoading(true);
    setMessage("Guardando sua inscrição... 🎀");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address.trim(),
          wishes: wishes.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.error || "Não foi possível salvar."
        );
        return;
      }

      await refresh();

      setMessage(
        "Sua inscrição foi guardada com carinho! ♡"
      );
    } catch {
      setMessage(
        "Ocorreu um erro de conexão. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  // Sorteio administrativo.
  async function draw() {
    if (loading) return;

    const confirmed = window.confirm(
      "🎁 MIDNIGHTBAR — SORTEIO DE NATAL\n\n" +
      "Deseja realizar o sorteio secreto?\n\n" +
      "Cada participante receberá um destinatário.\n" +
      "Os resultados serão individuais.\n\n" +
      "Confirmar?"
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("Misturando os presentinhos... ✨");

    try {
      const response = await fetch("/api/admin/draw", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.error || "Não foi possível sortear."
        );
        return;
      }

      await refresh();

      setMessage(
        "O sorteio foi realizado com sucesso! 🎁"
      );
    } catch {
      setMessage("Erro de conexão durante o sorteio.");
    } finally {
      setLoading(false);
    }
  }

  // Reinicia os pares sem excluir participantes.
  async function resetDraw() {
    if (loading || admin?.status !== "drawn") {
      return;
    }

    const confirmed = window.confirm(
      "❄️ REINICIAR SORTEIO\n\n" +
      "Todos os pares sorteados serão apagados.\n" +
      "Os participantes continuarão cadastrados.\n\n" +
      "Os resultados anteriores deixarão de valer.\n\n" +
      "Deseja continuar?"
    );

    if (!confirmed) return;

    const secondConfirmation = window.confirm(
      "Última confirmação!\n\n" +
      "Tem certeza de que deseja reiniciar o sorteio?"
    );

    if (!secondConfirmation) return;

    setLoading(true);
    setMessage("Preparando um novo sorteio... ❄️");

    try {
      const response = await fetch("/api/admin/reset", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.error || "Não foi possível reiniciar."
        );
        return;
      }

      setMe((previous) =>
        previous
          ? {
              registered: previous.registered,
              status: "registration",
            }
          : null
      );

      await refresh();

      setMessage(
        "Sorteio reiniciado! Os participantes " +
        "continuam cadastrados. ♡"
      );
    } catch {
      setMessage(
        "Erro de conexão. Confira o estado do evento."
      );
    } finally {
      setLoading(false);
    }
  }

  const isDrawn = me?.status === "drawn";
  const isRegistration =
    me?.status === "registration";

  return (
    <main className="christmas-page">
      <div
        className="snow-overlay"
        aria-hidden="true"
      />

      <div className="page-content">
        {/* NAVBAR GLOBAL */}
        <Navbar />

        {/* DECORAÇÃO */}
        <div className="stars" aria-hidden="true">
          ✧　❄　♡　✦　୨୧　❄
        </div>

        {/* APRESENTAÇÃO */}
        <section className="hero">
          <div
            className="hero-decoration"
            aria-hidden="true"
          >
            ❄️　🎀　❄️
          </div>

          <span className="eyebrow">
            ✧ ୨୧ CHRISTMAS EVENT 2026 ୨୧ ✧
          </span>

          <h1>
            Amigo <em>Secreto</em>
            <span className="hero-heart"> ♡</span>
          </h1>

          <p className="hero-description">
            Entre em nosso pequeno mundo de neve,
            carinho e presentinhos.
            <br />
            Um Natal especial para guardar no coração.
          </p>

          <div className="event-details">
            <div className="event-detail">
              <span>❄️</span>

              <div>
                <strong>12 e 13 de dezembro</strong>
                <small>Nosso encontro de Natal</small>
              </div>
            </div>

            <div className="event-detail">
              <span>🎁</span>

              <div>
                <strong>
                  Presentes a partir de R$ 60
                </strong>
                <small>Escolhidos com carinho</small>
              </div>
            </div>
          </div>

          <div className="ribbon">
            🎀 Um cantinho mágico só nosso ♡
          </div>
        </section>

        {/* PAINEL PRINCIPAL */}
        <section className="panel main-panel">
          {status === "loading" ||
          (status === "authenticated" && fetching) ? (
            <div className="loading-state">
              <span className="loading-icon">❄️</span>

              <h2>Preparando nosso cantinho...</h2>

              <p>
                Só um instantinho, os flocos estão
                se acomodando. ♡
              </p>
            </div>
          ) : !session ? (
            // LOGIN DISCORD
            <div className="login-section">
              <div className="section-icon">🎀</div>

              <span className="eyebrow">
                ୨୧ BEM-VINDO AO NOSSO NATAL ୨୧
              </span>

              <h2>
                Seu lugarzinho está esperando ♡
              </h2>

              <p>
                Entre com sua conta Discord para
                participar do nosso Amigo Secreto
                e viver um Natal cheio de surpresas.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() => void signIn("discord")}
              >
                ♡ Entrar com Discord
              </button>

              <small className="login-note">
                ✧ Uma conta Discord é necessária
                para participar.
              </small>
            </div>
          ) : (
            <>
              {/* USUÁRIO AUTENTICADO */}
              <div className="welcome-section">
                <div className="between">
                  <div>
                    <span className="eyebrow">
                      ✧ SEJA BEM-VINDO ✧
                    </span>

                    <h2>
                      Oiee,{" "}
                      {session.user?.name || "docinho"}! ♡
                    </h2>

                    <p>
                      Que bom ter você no nosso
                      cantinho de Natal.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="subtle"
                    onClick={() => void signOut()}
                  >
                    Sair ✧
                  </button>
                </div>
              </div>

              {me?.registered && (
                <div className="success">
                  ♡ Sua participação está confirmada!
                </div>
              )}

              {/* RESULTADO DO SORTEIO */}
              {isDrawn ? (
                me?.recipient ? (
                  <div className="recipient">
                    <div className="recipient-decoration">
                      🎁
                    </div>

                    <span className="eyebrow">
                      ✧ ୨୧ SEU AMIGO SECRETO ୨୧ ✧
                    </span>

                    <h2>
                      Você tirou:
                      <span className="recipient-name">
                        {" "}
                        {me.recipient.discordName ||
                          "Nome indisponível"} ♡
                      </span>
                    </h2>

                    <p>
                      Shhh... esse é o seu pequeno
                      segredo de Natal! Guarde com
                      carinho até o dia da revelação. ☾
                    </p>

                    <div className="recipient-info">
                      <div className="info-heading">
                        📦 Endereço de entrega
                      </div>

                      <pre>
                        {me.recipient.address}
                      </pre>
                    </div>

                    <div className="recipient-info">
                      <div className="info-heading">
                        🎀 Lista de desejos
                      </div>

                      <p>
                        {me.recipient.wishes ||
                          "Uma surpresa escolhida com carinho ♡"}
                      </p>
                    </div>

                    <small className="privacy-note">
                      🔒 Essas informações são privadas.
                      Não compartilhe o resultado
                      com outros participantes.
                    </small>
                  </div>
                ) : (
                  <div className="waiting-state">
                    <span className="section-icon">
                      🎁
                    </span>

                    <h2>
                      Seu segredo está sendo preparado...
                    </h2>

                    <p>
                      Aguarde enquanto verificamos
                      seu resultado. ♡
                    </p>
                  </div>
                )
              ) : isRegistration ? (
                // CADASTRO
                <div className="registration-section">
                  <div className="section-heading">
                    <span className="section-icon">
                      💌
                    </span>

                    <span className="eyebrow">
                      ୨୧ INSCRIÇÃO DE NATAL ୨୧
                    </span>

                    <h2>
                      Vamos preparar seu presentinho? ♡
                    </h2>

                    <p>
                      Conte onde seu presente deve
                      chegar e deixe algumas ideias
                      para quem tirar você.
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">
                      📦 Seu endereço de entrega
                    </label>

                    <textarea
                      id="address"
                      value={address}
                      onChange={(event) =>
                        setAddress(event.target.value)
                      }
                      placeholder={
                        "Rua, número, complemento, bairro, " +
                        "cidade, estado e CEP..."
                      }
                      maxLength={600}
                      disabled={loading}
                    />

                    <small>
                      Seu endereço será disponibilizado
                      ao participante que tirar você.
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="wishes">
                      🎀 Sua listinha de desejos
                    </label>

                    <textarea
                      id="wishes"
                      value={wishes}
                      onChange={(event) =>
                        setWishes(event.target.value)
                      }
                      placeholder={
                        "Cores favoritas, jogos, hobbies, " +
                        "ideias de presentes..."
                      }
                      maxLength={1000}
                      disabled={loading}
                    />

                    <small>
                      Opcional, mas ajuda a escolher
                      um presente especial! ♡
                    </small>
                  </div>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={register}
                    disabled={loading}
                  >
                    {loading
                      ? "Guardando com carinho..."
                      : me?.registered
                        ? "♡ Atualizar minha inscrição"
                        : "♡ Confirmar participação"}
                  </button>
                </div>
              ) : (
                <div className="waiting-state">
                  <span className="section-icon">
                    ❄️
                  </span>

                  <h2>
                    Nosso cantinho está aguardando...
                  </h2>

                  <p>
                    As inscrições não estão abertas
                    neste momento.
                  </p>
                </div>
              )}

              {/* PAINEL DO ORGANIZADOR */}
              {admin && (
                <section className="admin">
                  <div className="admin-heading">
                    <span className="eyebrow">
                      ✧ ÁREA RESERVADA ✧
                    </span>

                    <h3>
                      ☾ Painel do organizador
                    </h3>

                    <p>
                      Controle o sorteio com carinho
                      e segurança.
                    </p>
                  </div>

                  <div className="admin-stats">
                    <div className="stat-card">
                      <span>🎀 Participantes</span>
                      <strong>{admin.count}</strong>
                    </div>

                    <div className="stat-card">
                      <span>❄️ Estado</span>

                      <strong>
                        {admin.status === "registration"
                          ? "Inscrições"
                          : admin.status === "drawn"
                            ? "Sorteado"
                            : admin.status === "closed"
                              ? "Encerrado"
                              : admin.status}
                      </strong>
                    </div>
                  </div>

                  <p className="admin-description">
                    Os pares sorteados e endereços
                    não são exibidos neste painel.
                  </p>

                  {admin.status === "registration" && (
                    <>
                      <button
                        type="button"
                        className="primary-button"
                        disabled={
                          loading || admin.count < 5
                        }
                        onClick={draw}
                      >
                        🎁 Realizar sorteio secreto
                      </button>

                      {admin.count < 5 && (
                        <small className="admin-hint">
                          Faltam{" "}
                          {Math.max(0, 5 - admin.count)}{" "}
                          participante(s) para liberar
                          o sorteio.
                        </small>
                      )}
                    </>
                  )}

                  {admin.status === "drawn" && (
                    <div className="reset-section">
                      <p>
                        O sorteio já foi realizado.
                        Você pode reiniciá-lo,
                        se necessário.
                      </p>

                      <button
                        type="button"
                        className="reset-button"
                        disabled={loading}
                        onClick={resetDraw}
                      >
                        {loading
                          ? "Aguarde..."
                          : "↻ Reiniciar sorteio ♡"}
                      </button>
                    </div>
                  )}
                </section>
              )}

              {message && (
                <p
                  className="feedback-message"
                  role="status"
                >
                  ✧ {message}
                </p>
              )}
            </>
          )}
        </section>

        {/* RODAPÉ */}
        <div
          className="bottom-decoration"
          aria-hidden="true"
        >
          ❄　♡　✧　🎀　✧　♡　❄
        </div>

        <footer>
          <p>made with ♡ for Midnightbar</p>
          <span>雪のクリスマス · 2026</span>
        </footer>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <SessionProvider>
      <Main />
    </SessionProvider>
  );
}
