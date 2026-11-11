"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { discordInvite } from "../lib/community";

const items = [
  { href: "/", label: "Início", icon: "⌂" },
  { href: "/amigo-secreto", label: "Amigo Secreto", icon: "🎁" },
  { href: "/jogos", label: "Jogos", icon: "🎮" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="community-navbar" aria-label="Navegação principal">
      <Link className="nav-brand" href="/">☾ <span>MIDNIGHTBAR</span> ♡</Link>
      <div className="nav-links">
        {items.map((item) => (
          <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}
            className={`nav-link${pathname === item.href ? " active" : ""}`}>
            <span aria-hidden="true">{item.icon}</span> {item.label}
          </Link>
        ))}
        <a className="nav-link nav-discord" href={discordInvite} target="_blank" rel="noopener noreferrer">♡ Nosso Discord <span aria-hidden="true">↗</span></a>
      </div>
    </nav>
  );
}
