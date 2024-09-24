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

type VizTypeBarChart<DataItemType> = {
	type: 'BarChart';
	measure: keyof DataItemType;
};

type BarChartPathSpec = {
	id: string;
	type: 'bar';
	y: number;
	x: number;
	width: number;
	height: number;
};

type BarChartPlotData = {
	data: BarChartPathSpec[];
};

function generateBarChartData<DataItemType extends {id: string}>({
	spec,
	data,
	plotAreaWidth,
	plotAreaHeight,
}: {
	spec: VizTypeBarChart<DataItemType>;
	data: Array<DataItemType>;
	plotAreaWidth: number;
	plotAreaHeight: number;
}): BarChartPlotData {
	// TODO filter out potential NaN's from the dataset (also fro scatterplot)
	const domain = getDomain<DataItemType>(data, spec.measure);

	const barWidthScale = scaleLinear().domain(domain).range([0, plotAreaWidth]);

	const vizData = data.map((it, i) => {
		const barWidth = barWidthScale(it[spec.measure] as number);
		const y = i * 30;
		const barHeight = 20;
		return {
			id: it.id,
			type: 'bar' as const,
			x: 0,
			y,
			width: barWidth,
			height: barHeight,
		};
	});

	return {data: vizData};
}

type VizTypeScatterplot<DataItemType> = {
	type: 'ScatterPlot';
	xMeasure: keyof DataItemType;
	yMeasure: keyof DataItemType;
};

type TChartSpec<TDataItem> =
	| VizTypeScatterplot<TDataItem>
	| VizTypeBarChart<TDataItem>;

type ScatterPlotPathSpec = {
	id: string;
	type: 'circle';
	cx: number;
	cy: number;
	r: number;
};

type ScatterPlotChartData = {
	data: ScatterPlotPathSpec[];
};

function generateScatterplotData<DataItemType extends {id: string}>({
	spec,
	data,
	plotAreaWidth,
	plotAreaHeight,
}: {
	spec: VizTypeScatterplot<DataItemType>;
	data: Array<DataItemType>;
	plotAreaWidth: number;
	plotAreaHeight: number;
}): ScatterPlotChartData {
	const xRange = [0, plotAreaWidth];
	const yRange = [0, plotAreaHeight];
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

function generatePlotData<DataItemType extends {id: string}>({
	spec,
	data,
	plotAreaWidth,
	plotAreaHeight,
}: {
	spec: TChartSpec<DataItemType>;
	data: DataItemType[];
	plotAreaWidth: number;
	plotAreaHeight: number;
}): ScatterPlotChartData | BarChartPlotData {
	if (spec.type === 'ScatterPlot') {
		return generateScatterplotData({spec, data, plotAreaWidth, plotAreaHeight});
	}

	if (spec.type === 'BarChart') {
		return generateBarChartData({spec, data, plotAreaWidth, plotAreaHeight});
	}

	throw new Error('Error in generatePlotData: Unkonwn spec.type');
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

	// const scatterPlotVizData = generateScatterplotData<DataItem>({
	// 	spec: scatterPlotVizSpec,
	// 	data,
	// 	xRange: [0, 200],
	// 	yRange: [0, 200],
	// });

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

			{/* <div
				style={{
					color: theme.typography.title.color,
					fontSize: 20,
					marginBottom: 50,
				}}
			>
				{JSON.stringify(scatterPlotVizData.data[0], undefined, 0)}
			</div> */}

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

	// const startChartData = generateScatterplotData<TDataItem>({
	// 	spec: startChartSpec,
	// 	data,
	// 	plotAreaHeight: chartHeight,
	// 	plotAreaWidth: chartWidth,
	// });

	const startChartData = generatePlotData({
		spec: startChartSpec,
		data,
		plotAreaHeight: chartHeight,
		plotAreaWidth: chartWidth,
	});

	const endChartData = generatePlotData({
		spec: endChartSpec,
		data,
		plotAreaHeight: chartHeight / 2,
		plotAreaWidth: chartWidth / 2,
	});

	// QUICK-FIX: as the ids are all the same we have ONLY UPDATES ==> CHANGE ASAP
	const updateDataPathPairs = startChartData.data.map((_it, i) => {
		const startItem = startChartData.data[i];
		const endItem = endChartData.data[i];

		// TODO factor out
		const generateDataPath = (
			chartDataItem: BarChartPathSpec | ScatterPlotPathSpec
		): string => {
			if (chartDataItem.type === 'circle') {
				return generateCirclePath({
					r: chartDataItem.r,
					cx: chartDataItem.cx,
					cy: chartDataItem.cy,
				});
			}

			if (chartDataItem.type === 'bar') {
				return generateRectPath({
					x: chartDataItem.x,
					y: chartDataItem.y,
					width: chartDataItem.width,
					height: chartDataItem.height,
				});
			}

			throw new Error('generateDataPath: could not return anything!!!!');
		};

		const startDataPath = generateDataPath(startItem);
		const endDataPath = generateDataPath(endItem);

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
