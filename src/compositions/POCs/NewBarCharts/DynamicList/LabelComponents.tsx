import {ThemeType} from '../../../../acetti-themes/themeTypes';

export type TBarChartLabelComponent = React.ComponentType<{
	children: string;
	id: string;
	animateExit: boolean;
	animateEnter: boolean;
	baseline: number;
	theme: ThemeType;
}>;

export type TBarChartValueLabelComponent = React.ComponentType<{
	children: string;
	id: string;
	animateExit?: boolean;
	animateEnter?: boolean;
	baseline: number;
	theme: ThemeType;
	value: number; // TODO make compulsory
}>;
