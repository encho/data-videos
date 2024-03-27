import {ScaleLinear} from 'd3-scale';

import {TPeriodsScale} from '../periodsScale';
import {TGridLayoutArea} from '../../acetti-viz';

export const AnimatedValueDot: React.FC<{
	area: TGridLayoutArea;
	dotColor: string;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
}> = ({dotColor, area, yScale, periodsScale, timeSeries}) => {
	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();

	const visibleDomainIndexEnd = visibleDomainIndices[1];

	// determine current Dot location
	const leftEndIndex = Math.floor(visibleDomainIndexEnd);
	const rightEndIndex = Math.ceil(visibleDomainIndexEnd);
	const percRight = visibleDomainIndexEnd - leftEndIndex;

	const leftValue = timeSeries[leftEndIndex].value;
	const rightValue = timeSeries[rightEndIndex].value;

	const currentDotValue = leftValue * (1 - percRight) + rightValue * percRight;
	const currentDot_circle_cy = yScale(currentDotValue);

	// TODO implement
	// currentTimeBandsScale.scale(float)
	const currentDot_circle_cx_left =
		periodsScale.getBandFromIndex(leftEndIndex).x1;
	const currentDot_circle_cx_right =
		periodsScale.getBandFromIndex(rightEndIndex).x1;
	const currentDot_circle_cx =
		currentDot_circle_cx_left * (1 - percRight) +
		currentDot_circle_cx_right * percRight;

	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			<g>
				<circle
					cx={currentDot_circle_cx}
					cy={currentDot_circle_cy}
					r={10}
					fill={dotColor}
				/>
			</g>
		</svg>
	);
};
