import {z} from 'zod';
import {interpolate, useCurrentFrame, Easing, AbsoluteFill} from 'remotion';
import {JustLorenzoLogo} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
// import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
// import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {ThemeType} from '../../../../acetti-themes/themeTypes';

export const remapSpeed = (frame: number, speed: (fr: number) => number) => {
	let framesPassed = 0;
	for (let i = 0; i <= frame; i++) {
		framesPassed += speed(i);
	}

	return framesPassed;
};

export const takeOffSpeedFucntion = (f: number) =>
	10 ** interpolate(f, [0, 40], [-1, 6]);

export const zoomSpeedFunction = (f: number) =>
	10 ** interpolate(f, [0, 40], [-1, 5.5]);

export const frameAnimationCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const FrameAnimationComposition: React.FC<
	z.infer<typeof frameAnimationCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	// load fonts
	// ********************************************************
	useFontFamiliesLoader(theme);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<BlueSquare theme={theme} />
			{/* <LorenzoBertoliniLogo2 theme={theme} /> */}
		</AbsoluteFill>
	);
};

export const BlueSquare: React.FC<{theme: ThemeType}> = ({theme}) => {
	const frame = useCurrentFrame();

	const acceleratedFrame = remapSpeed(frame, takeOffSpeedFucntion);
	const acceleratedFrameZoom = remapSpeed(frame, zoomSpeedFunction);

	const translate = interpolate(acceleratedFrame, [0, 40], [-700, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.33, 1, 0.68, 1), // https://easings.net/#easeOutCubic
	});

	const zoom = interpolate(acceleratedFrameZoom, [0, 40], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				transform: `translateY(${translate}px) scale(${zoom})`,
				// transform: `scale(${zoom})`,
			}}
		>
			<JustLorenzoLogo theme={theme} fontSize={90} color="black" />
		</div>
	);
};
