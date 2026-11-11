// @ts-ignore -- Keep the global stylesheet import even when TS lacks CSS declarations.
import './style.css';
import type { ReactNode } from 'react';

export const metadata = {
	title: 'Midnightbar Amigo Secreto',
	description: 'Um Natal secreto no nosso cantinho ♡',
};

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="pt-BR">
			<body>{children}</body>
		</html>
	);
}