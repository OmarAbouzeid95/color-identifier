import { useColor } from '@/Providers/ColorProvider';
import { Label } from './ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';

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
					<SelectValue placeholder='Select a color list'>
						{colorsConfig.descriptions[activeColorList]?.['title']}
					</SelectValue>
				</SelectTrigger>
				<SelectContent className='max-w-87.5 md:max-w-full'>
					{colorsConfig.list.map((colorValue) => {
						const hasDescription =
							colorsConfig?.descriptions?.[activeColorList]?.description;
						return (
							<SelectItem
								key={colorValue}
								value={colorValue}
								className='max-w-85 md:max-w-full'
							>
								<div className='flex flex-col gap-1 items-start py-2'>
									<p>
										{colorsConfig.descriptions[colorValue]?.['title'] ||
											colorValue}
									</p>
									{hasDescription && (
										<p className='text-xs text-muted-foreground'>
											{
												colorsConfig?.descriptions?.[activeColorList]
													?.description
											}
										</p>
									)}
								</div>
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}
