import {
	BundesligaTabelleComposition,
	bundesligaTabelleCompositionSchema,
} from './BundesligaTabelleComposition';
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

export const BundesligaTabelle = {
	component: BundesligaTabelleComposition,
	schema: bundesligaTabelleCompositionSchema,
	calculateMetadata,
	fps,
	durationInFrames: 12 * fps,
	...videoSizes.linkedInTall,
	// ...videoSizes.linkedInTall,
};