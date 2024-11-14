import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';

// TODO compare vs BaselineGrid in typography package
// TODO deprecate/ replace BaselineGrid in typography package

import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {BaselineGrid} from '../BaselineGrid/BaselineGrid';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {TypographyStyle} from '../TextStyles/TextStylesComposition';
import {SlideTitle} from '../SlideTitle';
// import {DisplayGridRails} from '../../../../acetti-layout';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {HtmlArea} from '../../../../acetti-layout';

export const typesettingCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const TypesettingComposition: React.FC<
	z.infer<typeof typesettingCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);

	const {width} = useVideoConfig();

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

	// TODO define some possible baselines in the theme
	const baseline = area_1.height / 16;

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
						<Sequence layout="none">
							<div>
								<BaselineGrid
									width={area_1.width}
									height={area_1.height}
									baseline={baseline}
									{...theme.TypographicLayouts.baselineGrid}
									lineColor="#999"
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
										typographyStyle={theme.typography.textStyles.body}
										baseline={baseline}
										marginBottom={3}
									>
										Typesetting is the technical process of arranging text on a
										page to achieve optimal legibility and readability.
									</TypographyStyle>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.body}
										baseline={baseline}
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

				<LorenzoBertoliniLogo2 theme={theme} />
			</div>
		</>
	);
};
