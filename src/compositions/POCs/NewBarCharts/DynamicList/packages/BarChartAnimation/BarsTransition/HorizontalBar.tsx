import React from 'react';
import {ScaleLinear} from 'd3-scale';

import {HtmlArea, TGridLayoutArea} from '../../../../../../../acetti-layout';
import {RoundedRightRect, RoundedLeftRect} from './RoundedRect/RoundedRect';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';

export type THorizontalBarComponentProps = {
	area: TGridLayoutArea;
	valueFrom?: number;
	valueTo?: number;
	currentValue: number;
	currentColor: string;
	xScale: ScaleLinear<number, number>;
	baseline: number;
	theme: ThemeType;
	id: string;
	label: string;
	animateExit: boolean;
	animateEnter: boolean;
	// TODO evantually pass also these infos to all HorizontalBar Components! and also Label and ValueLabel
	// easingPercentage
	// statusFrom: "default" | ""
	// statusTo:
};

export type THorizontalBarComponent =
	React.ComponentType<THorizontalBarComponentProps>;

export const HorizontalBar: React.FC<THorizontalBarComponentProps> = ({
	area,
	currentValue,
	currentColor,
	xScale,
	baseline,
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

export function getBarRect({
	area,
	xScale,
	value,
}: {
	area: TGridLayoutArea;
	xScale: ScaleLinear<number, number>;
	value: number;
}) {
	const zeroLine_x = xScale(0);

	const currentBarWidth = Math.abs(xScale(value) - zeroLine_x);

	const barRect = {
		y: 0,
		x: value >= 0 ? zeroLine_x : zeroLine_x - currentBarWidth,
		height: area.height,
		width: currentBarWidth,
	};

	return barRect;
}
