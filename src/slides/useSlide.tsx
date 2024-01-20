import {TGridLayoutAreaSpec, TGridRailSpec, useGridLayout} from '../acetti-viz';

export function useSlide({width, height}: {width: number; height: number}) {
	// TODO should be passed to a provider, s.t. we can use within all deeply nested children
	// const {baseline, baselines, ...} = useTypographyicLayout
	const baseline = height / 50;
	const baselines = (amount: number) => {
		return amount * baseline;
	};

	const rowsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: baselines(3), name: 'topPadding'},
		// {type: 'pixel', value: baselines(6), name: 'title'},
		{type: 'pixel', value: baselines(4.5), name: 'title'},
		{type: 'pixel', value: baselines(1.5), name: 'space'},
		{type: 'pixel', value: baselines(2.25), name: 'subTitle'},
		{type: 'pixel', value: baselines(5), name: 'bodyTopMargin'},
		{type: 'fr', value: 1, name: 'body'},
		{type: 'pixel', value: baselines(5), name: 'bottomPadding'},
	];

	const colsRailSpec: TGridRailSpec = [
		{type: 'pixel', value: baselines(6), name: 'leftPadding'},
		{type: 'fr', value: 1, name: 'body'},
		{type: 'pixel', value: baselines(6), name: 'rightPadding'},
	];

	const gridLayoutSpec = {
		padding: 0,
		columnGap: 0,
		rowGap: 0,
		rows: rowsRailSpec,
		columns: colsRailSpec,
		areas: {
			title: [
				{name: 'title'},
				{name: 'body'},
				{name: 'title'},
				{name: 'body'},
			] as TGridLayoutAreaSpec,
			subTitle: [
				{name: 'subTitle'},
				{name: 'body'},
				{name: 'subTitle'},
				{name: 'body'},
			] as TGridLayoutAreaSpec,
			body: [
				{name: 'body'},
				{name: 'body'},
				{name: 'body'},
				{name: 'body'},
			] as TGridLayoutAreaSpec,
		},
	};

	const layout = useGridLayout({width, height, gridLayoutSpec});

	return {layout, baselines};
}
