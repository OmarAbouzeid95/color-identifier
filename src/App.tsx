import { useEffect, useRef, useState } from 'react';
import MainLayout from './components/layouts/MainLayout';
import { Input } from './components/ui/input';
import { Card, CardContent } from './components/ui/card';
import { cn } from '@/lib/utils';
import { capitalizeFirstLetter, convertRGBToHex } from './lib/helpers';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './components/ui/table';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

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

	const handleCopy = (text: string) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success('Copied to clipboard.');
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err);
			});
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
					<SelectTrigger className='w-full text-left'>
						<SelectValue placeholder='Select a color list' />
					</SelectTrigger>
					<SelectContent className='max-w-87.5'>
						{colorsConfig.list.map((colorValue) => (
							<SelectItem
								key={colorValue}
								value={colorValue}
								className='text-wrap max-w-85'
							>
								{colorsConfig.descriptions[colorValue]?.['title'] || colorValue}
							</SelectItem>
						))}
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
				{color && (
					<div className='w-full rounded-base flex flex-col shadow-shadow border-b-2 border-r-2 bg-background overflow-hidden'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='w-25'>Color Format</TableHead>
									<TableHead>Value</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell className='flex items-center gap-2 text-md font-semibold'>
										<span>{capitalizeFirstLetter(color?.name || '')}</span>
										<Copy
											size={16}
											onClick={() => handleCopy(color?.hex || '')}
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>HEX</TableCell>
									<TableCell className='flex items-center gap-2 text-md font-semibold uppercase'>
										<span>{color?.hex}</span>
										<Copy
											size={16}
											onClick={() => handleCopy(color?.hex || '')}
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>RGB</TableCell>
									<TableCell className='flex items-center gap-2 text-md font-semibold'>
										<span>{color?.rgb}</span>
										<Copy
											size={16}
											onClick={() => handleCopy(color?.rgb || '')}
										/>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</MainLayout>
	);
}

export default App;
