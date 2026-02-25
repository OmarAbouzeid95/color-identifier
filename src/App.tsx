import { useRef, useState } from 'react';
import MainLayout from './components/layouts/MainLayout';
import { Input } from './components/ui/input';
import { Card, CardContent } from './components/ui/card';
import { cn } from '@/lib/utils';

function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [hasImage, setHasImage] = useState(false);
	const [color, setColor] = useState<string | null>(null);

	const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		const x = Math.floor((e.clientX - rect.left) * scaleX);
		const y = Math.floor((e.clientY - rect.top) * scaleY);

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
		const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
		setColor(hex);
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const img = new Image();
		img.onload = () => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			canvas.width = img.width;
			canvas.height = img.height;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			ctx.drawImage(img, 0, 0);
			setHasImage(true);
			URL.revokeObjectURL(img.src);
		};
		img.src = URL.createObjectURL(file);
	};

	return (
		<MainLayout>
			<div className='max-w-lg mx-auto p-4 flex flex-col gap-4'>
				<Input type='file' accept='image/*' onChange={handleImageUpload} />
				<Card className={cn('p-0', !hasImage && 'hidden')}>
					<CardContent className='p-0'>
						<canvas
							ref={canvasRef}
							className='w-full h-auto cursor-crosshair'
							onClick={handleCanvasClick}
						/>
					</CardContent>
				</Card>
				{color && (
					<div className='flex items-center gap-3'>
						<div
							className='w-10 h-10 rounded-base border-2 border-border'
							style={{ backgroundColor: color }}
						/>
						<span className='font-heading text-lg'>{color}</span>
					</div>
				)}
			</div>
		</MainLayout>
	);
}

export default App;
