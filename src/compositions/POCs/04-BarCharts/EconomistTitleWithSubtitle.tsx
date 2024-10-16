// import {Sequence, useVideoConfig} from 'remotion';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {FadeInAndOutText} from '../../../acetti-typography/TextEffects/FadeInAndOutText';
import {
	Easing,
	Sequence,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
// import {ReactNode} from 'react';
// import {SlideIn} from '../SlideIn';
import {SlideIn} from '../../../SlideIn';
// import {FontFamiliesUnionType} from '../../../acetti-typography/fontSpecs';
// import {useFontFamiliesLoader} from '../../../acetti-typography/useFontFamiliesLoader';
// import {Performance_01} from '../../../acetti-ts-flics/single-timeseries/Performance_01/Performance_01';
// import {FontFamiliesUnionType} from '../acetti-typography/fontSpecs';
// import {useFontFamiliesLoader} from '../acetti-typography/useFontFamiliesLoader';

export const EconomistTitleWithSubtitle: React.FC<{
	title: string;
	subtitle: string;
	theme: ThemeType;
}> = ({title, subtitle, theme}) => {
	// TODO the typography should be loaded at the top global level + TypographyContext
	// useFontFamiliesLoader([fontFamilyTitle, fontFamilySubtitle]);

	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();

	// TODO from theme
	const titleStyle = {
		fontSize: 70,
		marginBottom: 0,
		color: theme.typography.title.color,
		fontFamily: 'Inter-Bold',
		marginLeft: 40,
		marginTop: 20,
	};

	// TODO from theme
	const subtitleStyle = {
		marginLeft: 40,
		fontSize: 44,
		marginBottom: 120,
		color: theme.typography.subTitle.color,
		fontFamily: 'Inter-Regular',
	};

	// TODO what about fade in animation? also sequence shoudl be here probably.
	// Fade out the animation at the end
	const opacity = interpolate(
		frame,
		[
			0.2,
			fps * 0.7,
			durationInFrames - fps * 0.5,
			durationInFrames - fps * 0.2,
		],
		[0, 1, 1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.ease,
		}
	);

	return (
		<div className="relative">
			<div className="invisible">
				<h1
					style={{
						// fontFamily: fontFamilyTitle,
						// fontSize: styling.titleFontSize,
						// color: styling.titleColor,
						opacity,
						...titleStyle,
					}}
				>
					{title}
				</h1>
				<h2
					style={{
						opacity,
						...subtitleStyle,
						// fontFamily: subtitleStyle.fontFamily,
						// fontSize: subtitleStyle.fontSize,
						// marginBottom: subtitleStyle.marginBottom,
						// color: subtitleStyle.color,
					}}
				>
					{subtitle}
				</h2>
			</div>
			<div className="absolute top-0 left-0">
				<Sequence from={0} layout="none">
					<SlideIn>
						<h1
							style={{
								opacity,
								...titleStyle,
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
								opacity,
								...subtitleStyle,
							}}
						>
							{subtitle}
						</h2>
					</SlideIn>
				</Sequence>
			</div>
		</div>
	);
};
