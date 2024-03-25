import {ReactNode} from 'react';

// import {useAppTheme} from '../../../src/appTheme/useAppTheme';

type TSvgProps = {
	height?: number;
	width?: number;
	children: ReactNode;
	style?: Object;
	stroke?: string;
};

export default function Svg({
	width,
	height,
	children,
	style = {},
	stroke = 'magenta',
}: TSvgProps) {
	const debugStyle = {border: `3px solid ${stroke}`};

	return (
		<svg
			width={width}
			height={height}
			style={{
				display: 'block',
				overflow: 'visible',
				...debugStyle,
				...style,
			}}
		>
			{children}
		</svg>
	);
}
