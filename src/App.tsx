import { useEffect, useState } from 'react';
import MainLayout from './components/layouts/MainLayout';
import { getNearsetColors } from './lib/helpers';
import { useColor } from './Providers/ColorProvider';
import ImageUpload from './components/ImageUpload';
import ColorListSelect from './components/ColorListSelect';
import ColorDetailsTable from './components/ColorDetailsTable';

function App() {
	const {
		setColor,
		activeColorList,
		setActiveColorList,
		colorsConfig,
		setColorsConfig,
	} = useColor();

	const [nearest, setNearest] = useState<ReturnType<
		typeof getNearsetColors
	> | null>(null);

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
