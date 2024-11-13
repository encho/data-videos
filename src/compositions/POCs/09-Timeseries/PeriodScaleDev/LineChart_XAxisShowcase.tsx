import {Position} from '../../../../acetti-ts-base/Position';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {TPeriodsScale} from '../../../../acetti-ts-periodsScale/periodsScale';
import {
	getIndicesAxisSpec,
	getDaysAxisSpec,
	getMonthStartsAxisSpec,
	getQuarterStartsAxisSpec,
} from '../../../../acetti-ts-axis/utils/axisSpecs_xAxis';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';
import {Animated_XAxis} from '../YScaleContextDev/Animated_XAxis';

const AXIS_SPEC_FUNCTIONS = {
	indices: getIndicesAxisSpec,
	days: getDaysAxisSpec,
	monthStarts: getMonthStartsAxisSpec,
	quarterStarts: getQuarterStartsAxisSpec,
} as const;

type TSpecType = keyof typeof AXIS_SPEC_FUNCTIONS;

const getAxisSpecType = (periodsScale: TPeriodsScale): TSpecType => {
	const numberOfVisibleDaysFrom = periodsScale.getVisibleDomain_NumberOfDays();
	const SPEC_TYPE =
		numberOfVisibleDaysFrom < 20
			? 'days'
			: numberOfVisibleDaysFrom < 200
			? 'monthStarts'
			: 'quarterStarts';

	return SPEC_TYPE;
};

const getAxisSpec = (periodsScale: TPeriodsScale, specType: TSpecType) => {
	const axisSpec = AXIS_SPEC_FUNCTIONS[specType](periodsScale);
	return axisSpec;
};

export const LineChart_XAxisShowcase: React.FC<{
	periodScaleAnimationContext: TPeriodScaleAnimationContext;
	layoutAreas: {
		xAxis: TGridLayoutArea;
		xAxis_days: TGridLayoutArea;
		xAxis_monthStarts: TGridLayoutArea;
		xAxis_quarterStarts: TGridLayoutArea;
	};
}> = ({periodScaleAnimationContext, layoutAreas}) => {
	const fromPeriodScale =
		periodScaleAnimationContext.currentSliceInfo.periodsScaleFrom;
	const toPeriodScale =
		periodScaleAnimationContext.currentSliceInfo.periodsScaleTo;

	const fromSpecType = getAxisSpecType(fromPeriodScale);
	const toSpecType = getAxisSpecType(toPeriodScale);

	const axisSpecFrom = getAxisSpec(fromPeriodScale, fromSpecType);
	const axisSpecTo = getAxisSpec(toPeriodScale, toSpecType);

	// ***************************
	// the different x-axis specs:
	// ***************************

	// 1. days
	const xAxisSpec_days_from = getDaysAxisSpec(fromPeriodScale);
	const xAxisSpec_days_to = getDaysAxisSpec(toPeriodScale);

	// 2. month starts
	const xAxisSpec_monthStarts_from = getMonthStartsAxisSpec(fromPeriodScale);
	const xAxisSpec_monthStarts_to = getMonthStartsAxisSpec(toPeriodScale);

	// 3. quarter starts
	const xAxisSpec_quarterStarts_from =
		getQuarterStartsAxisSpec(fromPeriodScale);
	const xAxisSpec_quarterStarts_to = getQuarterStartsAxisSpec(toPeriodScale);

	const xAxisDebugColors = {
		debugEnterColor: 'lime',
		debugUpdateColor: 'blue',
		debugExitColor: 'red',
	};

	return (
		<>
			<Position
				position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
			>
				<Animated_XAxis
					periodsScaleAnimation={periodScaleAnimationContext}
					axisSpecFrom={axisSpecFrom}
					axisSpecTo={axisSpecTo}
					area={layoutAreas.xAxis}
					{...xAxisDebugColors}
				/>
			</Position>

			{/* days x axis */}
			<Position
				position={{
					left: layoutAreas.xAxis_days.x1,
					top: layoutAreas.xAxis_days.y1,
				}}
			>
				<Animated_XAxis
					periodsScaleAnimation={periodScaleAnimationContext}
					axisSpecFrom={xAxisSpec_days_from}
					axisSpecTo={xAxisSpec_days_to}
					area={layoutAreas.xAxis}
					{...xAxisDebugColors}
				/>
			</Position>

			{/* month starts x axis */}
			<Position
				position={{
					left: layoutAreas.xAxis_monthStarts.x1,
					top: layoutAreas.xAxis_monthStarts.y1,
				}}
			>
				<Animated_XAxis
					periodsScaleAnimation={periodScaleAnimationContext}
					axisSpecFrom={xAxisSpec_monthStarts_from}
					axisSpecTo={xAxisSpec_monthStarts_to}
					area={layoutAreas.xAxis}
					{...xAxisDebugColors}
				/>
			</Position>

			{/* quarter starts x axis */}
			<Position
				position={{
					left: layoutAreas.xAxis_quarterStarts.x1,
					top: layoutAreas.xAxis_quarterStarts.y1,
				}}
			>
				<Animated_XAxis
					periodsScaleAnimation={periodScaleAnimationContext}
					axisSpecFrom={xAxisSpec_quarterStarts_from}
					axisSpecTo={xAxisSpec_quarterStarts_to}
					area={layoutAreas.xAxis}
					{...xAxisDebugColors}
				/>
			</Position>
		</>
	);
};
