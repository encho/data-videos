import {ScaleLinear} from 'd3-scale';

import {TGridLayoutArea} from '../../acetti-viz';
import {getYAxisSpecFromScale} from '../../acetti-axis/getYAxisSpecFromScale';

export const AnimatedYAxis: React.FC<{
	linesColor: string;
	area: TGridLayoutArea;
	yScaleCurrent: ScaleLinear<number, number>;
	fontSize: number;
	formatter: (x: number) => string;
	strokeWidth: number;
	textColor: string;
	tickColor: string;
}> = ({
	linesColor,
	area,
	yScaleCurrent,
	fontSize,
	formatter,
	strokeWidth,
	textColor,
	tickColor,
}) => {
	const yAxisSpec = getYAxisSpecFromScale(yScaleCurrent, formatter);

	return (
		<svg overflow="visible">
			{/* update ticks  */}
			{yAxisSpec.ticks.map((it, i) => {
				const tickMappedValue = yAxisSpec.scale(it.value);

				return (
					<g key={i}>
						<line
							x1={0}
							x2={20}
							y1={tickMappedValue}
							y2={tickMappedValue}
							stroke={tickColor}
							strokeWidth={strokeWidth}
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
							fill={textColor}
							// fontFamily={fontFamilyXTicklabels}
							fontSize={fontSize}
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
