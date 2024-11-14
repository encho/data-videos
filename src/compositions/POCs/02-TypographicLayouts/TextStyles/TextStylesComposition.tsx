import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';
// import {range} from 'lodash';
import {ReactNode} from 'react';

// TODO compare vs BaselineGrid in typography package
// TODO deprecate/ replace BaselineGrid in typography package
import {usePage} from '../../../../acetti-components/PageContext';
import {BaselineGrid} from '../BaselineGrid/BaselineGrid';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {CapSizeTextNew} from '../../../../acetti-typography/CapSizeTextNew';
import {SlideTitle} from '../SlideTitle';
import {DisplayGridRails} from '../../../../acetti-layout';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {HtmlArea} from '../../../../acetti-layout';
import {ThemeTextStyle} from '../../../../acetti-themes/themeTypes';

// TODO funciton of theme, and should get color though or id to color in theme
// TODO put into acetti-typograpy/new
export function TypographyStyle({
	children,
	baseline: baselineProp,
	color: colorProp,
	typographyStyle,
	marginBottom = 0,
	marginTop = 0,
	style,
}: {
	children: ReactNode;
	baseline?: number;
	marginBottom?: number;
	marginTop?: number;
	color?: string;
	typographyStyle: ThemeTextStyle;
	style?: React.CSSProperties;
}) {
	const {fontFamily, capHeightInBaselines, lineGapInBaselines, color} =
		typographyStyle;

	const {baseline: pageBaseline} = usePage();

	const baseline = baselineProp || pageBaseline;

	return (
		<CapSizeTextNew
			fontFamily={fontFamily}
			capHeight={capHeightInBaselines * baseline}
			lineGap={lineGapInBaselines * baseline}
			color={colorProp || color}
			marginBottom={marginBottom * baseline}
			marginTop={marginTop * baseline}
			style={style}
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
	const theme = useThemeFromEnum(themeEnum);

	const {width} = useVideoConfig();

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
					<DisplayGridRails {...matrixLayout} stroke="#444" strokeWidth={1} />

					<HtmlArea area={area_1}>
						<Sequence layout="none">
							<div>
								<BaselineGrid
									width={area_1.width}
									height={area_1.height}
									baseline={baselineLeft}
									{...theme.TypographicLayouts.baselineGrid}
									lineColor="#888"
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
										typographyStyle={theme.typography.textStyles.h1}
										baseline={baselineLeft}
										marginBottom={2}
									>
										This is h1
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h2}
										baseline={baselineLeft}
										marginBottom={2}
									>
										This is h2
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h3}
										baseline={baselineLeft}
										marginBottom={2}
									>
										This is h3
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.body}
										baseline={baselineLeft}
										marginBottom={2}
									>
										This is body
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.datavizLabel}
										baseline={baselineLeft}
										marginBottom={2}
									>
										Dataviz Label
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={
											theme.typography.textStyles.datavizValueLabel
										}
										baseline={baselineLeft}
										marginBottom={2}
									>
										Dataviz value label
									</TypographyStyle>
								</div>
							</div>
						</Sequence>
					</HtmlArea>

					<HtmlArea area={area_2}>
						<Sequence layout="none">
							<div>
								<BaselineGrid
									width={area_2.width}
									height={area_2.height}
									baseline={baselineRight}
									{...theme.TypographicLayouts.baselineGrid}
									lineColor="#888"
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
										typographyStyle={theme.typography.textStyles.h1}
										baseline={baselineRight}
										marginBottom={2}
									>
										This is h1
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h2}
										baseline={baselineRight}
										marginBottom={2}
									>
										This is h2
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h3}
										baseline={baselineRight}
										marginBottom={2}
									>
										This is h3
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.body}
										baseline={baselineRight}
										marginBottom={2}
									>
										This is body
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.datavizLabel}
										baseline={baselineRight}
										marginBottom={2}
									>
										Dataviz Label
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={
											theme.typography.textStyles.datavizValueLabel
										}
										baseline={baselineRight}
										marginBottom={2}
									>
										Dataviz value label
									</TypographyStyle>
								</div>
							</div>
						</Sequence>
					</HtmlArea>
				</div>

				<LorenzoBertoliniLogo2 theme={theme} />
			</div>
		</>
	);
};
