import {useMemo} from 'react';

import availableFontSpecs, {FontFamiliesUnionType} from './fontSpecs';
import {useFontsLoader} from './useFontsLoader';

function uniqueStrings(inputArray: string[]): string[] {
	// Create a Set to store unique strings
	const uniqueSet = new Set<string>();

	// Add the strings from the input array to the Set
	inputArray.forEach((str) => uniqueSet.add(str));

	// Convert the Set back to an array
	const uniqueArray = Array.from(uniqueSet);

	return uniqueArray;
}

// TODO create typography global context, s.t. typography info can be accessed from anywhere
export const useFontFamiliesLoader = (
	fontFamilies: FontFamiliesUnionType[]
) => {
	// load fonts
	const fontSpecs = useMemo(() => {
		const fontIds = uniqueStrings(fontFamilies);
		// @ts-ignore
		const specs = fontIds.map((it) => availableFontSpecs[it]);
		return specs;
	}, fontFamilies);
	useFontsLoader(fontSpecs);

	return fontSpecs;
};
