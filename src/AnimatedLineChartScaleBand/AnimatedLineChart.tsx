import {Sequence, useVideoConfig, AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {min, max} from 'd3-array';
// import invariant from 'tiny-invariant';

import {DisplayGridLayout} from '../acetti-viz';
import generateBrownianMotionTimeSeries from './utils/timeSeries/generateBrownianMotionTimeSeries';
import {AnimatedLineChartContainer} from './AnimatedLineChartContainer';
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

export type TTimeBandScale = {
	number_of_categories: number;
	number_of_visible_categories: number;
	// TODO deprecaet
	band_width: number;
	getBand: (d: Date) => {
		x1: number;
		x2: number;
		width: number;
		centroid: number;
	};
};

export const createTimeScaleBand = ({
	domain,
	visibleDomain,
	visibleRange,
}: TTimeScaleBandArgs): TTimeBandScale => {
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
	const {durationInFrames, height, width} = useVideoConfig();

	const CHART_WIDTH = width;
	const CHART_HEIGHT = height;

	const chartLayout = useChartLayout({
		width: CHART_WIDTH,
		height: CHART_HEIGHT,
	});

	const TITLE_START_FRAME = 0;
	const TITLE_DURATION_IN_FRAMES = 30;

	const FIRST_TS_START_FRAME = TITLE_START_FRAME + TITLE_DURATION_IN_FRAMES;
	const FIRST_TS_TRANSITION_IN_FRAMES = 3.5 * 30;

	const SECOND_TS_START_FRAME =
		FIRST_TS_START_FRAME + FIRST_TS_TRANSITION_IN_FRAMES;
	const SECOND_TS_TRANSITION_IN_FRAMES = 3.5 * 30;
	// durationInFrames - TITLE_DURATION_IN_FRAMES - FIRST_TS_TRANSITION_IN_FRAMES;

	const THIRD_TS_START_FRAME =
		SECOND_TS_START_FRAME + SECOND_TS_TRANSITION_IN_FRAMES;
	const THIRD_TS_TRANSITION_IN_FRAMES =
		durationInFrames -
		TITLE_DURATION_IN_FRAMES -
		FIRST_TS_TRANSITION_IN_FRAMES -
		SECOND_TS_TRANSITION_IN_FRAMES;

	const visibleRange = {startRange: 0, endRange: chartLayout.areas.plot.width};

	const visibleDomain = {
		startDomain: min(dates) as Date,
		endDomain: dates[10] as Date,
	};

	const visibleDomain2 = {
		startDomain: min(dates) as Date,
		endDomain: max(dates) as Date,
	};

	// const visibleDomain2 = {
	// 	startDomain: dates[dates.length - 5] as Date,
	// 	endDomain: dates[dates.length - 1] as Date,
	// };

	const myScaleForBands = createTimeScaleBand({
		domain: dates,
		visibleRange,
		visibleDomain,
	});

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

			{/* <Sequence from={TITLE_START_FRAME + TITLE_DURATION_IN_FRAMES}>
				<AbsoluteFill>
					<h1 style={{color: 'blue', fontSize: 100}}>ScaleBand Test</h1>
				</AbsoluteFill>
			</Sequence> */}

			<Sequence
				from={FIRST_TS_START_FRAME}
				durationInFrames={FIRST_TS_TRANSITION_IN_FRAMES}
			>
				<AnimatedLineChartContainer
					timeSeries={timeSeries}
					fromVisibleDomain={visibleDomain}
					toVisibleDomain={visibleDomain2}
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
					}}
				/>
			</Sequence>
			<Sequence
				from={SECOND_TS_START_FRAME}
				durationInFrames={SECOND_TS_TRANSITION_IN_FRAMES}
			>
				<AnimatedLineChartContainer
					timeSeries={timeSeries}
					fromVisibleDomain={visibleDomain2}
					toVisibleDomain={visibleDomain}
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
					}}
				/>
			</Sequence>
			<Sequence
				from={THIRD_TS_START_FRAME}
				durationInFrames={THIRD_TS_TRANSITION_IN_FRAMES}
			>
				<AnimatedLineChartContainer
					timeSeries={timeSeries}
					fromVisibleDomain={visibleDomain}
					toVisibleDomain={visibleDomain}
					layoutAreas={{
						plot: chartLayout.areas.plot,
						xAxis: chartLayout.areas.xAxis,
						yAxis: chartLayout.areas.yAxis,
					}}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};
