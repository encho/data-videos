import {
	BacktestChartComposition,
	zBacktestChartCompositionSchema,
} from './BacktestChartComposition';
import {calculateMetadata} from './calculateMetadata';

// TODO import
const videoSizes = {
	square: {
		width: 1080,
		height: 1080,
	},
	linkedInTall: {
		width: 1080,
		height: 1350,
	},
	linkedInWide: {
		height: 1080,
		width: 1350,
	},
	widescreen_16x9: {
		width: 1920,
		height: 1080,
	},
};

const fps = 30;

export const BacktestChart = {
	component: BacktestChartComposition,
	schema: zBacktestChartCompositionSchema,
	calculateMetadata,
	fps,
	durationInFrames: 18 * fps,
	...videoSizes.square,
};
