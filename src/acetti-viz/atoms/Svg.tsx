import {ReactNode} from 'react';

// import {useAppTheme} from '../../../src/appTheme/useAppTheme';

type TSvgProps = {
	height?: number;
	width?: number;
	children: ReactNode;
	style?: Object;
	stroke?: string;
	fill?: string;
};

export default function Svg({
	width,
	height,
	children,
	style = {},
	stroke = 'magenta',
	fill = 'rgba(255,0,0,0.2)',
}: TSvgProps) {
	// const debugStyle = {border: `3px solid ${stroke}`};
	// const debugStyle = {border: `10px solid ${stroke}`};
	const debugStyle = {border: `0px solid ${stroke}`};

	return (
		<svg
			width={width}
			height={height}
			style={{
				display: 'block',
				overflow: 'visible',
				backgroundColor: fill,
				// vectorEffect: 'non-scaling-stroke',
				...debugStyle,
				...style,
			}}
		>
			{children}
		</svg>
	);
}
