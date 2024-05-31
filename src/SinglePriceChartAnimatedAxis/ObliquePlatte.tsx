import {ThemeType} from '../acetti-themes/themeTypes';

type Theme_Platte = ThemeType['platte'];

export const ObliquePlatte: React.FC<{
	children: React.ReactNode;
	width: number;
	height: number;
	theme: Theme_Platte;
}> = ({children, width, height, theme}) => {
	return (
		<div
			style={{
				perspective: '3000px',
				transformStyle: 'preserve-3d',
			}}
		>
			<div
				style={{
					overflow: 'visible',
					borderColor: theme.borderColor,
					backgroundColor: theme.backgroundColor,
					borderRadius: 8,
					borderStyle: 'solid',
					borderWidth: 3,
					height,
					width,
					transform: `translateX(-20px) rotateX(${20}deg) rotateY(${-20}deg) rotateZ(${1}deg)`,
				}}
			>
				{children}
			</div>
		</div>
	);
};
