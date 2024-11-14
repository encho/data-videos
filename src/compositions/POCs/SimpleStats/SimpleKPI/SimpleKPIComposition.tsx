import {z} from 'zod';
import numeral from 'numeral';
import {Sequence, useVideoConfig} from 'remotion';

import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {FadeInAndOutText} from '../../../../acetti-typography/TextEffects/FadeInAndOutText';
import {WaterfallTextEffect} from '../../../../acetti-typography/TextEffects/WaterfallTextEffect';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SlideTitle} from '../../02-TypographicLayouts/SlideTitle';

export const simpleKPICompositionSchema = z.object({
	themeEnum: zThemeEnum,
	kpiValue: z.number(),
	kpiValueFormatString: z.string(),
	kpiLabel: z.string(),
	baseline: z.number(), // TODO rename to baseline
});

export const SimpleKPIComposition: React.FC<
	z.infer<typeof simpleKPICompositionSchema>
> = ({themeEnum, kpiValue, kpiValueFormatString, kpiLabel, baseline}) => {
	const theme = useThemeFromEnum(themeEnum);

	const {fps, durationInFrames} = useVideoConfig();

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<SlideTitle theme={theme}>Simple KPI's</SlideTitle>
			<Sequence
				layout="none"
				durationInFrames={durationInFrames - fps}
				from={Math.floor(fps * 0.5)}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: baseline * 2,
						marginLeft: 40,
						marginTop: 80,
					}}
				>
					<Sequence layout="none">
						<SimpleKPI
							{...{
								themeEnum,
								kpiValue,
								kpiValueFormatString,
								kpiLabel,
								baseline,
							}}
						/>
					</Sequence>

					<Sequence layout="none" from={Math.floor(fps * 1.75)}>
						<SimpleKPI
							{...{
								themeEnum,
								kpiValue: 2000,
								kpiValueFormatString: '$ 0.00',
								kpiLabel: 'Investments',
								baseline,
							}}
						/>
					</Sequence>
				</div>
			</Sequence>
			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};

export const SimpleKPI: React.FC<
	z.infer<typeof simpleKPICompositionSchema>
> = ({themeEnum, kpiValue, kpiValueFormatString, kpiLabel, baseline}) => {
	const theme = useThemeFromEnum(themeEnum);

	const formattedKpiValue = numeral(kpiValue).format(kpiValueFormatString);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<TypographyStyle
				typographyStyle={theme.typography.textStyles.datavizLabel}
				baseline={baseline}
				marginBottom={0.5}
			>
				<FadeInAndOutText innerDelay={Math.floor(90 * 0.75)}>
					{formattedKpiValue}
				</FadeInAndOutText>
			</TypographyStyle>
			<TypographyStyle
				typographyStyle={theme.typography.textStyles.datavizValueLabel}
				baseline={baseline}
			>
				<WaterfallTextEffect>{kpiLabel}</WaterfallTextEffect>
			</TypographyStyle>
		</div>
	);
};
