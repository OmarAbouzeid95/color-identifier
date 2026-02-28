import { useColor } from '@/Providers/ColorProvider';
import { capitalizeFirstLetter } from '@/lib/helpers';
import { Copy, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const COLOR_FORMATS = ['hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'oklch'] as const;

function handleCopy(text: string) {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			toast.success('Copied to clipboard.');
		})
		.catch((err) => {
			console.error('Failed to copy text: ', err);
		});
}

function ColorEntry({
	label,
	value,
}: {
	label: string;
	value: string | undefined;
}) {
	return (
		<div className='flex items-center justify-between gap-2 bg-secondary-background px-4 py-3 border-2 rounded-base'>
			<span className='text-xs uppercase tracking-wider text-foreground/50 font-heading shrink-0'>
				{label}
			</span>
			{value ? (
				<button
					onClick={() => handleCopy(value)}
					className='inline-flex items-center gap-2 text-sm font-heading cursor-pointer hover:text-main transition-colors text-right min-w-0'
				>
					<span className='truncate'>{value}</span>
					<Copy size={14} className='shrink-0' />
				</button>
			) : (
				<span className='text-foreground/30'>&mdash;</span>
			)}
		</div>
	);
}

export default function ColorDetailsTable() {
	const { color } = useColor();

	return (
		<div className='space-y-4'>
			<Alert className='bg-amber-300'>
				<Info />
				<AlertTitle>Color Matching Note</AlertTitle>
				<AlertDescription>
					The color name is matched to the nearest known color in the selected
					list and may not be exact.
				</AlertDescription>
			</Alert>

			{color && (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
					{/* Color swatch */}
					<div
						className='md:col-span-2 h-20 rounded-base border-2 shadow-shadow flex items-end p-3 transition-colors'
						style={{ backgroundColor: color.hex }}
					>
						<span className='text-sm font-heading px-2 py-0.5 rounded-base bg-secondary-background/80 backdrop-blur-sm border'>
							{capitalizeFirstLetter(color.name)}
						</span>
					</div>

					{COLOR_FORMATS.map((format) => (
						<ColorEntry key={format} label={format} value={color?.[format]} />
					))}
				</div>
			)}
		</div>
	);
}
