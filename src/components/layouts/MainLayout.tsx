import Header from '../Header';
import { type ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
	return (
		<main className='flex min-h-screen flex-col'>
			<Header />
			<div className='grow'>{children}</div>
		</main>
	);
}
