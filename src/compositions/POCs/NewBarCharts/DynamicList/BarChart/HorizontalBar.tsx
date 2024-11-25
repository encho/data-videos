import React from 'react';
// import {interpolate} from 'remotion';
import {ScaleLinear} from 'd3-scale';
// import {isNumber} from 'lodash';
// import invariant from 'tiny-invariant';

import {HtmlArea, TGridLayoutArea} from '../../../../../acetti-layout';
// import {ThemeType} from '../../../../../acetti-themes/themeTypes';
import {
	RoundedRightRect,
	RoundedLeftRect,
} from '../../../../../acetti-flics/SimpleBarChart/SimpleBarChart';

export const HorizontalBar: React.FC<{
	area: TGridLayoutArea;
	// theme: ThemeType;
	// id: string;
	currentValue: number;
	// valueTo: number;
	// colorFrom: number;
	// colorTo: number;
	// easingPercentage: number;
	xScale: ScaleLinear<number, number>;
}> = ({
	area,
	// theme,
	// id,
	// valueFrom: valueFromProp, // TODO deprecate
	// valueTo: valueToProp, // TODO deprecate
	currentValue,
	// TODO: pass:
	// currentValue directly!!!
	// colorFrom,
	// colorTo,
	// TODO currentColor
	// TODO currentOpacity
	// easingPercentage, // TODO deprecate
	xScale,
}) => {
	// invariant(
	// 	isNumber(valueFromProp) || isNumber(valueToProp),
	// 	'HorizontalBarChart: please provide at least one of valueTo and valueFrom'
	// );

	// const valueTo = valueToProp ? valueToProp : 0;
	// const valueFrom = valueFromProp ? valueFromProp : 0;

	// const currentValue = interpolate(
	// 	easingPercentage,
	// 	[0, 1],
	// 	[valueFrom, valueTo],
	// 	{}
	// );

	const zeroLine_x = xScale(0);

	const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x);

	const relativeBarPositions = {
		y: 0,
		x: currentValue >= 0 ? zeroLine_x : zeroLine_x - currentBarWidth,
		height: area.height,
		width: currentBarWidth,
	};

	const barColor = 'orange';

	return (
		<HtmlArea area={area}>
			<svg width={area.width} height={area.height}>
				{currentValue > 0 && area.width ? (
					<RoundedRightRect
						y={relativeBarPositions.y}
						x={relativeBarPositions.x}
						height={relativeBarPositions.height}
						width={relativeBarPositions.width}
						fill={barColor}
						// TODO: get radius from baseline?
						radius={5}
					/>
				) : currentValue < 0 && area.width ? (
					<RoundedLeftRect
						y={relativeBarPositions.y}
						x={relativeBarPositions.x}
						height={relativeBarPositions.height}
						width={relativeBarPositions.width}
						fill={barColor}
						// TODO: get radius from baseline?
						radius={5}
					/>
				) : null}
			</svg>
		</HtmlArea>
	);
};
