import {ScaleLinear} from 'd3-scale';

import {TGridLayoutArea} from '../../acetti-viz';
import {getYAxisSpecFromScale} from '../../acetti-axis/getYAxisSpecFromScale';

export type TTheme_YAxis = {
	fontSize: number;
	formatter: (x: number) => string;
	strokeWidth: number;
	color: string;
	tickColor: string;
};

export const AnimatedYAxis: React.FC<{
	area: TGridLayoutArea;
	yScaleCurrent: ScaleLinear<number, number>;
	theme: TTheme_YAxis;
}> = ({area, yScaleCurrent, theme}) => {
	const yAxisSpec = getYAxisSpecFromScale(yScaleCurrent, theme.formatter);

	return (
		<svg overflow="visible">
			{yAxisSpec.ticks.map((it, i) => {
				const tickMappedValue = yAxisSpec.scale(it.value);

				return (
					<g key={i}>
						<line
							x1={0}
							x2={20}
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
				const labelMappedValue = yAxisSpec.scale(it.value);
				return (
					<g key={it.id}>
						<text
							textAnchor="end"
							alignmentBaseline="middle"
							fill={theme.color}
							// fontFamily={fontFamilyXTicklabels}
							fontSize={theme.fontSize}
							y={labelMappedValue}
							x={area.width}
						>
							{it.label}
						</text>
					</g>
				);
			})}
		</svg>
	);
};
