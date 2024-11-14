import {ReactNode} from 'react';
import config from '../config';
import {TGridLayoutArea} from '../types2';
// QUICK-FIX, we should be able to have griddy independant of appTheme, passing theme in!
// import {useAppTheme} from '../../../src/appTheme/useAppTheme';

type TAreaProps = {
	area: TGridLayoutArea;
	children?: ReactNode;
	fill?: string;
	// eslint-disable-next-line
	stroke?: string;
	// eslint-disable-next-line
	show?: boolean;
};

export default function Area({
	children,
	area,
	fill,
	stroke,
	show = false,
	...props
}: TAreaProps) {
	return (
		<g {...props} transform={`translate(${area.x1} ${area.y1})`}>
			<AreaRect
				show={config.debug || show}
				area={area}
				fill={fill}
				stroke={stroke}
			/>
			{children || null}
		</g>
	);
}

function AreaRect({
	area,
	fill,
	stroke,
	show,
}: {
	show?: boolean;
	fill?: string;
	stroke?: string;
	area: TGridLayoutArea;
}) {
	// const {theme} = useAppTheme();
	// const defaultFillColor = theme.DisplayGridLayout.Area.backgroundColor;
	// const defaultStrokeColor = theme.DisplayGridLayout.Area.borderColor;
	const defaultFillColor = 'rgba(0,0,0,0.2)';
	const defaultStrokeColor = 'magenta';

	const strokeColor = stroke
		? stroke
		: show
		? defaultStrokeColor
		: 'transparent';
	const fillColor = fill ? fill : show ? defaultFillColor : 'transparent';

	return (
		<rect
			stroke={strokeColor}
			fill={fillColor}
			x={0}
			y={0}
			width={area.width}
			height={area.height}
		/>
	);
}

export function HtmlArea({
	area,
	children,
	fill = 'transparent',
	opacity,
}: TAreaProps & {opacity?: number}) {
	return (
		<div
			style={{
				position: 'absolute',
				backgroundColor: fill,
				opacity,
				width: area.width,
				height: area.height,
				top: area.y1,
				left: area.x1,
			}}
		>
			{children || null}
		</div>
	);
}
