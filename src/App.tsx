import { useEffect, useRef, useState } from 'react';
import MainLayout from './components/layouts/MainLayout';
import { Input } from './components/ui/input';
import { Card, CardContent } from './components/ui/card';
import { cn } from '@/lib/utils';
import { convertRGBToHex } from './lib/helpers';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './components/ui/select';

function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [hasImage, setHasImage] = useState(false);
	const [color, setColor] = useState<{
		name?: string;
		hex?: string;
		rgb?: string;
	} | null>(null);
	const [focusCoordinates, setFocusCoordinates] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [activeColorList, setActiveColorList] = useState<string>('basic');
	const [colorsConfig, setColorsConfig] = useState<{
		list: string[];
		descriptions: Record<string, { title: string; description: string }>;
	}>({
		list: [],
		descriptions: {},
	});

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
		setColor({
			hex,
			rgb: `rgb(${r}, ${g}, ${b})`,
		});
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		resetStates();
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

	useEffect(() => {
		if (!color?.hex) return;

		fetch(
			`https://api.color.pizza/v1/?list=${activeColorList}&values=${color.hex.replace('#', '')}`,
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.paletteTitle) {
					setColor((prev) => ({
						...prev,
						name: data.paletteTitle,
					}));
				}
			})
			.catch((err) => {
				console.error('Error fetching color name:', err);
			});
	}, [color?.hex, activeColorList]);

	useEffect(() => {
		fetch('https://api.color.pizza/v1/lists')
			.then((res) => res.json())
			.then((data) => {
				if (!data.availableColorNameLists || !data.listDescriptions) {
					throw new Error('Invalid response structure');
				}
				setColorsConfig({
					list: data.availableColorNameLists,
					descriptions: data.listDescriptions,
				});
			})
			.catch((err) => {
				console.error('Error fetching color lists:', err);
			});
	}, []);

	return (
		<MainLayout>
			<div className='max-w-lg mx-auto p-4 flex flex-col gap-4'>
				<Input type='file' accept='image/*' onChange={handleImageUpload} />
				<Select
					value={activeColorList}
					onValueChange={(value) => setActiveColorList(value)}
				>
					<SelectTrigger className='w-45'>
						<SelectValue placeholder='Select a color list' />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{colorsConfig.list.map((colorValue) => (
								<SelectItem key={colorValue} value={colorValue}>
									{colorsConfig.descriptions[colorValue]?.['title'] ||
										colorValue}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<Card className={cn('p-0', !hasImage && 'hidden')}>
					<CardContent className='p-0 relative'>
						<canvas
							ref={canvasRef}
							className='w-full h-auto cursor-crosshair'
							onClick={handleCanvasClick}
						/>
						{focusCoordinates && (
							<div
								className='absolute w-4 h-4 rounded-full border-2 border-border bg-transparent pointer-events-none'
								style={{
									left: focusCoordinates.x - 8,
									top: focusCoordinates.y - 8,
								}}
							/>
						)}
					</CardContent>
				</Card>
				{color && (
					<div className='flex items-center gap-3'>
						<div
							className='w-10 h-10 rounded-base border-2 border-border'
							style={{ backgroundColor: color.hex }}
						/>
						<span className='font-heading text-lg'>{color.hex}</span>
						<span className='font-heading text-sm'>{color.name}</span>
					</div>
				)}
			</div>
		</MainLayout>
	);
}

export default App;
