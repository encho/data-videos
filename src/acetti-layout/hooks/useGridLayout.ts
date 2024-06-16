import {debounce} from 'lodash';
import {useCallback, useEffect, useState} from 'react';

import {createGridLayout} from '../gridLayout';
import type {TGridLayoutSpec} from '../types2';

type TUseGridLayout = {
	width: number;
	height: number;
	gridLayoutSpec: TGridLayoutSpec;
};

export default function useGridLayout({
	width,
	height,
	gridLayoutSpec,
}: TUseGridLayout) {
	const [gridLayout, setGridLayout] = useState(
		createGridLayout(gridLayoutSpec, {width, height})
	);

	const updateGridLayout = useCallback(
		debounce((_gridLayoutSpec, {width: _width, height: _height}) => {
			const updatedGridLayout = createGridLayout(_gridLayoutSpec, {
				width: _width,
				height: _height,
			});
			setGridLayout(updatedGridLayout);
		}, 1000 / 15),
		[]
	);

	useEffect(() => {
		updateGridLayout(gridLayoutSpec, {width, height});
	}, [width, height, gridLayoutSpec, updateGridLayout]);

	return gridLayout;
}
