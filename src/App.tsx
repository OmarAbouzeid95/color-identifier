import { useEffect } from 'react';
import MainLayout from './components/layouts/MainLayout';
import { useColor } from './Providers/ColorProvider';
import ImageUpload from './components/ImageUpload';
import ColorListSelect from './components/ColorListSelect';
import ColorDetailsTable from './components/ColorDetailsTable';
import { DEFAULT_COLORS } from './constants/colors';
import type { NamedColor } from './types/colors';

function App() {
	const { activeColorList, setColorsConfig, setColorList } = useColor();

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
		if (activeColorList === 'basic') {
			setColorList(DEFAULT_COLORS);
			return;
		}

		fetch(`https://api.color.pizza/v1/?list=${activeColorList}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.colors && Array.isArray(data.colors)) {
					// Keep only what the matcher needs; the API sends many extra fields per color
					setColorList(
						data.colors.map(({ name, hex }: NamedColor) => ({ name, hex })),
					);
				}
			})
			.catch((err) => {
				console.error('Error fetching color lists:', err);
			});
	}, [activeColorList]);

	return (
		<MainLayout>
			<section className='max-w-lg mx-auto px-4 py-16 md:py-24 md:max-w-7xl text-center'>
				<h2 className='text-4xl font-heading tracking-tight md:text-5xl'>
					Identify Any Color
				</h2>
				<p className='mt-4 text-base text-foreground/60 max-w-lg mx-auto'>
					Upload an image, click anywhere on it, and instantly get the color
					name and values in every major format.
				</p>
			</section>
			<div className='max-w-lg mx-auto p-4 flex flex-col gap-4 md:max-w-7xl md:flex-row md:justify-between lg:gap-20'>
				<ImageUpload />
				<div className='space-y-6'>
					<ColorListSelect />
					<ColorDetailsTable />
				</div>
			</div>
		</MainLayout>
	);
}

export default App;
