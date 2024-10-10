import {z} from 'zod';

import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {DisplayGridRails, Area} from '../../../../acetti-layout';

import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {SlideTitle} from '../SlideTitle';

export const matrixLayoutCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

const LAYOUT_WIDTH = 800;
const LAYOUT_HEIGHT = 600;

export const MatrixLayoutComposition: React.FC<
	z.infer<typeof matrixLayoutCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const nrRows = 5;
	const nrColumns = 5;

	const matrixLayout = useMatrixLayout({
		width: LAYOUT_WIDTH,
		height: LAYOUT_HEIGHT,
		nrColumns,
		nrRows,
		rowSpacePixels: 20,
		columnSpacePixels: 20,
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
			<SlideTitle theme={theme}>The Matrix Layout</SlideTitle>

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
										// fill="rgba(200,100,0,0.6)"
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

			<LorenzoBertoliniLogo color={theme.typography.textColor} fontSize={34} />
		</div>
	);
};
