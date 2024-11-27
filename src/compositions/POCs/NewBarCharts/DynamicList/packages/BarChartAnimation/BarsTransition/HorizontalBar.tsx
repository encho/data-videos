import React from 'react';
import {ScaleLinear} from 'd3-scale';

import {HtmlArea, TGridLayoutArea} from '../../../../../../../acetti-layout';
import {
	RoundedRightRect,
	RoundedLeftRect,
} from '../../../../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';

export const HorizontalBar: React.FC<{
	area: TGridLayoutArea;
	currentValue: number;
	currentColor: string;
	xScale: ScaleLinear<number, number>;
	baseline: number;
	theme: ThemeType;
	// TODO evantually pass also these infos to all HorizontalBar Components!
	// theme
	// itemFrom
	// itemTo
	// easingPercentage
}> = ({
	area,
	currentValue,
	currentColor,
	xScale,
	baseline,
	// theme: _theme,
}) => {
	const zeroLine_x = xScale(0);

	const barRadius = baseline / 4;

	const currentBarWidth = Math.abs(xScale(currentValue) - zeroLine_x);

	const relativeBarPositions = {
		y: 0,
		x: currentValue >= 0 ? zeroLine_x : zeroLine_x - currentBarWidth,
		height: area.height,
		width: currentBarWidth,
	};

	const barColor = currentColor;

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
						radius={barRadius}
					/>
				) : currentValue < 0 && area.width ? (
					<RoundedLeftRect
						y={relativeBarPositions.y}
						x={relativeBarPositions.x}
						height={relativeBarPositions.height}
						width={relativeBarPositions.width}
						fill={barColor}
						radius={barRadius}
					/>
				) : null}
			</svg>
		</HtmlArea>
	);
};
