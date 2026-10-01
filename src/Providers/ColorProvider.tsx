import type { Color } from '@/types/colors';
import nearestColor from 'nearest-color';
import {
	createContext,
	useContext,
	useMemo,
	useState,
	type Dispatch,
	type SetStateAction,
} from 'react';

type PickedColor = Omit<Color, 'name'>;

type ColorContextType = {
	color: Color | null;
	setColor: Dispatch<SetStateAction<PickedColor | null>>;
	activeColorList: string;
	setActiveColorList: (list: string) => void;
	colorsConfig: {
		list: string[];
		descriptions: Record<string, { title: string; description: string }>;
	};
	setColorsConfig: (config: {
		list: string[];
		descriptions: Record<string, { title: string; description: string }>;
	}) => void;
	setNearestColors: Dispatch<SetStateAction<Record<string, string> | null>>;
};

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const useColor = () => {
	const context = useContext(ColorContext);

	if (!context) {
		throw new Error('useColor must be used within an ColorProvider');
	}
	return context;
};

export default function ColorProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [pickedColor, setColor] = useState<PickedColor | null>(null);
	const [activeColorList, setActiveColorList] = useState<string>('basic');
	const [colorsConfig, setColorsConfig] = useState<{
		list: string[];
		descriptions: Record<string, { title: string; description: string }>;
	}>({
		list: [],
		descriptions: {},
	});
	const [nearestColors, setNearestColors] = useState<Record<
		string,
		string
	> | null>(null);

	const matchColor = useMemo(
		() => (nearestColors ? nearestColor.from(nearestColors) : null),
		[nearestColors],
	);

	const color = useMemo<Color | null>(() => {
		if (!pickedColor) return null;
		return {
			...pickedColor,
			name: matchColor?.(pickedColor.hex)?.name || 'Unknown',
		};
	}, [pickedColor, matchColor]);

	return (
		<ColorContext.Provider
			value={{
				color,
				setColor,
				activeColorList,
				setActiveColorList,
				colorsConfig,
				setColorsConfig,
				setNearestColors,
			}}
		>
			{children}
		</ColorContext.Provider>
	);
}
