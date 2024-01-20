import {ReactNode} from 'react';

// import {useAppTheme} from '../../../src/appTheme/useAppTheme';

type TSvgProps = {
	height?: number;
	width?: number;
	children: ReactNode;
	style?: Object;
};

export default function Svg({width, height, children, style = {}}: TSvgProps) {
	const defaultStrokeColor = 'magenta';

	const debugStyle = {border: `3px solid ${defaultStrokeColor}`};

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
