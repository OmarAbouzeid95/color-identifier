import { useColor } from '@/Providers/ColorProvider';
import { Label } from './ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Info } from 'lucide-react';

export default function ColorListSelect() {
	const { activeColorList, setActiveColorList, colorsConfig } = useColor();

	return (
		<div className='space-y-2'>
			<Label className='block' htmlFor='color-list-select'>
				Colors List
			</Label>
			<Select
				value={activeColorList}
				onValueChange={(value) => setActiveColorList(value)}
			>
				<SelectTrigger className='w-full text-left' id='color-list-select'>
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
			<Alert className='bg-white'>
				<Info />
				<AlertTitle>Color Set Details</AlertTitle>
				<AlertDescription>
					{colorsConfig?.descriptions?.[activeColorList]?.description ||
						'No description available'}
				</AlertDescription>
			</Alert>
		</div>
	);
}
