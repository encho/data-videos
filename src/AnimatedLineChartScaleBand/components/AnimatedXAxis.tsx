import {ScaleTime} from 'd3-scale';

import {TGridLayoutArea} from '../../acetti-viz';
import {getXAxisSpecFromScale} from '../../acetti-axis/getXAxisSpecFromScale';
import {
	getTickMappedValue,
	getTickValue,
	getLabelMappedValue,
	getLabelValue,
} from '../../acetti-axis/axisSpec';

export const AnimatedXAxis: React.FC<{
	linesColor: string;
	area: TGridLayoutArea;
	xScaleCurrent: ScaleTime<Date, number>;
	axisSpecType: 'STANDARD' | 'INTER_MONTHS';
}> = ({linesColor, area, xScaleCurrent, axisSpecType}) => {
	const xAxisSpec = getXAxisSpecFromScale(xScaleCurrent, axisSpecType);

	return (
		<svg overflow="visible">
			{/* <rect
				x={0}
				y={0}
				width={area.width}
				height={area.height}
				fill="#f05122"
				opacity={0.05}
			/> */}

			{/* update ticks  */}
			{xAxisSpec.ticks.map((it, i) => {
				const tickMappedValue = getTickMappedValue(xAxisSpec, it.id);

				return (
					<g key={i}>
						<line
							x1={tickMappedValue}
							x2={tickMappedValue}
							y1={0}
							y2={20}
							stroke={linesColor}
							strokeWidth={4}
						/>
					</g>
				);
			})}

			{/* update labels  */}
			{xAxisSpec.labels.map((it, i) => {
				const labelMappedValue = getLabelMappedValue(xAxisSpec, it.id);
				return (
					<g key={i}>
						<text
							textAnchor="middle"
							alignmentBaseline="hanging"
							fill={linesColor}
							stroke={linesColor}
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
			})}

			{/* horizontal line */}
			<g>
				<line
					x1={xAxisSpec.scale(xAxisSpec.scale.domain()[0])}
					x2={xAxisSpec.scale(xAxisSpec.scale.domain()[1])}
					y1={0}
					y2={0}
					stroke={linesColor}
					// TODO strokeWidth as variable
					strokeWidth={4}
				/>
			</g>
		</svg>
	);
};
