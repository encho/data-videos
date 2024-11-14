import {z} from 'zod';
import {useVideoConfig, Sequence} from 'remotion';

import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {BaselineGrid} from '../BaselineGrid/BaselineGrid';
import {useMatrixLayout} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {DisplayGridRails} from '../../../../acetti-layout';
import {SlideTitle} from '../SlideTitle';

export const modularScaleCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const ModularScaleComposition: React.FC<
	z.infer<typeof modularScaleCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);
	const {fps} = useVideoConfig();

	useFontFamiliesLoader(theme);

	const baseline = 14; // TODO funciton of width

	const paddingInBaselines = 2;
	const gutterInBaselines = 1;
	const cellHeightInBaselines = 14;

	const poster_height =
		(2 * paddingInBaselines +
			3 * gutterInBaselines +
			4 * cellHeightInBaselines) *
		baseline;

	// const poster_width = poster_height * 0.62;
	const poster_width = poster_height * 0.66;

	const matrixLayout = useMatrixLayout({
		width: poster_width,
		height: poster_height,
		nrColumns: 4,
		nrRows: 4,
		columnSpacePixels: gutterInBaselines * baseline,
		rowSpacePixels: gutterInBaselines * baseline,
		rowPaddingPixels: paddingInBaselines * baseline,
		columnPaddingPixels: paddingInBaselines * baseline,
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
			<SlideTitle theme={theme}>The Modular Scale</SlideTitle>
			<Sequence layout="none" from={Number(fps)}>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							width: poster_width,
							height: poster_height,
							position: 'relative',
						}}
					>
						<BaselineGrid
							width={poster_width}
							height={poster_height}
							baseline={baseline}
							{...theme.TypographicLayouts.baselineGrid}
							strokeWidth={3}
						/>
						<DisplayGridRails
							{...matrixLayout}
							stroke={theme.TypographicLayouts.gridLayout.lineColor}
						/>
					</div>
				</div>
			</Sequence>

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};
