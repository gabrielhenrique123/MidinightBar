
import Navbar from "../../components/Navbar";
import { community } from "../../lib/community";

export default function JogosPage() {
  return (
    <main className="christmas-page">
      <div className="page-content">
        <Navbar />

        <section className="hero">
          <span className="eyebrow">
            ❄ MIDNIGHTBAR GAMES ❄
          </span>

          <h1>
            Nosso <em>cantinho de jogos</em> ♡
          </h1>

          <p className="hero-description">
            Jogos, aventuras e momentos especiais
            para compartilhar com nossos amigos.
          </p>
        </section>

        <section className="games-section">
          <h2>🎮 Jogos da comunidade</h2>

          <p>
            Jogos originais que gostamos de jogar juntos.
          </p>

          <div className="games-grid">
            {community.games.map((game) => (
              <article className="game-card" key={game.id}>
                <div className="game-icon">
                  {game.emoji}
                </div>

                <span className="game-category">
                  {game.category} ·
                  {game.free ? " Gratuito" : " Pago"}
                </span>

                <h2>{game.name}</h2>
                <p>{game.description}</p>

                <small>✧ {game.platform}</small>

                <a
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="game-button"
                >
                  Ver jogo ♡
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="games-section modified-section">
          <h2>🧩 Jogos modificados</h2>

          <p>
            Modificações e conteúdos personalizados
            que compartilhamos na comunidade.
          </p>

          <div className="games-grid">
            {community.modifiedGames.map((game) => (
              <article className="game-card" key={game.id}>
                <div className="game-icon">
                  {game.emoji}
                </div>

                <span className="game-category">
                  {game.category} · Modificado
                </span>

                <h2>{game.name}</h2>
                <p>{game.description}</p>

                <small>✧ {game.platform}</small>

                <a
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="game-button"
                >
                  📁 Acessar Google Drive
                </a>
              </article>
            ))}
          </div>
        </section>

        <footer>
          Feito com ♡ para Midnightbar · おやすみ
        </footer>
      </div>
    </main>
  );
}
