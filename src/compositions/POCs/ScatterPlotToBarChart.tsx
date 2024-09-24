import {z} from 'zod';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {interpolate as flubberInterploate} from 'flubber';
import {
	// ScaleLinear,
	scaleLinear,
} from 'd3-scale';

import {generateRectPath} from './generateRectPath';
import {generateCirclePath} from './generateCirclePath';

import {getDomain} from './analytics';
import {data, DataItem} from './data';
import LorenzoBertoliniLogo from '../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../acetti-themes/getThemeFromEnum';

type VizTypeScatterplot<DataItemType> = {
	type: 'ScatterPlot';
	xMeasure: keyof DataItemType;
	yMeasure: keyof DataItemType;
};

type TChartSpec<TDataItem> = VizTypeScatterplot<TDataItem>;

type ScatterPlotChartData = {
	data: Array<{
		id: string;
		type: 'circle';
		cx: number;
		cy: number;
		r: number;
	}>;
};

function generateScatterplotData<DataItemType extends {id: string}>({
	spec,
	data,
	xRange,
	yRange,
}: {
	spec: VizTypeScatterplot<DataItemType>;
	data: Array<DataItemType>;
	xRange: [number, number];
	yRange: [number, number];
}): ScatterPlotChartData {
	const xDomain = getDomain<DataItemType>(data, spec.xMeasure);
	const yDomain = getDomain<DataItemType>(data, spec.yMeasure);

	const xScale = scaleLinear().domain(xDomain).range(xRange);
	const yScale = scaleLinear().domain(yDomain).range(yRange);

	const vizData = data.map((it, i) => {
		const cx = xScale(it[spec.xMeasure] as number); // TODO ensure number
		const cy = yScale(it[spec.yMeasure] as number); // TODO ensure number
		const r = 20;
		return {
			id: it.id,
			type: 'circle' as const,
			cx,
			cy,
			r,
		};
	});

	return {data: vizData};
}

export const scatterPlotToBarChartSchema = z.object({
	themeEnum: zThemeEnum,
});

export const ScatterPlotToBarChart: React.FC<
	z.infer<typeof scatterPlotToBarChartSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const scatterPlotVizSpec: VizTypeScatterplot<DataItem> = {
		type: 'ScatterPlot',
		xMeasure: 'age',
		yMeasure: 'income',
	};

	const scatterPlotVizData = generateScatterplotData<DataItem>({
		spec: scatterPlotVizSpec,
		data,
		xRange: [0, 200],
		yRange: [0, 200],
	});

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div
				style={{
					color: theme.typography.title.color,
					fontSize: 100,
					marginBottom: 50,
				}}
			>
				ScatterPlotToBarChart
			</div>

			<div
				style={{
					color: theme.typography.title.color,
					fontSize: 20,
					marginBottom: 50,
				}}
			>
				{JSON.stringify(data[0], undefined, 0)}
			</div>

			<div
				style={{
					color: theme.typography.title.color,
					fontSize: 20,
					marginBottom: 50,
				}}
			>
				{JSON.stringify(scatterPlotVizData.data[0], undefined, 0)}
			</div>

			<div>
				<div
					style={{
						// position: 'relative',
						marginTop: 60,
						marginLeft: 30,
					}}
				>
					<AnalyticsChartTransition
						data={data}
						startChartSpec={scatterPlotVizSpec}
						endChartSpec={scatterPlotVizSpec}
					/>
				</div>
			</div>
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};

type TAnalyticsChartTransition<TDataItem> = {
	data: TDataItem[];
	startChartSpec: TChartSpec<TDataItem>;
	endChartSpec: TChartSpec<TDataItem>;
};

export function AnalyticsChartTransition<TDataItem extends {id: string}>({
	data,
	startChartSpec,
	endChartSpec,
}: TAnalyticsChartTransition<TDataItem>) {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
		easing: Easing.cubic,
	});

	// TODO where from??
	const chartWidth = 300;
	const chartHeight = 300;

	// TODO: more generic, as this is only for scatterplots... e.g.:
	// const startVizData = generateChartData({chartSpec, data, ...})
	const startChartData = generateScatterplotData<TDataItem>({
		spec: startChartSpec,
		data,
		xRange: [0, chartWidth], // TODO from some chart layout...
		yRange: [0, chartHeight], // TODO from some chart layout...
	});

	// TODO: more generic, as this is only for scatterplots... e.g.:
	// const startVizData = generateChartData({chartSpec, data, ...})
	const endChartData = generateScatterplotData<TDataItem>({
		spec: endChartSpec,
		data,
		xRange: [0, chartWidth / 2], // TODO from some chart layout...
		yRange: [0, chartHeight / 2], // TODO from some chart layout...
	});

	// QUICK-FIX: as the ids are all the same we have ONLY UPDATES ==> CHANGE ASAP
	const updateDataPathPairs = startChartData.data.map((_it, i) => {
		const startItem = startChartData.data[i];
		const endItem = endChartData.data[i];

		// TODO more generic like
		// const dataPath = generateDataPath(it)
		const startDataPath = generateCirclePath({
			r: startItem.r,
			cx: startItem.cx,
			cy: startItem.cy,
		});

		// TODO more generic like
		// const dataPath = generateDataPath(it)
		const endDataPath = generateCirclePath({
			r: endItem.r,
			cx: endItem.cx,
			cy: endItem.cy,
		});

		return {
			startDataPath,
			endDataPath,
		};
	});

	return (
		<svg
			style={{
				backgroundColor: '#303030',
				width: chartWidth, // also this size should come from chartSpec
				height: chartHeight, // also this size should come from chartSpec
				overflow: 'visible',
			}}
		>
			{updateDataPathPairs.map(({startDataPath, endDataPath}) => {
				const flubberInterpolator = flubberInterploate(
					startDataPath,
					endDataPath
				);

				const flubberInterpolatedPath = flubberInterpolator(progress);

				return (
					<g>
						<path d={startDataPath} fill={'red'} opacity={0.3} />
						<path d={endDataPath} fill={'green'} opacity={0.3} />

						<path d={flubberInterpolatedPath} fill={'white'} />
					</g>
				);
			})}
		</svg>
	);
}
