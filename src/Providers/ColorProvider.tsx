import type { Color } from '@/types/colors';
import {
	createContext,
	useContext,
	useState,
	type Dispatch,
	type SetStateAction,
} from 'react';

type ColorContextType = {
	color: Color | null;
	setColor: Dispatch<SetStateAction<Color | null>>;
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
	nearestColors: Record<string, any> | null;
	setNearestColors: Dispatch<SetStateAction<Record<string, any> | null>>;
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
	const [color, setColor] = useState<Color | null>(null);
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
		any
	> | null>(null);

	return (
		<ColorContext.Provider
			value={{
				color,
				setColor,
				activeColorList,
				setActiveColorList,
				colorsConfig,
				setColorsConfig,
				nearestColors,
				setNearestColors,
			}}
		>
			{children}
		</ColorContext.Provider>
	);
}
