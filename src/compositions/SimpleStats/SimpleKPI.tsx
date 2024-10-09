import {z} from 'zod';
import numeral from 'numeral';
import {Sequence} from 'remotion';

import {FadeInAndOutText} from '../../acetti-typography/TextEffects/FadeInAndOutText';
import {WaterfallTextEffect} from '../../acetti-typography/TextEffects/WaterfallTextEffect';
import {ThemeType} from '../../acetti-themes/themeTypes';
import {Position} from '../../acetti-ts-base/Position';
import LorenzoBertoliniLogo from '../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../acetti-themes/getThemeFromEnum';

import {
	getKPIFontSize,
	getLabelFontSize,
	getLabelMarginTop,
	getSpaceMedium,
} from '../../acetti-themes/typographySizes';

export const simpleKPICompositionSchema = z.object({
	themeEnum: zThemeEnum,
	kpiValue: z.number(),
	kpiValueFormatString: z.string(),
	kpiLabel: z.string(),
	baseFontSize: z.number(),
});

export const SimpleKPIComposition: React.FC<
	z.infer<typeof simpleKPICompositionSchema>
> = ({themeEnum, kpiValue, kpiValueFormatString, kpiLabel, baseFontSize}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	// TODO kpi section in theme!!!
	// const kpiColor = theme.typography.textColor;

	const spaceMedium = getSpaceMedium(baseFontSize);

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<Position position={{top: 100, left: 100}}>
				<div
					style={{display: 'flex', flexDirection: 'column', gap: spaceMedium}}
				>
					<Sequence layout="none">
						<SimpleKPI
							{...{
								themeEnum,
								kpiValue,
								kpiValueFormatString,
								kpiLabel,
								baseFontSize,
							}}
						/>
					</Sequence>

					<Sequence layout="none" from={90 * 2}>
						<SimpleKPI
							{...{
								themeEnum,
								kpiValue: 2000,
								kpiValueFormatString: '$ 0.00',
								kpiLabel: 'Investments',
								baseFontSize,
							}}
						/>
					</Sequence>
				</div>
			</Position>
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};

export const SimpleKPI: React.FC<
	z.infer<typeof simpleKPICompositionSchema>
> = ({themeEnum, kpiValue, kpiValueFormatString, kpiLabel, baseFontSize}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const formattedKpiValue = numeral(kpiValue).format(kpiValueFormatString);

	const kpiFontSize = getKPIFontSize(baseFontSize);
	const labelFontSize = getLabelFontSize(baseFontSize);
	const labelMarginTop = getLabelMarginTop(baseFontSize);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<div style={{}}>
				<div
					style={{
						...getTitleStyles(theme),
						fontSize: kpiFontSize,
						marginTop: `-${0.32}em`, // TODO this is capsize adjustment
						marginBottom: `-${0.33}em`, // TODO this is capsize adjustment
					}}
				>
					<FadeInAndOutText innerDelay={Math.floor(90 * 0.75)}>
						{formattedKpiValue}
					</FadeInAndOutText>
				</div>
			</div>
			<div
				style={{
					marginTop: labelMarginTop,
				}}
			>
				<div
					style={{
						marginTop: `-${0.32}em`, // TODO this is capsize adjustment
						marginBottom: `-${0.33}em`, // TODO this is capsize adjustment
						...getSubTitleStyles(theme),
						fontSize: labelFontSize,
					}}
				>
					<WaterfallTextEffect>{kpiLabel}</WaterfallTextEffect>
				</div>
			</div>
		</div>
	);
};

const getTitleStyles = (theme: ThemeType) => {
	const titleStyles = {
		fontWeight: 700,
		fontFamily: theme.typography.title.fontFamily,
		color: theme.SimpleKPI.kpiColor,
	};
	return titleStyles;
};

const getSubTitleStyles = (theme: ThemeType) => {
	const subTitleStyles = {
		fontWeight: 500,
		fontFamily: theme.typography.title.fontFamily,
		color: theme.SimpleKPI.labelColor,
	};
	return subTitleStyles;
};
