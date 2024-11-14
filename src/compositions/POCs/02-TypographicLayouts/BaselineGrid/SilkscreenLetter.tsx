import {z} from 'zod';

// import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	// getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {DisplayGridRails, Area} from '../../../../acetti-layout';

import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../../acetti-layout/hooks/useMatrixLayout';

export const silkscreenFontPOCSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SilkscreenLetter: React.FC<{
	// letter: string;
	letterCells: {row: number; column: number}[];
	nrColumns: number;
	nrRows: number;
	cellSize: number;
	showGrid?: boolean;
	color?: string;
}> = ({
	// letter,  TODO introduce ?
	letterCells,
	nrColumns,
	nrRows,
	cellSize,
	showGrid = true,
	color = 'rgba(200,100,0,0.8)',
}) => {
	const letterWidth = nrColumns * cellSize;
	const letterHeight = nrRows * cellSize;

	const matrixLayout = useMatrixLayout({
		width: letterWidth,
		height: letterHeight,
		nrColumns,
		nrRows,
	});

	return (
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
				{showGrid ? (
					<div style={{position: 'absolute', top: 0, left: 0}}>
						<DisplayGridRails {...matrixLayout} />
					</div>
				) : null}
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<div style={{position: 'relative'}}>
						<div>
							<svg
								style={{
									width: matrixLayout.width,
									height: matrixLayout.height,
								}}
							>
								{letterCells.map((letterCell) => {
									return (
										<Area
											area={getMatrixLayoutCellArea({
												layout: matrixLayout,
												cellName: 'cell',
												row: letterCell.row,
												column: letterCell.column,
											})}
											fill={color}
										>
											<g />
										</Area>
									);
								})}
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
