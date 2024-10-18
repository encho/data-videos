import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';
import {range} from 'lodash';
import {ReactNode} from 'react';

// TODO compare vs BaselineGrid in typography package
// TODO deprecate/ replace BaselineGrid in typography package
import {BaselineGrid} from '../BaselineGrid/BaselineGrid';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
// import {ElementsLogo} from './ElementsLogo';
// import {CapSizeTextNew} from './CapSizeTextNew';
import {CapSizeTextNew} from '../../../../acetti-typography/CapSizeTextNew';
import {SlideTitle} from '../SlideTitle';
import {DisplayGridRails} from '../../../../acetti-layout';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {HtmlArea} from '../../../../acetti-layout';
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

export const typesettingCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const TypesettingComposition: React.FC<
	z.infer<typeof typesettingCompositionSchema>
> = ({themeEnum}) => {
	useFontFamiliesLoader(['Inter-Regular', 'Inter-Bold']);
	const theme = getThemeFromEnum(themeEnum as any);

	const {width, fps} = useVideoConfig();

	const matrixLayout = useMatrixLayout({
		width, // TODO better show grid rails!
		height: 540,
		nrColumns: 1,
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

	// const area_2 = getMatrixLayoutCellArea({
	// 	layout: matrixLayout,
	// 	cellName: 'cell',
	// 	row: 0,
	// 	column: 1,
	// });

	// typographic info for area_1
	// ***********************************************************
	const baseline = area_1.height / 16;

	const typography = {
		styles: {
			h1: {
				fontFamily: 'Inter-Bold' as const,
				capHeightInBaselines: 3,
				lineGapInBaselines: 1,
			},
			h2: {
				fontFamily: 'Inter-Bold' as const,
				capHeightInBaselines: 2,
				lineGapInBaselines: 1,
			},
			body: {
				fontFamily: 'Inter-Regular' as const,
				capHeightInBaselines: 1,
				lineGapInBaselines: 0.8,
			},
		},
	};

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
				<SlideTitle theme={theme}>Typesetting</SlideTitle>
				<div style={{position: 'relative', marginTop: 100}}>
					{/* <DisplayGridRails {...matrixLayout} stroke={'#444'} strokeWidth={1} /> */}

					<HtmlArea area={area_1}>
						<Sequence from={0} layout="none">
							<div>
								{/* <BaselineGrid
									width={area_1.width}
									height={area_1.height}
									baseline={baseline}
									{...theme.TypographicLayouts.baselineGrid}
									lineColor={'#888'}
									strokeWidth={1}
								/> */}

								<div
									style={{
										position: 'relative',
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									{/* // TODO false to not use style marginBottom or override with number ot control baseline multiples!! */}
									<TypographyStyle
										typographyStyle={typography.styles.body}
										baseline={baseline}
										color="white"
										marginBottom={2.5}
									>
										Typesetting is the technical process of arranging text on a
										page to achieve optimal legibility and readability.
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={typography.styles.body}
										baseline={baseline}
										color="white"
									>
										This involves finding an equilibrium between the key
										typographic elements{' '}
										<span style={{textDecoration: 'underline'}}>
											font size, line height (leading), and line length
											(measure).
										</span>
									</TypographyStyle>
								</div>
							</div>
						</Sequence>
					</HtmlArea>
				</div>

				{/* <ElementsLogo cell_size={4} /> */}
				<LorenzoBertoliniLogo color={theme.typography.textColor} />
			</div>
		</>
	);
};
