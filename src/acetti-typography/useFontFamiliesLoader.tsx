import {useMemo} from 'react';
import {useEffect} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

import {getUniqueThemeFontFamilies} from '../acetti-themes/getUniqueThemeFontFamilies';
import {ThemeType} from '../acetti-themes/themeTypes';
import type {TFontSpec} from './fontSpecsLibrary';
import {TAvailableFontFamily} from './fontMetricsLibrary';
import {getFontSpec} from './fontSpecsLibrary';

function uniqueThings<Thing>(inputArray: Thing[]): Thing[] {
	// Create a Set to store unique strings
	const uniqueSet = new Set<Thing>();

	// Add the strings from the input array to the Set
	inputArray.forEach((str) => uniqueSet.add(str));

	// Convert the Set back to an array
	const uniqueArray = Array.from(uniqueSet);

	return uniqueArray;
}

// TODO create typography global context, s.t. typography info can be accessed from anywhere
export const useFontFamiliesLoader = (theme: ThemeType) => {
	const fontFamilies = getUniqueThemeFontFamilies(theme);
	// load fonts
	const fontSpecs = useMemo(() => {
		const uniqueFontFamilies = uniqueThings<TAvailableFontFamily>(fontFamilies);
		return uniqueFontFamilies.map((fontFamily) => getFontSpec(fontFamily));
	}, fontFamilies);
	useFontsLoader(fontSpecs);

	return fontSpecs;
};

export function useFontsLoader(fontSpecsToLoad: TFontSpec[]) {
	useEffect(() => {
		for (let fontSpec of fontSpecsToLoad) {
			loadFont(fontSpec);
		}
	}, []);
}

async function loadFont(fontSpec: TFontSpec) {
	const log_msg = `loading theme font ${fontSpec.fontFamily}...`;

	const handle = delayRender(log_msg);

	const fontFace = new FontFace(
		fontSpec.fontFamily,
		'url(' + staticFile(fontSpec.filePath) + ')',
		undefined // could be e.g. {weight: 800}
	);

	await fontFace.load();
	document.fonts.add(fontFace);

	continueRender(handle);
}
