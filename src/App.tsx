import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MainLayout from './components/layouts/MainLayout';

function App() {
	const [count, setCount] = useState(0);

	return (
		<MainLayout>
			<div className='p-4'>
				<h1 className='text-2xl font-bold'>Color Identifier</h1>
				<div className='card'>
					<Button onClick={() => setCount((count) => count + 1)}>
						count is {count}
					</Button>
				</div>
			</div>
		</MainLayout>
	);
}

export default App;
