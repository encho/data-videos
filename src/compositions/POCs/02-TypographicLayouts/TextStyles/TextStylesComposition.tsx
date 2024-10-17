import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';
// import {range} from 'lodash';
import {ReactNode} from 'react';

// TODO compare vs BaselineGrid in typography package
// TODO deprecate/ replace BaselineGrid in typography package
import {BaselineGrid} from '../BaselineGrid/BaselineGrid';
// import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {CapSizeTextNew} from '../BaselineGrid/CapSizeTextNew';
import {SlideTitle} from '../SlideTitle';
import {DisplayGridRails} from '../../../../acetti-layout';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {HtmlArea} from '../../../../acetti-layout';
import {textStyles} from './textStyles';
import {useFontFamiliesLoader} from '../BaselineGrid/useFontFamiliesLoader';
// import {FadeInAndOutText} from '../../SimpleStats/FadeInAndOutText';

// TODO funciton of theme, and should get color though or id to color in theme
function TypographyStyle({
	children,
	baseline,
	color,
	typographyStyle,
	marginBottom = 0,
}: {
	children: ReactNode;
	baseline: number;
	marginBottom?: number;
	color: string;
	typographyStyle: {
		fontFamily: 'Inter' | 'Inter-Regular' | 'Inter-Bold';
		capHeightInBaselines: number;
		lineGapInBaselines: number;
	};
}) {
	const {fontFamily, capHeightInBaselines, lineGapInBaselines} =
		typographyStyle;

	return (
		<CapSizeTextNew
			fontFamily={fontFamily}
			capHeight={capHeightInBaselines * baseline}
			lineGap={lineGapInBaselines * baseline}
			color={color}
			marginBottom={marginBottom * baseline}
		>
			{children}
		</CapSizeTextNew>
	);
}

export const textStylesCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const TextStylesComposition: React.FC<
	z.infer<typeof textStylesCompositionSchema>
> = ({themeEnum}) => {
	// useFontFamiliesLoader(['Inter-Regular', 'Inter-Bold']);
	useFontFamiliesLoader([
		'Inter-Regular',
		'Inter-Bold',
		// 'SourceSerifPro-Light',
	]);

	const theme = getThemeFromEnum(themeEnum as any);

	const {width, fps} = useVideoConfig();

	const matrixLayout = useMatrixLayout({
		width, // TODO better show grid rails!
		height: 660,
		nrColumns: 2,
		nrRows: 1,
		rowSpacePixels: 80,
		columnSpacePixels: 200,
		rowPaddingPixels: 0,
		columnPaddingPixels: 130,
	});

	const area_1 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		cellName: 'cell',
		row: 0,
		column: 0,
	});

	const area_2 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		cellName: 'cell',
		row: 0,
		column: 1,
	});

	// ***********************************************************
	const baselineLeft = area_1.height / 20;
	const baselineRight = baselineLeft * 0.5;

	return (
		<>
			<div
				style={{
					backgroundColor: theme.global.backgroundColor,
					position: 'absolute',
					width: '100%',
					height: '100%',
				}}
			>
				<SlideTitle theme={theme}>Text Styles</SlideTitle>
				<div style={{position: 'relative', marginTop: 0}}>
					<DisplayGridRails {...matrixLayout} stroke={'#444'} strokeWidth={1} />

					<HtmlArea area={area_1}>
						<Sequence from={0} layout="none">
							<div>
								<BaselineGrid
									width={area_1.width}
									height={area_1.height}
									baseline={baselineLeft}
									{...theme.TypographicLayouts.baselineGrid}
									lineColor={'#888'}
									strokeWidth={1}
								/>

								<div
									style={{
										position: 'relative',
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									{/* // TODO false to not use style marginBottom or override with number ot control baseline multiples!! */}
									<TypographyStyle
										typographyStyle={textStyles.h1}
										baseline={baselineLeft}
										color="white"
										marginBottom={2}
									>
										This is h1
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={textStyles.h2}
										baseline={baselineLeft}
										color="white"
										marginBottom={2}
									>
										This is h2
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={textStyles.body}
										baseline={baselineLeft}
										color="white"
									>
										This is body
									</TypographyStyle>
								</div>
							</div>
						</Sequence>
					</HtmlArea>

					<HtmlArea area={area_2}>
						<Sequence from={0} layout="none">
							<div>
								<BaselineGrid
									width={area_2.width}
									height={area_2.height}
									baseline={baselineRight}
									{...theme.TypographicLayouts.baselineGrid}
									lineColor={'#888'}
									strokeWidth={1}
								/>

								<div
									style={{
										position: 'relative',
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									{/* // TODO false to not use style marginBottom or override with number ot control baseline multiples!! */}
									<TypographyStyle
										typographyStyle={textStyles.h1}
										baseline={baselineRight}
										color="white"
										marginBottom={2}
									>
										This is h1
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={textStyles.h2}
										baseline={baselineRight}
										color="white"
										marginBottom={2}
									>
										This is h2
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={textStyles.body}
										baseline={baselineRight}
										color="white"
									>
										This is body
									</TypographyStyle>
								</div>
							</div>
						</Sequence>
					</HtmlArea>
				</div>

				<LorenzoBertoliniLogo color={theme.typography.textColor} />
			</div>
		</>
	);
};
