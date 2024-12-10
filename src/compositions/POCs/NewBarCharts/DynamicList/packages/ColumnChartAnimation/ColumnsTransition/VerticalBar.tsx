import React from 'react';
import {ScaleLinear} from 'd3-scale';

import {HtmlArea, TGridLayoutArea} from '../../../../../../../acetti-layout';
import {RoundedTopRect, RoundedBottomRect} from './RoundedRect/RoundedRect';
import {ThemeType} from '../../../../../../../acetti-themes/themeTypes';

export type TVerticalBarComponentProps = {
	area: TGridLayoutArea;
	valueFrom?: number;
	valueTo?: number;
	currentValue: number;
	currentColor: string;
	yScale: ScaleLinear<number, number>;
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

export type TVerticalBarComponent =
	React.ComponentType<TVerticalBarComponentProps>;

export function getColumnRect({
	area,
	yScale,
	value,
}: {
	area: TGridLayoutArea;
	yScale: ScaleLinear<number, number>;
	value: number;
}) {
	const zeroLine_y = yScale(0);

	const columnHeight = Math.abs(zeroLine_y - yScale(value));

	const columnRect = {
		x: 0,
		y: value >= 0 ? zeroLine_y - columnHeight : zeroLine_y,
		width: area.width,
		height: columnHeight,
	};

	return columnRect;
}

export const VerticalBar: React.FC<TVerticalBarComponentProps> = ({
	area,
	currentValue,
	currentColor,
	yScale,
	baseline,
}) => {
	const barRadius = 0.25 * baseline; // TODO 0.25 from theme

	const relativeBarPositions = getColumnRect({
		area,
		value: currentValue,
		yScale,
	});

	const barColor = currentColor;

	return (
		<HtmlArea area={area}>
			<svg width={area.width} height={area.height}>
				{currentValue > 0 && area.width ? (
					<RoundedTopRect
						y={relativeBarPositions.y}
						x={relativeBarPositions.x}
						height={relativeBarPositions.height}
						width={relativeBarPositions.width}
						fill={barColor}
						radius={barRadius}
					/>
				) : currentValue < 0 && area.width ? (
					<RoundedBottomRect
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
