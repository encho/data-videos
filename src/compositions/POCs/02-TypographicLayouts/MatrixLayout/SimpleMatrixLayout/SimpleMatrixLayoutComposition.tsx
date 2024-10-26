import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';

import {useFontFamiliesLoader} from '../../../../../acetti-typography/useFontFamiliesLoader';
import {LorenzoBertoliniLogo2} from '../../../../../acetti-components/LorenzoBertoliniLogo2';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../../acetti-themes/getThemeFromEnum';
import {DisplayGridRails, Area} from '../../../../../acetti-layout';

import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../../../acetti-layout/hooks/useMatrixLayout';
import {SlideTitle} from '../../SlideTitle';
import {ThemeType} from '../../../../../acetti-themes/themeTypes';

export const simpleMatrixLayoutCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

const LAYOUT_WIDTH = 800;
const LAYOUT_HEIGHT = 600;

export const SimpleMatrixLayoutComposition: React.FC<
	z.infer<typeof simpleMatrixLayoutCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const {fps} = useVideoConfig();

	useFontFamiliesLoader(theme);

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<Sequence layout="none">
				<SlideTitle theme={theme}>The Matrix Layout</SlideTitle>
			</Sequence>
			<Sequence
				from={Math.floor(fps * 1)}
				// durationInFrames={fps * 3}
				layout="none"
			>
				<StandardMatrixLayoutExample theme={theme} />
			</Sequence>

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};

const StandardMatrixLayoutExample: React.FC<{theme: ThemeType}> = ({theme}) => {
	const nrRows = 5;
	const nrColumns = 5;

	const matrixLayout = useMatrixLayout({
		width: LAYOUT_WIDTH,
		height: LAYOUT_HEIGHT,
		nrColumns,
		nrRows,
		rowSpacePixels: 20,
		columnSpacePixels: 20,
		rowPaddingPixels: 40,
		columnPaddingPixels: 40,
	});

	return (
		<div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						position: 'relative',
						width: matrixLayout.width,
						height: matrixLayout.height,
					}}
				>
					<div style={{position: 'absolute', top: 0, left: 0}}>
						<DisplayGridRails
							{...matrixLayout}
							stroke={theme.TypographicLayouts.gridLayout.lineColor}
						/>
					</div>
					<div style={{position: 'absolute', top: 0, left: 0}}>
						<div style={{position: 'relative'}}>
							<div>
								<svg
									style={{
										width: matrixLayout.width,
										height: matrixLayout.height,
									}}
								>
									<Area
										area={getMatrixLayoutCellArea({
											layout: matrixLayout,
											cellName: 'cell',
											row: 0,
											column: 0,
										})}
										fill={theme.TypographicLayouts.gridLayout.activeAreaFill}
									>
										<g></g>
									</Area>
									<Area
										area={getMatrixLayoutCellArea({
											layout: matrixLayout,
											cellName: 'cell',
											row: 1,
											column: 0,
										})}
										fill={theme.TypographicLayouts.gridLayout.activeAreaFill}
									>
										<g></g>
									</Area>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
