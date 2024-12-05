import {TPeriodsScale} from '../../../../acetti-ts-periodsScale/periodsScale';
import {
	getIndicesAxisSpec,
	getDaysAxisSpec,
	getMonthStartsAxisSpec,
	getQuarterStartsAxisSpec,
	getSemesterStartsAxisSpec,
	getYearStartsAxisSpec,
} from '../../../../acetti-ts-axis/utils/axisSpecs_xAxis';

const AXIS_SPEC_FUNCTIONS = {
	indices: getIndicesAxisSpec,
	days: getDaysAxisSpec,
	monthStarts: getMonthStartsAxisSpec,
	quarterStarts: getQuarterStartsAxisSpec,
	semesterStarts: getSemesterStartsAxisSpec,
	yearStarts: getYearStartsAxisSpec,
} as const;

type TSpecType = keyof typeof AXIS_SPEC_FUNCTIONS;

// TODO this has actually to be used by timeseries charts...
export const getAxisSpecType = (
	periodsScale: TPeriodsScale
	// xAxisAreaWidth: number, // TODO make dependant also on width (user based)
	// theme: ThemeType, // TODO make dependant also on font size (user based)
	// baseline: number // TODO make dependant also on font size (user based)
): TSpecType => {
	const numberOfVisibleDaysFrom = periodsScale.getVisibleDomain_NumberOfDays();
	const SPEC_TYPE =
		numberOfVisibleDaysFrom < 20
			? 'days'
			: numberOfVisibleDaysFrom < 200
			? 'monthStarts'
			: numberOfVisibleDaysFrom < 900
			? 'quarterStarts'
			: numberOfVisibleDaysFrom < 2000
			? 'semesterStarts'
			: 'yearStarts';

	return SPEC_TYPE;
};

export const getAxisSpec = (
	periodsScale: TPeriodsScale,
	specType: TSpecType
) => {
	const axisSpec = AXIS_SPEC_FUNCTIONS[specType](periodsScale);
	return axisSpec;
};
