import {ScaleLinear} from 'd3-scale';

import {TGridLayoutArea} from '../../acetti-viz';
import {getYAxisSpecFromScale} from '../../acetti-axis/getYAxisSpecFromScale';

export const AnimatedYAxis: React.FC<{
	linesColor: string;
	area: TGridLayoutArea;
	yScaleCurrent: ScaleLinear<number, number>;
	fontSize?: number;
	// axisSpecType: 'STANDARD' | 'INTER_MONTHS';
}> = ({
	linesColor,
	area,
	yScaleCurrent,
	fontSize = 12,
	// axisSpecType
}) => {
	const yAxisSpec = getYAxisSpecFromScale(yScaleCurrent);

	return (
		<svg overflow="visible">
			<rect
				x={0}
				y={0}
				width={area.width}
				height={area.height}
				fill="#f05122"
				opacity={0}
			/>

			{/* zero line */}
			<line
				y1={yAxisSpec.scale(0)}
				y2={yAxisSpec.scale(0)}
				x1={0}
				x2={50}
				stroke={'gray'}
				// TODO strokeWidth as variable
				strokeWidth={12}
				opacity={0.3}
			/>

			{/* update ticks  */}
			{yAxisSpec.ticks.map((it, i) => {
				// const tickMappedValue = getTickMappedValue(xAxisSpec, it.id);
				const tickMappedValue = yAxisSpec.scale(it.value);

				return (
					<g key={i}>
						<line
							x1={0}
							x2={20}
							y1={tickMappedValue}
							y2={tickMappedValue}
							stroke={linesColor}
							strokeWidth={4}
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
							// textAnchor={it.textAnchor || 'middle'}
							textAnchor="end"
							// TODO middle or center?
							// alignmentBaseline="hanging"
							alignmentBaseline="middle"
							// fill={'red'}
							// stroke={'red'}
							fill={linesColor}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							fontSize={fontSize}
							y={labelMappedValue}
							x={70}
						>
							{it.label}
						</text>
					</g>
				);
			})}

			{/* horizontal line */}
			{/* <g>
				<line
					x1={xAxisSpec.scale(xAxisSpec.scale.domain()[0])}
					x2={xAxisSpec.scale(xAxisSpec.scale.domain()[1])}
					y1={0}
					y2={0}
					stroke={linesColor}
					// TODO strokeWidth as variable
					strokeWidth={4}
				/>
			</g> */}
		</svg>
	);
};
