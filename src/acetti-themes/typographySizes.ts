export const LABEL_SIZE_FACTOR = 1.25;
export const LABEL_MARGIN_TOP_FACTOR = 0.5;

export const KPI_SIZE_FACTOR = 2;

export const SPACE_MEDIUM_FACTOR = 3;

// Space
export const getSpaceMedium = (baseFontSize: number) =>
	baseFontSize * SPACE_MEDIUM_FACTOR;

// Label
export const getLabelFontSize = (baseFontSize: number) =>
	baseFontSize * LABEL_SIZE_FACTOR;

export const getLabelMarginTop = (baseFontSize: number) =>
	baseFontSize * LABEL_MARGIN_TOP_FACTOR;

// KPI
export const getKPIFontSize = (baseFontSize: number) =>
	baseFontSize * KPI_SIZE_FACTOR;
