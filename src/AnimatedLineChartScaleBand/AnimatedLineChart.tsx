import {Sequence, useVideoConfig, AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {min, max} from 'd3-array';
// import invariant from 'tiny-invariant';

import {DisplayGridLayout} from '../acetti-viz';
import generateBrownianMotionTimeSeries from './utils/timeSeries/generateBrownianMotionTimeSeries';
// import {AnimatedLineChartContainer} from './AnimatedLineChartContainer';
import {useChartLayout} from './useChartLayout';

function sliceList(list: Date[], startDate: Date, endDate: Date): Date[] {
	// Find the indices of startDate and endDate in the list
	const startIndex = list.findIndex(
		(date) => date.getTime() === startDate.getTime()
	);
	const endIndex = list.findIndex(
		(date) => date.getTime() === endDate.getTime()
	);

	// If either startDate or endDate is not found, or if start index is greater than end index, return an empty array
	if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
		return [];
	}

	// Slice the list from startIndex to endIndex (inclusive)
	return list.slice(startIndex, endIndex + 1);
}

const timeSeries = generateBrownianMotionTimeSeries(
	new Date(2020, 0, 1),
	new Date(2020, 2, 1)
	// new Date(2030, 0, 20)
);

const dates = timeSeries.map((it) => it.date);

type TTimeScaleBandArgs = {
	domain: Date[];
	visibleRange: {startRange: number; endRange: number};
	visibleDomain: {startDomain: Date; endDomain: Date};
};

const createTimeScaleBand = ({
	domain,
	visibleDomain,
	visibleRange,
}: TTimeScaleBandArgs) => {
	// get the number of categories
	// TODO add padding possibility
	// const PADDING = in percent

	const number_of_categories = domain.length;

	const visible_categories = sliceList(
		domain,
		visibleDomain.startDomain,
		visibleDomain.endDomain
	);

	const number_of_visible_categories = visible_categories.length;

	const visibleRangeSize = visibleRange.endRange - visibleRange.startRange;

	const band_width = visibleRangeSize / number_of_visible_categories;

	const firstCategoryIndex = domain.findIndex(
		(date) => date.getTime() === visibleDomain.startDomain.getTime()
	);
	// console.log({firstCategoryIndex});
	// invariant(firstCategoryIndex);

	const shiftLeft = firstCategoryIndex * band_width;

	const getBand = (date: Date) => {
		const globalDateIndex = domain.findIndex(
			(domainDate) => domainDate.getTime() === date.getTime()
		);

		const x1 = globalDateIndex * band_width - shiftLeft;
		const x2 = x1 + band_width;
		const centroid = (x1 + x2) / 2;
		return {
			x1,
			x2,
			centroid,
			width: band_width,
		};
	};

	return {
		number_of_categories,
		number_of_visible_categories,
		band_width,
		getBand,
	};
};

export const AnimatedLineChartSchema = z.object({
	backgroundColor: zColor(),
	textColor: zColor(),
	axisSpecType: z.enum(['STANDARD', 'INTER_MONTHS']),
});

export const AnimatedLineChart: React.FC<
	z.infer<typeof AnimatedLineChartSchema>
> = ({backgroundColor, textColor, axisSpecType}) => {
	// const currentFrame = useCurrentFrame();
	const {
		// durationInFrames,
		height,
		width,
	} = useVideoConfig();

	const CHART_WIDTH = width;
	const CHART_HEIGHT = height;

	const chartLayout = useChartLayout({
		width: CHART_WIDTH,
		height: CHART_HEIGHT,
	});

	const TITLE_START_FRAME = 0;
	// const TITLE_DURATION_IN_FRAMES = 45;
	const TITLE_DURATION_IN_FRAMES = 30;

	// const visibleDomain = {startDomain: min(dates), endDomain: max(dates)};
	const visibleDomain = {
		startDomain: min(dates) as Date,
		endDomain: max(dates) as Date,
	};
	const visibleRange = {startRange: 0, endRange: chartLayout.areas.plot.width};

	const myScaleForBands = createTimeScaleBand({
		domain: dates,
		visibleRange,
		visibleDomain,
	});

	const visibleDomain2 = {
		startDomain: dates[dates.length - 5] as Date,
		endDomain: dates[dates.length - 1] as Date,
	};

	const myScaleForBands2 = createTimeScaleBand({
		domain: dates,
		visibleRange,
		visibleDomain: visibleDomain2,
	});

	console.log(myScaleForBands);

	return (
		<AbsoluteFill style={{backgroundColor}}>
			<DisplayGridLayout
				stroke={textColor}
				fill="transparent"
				// hide={true}
				hide={false}
				areas={chartLayout.areas}
				width={width}
				height={height}
			/>

			<Sequence
				from={TITLE_START_FRAME}
				durationInFrames={TITLE_DURATION_IN_FRAMES}
			>
				<h1 style={{color: textColor, fontSize: 300}}>Start</h1>
			</Sequence>

			<Sequence
				from={TITLE_START_FRAME + TITLE_DURATION_IN_FRAMES}
				// from={TITLE_START_FRAME}
				// durationInFrames={TITLE_DURATION_IN_FRAMES}
			>
				<AbsoluteFill>
					<h1 style={{color: 'blue', fontSize: 100}}>ScaleBand Test</h1>
					<div
						style={{
							position: 'absolute',
							top: chartLayout.areas.plot.y1,
							left: chartLayout.areas.plot.x1,
						}}
					>
						<svg
							width={chartLayout.areas.plot.width}
							height={500}
							style={{
								backgroundColor: 'blue',
								overflow: 'visible',
							}}
						>
							{dates.map((date, i) => {
								const band = myScaleForBands.getBand(date);
								return (
									<g>
										<rect
											x={band.x1}
											y={50}
											width={band.width}
											height={100}
											fill="darkblue"
											stroke="yellow"
											strokeWidth={2}
										/>
										{i % 5 === 0 ? (
											<text
												textAnchor="middle"
												alignmentBaseline="middle"
												fill={'yellow'}
												fontSize={18}
												fontWeight={500}
												x={band.centroid}
												y={100}
											>
												{i.toString()}
											</text>
										) : null}
									</g>
								);
							})}

							{dates.map((date, i) => {
								const band = myScaleForBands2.getBand(date);
								return (
									<g>
										<rect
											x={band.x1}
											y={50 + 200}
											width={band.width}
											height={100}
											fill="darkblue"
											stroke="yellow"
											strokeWidth={2}
										/>
										{i % 5 === 0 ? (
											<text
												textAnchor="middle"
												alignmentBaseline="middle"
												fill={'yellow'}
												fontSize={18}
												fontWeight={500}
												x={band.centroid}
												y={100 + 200}
											>
												{i.toString()}
											</text>
										) : null}
									</g>
								);
							})}
						</svg>
					</div>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
