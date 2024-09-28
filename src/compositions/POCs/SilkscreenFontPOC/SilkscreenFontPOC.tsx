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

export const silkscreenFontPOCSchema = z.object({
	themeEnum: zThemeEnum,
});

const E_LETTER = {
	letter: 'E',
	nrRows: 5,
	nrColumns: 3,
	letterCells: [
		{row: 0, column: 0},
		{row: 1, column: 0},
		{row: 2, column: 0},
		{row: 3, column: 0},
		{row: 4, column: 0},
		{row: 0, column: 1},
		{row: 0, column: 2},
		{row: 2, column: 1},
		{row: 2, column: 2},
		{row: 4, column: 1},
		{row: 4, column: 2},
	],
};

const L_LETTER = {
	letter: 'L',
	nrRows: 5,
	nrColumns: 3,
	letterCells: [
		{row: 0, column: 0},
		{row: 1, column: 0},
		{row: 2, column: 0},
		{row: 3, column: 0},
		{row: 4, column: 0},
		{row: 4, column: 1},
		{row: 4, column: 2},
	],
};

const M_LETTER = {
	letter: 'M',
	nrRows: 5,
	nrColumns: 5,
	letterCells: [
		{row: 0, column: 0},
		{row: 1, column: 0},
		{row: 2, column: 0},
		{row: 3, column: 0},
		{row: 4, column: 0},
		{row: 0, column: 4},
		{row: 1, column: 4},
		{row: 2, column: 4},
		{row: 3, column: 4},
		{row: 4, column: 4},
		{row: 1, column: 1},
		{row: 1, column: 3},
		{row: 2, column: 2},
	],
};

const N_LETTER = {
	letter: 'N',
	nrRows: 5,
	nrColumns: 5,
	letterCells: [
		{row: 0, column: 0},
		{row: 1, column: 0},
		{row: 2, column: 0},
		{row: 3, column: 0},
		{row: 4, column: 0},
		{row: 0, column: 4},
		{row: 1, column: 4},
		{row: 2, column: 4},
		{row: 3, column: 4},
		{row: 4, column: 4},
		{row: 1, column: 1},
		{row: 2, column: 2},
		{row: 3, column: 3},
	],
};

const T_LETTER = {
	letter: 'T',
	nrRows: 5,
	nrColumns: 3,
	letterCells: [
		{row: 0, column: 0},
		{row: 0, column: 1},
		{row: 0, column: 2},
		{row: 1, column: 1},
		{row: 2, column: 1},
		{row: 3, column: 1},
		{row: 4, column: 1},
	],
};

const S_LETTER = {
	letter: 'S',
	nrRows: 5,
	nrColumns: 4,
	letterCells: [
		{row: 0, column: 1},
		{row: 0, column: 2},
		{row: 0, column: 3},
		{row: 1, column: 0},
		{row: 2, column: 1},
		{row: 2, column: 2},
		{row: 3, column: 3},
		{row: 4, column: 2},
		{row: 4, column: 1},
		{row: 4, column: 0},
	],
};

const O_LETTER = {
	letter: 'O',
	nrRows: 5,
	nrColumns: 4,
	letterCells: [
		{row: 0, column: 1},
		{row: 0, column: 2},
		{row: 4, column: 1},
		{row: 4, column: 2},
		{row: 1, column: 0},
		{row: 2, column: 0},
		{row: 3, column: 0},
		{row: 1, column: 3},
		{row: 2, column: 3},
		{row: 3, column: 3},
	],
};

const F_LETTER = {
	letter: 'F',
	nrRows: 5,
	nrColumns: 3,
	letterCells: [
		{row: 0, column: 1},
		{row: 0, column: 2},
		{row: 2, column: 1},
		{row: 2, column: 2},
		{row: 0, column: 0},
		{row: 1, column: 0},
		{row: 2, column: 0},
		{row: 3, column: 0},
		{row: 4, column: 0},
	],
};

const D_LETTER = {
	letter: 'D',
	nrRows: 5,
	nrColumns: 4,
	letterCells: [
		{row: 0, column: 1},
		{row: 0, column: 2},
		{row: 4, column: 1},
		{row: 4, column: 2},
		{row: 0, column: 0},
		{row: 1, column: 0},
		{row: 2, column: 0},
		{row: 3, column: 0},
		{row: 4, column: 0},
		{row: 1, column: 3},
		{row: 2, column: 3},
		{row: 3, column: 3},
	],
};

const A_LETTER = {
	letter: 'A',
	nrRows: 5,
	nrColumns: 4,
	letterCells: [
		{row: 0, column: 1},
		{row: 0, column: 2},
		{row: 2, column: 1},
		{row: 2, column: 2},
		{row: 1, column: 0},
		{row: 2, column: 0},
		{row: 3, column: 0},
		{row: 4, column: 0},
		{row: 1, column: 3},
		{row: 2, column: 3},
		{row: 3, column: 3},
		{row: 4, column: 3},
	],
};

const R_LETTER = {
	letter: 'R',
	nrRows: 5,
	nrColumns: 4,
	letterCells: [
		{row: 0, column: 1},
		{row: 0, column: 2},
		{row: 2, column: 1},
		{row: 2, column: 2},
		{row: 0, column: 0},
		{row: 1, column: 0},
		{row: 2, column: 0},
		{row: 3, column: 0},
		{row: 4, column: 0},
		{row: 1, column: 3},
		{row: 3, column: 2},
		{row: 4, column: 3},
	],
};

const Y_LETTER = {
	letter: 'Y',
	nrRows: 5,
	nrColumns: 5,
	letterCells: [
		{row: 0, column: 0},
		{row: 0, column: 4},
		{row: 1, column: 1},
		{row: 1, column: 3},
		{row: 2, column: 2},
		{row: 3, column: 2},
		{row: 4, column: 2},
	],
};

const I_LETTER = {
	letter: 'I',
	nrRows: 5,
	nrColumns: 1,
	letterCells: [
		{row: 0, column: 0},
		{row: 1, column: 0},
		{row: 2, column: 0},
		{row: 3, column: 0},
		{row: 4, column: 0},
	],
};

const G_LETTER = {
	letter: 'G',
	nrRows: 5,
	nrColumns: 4,
	letterCells: [
		{row: 0, column: 1},
		{row: 0, column: 2},
		{row: 0, column: 3},
		{row: 1, column: 0},
		{row: 2, column: 0},
		{row: 3, column: 0},
		{row: 4, column: 1},
		{row: 4, column: 2},
		{row: 3, column: 3},
		{row: 2, column: 3},
		{row: 2, column: 2},
	],
};

export const SilkscreenFontPOC: React.FC<
	z.infer<typeof silkscreenFontPOCSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	// const LETTER = E_LETTER;
	// const LETTER = L_LETTER;
	// const LETTER = M_LETTER;
	// const LETTER = N_LETTER;
	// const LETTER = T_LETTER;
	// const LETTER = S_LETTER;
	// const LETTER = O_LETTER;
	// const LETTER = F_LETTER;
	// const LETTER = D_LETTER;
	// const LETTER = A_LETTER;
	// const LETTER = R_LETTER;
	// const LETTER = Y_LETTER;
	// const LETTER = I_LETTER;
	const LETTER = G_LETTER;

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
						Silkscreen Font
					</div>
				</div>

				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							color: theme.typography.subTitle.color,
							fontSize: 80,
							marginBottom: 50,
						}}
					>
						{LETTER.letter}
					</div>
				</div>

				<SilkscreenLetter cellSize={100} {...LETTER} />
			</div>

			<div style={{display: 'flex', justifyContent: 'center'}}>
				<div
					style={{
						display: 'flex',
						gap: 2 * 16,
						flexDirection: 'column',
						marginTop: 40,
					}}
				>
					<div style={{display: 'flex', gap: 4 * 16}}>
						<div style={{display: 'flex', gap: 2 * 16}}>
							<SilkscreenLetter cellSize={16} {...E_LETTER} showGrid={false} />
							<SilkscreenLetter cellSize={16} {...L_LETTER} showGrid={false} />
							<SilkscreenLetter cellSize={16} {...E_LETTER} showGrid={false} />
							<SilkscreenLetter cellSize={16} {...M_LETTER} showGrid={false} />
							<SilkscreenLetter cellSize={16} {...E_LETTER} showGrid={false} />
							<SilkscreenLetter cellSize={16} {...N_LETTER} showGrid={false} />
							<SilkscreenLetter cellSize={16} {...T_LETTER} showGrid={false} />
							<SilkscreenLetter cellSize={16} {...S_LETTER} showGrid={false} />
						</div>
						<div style={{display: 'flex', gap: 2 * 16}}>
							<SilkscreenLetter cellSize={16} {...O_LETTER} showGrid={false} />
							<SilkscreenLetter cellSize={16} {...F_LETTER} showGrid={false} />
						</div>
					</div>

					<div style={{display: 'flex', gap: (4 * 16) / 1.6}}>
						<div style={{display: 'flex', gap: (2 * 16) / 1.6}}>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...D_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...A_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...T_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...A_LETTER}
								showGrid={false}
							/>
						</div>
						<div style={{display: 'flex', gap: (2 * 16) / 1.6}}>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...S_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...T_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...O_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...R_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...Y_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...T_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...E_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...L_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...L_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...I_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...N_LETTER}
								showGrid={false}
							/>
							<SilkscreenLetter
								cellSize={16 / 1.6}
								{...G_LETTER}
								showGrid={false}
							/>
						</div>
					</div>
				</div>
			</div>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};

export const SilkscreenLetter: React.FC<{
	letter: string;
	letterCells: {row: number; column: number}[];
	nrColumns: number;
	nrRows: number;
	cellSize: number;
	showGrid?: boolean;
}> = ({letter, letterCells, nrColumns, nrRows, cellSize, showGrid = true}) => {
	// const cellSize = 100;

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
											fill="rgba(200,100,0,0.8)"
										>
											<g></g>
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
