import type { Color } from '@/types/colors';
import { createContext, useContext, useState } from 'react';

type ColorContextType = {
	color: Color | null;
	setColor: (color: Color | null) => void;
	activeColorList: string;
	setActiveColorList: (list: string) => void;
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

	return (
		<ColorContext.Provider
			value={{ color, setColor, activeColorList, setActiveColorList }}
		>
			{children}
		</ColorContext.Provider>
	);
}
