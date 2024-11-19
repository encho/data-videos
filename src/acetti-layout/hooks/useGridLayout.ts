import {debounce} from 'lodash';
import {useCallback, useEffect, useState} from 'react';

import {createGridLayout} from '../gridLayout';
import type {TGridLayoutSpec} from '../types2';

type TUseGridLayout = {
	width?: number;
	height?: number;
	gridLayoutSpec: TGridLayoutSpec;
};

// TODO: when the gridLayoutSpec changes (and not the height or width) a problem arises:
// for a brief amount of time the returned gridLayout is not in sync with the gridLayoutSpec
// leading to difficult to debug errors, as the expected gridLayout is not the one which is briefly returned
// QUICK-FIX for those cases, at the moment something like:
// const gridLayout = useMemo(() => {
// 	return createGridLayout(gridLayoutSpec, {
// 		width,
// 		height,
// 	});
// }, [width, height, gridLayoutSpec]);
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
