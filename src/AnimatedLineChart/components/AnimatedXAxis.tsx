import {ScaleTime} from 'd3-scale';

import {TGridLayoutArea} from '../../acetti-viz';
import {getXAxisSpecFromScale} from '../../acetti-axis/getXAxisSpecFromScale';

export const AnimatedXAxis: React.FC<{
	area: TGridLayoutArea;
	xScaleCurrent: ScaleTime<Date, number>;
}> = ({area, xScaleCurrent}) => {
	const xAxisSpec = getXAxisSpecFromScale(xScaleCurrent);

	return (
		<svg overflow="visible">
			<rect
				x={0}
				y={0}
				width={area.width}
				height={area.height}
				fill="#f05122"
				opacity={0.05}
			/>

			{/* update ticks  */}
			{xAxisSpec.ticks.map((it, i) => {
				return (
					<g key={i}>
						<line
							x1={xAxisSpec.scale(it.value)}
							x2={xAxisSpec.scale(it.value)}
							y1={0}
							y2={20}
							stroke={'green'}
							strokeWidth={4}
						/>
					</g>
				);
			})}

			{/* update labels  */}
			{xAxisSpec.labels.map((it, i) => {
				return (
					<g key={i}>
						<text
							textAnchor="middle"
							alignmentBaseline="hanging"
							fill={'green'}
							stroke={'green'}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							fontSize={16}
							x={xAxisSpec.scale(it.value)}
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
					stroke={'green'}
					// TODO strokeWidth as variable
					strokeWidth={4}
				/>
			</g>
		</svg>
	);
};
