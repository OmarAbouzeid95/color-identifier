import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import {
	convertRGBToCMYK,
	convertRGBToHex,
	convertRGBToHSL,
	convertRGBToHSV,
	convertRGBToOKLCH,
} from '@/lib/helpers';
import { useColor } from '@/Providers/ColorProvider';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import nearestColor from 'nearest-color';

export default function ImageUpload() {
	const { color, setColor, nearestColors } = useColor();
	const [hasImage, setHasImage] = useState(false);
	const [focusCoordinates, setFocusCoordinates] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

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

		if (!nearestColors) return;

		const nearest = nearestColor.from(nearestColors);
		setColor({
			name: nearest(convertRGBToHex(r, g, b))?.name || 'Unknown',
			hex: convertRGBToHex(r, g, b),
			rgb: `rgb(${r}, ${g}, ${b})`,
			hsl: convertRGBToHSL(r, g, b),
			hsv: convertRGBToHSV(r, g, b),
			cmyk: convertRGBToCMYK(r, g, b),
			oklch: convertRGBToOKLCH(r, g, b),
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
			<Card
				className={cn(
					'p-0 overflow-hidden bg-secondary-background h-80 lg:h-120 w-fit mx-auto',
					!hasImage && 'hidden',
				)}
			>
				<CardContent className='p-0 relative w-fit mx-auto h-full flex items-center justify-center'>
					<canvas
						ref={canvasRef}
						className='max-w-full max-h-full cursor-crosshair block'
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
			<div className='space-y-4 md:max-w-lg md:min-w-lg'>
				<Label htmlFor='image-upload' className='block'>
					{!hasImage && (
						<Card className='bg-white w-full border-dashed shadow-none!'>
							<CardContent className='flex flex-col md:h-44 items-center justify-center gap-4'>
								<div className='bg-background p-4 rounded-full'>
									<Upload />
								</div>
								<span>Drop your image here, or browse</span>
								<span className='text-xs text-muted-foreground'>
									Supports: JPG, PNG, WebP
								</span>
							</CardContent>
						</Card>
					)}
					{hasImage && (
						<Button
							className='w-full inline-flex items-center gap-2'
							type='button'
							onClick={() => fileInputRef.current?.click()}
						>
							<Upload />
							<span>Upload another photo</span>
						</Button>
					)}
				</Label>
				<Input
					ref={fileInputRef}
					id='image-upload'
					className='hidden'
					type='file'
					accept='image/*'
					onChange={handleImageUpload}
				/>
			</div>
		</div>
	);
}
