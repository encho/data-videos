import {ScaleTime, ScaleLinear} from 'd3-scale';

import {TGridLayoutArea} from '../../acetti-viz';
import {getXAxisSpecFromScale} from '../../acetti-axis/getXAxisSpecFromScale';
import {
	getTickMappedValue,
	getTickValue,
	getLabelMappedValue,
	getLabelValue,
} from '../../acetti-axis/axisSpec';
import {getYAxisSpecFromScale} from '../../acetti-axis/getYAxisSpecFromScale';

export const AnimatedYAxis: React.FC<{
	linesColor: string;
	area: TGridLayoutArea;
	yScaleCurrent: ScaleLinear<number, number>;
	// axisSpecType: 'STANDARD' | 'INTER_MONTHS';
}> = ({
	linesColor,
	area,
	yScaleCurrent,
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
			{/* {yAxisSpec.labels.map((it, i) => {
				const labelMappedValue = getLabelMappedValue(yAxisSpec, it.id);
				return (
					<g key={i}>
						<text
							textAnchor="middle"
							alignmentBaseline="hanging"
							fill={'red'}
							stroke={'red'}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							fontSize={16}
							x={labelMappedValue}
							y={24}
						>
							{it.label}
						</text>
					</g>
				);
			})} */}

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
