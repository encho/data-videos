import {colorPalettes} from './tailwindPalettes';
import {makeThemeGenerator} from './makeThemeGenerator';
import {ThemePalette} from './makeThemeGenerator';

// const GRAYS = colorPalettes.Zinc;
// const GRAYS = colorPalettes.Stone;
// const GRAYS = colorPalettes.Slate;
const GRAYS = colorPalettes.Gray;
// const GRAYS = colorPalettes.Neutral;
// const GRAYS = colorPalettes.Blue;
// const GRAYS = colorPalettes.Orange;
// const GRAYS = colorPalettes.Emerald;

const palette: ThemePalette = {
	// grays: GRAYS,
	background: {
		main: 'brown',
		soft: 'yellow',
	},
	typography: {
		title: {
			main: GRAYS['900'],
			soft: GRAYS['400'],
		},
		subtitle: {
			main: GRAYS['500'],
			soft: GRAYS['400'],
		},
		datavizLabel: {
			main: GRAYS['500'],
			soft: GRAYS['400'],
		},
		datavizValueLabel: {
			main: GRAYS['500'],
			soft: GRAYS['400'],
		},
		dataSource: {
			main: GRAYS['500'],
			soft: GRAYS['400'],
		},
		logo: {
			main: GRAYS['500'],
			soft: GRAYS['400'],
		},
		axisTickLabel: {
			main: GRAYS['500'],
			soft: GRAYS['400'],
		},
		axisTick: {
			main: GRAYS['500'],
			soft: GRAYS['400'],
		},
		axisLine: {
			main: GRAYS['500'],
			soft: GRAYS['400'],
		},
	},
	data: {
		grays: GRAYS,
		tenColors: {
			0: {main: GRAYS['100']},
			1: {main: 'magenta'},
			2: {main: 'magenta'},
			3: {main: 'magenta'},
			4: {main: 'magenta'},
			5: {main: 'magenta'},
			6: {main: 'magenta'},
			7: {main: 'magenta'},
			8: {main: 'magenta'},
			9: {main: 'magenta'},
		},
	},
};

export const theme = makeThemeGenerator({palette});
