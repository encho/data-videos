import {useEffect} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

import type {TFontSpec} from './fontSpecs';

export function useFontsLoader(fontSpecsToLoad: TFontSpec[]) {
	useEffect(() => {
		for (let fontSpec of fontSpecsToLoad) {
			loadFont(fontSpec);
		}
	}, []);
}

async function loadFont(fontSpec: TFontSpec) {
	const log_msg = `loading theme font ${fontSpec.name}...`;

	const handle = delayRender(log_msg);
	const constructedFileName =
		'fileName' in fontSpec
			? `${fontSpec.fileName}.ttf`
			: `${fontSpec.font}-${fontSpec.variant}.ttf`;
	const fontFace = new FontFace(
		fontSpec.name,
		'url(' + staticFile(`/fonts/${fontSpec.font}/${constructedFileName}`) + ')',
		'weight' in fontSpec ? {weight: `${fontSpec.weight}`} : undefined
	);
	await fontFace.load();
	document.fonts.add(fontFace);
	continueRender(handle);
}
