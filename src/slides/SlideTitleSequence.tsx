import {Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ReactNode, useMemo} from 'react';
import {SlideIn} from '../SlideIn';

import availableFontSpecs, {FontFamiliesUnionType} from '../fontSpecs';
import {useFontsLoader} from '../useFontsLoader';

function uniqueStrings(inputArray: string[]): string[] {
	// Create a Set to store unique strings
	const uniqueSet = new Set<string>();

	// Add the strings from the input array to the Set
	inputArray.forEach((str) => uniqueSet.add(str));

	// Convert the Set back to an array
	const uniqueArray = Array.from(uniqueSet);

	return uniqueArray;
}

export function SlideTitleSequence({
	title,
	subTitle,
	styling,
	// TODO rename to titleFontFamily and subTitleFontFamily perhaps
	fontFamilyTitle,
	fontFamilySubtitle,
}: {
	title: string | ReactNode;
	subTitle: string;
	fontFamilyTitle: FontFamiliesUnionType;
	fontFamilySubtitle: FontFamiliesUnionType;
	styling: {
		titleColor: string;
		subTitleColor: string;
		titleFontSize: number;
		subTitleFontSize: number;
	};
}) {
	// load fonts
	const fontSpecs = useMemo(() => {
		const fontIds = uniqueStrings([fontFamilyTitle, fontFamilySubtitle]);
		// @ts-ignore
		const specs = fontIds.map((it) => availableFontSpecs[it]);
		return specs;
	}, [fontFamilyTitle, fontFamilySubtitle]);
	useFontsLoader(fontSpecs);

	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	// TODO what about fade in animation? also sequence shoudl be here probably.
	// Fade out the animation at the end
	const opacity = interpolate(
		frame,
		[durationInFrames - 15, durationInFrames - 5],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<div className="relative">
			<div className="invisible">
				<h1
					style={{
						fontFamily: fontFamilyTitle,
						fontSize: styling.titleFontSize,
						color: styling.titleColor,
						opacity,
					}}
				>
					{title}
				</h1>
				<h2
					style={{
						fontFamily: fontFamilySubtitle,
						fontSize: styling.subTitleFontSize,
						opacity,
						color: styling.subTitleColor,
					}}
				>
					{subTitle}
				</h2>
			</div>
			<div className="absolute top-0 left-0">
				<Sequence from={0} layout="none">
					<SlideIn>
						<h1
							style={{
								fontFamily: fontFamilyTitle,
								fontSize: styling.titleFontSize,
								color: styling.titleColor,
								opacity,
							}}
						>
							{title}
						</h1>
					</SlideIn>
				</Sequence>
				<Sequence from={5} layout="none">
					<SlideIn>
						<h2
							style={{
								fontFamily: fontFamilySubtitle,
								fontSize: styling.subTitleFontSize,
								opacity,
								color: styling.subTitleColor,
							}}
						>
							{subTitle}
						</h2>
					</SlideIn>
				</Sequence>
			</div>
		</div>
	);
}
