import {
	PerformanceCompareChartComposition,
	performanceCompareChartCompositionSchema,
} from './PerformanceCompareChartComposition';
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

export const PerformanceCompareChart = {
	component: PerformanceCompareChartComposition,
	schema: performanceCompareChartCompositionSchema,
	calculateMetadata,
	fps,
	durationInFrames: 15 * fps,
	...videoSizes.linkedInWide,
};
