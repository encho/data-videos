import {ThemeType} from '../../../acetti-themes/themeTypes';
// import {
// 	Easing,
// 	Sequence,
// 	interpolate,
// 	useCurrentFrame,
// 	useVideoConfig,
// } from 'remotion';
// import {SlideIn} from '../../../SlideIn';
import {TypographyStyle} from '../02-TypographicLayouts/TextStyles/TextStylesComposition';

export const EconomistTitleWithSubtitle: React.FC<{
	title: string;
	subtitle: string;
	theme: ThemeType;
}> = ({title, subtitle, theme}) => {
	// TODO the typography should be loaded at the top global level + TypographyContext
	// useFontFamiliesLoader([fontFamilyTitle, fontFamilySubtitle]);

	// const frame = useCurrentFrame();
	// const {durationInFrames, fps} = useVideoConfig();

	const baseline = 18;
	const pageMarginLeft = 40;
	const pageMarginTop = 40;

	// TODO from theme
	// const titleStyle = {
	// 	// fontSize: 60,
	// 	// marginBottom: 0,
	// 	// color: theme.typography.title.color,
	// 	// fontFamily: 'Inter-Bold',
	// 	marginLeft: 40,
	// 	marginTop: 20,
	// };

	// TODO from theme
	// const subtitleStyle = {
	// 	marginLeft: 40,
	// 	fontSize: 44,
	// 	marginBottom: 120,
	// 	color: theme.typography.subTitle.color,
	// 	fontFamily: 'Inter-Regular',
	// };

	// TODO what about fade in animation? also sequence shoudl be here probably.
	// Fade out the animation at the end
	// const opacity = interpolate(
	// 	frame,
	// 	[
	// 		0.2,
	// 		fps * 0.7,
	// 		durationInFrames - fps * 0.5,
	// 		durationInFrames - fps * 0.2,
	// 	],
	// 	[0, 1, 1, 0],
	// 	{
	// 		extrapolateLeft: 'clamp',
	// 		extrapolateRight: 'clamp',
	// 		easing: Easing.ease,
	// 	}
	// );

	return (
		<div>
			<div style={{marginLeft: pageMarginLeft, marginTop: pageMarginTop}}>
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.h1}
					baseline={baseline}
					marginBottom={2}
					// marginTop={2}
				>
					{title}
				</TypographyStyle>
			</div>
			<div style={{marginLeft: pageMarginLeft}}>
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.h2}
					baseline={baseline}
					marginBottom={5}
				>
					{subtitle}
				</TypographyStyle>
			</div>
		</div>
	);
};
