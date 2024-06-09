import {ScaleLinear} from 'd3-scale';

import {TGridLayoutArea} from '../../../../acetti-viz';
// import {getYAxisSpecFromScale} from '../../../../acetti-axis/getYAxisSpecFromScale';
// TODO rename better!
// import {TAxisSpec_Linear_Numeric} from '../../../../acetti-axis/getYAxisSpecFromScale';
import {TYAxisSpec} from './axisSpecs_yAxis';

export type TTheme_YAxis = {
	fontSize: number;
	// formatter: (x: number) => string;
	strokeWidth: number;
	color: string;
	tickColor: string;
};

export const YAxis_SpecBased: React.FC<{
	area: TGridLayoutArea;
	yScaleCurrent: ScaleLinear<number, number>;
	theme: TTheme_YAxis;
	// formatter: (x: number) => string;
	// yAxisSpec: TAxisSpec_Linear_Numeric;
	yAxisSpec: TYAxisSpec;
}> = ({
	// area,
	yScaleCurrent,
	theme,
	yAxisSpec,
}) => {
	// TODO ideally these are to be found in theme// BUT multiple size options somwehow...
	// const TICK_LINE_SIZE = 20;
	const TICK_LINE_SIZE = 24;
	const TICK_TEXT_FONT_SIZE = 24;
	const TICK_TEXT_FONT_WEIGHT = 500;
	const TICK_TEXT_LEFT_PADDING = 5;

	// const yAxisSpec = getYAxisSpecFromScale(yScaleCurrent, formatter);

	return (
		<svg overflow="visible">
			{yAxisSpec.ticks.map((it, i) => {
				// const tickMappedValue = yAxisSpec.scale(it.value);
				const tickMappedValue = yScaleCurrent(it.domainValue);

				return (
					<g key={i}>
						<line
							x1={0}
							x2={TICK_LINE_SIZE}
							y1={tickMappedValue}
							y2={tickMappedValue}
							stroke={theme.tickColor}
							strokeWidth={theme.strokeWidth}
						/>
					</g>
				);
			})}

			{/* update labels  */}
			{yAxisSpec.labels.map((it, i) => {
				// const labelMappedValue = yAxisSpec.scale(it.value);
				const labelMappedValue = yScaleCurrent(it.domainValue);
				return (
					<g key={it.id}>
						<text
							// textAnchor="end"
							textAnchor="start"
							alignmentBaseline="middle"
							fill={theme.color}
							// fontFamily={fontFamilyXTicklabels}
							fontSize={TICK_TEXT_FONT_SIZE}
							fontWeight={TICK_TEXT_FONT_WEIGHT}
							y={labelMappedValue}
							// x={area.width}
							x={TICK_LINE_SIZE + TICK_TEXT_LEFT_PADDING}
						>
							{it.label}
						</text>
					</g>
				);
			})}
		</svg>
	);
};
