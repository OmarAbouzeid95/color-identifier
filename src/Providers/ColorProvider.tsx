import type { Color } from '@/types/colors';
import { createContext, useContext, useState } from 'react';

type ColorContextType = {
	color: Color | null;
	setColor: (color: Color | null) => void;
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

	return (
		<ColorContext.Provider
			value={{
				color,
				setColor,
				activeColorList,
				setActiveColorList,
				colorsConfig,
				setColorsConfig,
			}}
		>
			{children}
		</ColorContext.Provider>
	);
}
