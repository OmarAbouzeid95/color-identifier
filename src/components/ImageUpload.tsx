import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';
import { Card, CardContent } from './ui/card';
import FileImages from './FileImages';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { convertRGBToHex } from '@/lib/helpers';
import { useColor } from '@/Providers/ColorProvider';
import ColorListSelect from './ColorListSelect';

export default function ImageUpload() {
	const { color, setColor } = useColor();
	const [hasImage, setHasImage] = useState(false);
	const [focusCoordinates, setFocusCoordinates] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const resetStates = () => {
		setHasImage(false);
		setColor(null);
		setFocusCoordinates(null);
	};

	const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		const x = Math.floor((e.clientX - rect.left) * scaleX);
		const y = Math.floor((e.clientY - rect.top) * scaleY);
		setFocusCoordinates({ x: x / scaleX, y: y / scaleY });

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
		const hex = convertRGBToHex(r, g, b);
		console.log({ hex });
		// const nearestColor = nearest?.(hex);
		// if (nearestColor) {
		// 	console.log(nearestColor);
		// }
		setColor({
			name: 'Unknown',
			hex,
			rgb: `rgb(${r}, ${g}, ${b})`,
			hsl: '',
			lab: '',
			bestContrast: '',
		});
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		resetStates();

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
		<div className='flex flex-col gap-4'>
			<Label htmlFor='image-upload'>
				<Card>
					<CardContent className='flex flex-col items-center gap-4'>
						<FileImages />
						<span>Drop your image here, or browse</span>
						<span className='text-xs text-muted-foreground'>
							Supports: JPG, PNG, WebP
						</span>
					</CardContent>
				</Card>
			</Label>
			<Input
				id='image-upload'
				className='hidden'
				type='file'
				accept='image/*'
				onChange={handleImageUpload}
			/>
			<ColorListSelect />
			<Card className={cn('p-0', !hasImage && 'hidden')}>
				<CardContent className='p-0 relative'>
					<canvas
						ref={canvasRef}
						className='w-full h-auto cursor-crosshair'
						onClick={handleCanvasClick}
					/>
					{focusCoordinates && (
						<>
							<div
								className='absolute w-4 h-4 rounded-full border-2 border-border bg-transparent pointer-events-none'
								style={{
									left: focusCoordinates.x - 8,
									top: focusCoordinates.y - 8,
								}}
							/>
							<span
								className='absolute py-2 px-4 border rounded-full bg-amber-700 z-10'
								style={{
									left: focusCoordinates.x,
									top: focusCoordinates.y,
								}}
							>
								{color?.name}
							</span>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
