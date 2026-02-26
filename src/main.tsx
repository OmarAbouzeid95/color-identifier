import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import ColorProvider from './Providers/ColorProvider.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ColorProvider>
			<App />
		</ColorProvider>
	</StrictMode>,
);
