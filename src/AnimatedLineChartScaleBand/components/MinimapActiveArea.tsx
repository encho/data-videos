import {ScaleLinear} from 'd3-scale';

import {TPeriodsScale} from '../periodsScale/periodsScale';
import {TGridLayoutArea} from '../../acetti-viz';

export const MinimapActiveArea: React.FC<{
	areaColor: string;
	areaOpacity: number;
	area: TGridLayoutArea;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	activeDomainIndices: [number, number];
}> = ({areaColor, areaOpacity, area, periodsScale, activeDomainIndices}) => {
	const x1 = periodsScale.mapFloatIndexToRange(activeDomainIndices[0]);
	const x2 = periodsScale.mapFloatIndexToRange(activeDomainIndices[1]);

	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			<rect
				x={x1}
				width={x2 - x1}
				fill={areaColor}
				opacity={areaOpacity}
				height={area.height}
			/>
		</svg>
	);
};
