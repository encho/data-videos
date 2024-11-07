import {z} from 'zod';
import {
	Sequence,
	useVideoConfig,
	Easing,
	interpolate,
	useCurrentFrame,
} from 'remotion';

import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SlideTitle} from '../../02-TypographicLayouts/SlideTitle';
import {SparklineLargeKeyframes} from '../../../../acetti-ts-flics/single-timeseries/SparklineLarge/SparklineLargeKeyframes';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {SingleTimeseriesBuildup} from '../../../../acetti-ts-flics/single-timeseries/SingleTimeseriesBuildup/SingleTimeseriesBuildup';

// const timeSeries = [
// 	{value: 150, date: new Date('2010-12-31')},
// 	{value: 57, date: new Date('2011-12-31')},
// 	{value: 58, date: new Date('2012-12-31')},
// 	{value: 65, date: new Date('2013-12-31')},
// 	{value: 77, date: new Date('2014-12-31')},
// 	{value: 94, date: new Date('2015-12-31')},
// 	{value: 91, date: new Date('2016-12-31')},
// 	{value: 65, date: new Date('2017-12-31')},
// 	{value: 114, date: new Date('2018-12-31')},
// 	{value: 60, date: new Date('2019-12-31')},
// 	{value: 64, date: new Date('2020-12-31')},
// 	{value: 118, date: new Date('2021-12-31')},
// 	{value: 94, date: new Date('2022-12-31')},
// 	{value: 127, date: new Date('2023-12-31')},
// 	{value: 68, date: new Date('2024-12-31')},
// 	{value: 40, date: new Date('2025-12-31')},
// 	{value: 88, date: new Date('2026-12-31')},
// ];

const start = new Date('2022-03-01');
const end = new Date('2024-11-01');
const timeSeries = generateStockLikeTimeSeries(start, end);

export const singleTimeseriesBuildupCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SingleTimeseriesBuildupComposition: React.FC<
	z.infer<typeof singleTimeseriesBuildupCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	// load fonts
	// ********************************************************
	useFontFamiliesLoader(theme);

	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const baseline = 30;

	const opacity = interpolate(
		frame,
		[0, fps * 2.0, durationInFrames - fps * 0.3, durationInFrames - 1],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.ease}
	);

	const CHART_WIDTH = 900;
	const CHART_HEIGHT = 280;

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div>
				<SlideTitle theme={theme}>Single Timeseries Buildup</SlideTitle>

				<Sequence from={fps * 1.5} layout="none">
					{/* <Sequence from={fps * 4.5} layout="none"> */}
					<div>
						<div
							style={{
								marginTop: baseline * 3,
								display: 'flex',
								justifyContent: 'center',
								// marginTop: 0,
								opacity,
							}}
						>
							<SingleTimeseriesBuildup
								id="001"
								data={timeSeries}
								width={CHART_WIDTH}
								height={CHART_HEIGHT}
								theme={theme}
								baseline={baseline}
							/>
						</div>

						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								marginTop: 350,
							}}
						>
							<SparklineLargeKeyframes
								width={720}
								theme={theme}
								baseFontSize={15}
							/>
						</div>
					</div>
				</Sequence>
			</div>

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};

function generateStockLikeTimeSeries(
	start: Date,
	end: Date
): {value: number; date: Date}[] {
	const timeSeries: {value: number; date: Date}[] = [];
	let currentDate = new Date(start);
	let value = 100 + Math.random() * 10; // Starting value around 100

	while (currentDate <= end) {
		// Simulate stock-like random walk
		const randomChange = (Math.random() - 0.5) * 2; // Random change between -1 and 1
		value = Math.max(50, value + randomChange); // Ensure value doesn't drop below 50

		timeSeries.push({
			value: parseFloat(value.toFixed(2)), // Keep 2 decimal places for realism
			date: new Date(currentDate),
		});

		// Increment date by 1 day
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return timeSeries;
}

// Usage
// const start = new Date('2022-03-01');
// const end = new Date('2024-11-01');
// const stockTimeSeries = generateStockLikeTimeSeries(start, end);
// console.log(stockTimeSeries);
