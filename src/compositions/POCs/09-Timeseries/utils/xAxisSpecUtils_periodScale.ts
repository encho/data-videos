import {TPeriodsScale} from '../../../../acetti-ts-periodsScale/periodsScale';
import {
	getIndicesAxisSpec,
	getDaysAxisSpec,
	getMonthStartsAxisSpec,
	getQuarterStartsAxisSpec,
	getSemesterStartsAxisSpec,
	getYearStartsAxisSpec,
} from '../../../../acetti-ts-axis/utils/axisSpecs_xAxis';
import {ThemeType} from '../../../../acetti-themes/themeTypes';

const AXIS_SPEC_FUNCTIONS = {
	indices: getIndicesAxisSpec,
	days: getDaysAxisSpec,
	monthStarts: getMonthStartsAxisSpec,
	quarterStarts: getQuarterStartsAxisSpec,
	semesterStarts: getSemesterStartsAxisSpec,
	yearStarts: getYearStartsAxisSpec,
} as const;

export type TAxisSpecTypeEnum = keyof typeof AXIS_SPEC_FUNCTIONS;

// // TODO this has actually to be used by timeseries charts...
// export const getAxisSpecType = (
// 	periodsScale: TPeriodsScale
// 	// xAxisAreaWidth: number, // TODO make dependant also on width (user based)
// 	// theme: ThemeType, // TODO make dependant also on font size (user based)
// 	// baseline: number // TODO make dependant also on font size (user based)
// ): TAxisSpecTypeEnum => {
// 	const numberOfVisibleDaysFrom = periodsScale.getVisibleDomain_NumberOfDays();
// 	const SPEC_TYPE =
// 		numberOfVisibleDaysFrom < 20
// 			? 'days'
// 			: numberOfVisibleDaysFrom < 200
// 			? 'monthStarts'
// 			: numberOfVisibleDaysFrom < 900
// 			? 'quarterStarts'
// 			: numberOfVisibleDaysFrom < 2000
// 			? 'semesterStarts'
// 			: 'yearStarts';

// 	return SPEC_TYPE;
// };

export function getWidthInTickLabelSize({
	theme,
	baseline,
	width,
}: {
	theme: ThemeType;
	baseline: number;
	width: number;
}) {
	const tickLabelCapheightInPixels =
		theme.typography.textStyles.datavizTickLabel.capHeightInBaselines *
		baseline;

	return width / tickLabelCapheightInPixels;
}

export const getAxisSpecType = ({
	periodsScale,
	width,
	baseline,
	theme,
}: {
	periodsScale: TPeriodsScale;
	width: number;
	baseline: number;
	theme: ThemeType;
}): TAxisSpecTypeEnum => {
	const numberOfVisibleDays = periodsScale.getVisibleDomain_NumberOfDays();

	const widthInTickLabelSize = getWidthInTickLabelSize({
		theme,
		baseline,
		width,
	});

	// relatively large font
	if (widthInTickLabelSize < 40) {
		return numberOfVisibleDays < 20
			? 'days'
			: numberOfVisibleDays < 200
			? 'monthStarts'
			: numberOfVisibleDays < 900
			? 'quarterStarts'
			: numberOfVisibleDays < 1500
			? 'semesterStarts'
			: 'yearStarts';
	}

	return numberOfVisibleDays < 20
		? 'days'
		: numberOfVisibleDays < 200
		? 'monthStarts'
		: numberOfVisibleDays < 900
		? 'quarterStarts'
		: numberOfVisibleDays < 2000
		? 'semesterStarts'
		: 'yearStarts';
};

export const getAxisSpec = (
	periodsScale: TPeriodsScale,
	specType: TAxisSpecTypeEnum
) => {
	const axisSpec = AXIS_SPEC_FUNCTIONS[specType](periodsScale);
	return axisSpec;
};
