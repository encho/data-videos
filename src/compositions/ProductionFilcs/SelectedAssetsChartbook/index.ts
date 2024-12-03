import {
	SelectedAssetsChartbookComposition,
	selectedAssetsChartbookSchema,
} from './SelectedAssetsChartbookComposition';
import {calculateMetadata} from './calculateMetadata';

export const SelectedAssetsChartbook = {
	Composition: SelectedAssetsChartbookComposition,
	schema: selectedAssetsChartbookSchema,
	calculateMetadata,
};
