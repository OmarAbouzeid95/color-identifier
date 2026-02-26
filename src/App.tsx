import { useEffect, useState } from 'react';
import MainLayout from './components/layouts/MainLayout';
import { capitalizeFirstLetter, getNearsetColors } from './lib/helpers';
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
import { Info, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { useColor } from './Providers/ColorProvider';
import ImageUpload from './components/ImageUpload';
import ColorListSelect from './components/ColorListSelect';

function App() {
	const {
		color,
		setColor,
		activeColorList,
		setActiveColorList,
		colorsConfig,
		setColorsConfig,
	} = useColor();

	const [nearest, setNearest] = useState<ReturnType<
		typeof getNearsetColors
	> | null>(null);

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

	useEffect(() => {
		fetch(`https://api.color.pizza/v1/?list=${activeColorList}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.colors && Array.isArray(data.colors)) {
					setNearest(getNearsetColors(data.colors));
				}
			})
			.catch((err) => {
				console.error('Error fetching color lists:', err);
			});
	}, [activeColorList]);

	return (
		<MainLayout>
			<div className='max-w-lg mx-auto p-4 flex flex-col gap-4'>
				<ImageUpload />
				<ColorListSelect />
				{color && (
					<div className='space-y-6'>
						<Alert className='bg-amber-300'>
							<Info />
							<AlertTitle>Success! Your changes have been saved</AlertTitle>
							<AlertDescription>
								This is an alert with icon, title and description.
							</AlertDescription>
						</Alert>
						<div className='w-full rounded-base flex flex-col shadow-shadow border-b border-r bg-background overflow-hidden'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='w-40'>Color Format</TableHead>
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
					</div>
				)}
			</div>
		</MainLayout>
	);
}

export default App;
