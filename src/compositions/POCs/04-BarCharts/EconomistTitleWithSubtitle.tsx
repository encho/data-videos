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

export const EconomistTitleWithSubtitleOLD: React.FC<{
	title: string;
	subtitle: string;
	theme: ThemeType;
}> = ({title, subtitle, theme}) => {
	const {fps} = useVideoConfig();
	// TODO fontSize? gap? from Theme!! or from baseline prop!!
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				marginLeft: 40,
				marginRight: 40,
				// justifyContent: 'center',
				// gap: 10,
			}}
		>
			<div
				style={{
					color: theme.typography.title.color,
					fontSize: 70,
					marginTop: 60,
					marginBottom: 20,
					fontFamily: 'Inter-Bold',
					fontWeight: 700,
				}}
			>
				<FadeInAndOutText>{title}</FadeInAndOutText>
			</div>
			<Sequence from={fps * 0.7} layout="none">
				<div
					style={{
						color: theme.typography.subTitle.color,
						fontSize: 50,
						marginBottom: 80,
						fontFamily: 'Inter-Regular',
						fontWeight: 700,
					}}
				>
					<FadeInAndOutText>{subtitle}</FadeInAndOutText>
				</div>
			</Sequence>
		</div>
	);
};

export const EconomistTitleWithSubtitle: React.FC<{
	title: string;
	subtitle: string;
	theme: ThemeType;

	// export function SlideTitleSequence({
	// 	title,
	// 	subTitle,
	// 	styling,
	// 	// TODO rename to titleFontFamily and subTitleFontFamily perhaps
	// 	fontFamilyTitle,
	// 	fontFamilySubtitle,
	// }: {
	// 	title: string | ReactNode;
	// 	subTitle: string;
	// 	fontFamilyTitle: FontFamiliesUnionType;
	// 	fontFamilySubtitle: FontFamiliesUnionType;
	// 	styling: {
	// 		titleColor: string;
	// 		subTitleColor: string;
	// 		titleFontSize: number;
	// 		subTitleFontSize: number;
	// 	};
}> = ({title, subtitle, theme}) => {
	// TODO the typography should be loaded at the top global level + TypographyContext
	// useFontFamiliesLoader([fontFamilyTitle, fontFamilySubtitle]);

	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();

	// const styling = {
	// 	titleColor: 'red',
	// 	subTitleColor: 'cyan',
	// 	titleFontSize: 80,
	// 	// subTitleFontSize: 50,
	// };

	const titleStyle = {
		fontSize: 70,
		marginBottom: 10,
		color: theme.typography.title.color,
		fontFamily: 'Inter-Bold',
		marginLeft: 40,
		marginTop: 20,
	};

	const subtitleStyle = {
		marginLeft: 40,
		fontSize: 50,
		marginBottom: 120,
		color: theme.typography.subTitle.color,
		fontFamily: 'Inter-Regular',
	};

	// const fontFamilyTitle = 'Inter-Bold';
	// const fontFamilySubtitle = 'Inter-Regular';

	// TODO what about fade in animation? also sequence shoudl be here probably.
	// Fade out the animation at the end
	const opacity = interpolate(
		frame,
		[0, fps * 0.5, durationInFrames - 15, durationInFrames - 5],
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
