import {Composition} from 'remotion';
import {MyComposition, myCompSchema} from './Composition';
import {
	HorizontalBarsStar,
	horizontalBarsStarSchema,
} from './HorizontalBarsStar/HorizontalBarsStar';
import {
	BundesligaTop10BarChart,
	bundesligaTop10BarChartSchema,
} from './BundesligaTop10BarChart/BundesligaTop10BarChart';

import {
	SimpleLineChart,
	simpleLineChartSchema,
} from './SimpleLineChart/SimpleLineChart';

import {
	NerdyPriceChart,
	nerdyPriceChartSchema,
} from './NerdyPriceChart/NerdyPriceChart';

import {
	NerdyPriceChart2,
	nerdyPriceChartSchema2,
} from './NerdyPriceChart2/NerdyPriceChart2';

import {
	NerdyPriceChart3,
	nerdyPriceChartSchema3,
} from './NerdyPriceChart3/NerdyPriceChart3';

import {
	NerdyPriceChartSingle,
	nerdyPriceChartSingleSchema,
} from './NerdyPriceChartSingle/NerdyPriceChartSingle';

import {
	SinglePriceChart,
	singlePriceChartSchema,
} from './SinglePriceChart/SinglePriceChart';

import {
	SinglePriceChartAnimatedAxis,
	singlePriceChartAnimatedAxisSchema,
} from './SinglePriceChartAnimatedAxis/SinglePriceChartAnimatedAxis';

import {
	AxisTransition,
	AxisTransitionSchema,
} from './AxisTransition/AxisTransition';

import {
	AnimatedLineChartSchema,
	AnimatedLineChart,
} from './AnimatedLineChart/AnimatedLineChart';

import {
	AnimatedLineChartSchema as ScaleBandLineChartSchema,
	AnimatedLineChart as ScaleBandLineChart,
} from './AnimatedLineChartScaleBand/AnimatedLineChart';

import {colorPaletteSchema, ColorPalette} from './ColorPalette/ColorPalette';

import './tailwind.css';

const squareVideo = {
	width: 1080,
	height: 1080,
};

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="SinglePriceChartAnimatedAxis"
				component={SinglePriceChartAnimatedAxis}
				// durationInFrames={90 * 3.5}
				// durationInFrames={90 * 30}
				durationInFrames={90 * 15}
				// 	(INPUT_PROPS?.durationSecs ?? DEFAULT_DURATION_SECONDS) *
				fps={90}
				{...squareVideo}
				schema={singlePriceChartAnimatedAxisSchema}
				defaultProps={{
					ticker: 'BTC-USD' as const,
					timePeriod: '2Y' as const,
					nerdyFinanceEnv: 'PROD' as const,
					themeEnum: 'NERDY' as const,
				}}
			/>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="SinglePriceChart"
				component={SinglePriceChart}
				durationInFrames={90 * 3.5}
				// 	(INPUT_PROPS?.durationSecs ?? DEFAULT_DURATION_SECONDS) *
				fps={90}
				{...squareVideo}
				schema={singlePriceChartSchema}
				defaultProps={{
					ticker: 'BTC-USD' as const,
					timePeriod: '2Y' as const,
					nerdyFinanceEnv: 'PROD' as const,
					themeEnum: 'NERDY' as const,
				}}
			/>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="NerdyPriceChartSingle"
				component={NerdyPriceChartSingle}
				durationInFrames={90 * 3.5}
				// 	(INPUT_PROPS?.durationSecs ?? DEFAULT_DURATION_SECONDS) *
				fps={90}
				{...squareVideo}
				schema={nerdyPriceChartSingleSchema}
				defaultProps={{
					ticker: 'BTC-USD' as const,
					timePeriod: '2Y' as const,
					showZero: true,
					nerdyFinanceEnv: 'PROD' as const,
					styling: {yAxisAreaWidth: 1000},
					themeEnum: 'LORENZOBERTOLINI' as const,
				}}
			/>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="ColorPalette"
				component={ColorPalette}
				durationInFrames={8000}
				// 	(INPUT_PROPS?.durationSecs ?? DEFAULT_DURATION_SECONDS) *
				fps={90}
				{...squareVideo}
				schema={colorPaletteSchema}
				defaultProps={{themeEnum: 'NERDY' as const}}
			/>

			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="NerdyPriceChart3"
				component={NerdyPriceChart3}
				durationInFrames={600}
				// 	(INPUT_PROPS?.durationSecs ?? DEFAULT_DURATION_SECONDS) *
				fps={90}
				{...squareVideo}
				schema={nerdyPriceChartSchema3}
				defaultProps={{
					ticker: 'BTC-USD' as const,
					timePeriod: '1Y' as const,
					showZero: true,
					nerdyFinanceEnv: 'PROD' as const,
					styling: {yAxisAreaWidth: 150},
					themeEnum: 'LORENZOBERTOLINI' as const,
				}}
			/>

			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="NerdyPriceChart2"
				component={NerdyPriceChart2}
				durationInFrames={600}
				// 	(INPUT_PROPS?.durationSecs ?? DEFAULT_DURATION_SECONDS) *
				fps={90}
				{...squareVideo}
				schema={nerdyPriceChartSchema2}
				defaultProps={{
					ticker: 'BTC-USD' as const,
					timePeriod: '1Y' as const,
					showZero: true,
					nerdyFinanceEnv: 'PROD' as const,
					styling: {yAxisAreaWidth: 150},
					theme: {
						global: {backgroundColor: '#ffffff'},
						yAxis: {
							fontSize: 15,
							strokeWidth: 4,
							color: '#ff6b6b',
							tickColor: '#ff6b6b',
						},
						xAxis: {
							fontSize: 16,
							strokeWidth: 2,
							color: '#ff6b6b',
							tickColor: '#ff6b6b',
						},
						candlesticks: {
							up: {
								bodyColor: '#222',
								bodyStrokeColor: '#555',
								lineColor: '#333',
								strokeWidth: 2,
							},
							down: {
								bodyColor: '#222',
								bodyStrokeColor: '#111',
								lineColor: '#444',
								strokeWidth: 2,
							},
						},
						dataColors: [
							{
								M3: '#333',
								M2: '#555',
								M1: '#ff0000',
								BASE: '#f05122',
								P1: '#666',
								P2: '#566',
								P3: '#444',
							},
							{
								M3: '#333',
								M2: '#555',
								M1: 'cyan',
								BASE: '#3f62ca',
								P1: 'magenta',
								P2: '#566',
								P3: '#444',
							},
						],
						minimap: {
							lineColor: '#ff7575',
							areaColor: '#ff0000',
							areaOpacity: 0.2,
						},
						highlightArea: {
							backgroundColor: '#c2bb00',
							backgroundOpacity: 0.2,
							borderColor: '#99b800',
							textColor: '#ff7214',
						},
					},
				}}
			/>

			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="ScaleBandLineChart"
				component={ScaleBandLineChart}
				// durationInFrames={240}
				durationInFrames={30 * 12}
				// 	(INPUT_PROPS?.durationSecs ?? DEFAULT_DURATION_SECONDS) *
				fps={60}
				{...squareVideo}
				schema={ScaleBandLineChartSchema}
				defaultProps={{
					backgroundColor: '#000000',
					textColor: '#e11969',
					axisSpecType: 'STANDARD' as const,
				}}
			/>

			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="AnimatedLineChart"
				component={AnimatedLineChart}
				// durationInFrames={240}
				durationInFrames={30 * 12}
				// 	(INPUT_PROPS?.durationSecs ?? DEFAULT_DURATION_SECONDS) *
				fps={30}
				{...squareVideo}
				schema={AnimatedLineChartSchema}
				defaultProps={{
					backgroundColor: '#1d1b1b',
					textColor: '#2de696',
					axisSpecType: 'STANDARD' as const,
				}}
			/>

			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="AxisTransition"
				component={AxisTransition}
				durationInFrames={240}
				// 	(INPUT_PROPS?.durationSecs ?? DEFAULT_DURATION_SECONDS) *
				fps={30}
				{...squareVideo}
				schema={AxisTransitionSchema}
				defaultProps={{
					backgroundColor: '#1d1b1b',
					textColor: '#92887c',
					axisSpecType: 'STANDARD' as const,
				}}
			/>

			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="NerdyPriceChart"
				component={NerdyPriceChart}
				durationInFrames={240}
				// 	(INPUT_PROPS?.durationSecs ?? DEFAULT_DURATION_SECONDS) *
				fps={30}
				{...squareVideo}
				schema={nerdyPriceChartSchema}
				defaultProps={{
					ticker: 'BTC-USD' as const,
					timePeriod: '1Y' as const,
					showZero: true,
					nerdyFinanceEnv: 'PROD' as const,
					styling: {yAxisAreaWidth: 150},
				}}
			/>

			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="SimpleLineChart"
				component={SimpleLineChart}
				durationInFrames={240}
				// 	(INPUT_PROPS?.durationSecs ?? DEFAULT_DURATION_SECONDS) *
				fps={30}
				{...squareVideo}
				schema={simpleLineChartSchema}
				defaultProps={{
					title: 'BTC-USD Performance 4234223',
					subtitle: 'Prices in USD',
					showZero: true,
					fontFamilyTitle: 'SourceSerifPro-Bold' as const,
					fontFamilySubtitle: 'SourceSerifPro-Regular' as const,
					fontFamilyXTicklabels: 'Inter-Regular' as const,
					fontFamilyYTicklabels: 'Inter-Regular' as const,
					data: [
						{
							index: new Date('2022-12-31T23:00:00.000Z'),
							value: 16625.080078125,
						},
						{
							index: new Date('2023-01-01T23:00:00.000Z'),
							value: 16688.470703125,
						},
						{
							index: new Date('2023-01-02T23:00:00.000Z'),
							value: 16679.857421875,
						},
						{
							index: new Date('2023-01-03T23:00:00.000Z'),
							value: 16863.23828125,
						},
						{
							index: new Date('2023-01-04T23:00:00.000Z'),
							value: 16836.736328125,
						},
						{index: new Date('2023-01-05T23:00:00.000Z'), value: 16951.96875},
						{index: new Date('2023-01-06T23:00:00.000Z'), value: 16955.078125},
						{
							index: new Date('2023-01-07T23:00:00.000Z'),
							value: 17091.14453125,
						},
						{index: new Date('2023-01-08T23:00:00.000Z'), value: 17196.5546875},
						{
							index: new Date('2023-01-09T23:00:00.000Z'),
							value: 17446.29296875,
						},
						{
							index: new Date('2023-01-10T23:00:00.000Z'),
							value: 17934.896484375,
						},
						{
							index: new Date('2023-01-11T23:00:00.000Z'),
							value: 18869.587890625,
						},
						{
							index: new Date('2023-01-12T23:00:00.000Z'),
							value: 19909.57421875,
						},
						{
							index: new Date('2023-01-13T23:00:00.000Z'),
							value: 20976.298828125,
						},
						{
							index: new Date('2023-01-14T23:00:00.000Z'),
							value: 20880.798828125,
						},
						{index: new Date('2023-01-15T23:00:00.000Z'), value: 21169.6328125},
						{
							index: new Date('2023-01-16T23:00:00.000Z'),
							value: 21161.51953125,
						},
						{index: new Date('2023-01-17T23:00:00.000Z'), value: 20688.78125},
						{
							index: new Date('2023-01-18T23:00:00.000Z'),
							value: 21086.79296875,
						},
						{
							index: new Date('2023-01-19T23:00:00.000Z'),
							value: 22676.552734375,
						},
						{index: new Date('2023-01-20T23:00:00.000Z'), value: 22777.625},
						{
							index: new Date('2023-01-21T23:00:00.000Z'),
							value: 22720.416015625,
						},
						{
							index: new Date('2023-01-22T23:00:00.000Z'),
							value: 22934.431640625,
						},
						{index: new Date('2023-01-23T23:00:00.000Z'), value: 22636.46875},
						{index: new Date('2023-01-24T23:00:00.000Z'), value: 23117.859375},
						{
							index: new Date('2023-01-25T23:00:00.000Z'),
							value: 23032.77734375,
						},
						{
							index: new Date('2023-01-26T23:00:00.000Z'),
							value: 23078.728515625,
						},
						{
							index: new Date('2023-01-27T23:00:00.000Z'),
							value: 23031.08984375,
						},
						{
							index: new Date('2023-01-28T23:00:00.000Z'),
							value: 23774.56640625,
						},
						{
							index: new Date('2023-01-29T23:00:00.000Z'),
							value: 22840.138671875,
						},
						{
							index: new Date('2023-01-30T23:00:00.000Z'),
							value: 23139.283203125,
						},
						{
							index: new Date('2023-01-31T23:00:00.000Z'),
							value: 23723.76953125,
						},
						{
							index: new Date('2023-02-01T23:00:00.000Z'),
							value: 23471.87109375,
						},
						{
							index: new Date('2023-02-02T23:00:00.000Z'),
							value: 23449.322265625,
						},
						{
							index: new Date('2023-02-03T23:00:00.000Z'),
							value: 23331.84765625,
						},
						{
							index: new Date('2023-02-04T23:00:00.000Z'),
							value: 22955.666015625,
						},
						{index: new Date('2023-02-05T23:00:00.000Z'), value: 22760.109375},
						{
							index: new Date('2023-02-06T23:00:00.000Z'),
							value: 23264.291015625,
						},
						{index: new Date('2023-02-07T23:00:00.000Z'), value: 22939.3984375},
						{index: new Date('2023-02-08T23:00:00.000Z'), value: 21819.0390625},
						{
							index: new Date('2023-02-09T23:00:00.000Z'),
							value: 21651.18359375,
						},
						{index: new Date('2023-02-10T23:00:00.000Z'), value: 21870.875},
						{index: new Date('2023-02-11T23:00:00.000Z'), value: 21788.203125},
						{index: new Date('2023-02-12T23:00:00.000Z'), value: 21808.1015625},
						{index: new Date('2023-02-13T23:00:00.000Z'), value: 22220.8046875},
						{
							index: new Date('2023-02-14T23:00:00.000Z'),
							value: 24307.841796875,
						},
						{
							index: new Date('2023-02-15T23:00:00.000Z'),
							value: 23623.474609375,
						},
						{index: new Date('2023-02-16T23:00:00.000Z'), value: 24565.6015625},
						{
							index: new Date('2023-02-17T23:00:00.000Z'),
							value: 24641.27734375,
						},
						{
							index: new Date('2023-02-18T23:00:00.000Z'),
							value: 24327.642578125,
						},
						{index: new Date('2023-02-19T23:00:00.000Z'), value: 24829.1484375},
						{
							index: new Date('2023-02-20T23:00:00.000Z'),
							value: 24436.353515625,
						},
						{index: new Date('2023-02-21T23:00:00.000Z'), value: 24188.84375},
						{index: new Date('2023-02-22T23:00:00.000Z'), value: 23947.4921875},
						{
							index: new Date('2023-02-23T23:00:00.000Z'),
							value: 23198.126953125,
						},
						{index: new Date('2023-02-24T23:00:00.000Z'), value: 23175.375},
						{
							index: new Date('2023-02-25T23:00:00.000Z'),
							value: 23561.212890625,
						},
						{
							index: new Date('2023-02-26T23:00:00.000Z'),
							value: 23522.87109375,
						},
						{
							index: new Date('2023-02-27T23:00:00.000Z'),
							value: 23147.353515625,
						},
						{
							index: new Date('2023-02-28T23:00:00.000Z'),
							value: 23646.55078125,
						},
						{
							index: new Date('2023-03-01T23:00:00.000Z'),
							value: 23475.466796875,
						},
						{index: new Date('2023-03-02T23:00:00.000Z'), value: 22362.6796875},
						{
							index: new Date('2023-03-03T23:00:00.000Z'),
							value: 22353.349609375,
						},
						{
							index: new Date('2023-03-04T23:00:00.000Z'),
							value: 22435.513671875,
						},
						{index: new Date('2023-03-05T23:00:00.000Z'), value: 22429.7578125},
						{
							index: new Date('2023-03-06T23:00:00.000Z'),
							value: 22219.76953125,
						},
						{
							index: new Date('2023-03-07T23:00:00.000Z'),
							value: 21718.080078125,
						},
						{
							index: new Date('2023-03-08T23:00:00.000Z'),
							value: 20363.021484375,
						},
						{
							index: new Date('2023-03-09T23:00:00.000Z'),
							value: 20187.244140625,
						},
						{
							index: new Date('2023-03-10T23:00:00.000Z'),
							value: 20632.41015625,
						},
						{
							index: new Date('2023-03-11T23:00:00.000Z'),
							value: 22163.94921875,
						},
						{
							index: new Date('2023-03-12T23:00:00.000Z'),
							value: 24197.533203125,
						},
						{
							index: new Date('2023-03-13T23:00:00.000Z'),
							value: 24746.07421875,
						},
						{index: new Date('2023-03-14T23:00:00.000Z'), value: 24375.9609375},
						{index: new Date('2023-03-15T23:00:00.000Z'), value: 25052.7890625},
						{index: new Date('2023-03-16T23:00:00.000Z'), value: 27423.9296875},
						{
							index: new Date('2023-03-17T23:00:00.000Z'),
							value: 26965.87890625,
						},
						{
							index: new Date('2023-03-18T23:00:00.000Z'),
							value: 28038.67578125,
						},
						{
							index: new Date('2023-03-19T23:00:00.000Z'),
							value: 27767.236328125,
						},
						{
							index: new Date('2023-03-20T23:00:00.000Z'),
							value: 28175.81640625,
						},
						{index: new Date('2023-03-21T23:00:00.000Z'), value: 27307.4375},
						{
							index: new Date('2023-03-22T23:00:00.000Z'),
							value: 28333.97265625,
						},
						{
							index: new Date('2023-03-23T23:00:00.000Z'),
							value: 27493.28515625,
						},
						{
							index: new Date('2023-03-24T23:00:00.000Z'),
							value: 27494.70703125,
						},
						{
							index: new Date('2023-03-25T23:00:00.000Z'),
							value: 27994.330078125,
						},
						{
							index: new Date('2023-03-26T22:00:00.000Z'),
							value: 27139.888671875,
						},
						{
							index: new Date('2023-03-27T22:00:00.000Z'),
							value: 27268.130859375,
						},
						{
							index: new Date('2023-03-28T22:00:00.000Z'),
							value: 28348.44140625,
						},
						{index: new Date('2023-03-29T22:00:00.000Z'), value: 28033.5625},
						{index: new Date('2023-03-30T22:00:00.000Z'), value: 28478.484375},
						{
							index: new Date('2023-03-31T22:00:00.000Z'),
							value: 28411.03515625,
						},
						{
							index: new Date('2023-04-01T22:00:00.000Z'),
							value: 28199.30859375,
						},
						{
							index: new Date('2023-04-02T22:00:00.000Z'),
							value: 27790.220703125,
						},
						{
							index: new Date('2023-04-03T22:00:00.000Z'),
							value: 28168.08984375,
						},
						{index: new Date('2023-04-04T22:00:00.000Z'), value: 28177.984375},
						{index: new Date('2023-04-05T22:00:00.000Z'), value: 28044.140625},
						{index: new Date('2023-04-06T22:00:00.000Z'), value: 27925.859375},
						{
							index: new Date('2023-04-07T22:00:00.000Z'),
							value: 27947.794921875,
						},
						{
							index: new Date('2023-04-08T22:00:00.000Z'),
							value: 28333.05078125,
						},
						{
							index: new Date('2023-04-09T22:00:00.000Z'),
							value: 29652.98046875,
						},
						{
							index: new Date('2023-04-10T22:00:00.000Z'),
							value: 30235.05859375,
						},
						{
							index: new Date('2023-04-11T22:00:00.000Z'),
							value: 30139.052734375,
						},
						{
							index: new Date('2023-04-12T22:00:00.000Z'),
							value: 30399.06640625,
						},
						{
							index: new Date('2023-04-13T22:00:00.000Z'),
							value: 30485.69921875,
						},
						{
							index: new Date('2023-04-14T22:00:00.000Z'),
							value: 30318.49609375,
						},
						{
							index: new Date('2023-04-15T22:00:00.000Z'),
							value: 30315.35546875,
						},
						{
							index: new Date('2023-04-16T22:00:00.000Z'),
							value: 29445.044921875,
						},
						{
							index: new Date('2023-04-17T22:00:00.000Z'),
							value: 30397.552734375,
						},
						{index: new Date('2023-04-18T22:00:00.000Z'), value: 28822.6796875},
						{
							index: new Date('2023-04-19T22:00:00.000Z'),
							value: 28245.98828125,
						},
						{
							index: new Date('2023-04-20T22:00:00.000Z'),
							value: 27276.91015625,
						},
						{index: new Date('2023-04-21T22:00:00.000Z'), value: 27817.5},
						{
							index: new Date('2023-04-22T22:00:00.000Z'),
							value: 27591.384765625,
						},
						{
							index: new Date('2023-04-23T22:00:00.000Z'),
							value: 27525.33984375,
						},
						{
							index: new Date('2023-04-24T22:00:00.000Z'),
							value: 28307.59765625,
						},
						{
							index: new Date('2023-04-25T22:00:00.000Z'),
							value: 28422.701171875,
						},
						{
							index: new Date('2023-04-26T22:00:00.000Z'),
							value: 29473.787109375,
						},
						{
							index: new Date('2023-04-27T22:00:00.000Z'),
							value: 29340.26171875,
						},
						{
							index: new Date('2023-04-28T22:00:00.000Z'),
							value: 29248.48828125,
						},
						{
							index: new Date('2023-04-29T22:00:00.000Z'),
							value: 29268.806640625,
						},
						{
							index: new Date('2023-04-30T22:00:00.000Z'),
							value: 28091.568359375,
						},
						{
							index: new Date('2023-05-01T22:00:00.000Z'),
							value: 28680.537109375,
						},
						{
							index: new Date('2023-05-02T22:00:00.000Z'),
							value: 29006.30859375,
						},
						{index: new Date('2023-05-03T22:00:00.000Z'), value: 28847.7109375},
						{
							index: new Date('2023-05-04T22:00:00.000Z'),
							value: 29534.384765625,
						},
						{
							index: new Date('2023-05-05T22:00:00.000Z'),
							value: 28904.623046875,
						},
						{
							index: new Date('2023-05-06T22:00:00.000Z'),
							value: 28454.978515625,
						},
						{index: new Date('2023-05-07T22:00:00.000Z'), value: 27694.2734375},
						{
							index: new Date('2023-05-08T22:00:00.000Z'),
							value: 27658.775390625,
						},
						{
							index: new Date('2023-05-09T22:00:00.000Z'),
							value: 27621.755859375,
						},
						{index: new Date('2023-05-10T22:00:00.000Z'), value: 27000.7890625},
						{
							index: new Date('2023-05-11T22:00:00.000Z'),
							value: 26804.990234375,
						},
						{index: new Date('2023-05-12T22:00:00.000Z'), value: 26784.078125},
						{
							index: new Date('2023-05-13T22:00:00.000Z'),
							value: 26930.638671875,
						},
						{
							index: new Date('2023-05-14T22:00:00.000Z'),
							value: 27192.693359375,
						},
						{
							index: new Date('2023-05-15T22:00:00.000Z'),
							value: 27036.650390625,
						},
						{
							index: new Date('2023-05-16T22:00:00.000Z'),
							value: 27398.802734375,
						},
						{
							index: new Date('2023-05-17T22:00:00.000Z'),
							value: 26832.208984375,
						},
						{
							index: new Date('2023-05-18T22:00:00.000Z'),
							value: 26890.12890625,
						},
						{index: new Date('2023-05-19T22:00:00.000Z'), value: 27129.5859375},
						{
							index: new Date('2023-05-20T22:00:00.000Z'),
							value: 26753.826171875,
						},
						{
							index: new Date('2023-05-21T22:00:00.000Z'),
							value: 26851.27734375,
						},
						{index: new Date('2023-05-22T22:00:00.000Z'), value: 27225.7265625},
						{
							index: new Date('2023-05-23T22:00:00.000Z'),
							value: 26334.818359375,
						},
						{
							index: new Date('2023-05-24T22:00:00.000Z'),
							value: 26476.20703125,
						},
						{
							index: new Date('2023-05-25T22:00:00.000Z'),
							value: 26719.291015625,
						},
						{
							index: new Date('2023-05-26T22:00:00.000Z'),
							value: 26868.353515625,
						},
						{
							index: new Date('2023-05-27T22:00:00.000Z'),
							value: 28085.646484375,
						},
						{
							index: new Date('2023-05-28T22:00:00.000Z'),
							value: 27745.884765625,
						},
						{
							index: new Date('2023-05-29T22:00:00.000Z'),
							value: 27702.349609375,
						},
						{
							index: new Date('2023-05-30T22:00:00.000Z'),
							value: 27219.658203125,
						},
						{
							index: new Date('2023-05-31T22:00:00.000Z'),
							value: 26819.97265625,
						},
						{
							index: new Date('2023-06-01T22:00:00.000Z'),
							value: 27249.58984375,
						},
						{
							index: new Date('2023-06-02T22:00:00.000Z'),
							value: 27075.12890625,
						},
						{
							index: new Date('2023-06-03T22:00:00.000Z'),
							value: 27119.06640625,
						},
						{
							index: new Date('2023-06-04T22:00:00.000Z'),
							value: 25760.09765625,
						},
						{
							index: new Date('2023-06-05T22:00:00.000Z'),
							value: 27238.783203125,
						},
						{
							index: new Date('2023-06-06T22:00:00.000Z'),
							value: 26345.998046875,
						},
						{
							index: new Date('2023-06-07T22:00:00.000Z'),
							value: 26508.216796875,
						},
						{index: new Date('2023-06-08T22:00:00.000Z'), value: 26480.375},
						{
							index: new Date('2023-06-09T22:00:00.000Z'),
							value: 25851.240234375,
						},
						{
							index: new Date('2023-06-10T22:00:00.000Z'),
							value: 25940.16796875,
						},
						{index: new Date('2023-06-11T22:00:00.000Z'), value: 25902.5},
						{
							index: new Date('2023-06-12T22:00:00.000Z'),
							value: 25918.728515625,
						},
						{
							index: new Date('2023-06-13T22:00:00.000Z'),
							value: 25124.67578125,
						},
						{
							index: new Date('2023-06-14T22:00:00.000Z'),
							value: 25576.39453125,
						},
						{
							index: new Date('2023-06-15T22:00:00.000Z'),
							value: 26327.462890625,
						},
						{
							index: new Date('2023-06-16T22:00:00.000Z'),
							value: 26510.67578125,
						},
						{
							index: new Date('2023-06-17T22:00:00.000Z'),
							value: 26336.212890625,
						},
						{
							index: new Date('2023-06-18T22:00:00.000Z'),
							value: 26851.029296875,
						},
						{
							index: new Date('2023-06-19T22:00:00.000Z'),
							value: 28327.48828125,
						},
						{index: new Date('2023-06-20T22:00:00.000Z'), value: 30027.296875},
						{index: new Date('2023-06-21T22:00:00.000Z'), value: 29912.28125},
						{index: new Date('2023-06-22T22:00:00.000Z'), value: 30695.46875},
						{index: new Date('2023-06-23T22:00:00.000Z'), value: 30548.6953125},
						{
							index: new Date('2023-06-24T22:00:00.000Z'),
							value: 30480.26171875,
						},
						{
							index: new Date('2023-06-25T22:00:00.000Z'),
							value: 30271.130859375,
						},
						{index: new Date('2023-06-26T22:00:00.000Z'), value: 30688.1640625},
						{
							index: new Date('2023-06-27T22:00:00.000Z'),
							value: 30086.24609375,
						},
						{index: new Date('2023-06-28T22:00:00.000Z'), value: 30445.3515625},
						{
							index: new Date('2023-06-29T22:00:00.000Z'),
							value: 30477.251953125,
						},
						{index: new Date('2023-06-30T22:00:00.000Z'), value: 30590.078125},
						{
							index: new Date('2023-07-01T22:00:00.000Z'),
							value: 30620.76953125,
						},
						{
							index: new Date('2023-07-02T22:00:00.000Z'),
							value: 31156.439453125,
						},
						{
							index: new Date('2023-07-03T22:00:00.000Z'),
							value: 30777.58203125,
						},
						{
							index: new Date('2023-07-04T22:00:00.000Z'),
							value: 30514.166015625,
						},
						{
							index: new Date('2023-07-05T22:00:00.000Z'),
							value: 29909.337890625,
						},
						{index: new Date('2023-07-06T22:00:00.000Z'), value: 30342.265625},
						{
							index: new Date('2023-07-07T22:00:00.000Z'),
							value: 30292.541015625,
						},
						{index: new Date('2023-07-08T22:00:00.000Z'), value: 30171.234375},
						{
							index: new Date('2023-07-09T22:00:00.000Z'),
							value: 30414.470703125,
						},
						{
							index: new Date('2023-07-10T22:00:00.000Z'),
							value: 30620.951171875,
						},
						{
							index: new Date('2023-07-11T22:00:00.000Z'),
							value: 30391.646484375,
						},
						{
							index: new Date('2023-07-12T22:00:00.000Z'),
							value: 31476.048828125,
						},
						{
							index: new Date('2023-07-13T22:00:00.000Z'),
							value: 30334.068359375,
						},
						{
							index: new Date('2023-07-14T22:00:00.000Z'),
							value: 30295.806640625,
						},
						{index: new Date('2023-07-15T22:00:00.000Z'), value: 30249.1328125},
						{
							index: new Date('2023-07-16T22:00:00.000Z'),
							value: 30145.888671875,
						},
						{index: new Date('2023-07-17T22:00:00.000Z'), value: 29856.5625},
						{
							index: new Date('2023-07-18T22:00:00.000Z'),
							value: 29913.923828125,
						},
						{index: new Date('2023-07-19T22:00:00.000Z'), value: 29792.015625},
						{
							index: new Date('2023-07-20T22:00:00.000Z'),
							value: 29908.744140625,
						},
						{
							index: new Date('2023-07-21T22:00:00.000Z'),
							value: 29771.802734375,
						},
						{index: new Date('2023-07-22T22:00:00.000Z'), value: 30084.5390625},
						{
							index: new Date('2023-07-23T22:00:00.000Z'),
							value: 29176.916015625,
						},
						{index: new Date('2023-07-24T22:00:00.000Z'), value: 29227.390625},
						{
							index: new Date('2023-07-25T22:00:00.000Z'),
							value: 29354.97265625,
						},
						{
							index: new Date('2023-07-26T22:00:00.000Z'),
							value: 29210.689453125,
						},
						{
							index: new Date('2023-07-27T22:00:00.000Z'),
							value: 29319.24609375,
						},
						{
							index: new Date('2023-07-28T22:00:00.000Z'),
							value: 29356.91796875,
						},
						{
							index: new Date('2023-07-29T22:00:00.000Z'),
							value: 29275.30859375,
						},
						{
							index: new Date('2023-07-30T22:00:00.000Z'),
							value: 29230.111328125,
						},
						{
							index: new Date('2023-07-31T22:00:00.000Z'),
							value: 29675.732421875,
						},
						{
							index: new Date('2023-08-01T22:00:00.000Z'),
							value: 29151.958984375,
						},
						{index: new Date('2023-08-02T22:00:00.000Z'), value: 29178.6796875},
						{
							index: new Date('2023-08-03T22:00:00.000Z'),
							value: 29074.091796875,
						},
						{
							index: new Date('2023-08-04T22:00:00.000Z'),
							value: 29042.126953125,
						},
						{
							index: new Date('2023-08-05T22:00:00.000Z'),
							value: 29041.85546875,
						},
						{index: new Date('2023-08-06T22:00:00.000Z'), value: 29180.578125},
						{index: new Date('2023-08-07T22:00:00.000Z'), value: 29765.4921875},
						{
							index: new Date('2023-08-08T22:00:00.000Z'),
							value: 29561.494140625,
						},
						{
							index: new Date('2023-08-09T22:00:00.000Z'),
							value: 29429.591796875,
						},
						{
							index: new Date('2023-08-10T22:00:00.000Z'),
							value: 29397.71484375,
						},
						{
							index: new Date('2023-08-11T22:00:00.000Z'),
							value: 29415.96484375,
						},
						{index: new Date('2023-08-12T22:00:00.000Z'), value: 29282.9140625},
						{
							index: new Date('2023-08-13T22:00:00.000Z'),
							value: 29408.443359375,
						},
						{
							index: new Date('2023-08-14T22:00:00.000Z'),
							value: 29170.34765625,
						},
						{
							index: new Date('2023-08-15T22:00:00.000Z'),
							value: 28701.779296875,
						},
						{
							index: new Date('2023-08-16T22:00:00.000Z'),
							value: 26664.55078125,
						},
						{
							index: new Date('2023-08-17T22:00:00.000Z'),
							value: 26049.556640625,
						},
						{
							index: new Date('2023-08-18T22:00:00.000Z'),
							value: 26096.205078125,
						},
						{
							index: new Date('2023-08-19T22:00:00.000Z'),
							value: 26189.583984375,
						},
						{index: new Date('2023-08-20T22:00:00.000Z'), value: 26124.140625},
						{index: new Date('2023-08-21T22:00:00.000Z'), value: 26031.65625},
						{index: new Date('2023-08-22T22:00:00.000Z'), value: 26431.640625},
						{
							index: new Date('2023-08-23T22:00:00.000Z'),
							value: 26162.373046875,
						},
						{
							index: new Date('2023-08-24T22:00:00.000Z'),
							value: 26047.66796875,
						},
						{
							index: new Date('2023-08-25T22:00:00.000Z'),
							value: 26008.462890625,
						},
						{
							index: new Date('2023-08-26T22:00:00.000Z'),
							value: 26089.693359375,
						},
						{
							index: new Date('2023-08-27T22:00:00.000Z'),
							value: 26106.150390625,
						},
						{
							index: new Date('2023-08-28T22:00:00.000Z'),
							value: 27727.392578125,
						},
						{index: new Date('2023-08-29T22:00:00.000Z'), value: 27297.265625},
						{
							index: new Date('2023-08-30T22:00:00.000Z'),
							value: 25931.47265625,
						},
						{
							index: new Date('2023-08-31T22:00:00.000Z'),
							value: 25800.724609375,
						},
						{
							index: new Date('2023-09-01T22:00:00.000Z'),
							value: 25868.798828125,
						},
						{
							index: new Date('2023-09-02T22:00:00.000Z'),
							value: 25969.56640625,
						},
						{
							index: new Date('2023-09-03T22:00:00.000Z'),
							value: 25812.416015625,
						},
						{
							index: new Date('2023-09-04T22:00:00.000Z'),
							value: 25779.982421875,
						},
						{
							index: new Date('2023-09-05T22:00:00.000Z'),
							value: 25753.236328125,
						},
						{index: new Date('2023-09-06T22:00:00.000Z'), value: 26240.1953125},
						{
							index: new Date('2023-09-07T22:00:00.000Z'),
							value: 25905.654296875,
						},
						{
							index: new Date('2023-09-08T22:00:00.000Z'),
							value: 25895.677734375,
						},
						{index: new Date('2023-09-09T22:00:00.000Z'), value: 25832.2265625},
						{
							index: new Date('2023-09-10T22:00:00.000Z'),
							value: 25162.654296875,
						},
						{index: new Date('2023-09-11T22:00:00.000Z'), value: 25833.34375},
						{
							index: new Date('2023-09-12T22:00:00.000Z'),
							value: 26228.32421875,
						},
						{
							index: new Date('2023-09-13T22:00:00.000Z'),
							value: 26539.673828125,
						},
						{
							index: new Date('2023-09-14T22:00:00.000Z'),
							value: 26608.693359375,
						},
						{index: new Date('2023-09-15T22:00:00.000Z'), value: 26568.28125},
						{index: new Date('2023-09-16T22:00:00.000Z'), value: 26534.1875},
						{index: new Date('2023-09-17T22:00:00.000Z'), value: 26754.28125},
						{index: new Date('2023-09-18T22:00:00.000Z'), value: 27211.1171875},
						{index: new Date('2023-09-19T22:00:00.000Z'), value: 27132.0078125},
						{index: new Date('2023-09-20T22:00:00.000Z'), value: 26567.6328125},
						{
							index: new Date('2023-09-21T22:00:00.000Z'),
							value: 26579.568359375,
						},
						{index: new Date('2023-09-22T22:00:00.000Z'), value: 26579.390625},
						{
							index: new Date('2023-09-23T22:00:00.000Z'),
							value: 26256.826171875,
						},
						{
							index: new Date('2023-09-24T22:00:00.000Z'),
							value: 26298.48046875,
						},
						{index: new Date('2023-09-25T22:00:00.000Z'), value: 26217.25},
						{
							index: new Date('2023-09-26T22:00:00.000Z'),
							value: 26352.716796875,
						},
						{index: new Date('2023-09-27T22:00:00.000Z'), value: 27021.546875},
						{
							index: new Date('2023-09-28T22:00:00.000Z'),
							value: 26911.720703125,
						},
						{
							index: new Date('2023-09-29T22:00:00.000Z'),
							value: 26967.916015625,
						},
						{index: new Date('2023-09-30T22:00:00.000Z'), value: 27983.75},
						{
							index: new Date('2023-10-01T22:00:00.000Z'),
							value: 27530.78515625,
						},
						{
							index: new Date('2023-10-02T22:00:00.000Z'),
							value: 27429.978515625,
						},
						{
							index: new Date('2023-10-03T22:00:00.000Z'),
							value: 27799.39453125,
						},
						{
							index: new Date('2023-10-04T22:00:00.000Z'),
							value: 27415.912109375,
						},
						{
							index: new Date('2023-10-05T22:00:00.000Z'),
							value: 27946.59765625,
						},
						{
							index: new Date('2023-10-06T22:00:00.000Z'),
							value: 27968.83984375,
						},
						{
							index: new Date('2023-10-07T22:00:00.000Z'),
							value: 27935.08984375,
						},
						{
							index: new Date('2023-10-08T22:00:00.000Z'),
							value: 27583.677734375,
						},
						{
							index: new Date('2023-10-09T22:00:00.000Z'),
							value: 27391.01953125,
						},
						{index: new Date('2023-10-10T22:00:00.000Z'), value: 26873.3203125},
						{
							index: new Date('2023-10-11T22:00:00.000Z'),
							value: 26756.798828125,
						},
						{index: new Date('2023-10-12T22:00:00.000Z'), value: 26862.375},
						{
							index: new Date('2023-10-13T22:00:00.000Z'),
							value: 26861.70703125,
						},
						{
							index: new Date('2023-10-14T22:00:00.000Z'),
							value: 27159.65234375,
						},
						{
							index: new Date('2023-10-15T22:00:00.000Z'),
							value: 28519.466796875,
						},
						{
							index: new Date('2023-10-16T22:00:00.000Z'),
							value: 28415.748046875,
						},
						{
							index: new Date('2023-10-17T22:00:00.000Z'),
							value: 28328.341796875,
						},
						{
							index: new Date('2023-10-18T22:00:00.000Z'),
							value: 28719.806640625,
						},
						{
							index: new Date('2023-10-19T22:00:00.000Z'),
							value: 29682.94921875,
						},
						{
							index: new Date('2023-10-20T22:00:00.000Z'),
							value: 29918.412109375,
						},
						{
							index: new Date('2023-10-21T22:00:00.000Z'),
							value: 29993.896484375,
						},
						{index: new Date('2023-10-22T22:00:00.000Z'), value: 33086.234375},
						{
							index: new Date('2023-10-23T22:00:00.000Z'),
							value: 33901.52734375,
						},
						{index: new Date('2023-10-24T22:00:00.000Z'), value: 34502.8203125},
						{index: new Date('2023-10-25T22:00:00.000Z'), value: 34156.6484375},
						{
							index: new Date('2023-10-26T22:00:00.000Z'),
							value: 33909.80078125,
						},
						{
							index: new Date('2023-10-27T22:00:00.000Z'),
							value: 34089.57421875,
						},
						{
							index: new Date('2023-10-28T22:00:00.000Z'),
							value: 34538.48046875,
						},
						{
							index: new Date('2023-10-29T23:00:00.000Z'),
							value: 34502.36328125,
						},
						{index: new Date('2023-10-30T23:00:00.000Z'), value: 34667.78125},
					],
					styling: {
						titleFontSize: 75,
						subTitleFontSize: 40,
						backgroundColor: '#111c6f',
						titleColor: '#6F5B3E',
						gridLinesColor: '#0a439e',
						yLabelsColor: '#0a439e',
						xLabelsColor: '#0a439e',
						lineColor: '#00c278',
						yAxisAreaWidth: 132,
						lineStrokeWidth: 10,
						lineCircleRadius: 16,
						yTickValuesFontSize: 40,
						xTickValuesFontSize: 40,
						xAxisAreaHeight: 60,
						gridLinesStrokeWidth: 3,
						yAxisAreaMarginLeft: 20,
						xTickValuesLength: 15,
						xTickValuesWidth: 2,
						xTickValuesColor: '#736cd5',
					},
					showLineChartLayout: false,
					watermark: true,
				}}
			/>

			<Composition
				id="HorizontalBarsStar"
				component={HorizontalBarsStar}
				durationInFrames={240}
				fps={30}
				{...squareVideo}
				schema={horizontalBarsStarSchema}
				defaultProps={barChartFixtureProps}
			/>
			<Composition
				id="BundesligaTop10BarChart"
				component={BundesligaTop10BarChart}
				durationInFrames={240}
				fps={30}
				{...squareVideo}
				schema={bundesligaTop10BarChartSchema}
				defaultProps={{dateString: '4. März 2024', year: 2023, apiData: null}}
				calculateMetadata={async ({props}) => {
					const apiUrl = `https://api.openligadb.de/getbltable/bl1/${props.year}`;
					const data = await fetch(apiUrl);
					const json = await data.json();
					return {
						props: {
							...props,
							apiData: json,
						},
					};
				}}
			/>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={240}
				fps={30}
				width={1280}
				height={720}
				schema={myCompSchema}
				defaultProps={{
					titleText: 'Welcome to Remotion with Tailwind CSS',
					titleColor: '#000000',
					logoColor: '#00bfff',
				}}
			/>
		</>
	);
};

const barChartFixtureProps = {
	titleText: 'Top 10 Bundesliga Teams | 29. Oktober 2023',
	titleFontSize: 44,
	titleColor: '#CAD8DE',
	backgroundColor: '#0b132b',
	progressColor: '#CAD8DE',
	items: [
		{
			label: 'Bayer Leverkusen',
			description: '25 Punkte',
			value: 25,
			colors: {background: '#1c2541', text: '#CAD8DE', border: '#76E7CD'},
			imageSource:
				'https://upload.wikimedia.org/wikipedia/de/thumb/f/f7/Bayer_Leverkusen_Logo.svg/1200px-Bayer_Leverkusen_Logo.svg.png',
		},
		{
			label: 'FC Bayern München',
			description: '23 Punkte',
			value: 23,
			colors: {background: '#1c2541', text: '#CAD8DE', border: '#76E7CD'},
			imageSource: 'https://i.imgur.com/jJEsJrj.png',
		},
		{
			label: 'VfB Stuttgart',
			description: '21 Punkte',
			value: 21,
			colors: {background: '#1c2541', text: '#CAD8DE', border: '#76E7CD'},
			imageSource: 'https://i.imgur.com/v0tkpNx.png',
		},
		{
			label: 'Borussia Dortmund',
			description: '21 Punkte',
			value: 21,
			colors: {background: '#1c2541', text: '#CAD8DE', border: '#76E7CD'},
			imageSource:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/560px-Borussia_Dortmund_logo.svg.png',
		},
		{
			label: 'RB Leipzig',
			description: '20 Punkte',
			value: 20,
			colors: {background: '#1c2541', text: '#CAD8DE', border: '#9B7EDE'},
			imageSource: 'https://i.imgur.com/Rpwsjz1.png',
		},
		{
			label: 'TSG 1899 Hoffenheim',
			description: '18 Punkte',
			value: 18,
			colors: {background: '#1c2541', text: '#CAD8DE', border: '#C45BAA'},
			imageSource: 'https://i.imgur.com/gF0PfEl.png',
		},
		{
			label: 'Eintracht Frankfurt',
			description: '14 Punkte',
			value: 14,
			colors: {background: '#1c2541', text: '#CAD8DE', border: 'transparent'},
			imageSource: 'https://i.imgur.com/X8NFkOb.png',
		},
		{
			label: 'SC Freiburg',
			description: '13 Punkte',
			value: 13,
			colors: {background: '#1c2541', text: '#CAD8DE', border: 'transparent'},
			imageSource: 'https://i.imgur.com/r3mvi0h.png',
		},
		{
			label: 'VfL Wolfsburg',
			description: '12 Punkte',
			value: 12,
			colors: {background: '#1c2541', text: '#CAD8DE', border: 'transparent'},
			imageSource: 'https://i.imgur.com/ucqKV4B.png',
		},
		{
			label: 'FC Augsburg',
			description: '11 Punkte',
			value: 11,
			colors: {background: '#1c2541', text: '#CAD8DE', border: 'transparent'},
			imageSource: 'https://i.imgur.com/sdE62e2.png',
		},
	],
};
