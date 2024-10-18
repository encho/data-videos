import {z} from 'zod';
import {useVideoConfig, Sequence} from 'remotion';

import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {BaselineGrid} from '../BaselineGrid/BaselineGrid';
// import {useMatrixLayout} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {DisplayGridRails} from '../../../../acetti-layout';
import {HtmlArea} from '../../../../acetti-layout';
// import {SlideTitle} from '../SlideTitle';
import {useChartLayout} from './useChartLayout';
import {getTextDimensionsFromTextStyle} from '../../../../acetti-typography/CapSizeTextNew';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {TypographyStyle} from '../TextStyles/TextStylesComposition';

export const swissPoster01CompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SwissPoster01Composition: React.FC<
	z.infer<typeof swissPoster01CompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);
	const {fps, width, height} = useVideoConfig();

	useFontFamiliesLoader(theme);

	// horizontal layout sizes
	const horizontalMarginInBaselines = 4;

	// vertical layout sizes
	const verticalMarginInBaselines = 1;
	const titleInBaselines = 10;
	const aboveTitleBaselines = 5;
	const underTitleBaselines = 20;

	const amountOfBaselines =
		2 * verticalMarginInBaselines +
		titleInBaselines +
		aboveTitleBaselines +
		underTitleBaselines;

	const baseline = height / amountOfBaselines;

	const posterTitleText = '77';

	// const baseline = 220; // TODO funciton of width

	const textStyle_h1 = theme.typography.textStyles.h1;
	const textStyle_posterTitle = {
		...textStyle_h1,
		capHeightInBaselines: titleInBaselines,
	};

	const posterTitleDimensions = getTextDimensionsFromTextStyle({
		textStyle: textStyle_posterTitle,
		baseline,
		text: posterTitleText,
	});

	console.log(posterTitleDimensions);

	// TODO rename to useSwissPoster01Layout() or so
	const chartLayout = useChartLayout({
		width,
		height,
		baseline,
		horizontalMarginInBaselines: horizontalMarginInBaselines,
		titleWidthInPixel: posterTitleDimensions.width,
		titleHeightInBaselines: titleInBaselines,
		aboveTitleInBaselines: aboveTitleBaselines,
		belowTitleInBaselines: underTitleBaselines,
	});

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			{/* <SlideTitle theme={theme}>Swiss Poster 01</SlideTitle> */}
			<Sequence
				layout="none"
				// from={fps * 1}
			>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							width: width,
							height: height,
							position: 'relative',
						}}
					>
						<DisplayGridRails
							{...chartLayout}
							stroke={theme.TypographicLayouts.gridLayout.lineColor}
						/>
						<BaselineGrid
							width={width}
							height={height}
							baseline={baseline}
							{...theme.TypographicLayouts.baselineGrid}
							strokeWidth={3}
						/>
						<HtmlArea area={chartLayout.areas.title}>
							<TypographyStyle
								baseline={baseline}
								typographyStyle={textStyle_posterTitle}
								color={'white'}
							>
								{posterTitleText}
							</TypographyStyle>
						</HtmlArea>
					</div>
				</div>
			</Sequence>

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};
