
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <main className="christmas-page">
      <div className="page-content">
        <Navbar />

        <section className="hero">
          <span className="eyebrow">
            ❄ WELCOME TO MIDNIGHTBAR ❄
          </span>

          <h1>
            Nosso pequeno <em>refúgio</em> ♡
          </h1>

          <p className="hero-description">
            Um cantinho aconchegante para jogar,
            conversar e criar memórias especiais.
          </p>

          <div className="ribbon">
            🎀 Seja bem-vindo ao Midnightbar!
          </div>
        </section>

        <section className="home-grid">
          <Link href="/amigo-secreto" className="home-card">
            <span>🎁</span>
            <h2>Amigo Secreto</h2>
            <p>
              Participe do nosso evento especial
              de Natal.
            </p>
            <strong>Participar ♡</strong>
          </Link>

          <Link href="/jogos" className="home-card">
            <span>🎮</span>
            <h2>Biblioteca de jogos</h2>
            <p>
              Confira nossos jogos e modificações.
            </p>
            <strong>Explorar jogos ♡</strong>
          </Link>

          <a
            href="https://discord.gg/zthegw3r3"
            target="_blank"
            rel="noopener noreferrer"
            className="home-card"
          >
            <span>💌</span>
            <h2>Nosso Discord</h2>
            <p>
              Entre no servidor e faça parte
              da comunidade.
            </p>
            <strong>Entrar no servidor ♡</strong>
          </a>
        </section>

        <footer>
          Feito com ♡ para Midnightbar
        </footer>
      </div>
    </main>
  );
}
