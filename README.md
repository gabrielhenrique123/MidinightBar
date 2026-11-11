# Midnightbar Amigo Secreto ♡

Aplicação Next.js para Amigo Oculto privado com Discord OAuth, Supabase PostgreSQL, criptografia AES-256-GCM e sorteio transacional.

## Iniciar
1. Instale Node.js 20.9+ e rode `npm install`.
2. Crie um projeto Supabase e execute `supabase/schema.sql` no SQL Editor.
3. Copie `.env.example` para `.env.local` e preencha todas as variáveis. Acrescente `DISCORD_BOT_TOKEN` com o token de um bot presente no servidor.
4. No Discord Developer Portal, crie uma aplicação, configure o redirect OAuth `http://localhost:3000/api/auth/callback/discord`, crie um bot e adicione-o ao servidor. Configure `DISCORD_GUILD_ID` e `ADMIN_DISCORD_IDS`.
5. Gere `NEXTAUTH_SECRET` com `openssl rand -base64 32`; gere `ADDRESS_ENCRYPTION_KEY` separadamente com o mesmo comando. Não compartilhe esses segredos.
6. Execute `npm run dev` e abra http://localhost:3000.
7. Para publicar, configure HTTPS, URL pública no Discord e `NEXTAUTH_URL` da produção.

## Segurança e limitações
- Endereços são cifrados em repouso com AES-256-GCM. A chave deve ser guardada fora do repositório; perder a chave impossibilita descriptografar os endereços.
- A API usa service role exclusivamente no servidor. Nunca exponha essa chave ao navegador. RLS está ativado sem políticas públicas.
- O sorteio só mostra o destinatário ao remetente autenticado. O painel administrativo mostra apenas contagem e estado.
- Administradores de infraestrutura com acesso ao banco e à chave podem recuperar pares/endereços. Anonimato absoluto contra operadores não é garantido.
- Endereços podem revelar a identidade; recomenda-se ponto de retirada ou intermediário.
- Antes de uso público: adicionar limitação de requisições, auditoria sem PII, política de privacidade, consentimento, exclusão/retencão após o evento, teste de carga e backups criptografados. A interface não oferece exclusão automática ainda.
- Sorteio não pode ser refeito pela interface. Inscrições encerram ao sortear. A distribuição é válida sem auto-sorteio, mas a etapa de reparação de pontos fixos não produz distribuição perfeitamente uniforme entre todas as permutações válidas.
- Exige ao menos cinco participantes cadastrados. O requisito de exclusão dos donos da contagem deve ser aplicado na configuração do evento antes de produção (atualmente conta todos os inscritos).
- Versão inicial funcional para desenvolvimento e testes; requer validação de segurança e implantação antes de coletar endereços reais.
