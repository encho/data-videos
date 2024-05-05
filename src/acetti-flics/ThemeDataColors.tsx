import {ColorsList} from './ColorsList';
import {ThemeType} from '../acetti-themes/themeTypes';

type TDataColors = ThemeType['dataColors'];

// TODO React.FC
export const ThemeDataColors = ({
	dataColors,
	width = 500,
}: {
	width?: number;
	dataColors: TDataColors;
}) => {
	const colorsList = dataColors.map((it, i) => {
		return {
			color: it.BASE,
			label: `dataColors[${i}]`,
		};
	});

	return <ColorsList colorsList={colorsList} width={width} />;
};
