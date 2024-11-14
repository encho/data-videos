import {AbsoluteFill} from 'remotion';

import {SilkscreenLetter} from './SilkscreenLetter';

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

export const ElementsLogo: React.FC<{cell_size: number}> = ({cell_size}) => {
	// const cell_size = 16;
	// const space = 2 * cell_size;
	const small_cell_size = cell_size / 1.6;

	const FONT_COLOR = '#707070';

	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', right: 40, top: 40}}>
				<div
					style={{
						display: 'flex',
						gap: 2 * cell_size,
						flexDirection: 'column',
					}}
				>
					<div style={{display: 'flex', gap: 4 * cell_size}}>
						<div style={{display: 'flex', gap: 2 * cell_size}}>
							<SilkscreenLetter
								cellSize={cell_size}
								{...E_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={cell_size}
								{...L_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={cell_size}
								{...E_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={cell_size}
								{...M_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={cell_size}
								{...E_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={cell_size}
								{...N_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={cell_size}
								{...T_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={cell_size}
								{...S_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
						</div>
						<div style={{display: 'flex', gap: 2 * cell_size}}>
							<SilkscreenLetter
								cellSize={cell_size}
								{...O_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={cell_size}
								{...F_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
						</div>
					</div>

					<div style={{display: 'flex', gap: 4 * small_cell_size}}>
						<div style={{display: 'flex', gap: 2 * small_cell_size}}>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...D_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...A_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...T_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...A_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
						</div>
						<div style={{display: 'flex', gap: 2 * small_cell_size}}>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...S_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...T_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...O_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...R_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...Y_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...T_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...E_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...L_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...L_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...I_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...N_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
							<SilkscreenLetter
								cellSize={small_cell_size}
								{...G_LETTER}
								showGrid={false}
								color={FONT_COLOR}
							/>
						</div>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
