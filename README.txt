MIDNIGHTBAR — TEMA INVERNO AZUL

1. Copie public/winter-forest.png para a pasta public/ do projeto.
2. Copie app/style.css para app/style.css (ou para o CSS realmente importado em app/layout.tsx).
3. Copie components/Navbar.tsx e lib/community.ts para as pastas correspondentes.
4. Copie app/jogos/page.tsx para app/jogos/page.tsx.
5. ATENÇÃO: app/page.tsx deste pacote é a NOVA HOME. Antes de substituí-lo, mova seu app/page.tsx atual (Amigo Secreto) para app/amigo-secreto/page.tsx.
6. No arquivo app/amigo-secreto/page.tsx, importe Navbar de "../../components/Navbar" e adicione <Navbar /> dentro do div.page-content. Não apague o login nem os handlers de sorteio.
7. Confirme que app/layout.tsx importa o CSS, por exemplo: import "./style.css";
8. Em lib/community.ts, adicione jogos modificados REAIS em modifiedGames. A seção já aparece vazia até você adicionar.
9. npm run dev

Convite Discord já configurado: https://discord.gg/zthegw3r3
As APIs /api/me, /api/register, /api/admin/draw e /api/admin/reset não foram alteradas.
