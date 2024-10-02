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
	fill = 'rgba(255,0,255,0.2)',
}: TSvgProps) {
	const debugStyle = {border: `1px solid ${stroke}`};

	return (
		<svg
			width={width}
			height={height}
			style={{
				...debugStyle,
				display: 'block',
				overflow: 'visible',
				backgroundColor: fill,
				// vectorEffect: 'non-scaling-stroke',
				...style,
			}}
		>
			{children}
		</svg>
	);
}
