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
import {ElementsLogo} from './ElementsLogo';
import {SilkscreenLetter} from './SilkscreenLetter';

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
							fontSize: 80,
							marginTop: 140,
							fontWeight: 700,
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

				<SilkscreenLetter cellSize={60} {...LETTER} />
			</div>

			<ElementsLogo cell_size={5.5} />

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
