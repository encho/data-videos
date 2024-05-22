import {ThemeType} from '../acetti-themes/themeTypes';

type Theme_Platte = ThemeType['platte'];

export const ObliquePlatte: React.FC<{
	children: React.ReactNode;
	width: number;
	height: number;
	theme: Theme_Platte;
}> = ({children, width, height, theme}) => {
	// const { durationInFrames} = useVideoConfig();
	// TODO integrate into colorpalette
	// const theme = themeEnum === 'NERDY' ? nerdyTheme : lorenzobertoliniTheme;
	// const frame = useCurrentFrame();
	// const {durationInFrames} = useVideoConfig();
	// const aPerc = interpolate(frame, [0, durationInFrames], [0, 1]);
	// const aTranslateY = interpolate(aPerc, [0, 1], [100, -8550]);
	// const width = 700;
	// const padding = 10;
	// const contentWidthInner = contentWidth - 2 * padding;

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

function formatPercentage(value: number): string {
	// Calculate the percentage by multiplying the value by 100
	let percentage = value * 100;
	// Round to the nearest integer and format with a sign
	// Directly use `toFixed(0)` which handles rounding
	return (percentage > 0 ? '+' : '') + percentage.toFixed(0) + '%';
}
// Usage examples:
// console.log(formatPercentage(1.23));  // Outputs: "+123%"
// console.log(formatPercentage(-0.5));  // Outputs: "-50%"
