import {ScaleLinear} from 'd3-scale';
import {line} from 'd3-shape';
import {useCurrentFrame, interpolate, Easing, useVideoConfig} from 'remotion';

import {getXY} from '../acetti-ts-periodsScale/getXY';
import {TPeriodsScale} from '../acetti-ts-periodsScale/periodsScale';
import {TGridLayoutArea} from '../acetti-layout';
import {TimeSeries} from '../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';

export const BuildingAnimatedLine: React.FC<{
	lineColor: string;
	area: TGridLayoutArea;
	timeSeries: TimeSeries;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	displayDots?: boolean;
}> = ({
	lineColor,
	area,
	timeSeries,
	periodsScale,
	yScale,
	displayDots = false,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entryDurationInFrames = fps * 1;

	const percAnimation = interpolate(frame, [0, entryDurationInFrames], [0, 1], {
		easing: Easing.ease,
	});

	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	const currentRightVisibleDomainIndex =
		percAnimation * visibleDomainIndices[1];

	const {x, y} = getXY({
		periodsScale,
		yScale: yScale,
		timeSeries,
		domainIndex: currentRightVisibleDomainIndex,
	});

	const visibleAreaWidth = x;

	const linePath = line<{date: Date; value: number}>()
		.x((d) => periodsScale.getBandFromDate(d.date).centroid)
		.y((d) => yScale(d.value));

	const d = linePath(timeSeries) || '';

	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			<defs>
				<clipPath id="plotAreaClipPath2">
					<rect
						x={0}
						y={0}
						width={visibleAreaWidth || area.width}
						height={area.height}
					/>
				</clipPath>
			</defs>

			<g clipPath="url(#plotAreaClipPath2)">
				<path d={d} stroke={lineColor} strokeWidth={4} fill="none" />
				{/* dots */}
			</g>
			<g>
				{displayDots
					? timeSeries.map((timeSeriesItem) => {
							const band = periodsScale.getBandFromDate(timeSeriesItem.date);
							const cx = band.centroid;
							const cy = yScale(timeSeriesItem.value);
							return (
								<g>
									<circle cx={cx} cy={cy} r={6} fill={lineColor} opacity={1} />
								</g>
							);
					  })
					: null}
			</g>

			{x && y ? <circle cx={x} cy={y} r={11} fill={lineColor} /> : null}
		</svg>
	);
};
