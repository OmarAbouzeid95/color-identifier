import Header from '../Header';
import { type ReactNode } from 'react';
import { Toaster } from '../ui/sonner';

export default function MainLayout({ children }: { children: ReactNode }) {
	return (
		<main className='flex min-h-screen flex-col'>
			<Toaster />
			<Header />
			<div className='grow'>{children}</div>
		</main>
	);
}
