import {z} from 'zod';

import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {DisplayGridRails, Area} from '../../../acetti-layout';

import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../acetti-layout/hooks/useMatrixLayout';

export const matrixLayoutPOCSchema = z.object({
	themeEnum: zThemeEnum,
});

const LAYOUT_WIDTH = 800;
const LAYOUT_HEIGHT = 600;

export const MatrixLayoutPOC: React.FC<
	z.infer<typeof matrixLayoutPOCSchema>
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
			<div style={{position: 'relative'}}>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							color: theme.typography.title.color,
							fontSize: 50,
							marginTop: 50,
						}}
					>
						useMatrixLayout Example
					</div>
				</div>

				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							color: theme.typography.subTitle.color,
							fontSize: 30,
							marginBottom: 50,
						}}
					>
						TODO: add animations and better area displays
					</div>
				</div>

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
							<DisplayGridRails {...matrixLayout} />
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
											fill="rgba(200,100,0,0.6)"
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
											fill="rgba(200,100,0,0.6)"
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

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
