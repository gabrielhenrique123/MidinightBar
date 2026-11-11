
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { community } from "../../lib/community";

const links = [
  { href: "/", label: "Início", icon: "⌂" },
  {
    href: "/amigo-secreto",
    label: "Amigo Secreto",
    icon: "🎁",
  },
  { href: "/jogos", label: "Jogos", icon: "🎮" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="community-navbar" aria-label="Menu principal">
      <Link href="/" className="nav-brand">
        ☾ MIDNIGHTBAR <span>♡</span>
      </Link>

      <div className="nav-links">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname === item.href
                ? "nav-link active"
                : "nav-link"
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {community.discordInvite ? (
          <a
            className="nav-link discord-link"
            href={community.discordInvite}
            target="_blank"
            rel="noopener noreferrer"
          >
            ♡ Nosso Discord
          </a>
        ) : (
          <span className="nav-link nav-disabled">
            ♡ Discord em breve
          </span>
        )}
      </div>
    </nav>
  );
}
