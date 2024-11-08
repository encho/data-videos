import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';

import {PageContext} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {TextAnimationSubtle} from './TextAnimationSubtle/TextAnimationSubtle';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import {FadeInAndOutText} from '../../../../acetti-typography/TextEffects/FadeInAndOutText';
import {WaterfallTextEffect} from '../../../../acetti-typography/TextEffects/WaterfallTextEffect';
import {Position} from '../../../../acetti-ts-base/Position';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';

export const textAnimationsCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	kpiValue: z.number(),
	kpiValueFormatString: z.string(),
	kpiLabel: z.string(),
	fontSize: z.number(),
});

export const TextAnimationsComposition: React.FC<
	z.infer<typeof textAnimationsCompositionSchema>
> = ({themeEnum, kpiValue, kpiValueFormatString, kpiLabel, fontSize}) => {
	const theme = getThemeFromEnum(themeEnum as any);
	const {width, height} = useVideoConfig();

	// load fonts
	// ********************************************************
	useFontFamiliesLoader(theme);

	return (
		<PageContext width={width} height={height} margin={40} nrBaselines={40}>
			<Page theme={theme} show>
				{({baseline}) => {
					return (
						<>
							<Position position={{top: 100, left: 100}}>
								<div
									style={{display: 'flex', flexDirection: 'column', gap: 80}}
								>
									<Sequence layout="none">
										<TypographyStyle
											typographyStyle={theme.typography.textStyles.h2}
											baseline={24}
											marginBottom={2}
										>
											{/* <FadeInAndOutText>Fade In And Out Text</FadeInAndOutText> */}
											<FadeInAndOutText>Fade In/Out</FadeInAndOutText>
										</TypographyStyle>
									</Sequence>
									<Sequence layout="none">
										<TypographyStyle
											typographyStyle={theme.typography.textStyles.h2}
											baseline={24}
											marginBottom={2}
										>
											<WaterfallTextEffect>
												Waterfall Text Effect
											</WaterfallTextEffect>
										</TypographyStyle>
									</Sequence>
									<Sequence layout="none">
										<TypographyStyle
											typographyStyle={theme.typography.textStyles.h2}
											baseline={24}
											marginBottom={2}
										>
											<TextAnimationSubtle translateY={baseline * 1.25}>
												Text Animation Subtle
											</TextAnimationSubtle>
										</TypographyStyle>
									</Sequence>
								</div>
							</Position>
							<LorenzoBertoliniLogo color={theme.typography.textColor} />
						</>
					);
				}}
			</Page>
		</PageContext>
	);
};
