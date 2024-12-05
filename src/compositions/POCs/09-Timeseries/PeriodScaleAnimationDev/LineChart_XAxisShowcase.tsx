// import { differenceInCalendarDays } from 'date-fns';
import {Position} from '../../../../acetti-layout/atoms/Position';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {TPeriodsScale} from '../../../../acetti-ts-periodsScale/periodsScale';
import {
	getIndicesAxisSpec,
	getDaysAxisSpec,
	getMonthStartsAxisSpec,
	getQuarterStartsAxisSpec,
	getSemesterStartsAxisSpec,
} from '../../../../acetti-ts-axis/utils/axisSpecs_xAxis';
import {Animated_XAxis} from '../utils/Animated_XAxis';
import {TPeriodScaleAnimationContext} from '../utils/usePeriodScaleAnimation';

import {
	getAxisSpecType,
	getAxisSpec,
} from '../utils/xAxisSpecUtils_periodScale';

export const LineChart_XAxisShowcase: React.FC<{
	periodScaleAnimation: TPeriodScaleAnimationContext;
	layoutAreas: {
		xAxis: TGridLayoutArea;
		xAxis_days: TGridLayoutArea;
		xAxis_monthStarts: TGridLayoutArea;
		xAxis_quarterStarts: TGridLayoutArea;
		xAxis_semesterStarts: TGridLayoutArea;
	};
}> = ({periodScaleAnimation, layoutAreas}) => {
	const fromPeriodScale =
		periodScaleAnimation.currentSliceInfo.periodsScaleFrom;
	const toPeriodScale = periodScaleAnimation.currentSliceInfo.periodsScaleTo;

	const fromSpecType = getAxisSpecType(fromPeriodScale);
	const toSpecType = getAxisSpecType(toPeriodScale);

	const axisSpecFrom = getAxisSpec(fromPeriodScale, fromSpecType);
	const axisSpecTo = getAxisSpec(toPeriodScale, toSpecType);

	// ***************************
	// the different x-axis specs:
	// ***************************

	// 1. days
	// const xAxisSpec_days_from = getDaysAxisSpec(fromPeriodScale);
	// const xAxisSpec_days_to = getDaysAxisSpec(toPeriodScale);

	// 2. month starts
	// const xAxisSpec_monthStarts_from = getMonthStartsAxisSpec(fromPeriodScale);
	// const xAxisSpec_monthStarts_to = getMonthStartsAxisSpec(toPeriodScale);

	// 3. quarter starts
	const xAxisSpec_quarterStarts_from =
		getQuarterStartsAxisSpec(fromPeriodScale);
	const xAxisSpec_quarterStarts_to = getQuarterStartsAxisSpec(toPeriodScale);

	// 4. semester starts
	const xAxisSpec_semesterStarts_from =
		getSemesterStartsAxisSpec(fromPeriodScale);
	const xAxisSpec_semesterStarts_to = getSemesterStartsAxisSpec(toPeriodScale);

	const xAxisDebugColors = {
		debugEnterColor: 'lime',
		debugUpdateColor: 'blue',
		debugExitColor: 'red',
	};

	return (
		<>
			<div
				style={{
					position: 'fixed',
					bottom: 50,
					right: 50,
					color: 'orange',
					zIndex: 1000,
					fontSize: 50,
				}}
			>
				Number of visible days:{' '}
				{periodScaleAnimation.periodsScale.getVisibleDomain_NumberOfDays()}
			</div>
			<Position
				position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
			>
				<Animated_XAxis
					periodsScaleAnimation={periodScaleAnimation}
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
				{/* <Animated_XAxis
					periodsScaleAnimation={periodScaleAnimation}
					axisSpecFrom={xAxisSpec_days_from}
					axisSpecTo={xAxisSpec_days_to}
					area={layoutAreas.xAxis}
					{...xAxisDebugColors}
				/> */}
			</Position>

			{/* month starts x axis */}
			<Position
				position={{
					left: layoutAreas.xAxis_monthStarts.x1,
					top: layoutAreas.xAxis_monthStarts.y1,
				}}
			>
				{/* <Animated_XAxis
					periodsScaleAnimation={periodScaleAnimation}
					axisSpecFrom={xAxisSpec_monthStarts_from}
					axisSpecTo={xAxisSpec_monthStarts_to}
					area={layoutAreas.xAxis}
					{...xAxisDebugColors}
				/> */}
			</Position>

			{/* quarter starts x axis */}
			<Position
				position={{
					left: layoutAreas.xAxis_quarterStarts.x1,
					top: layoutAreas.xAxis_quarterStarts.y1,
				}}
			>
				<Animated_XAxis
					periodsScaleAnimation={periodScaleAnimation}
					axisSpecFrom={xAxisSpec_quarterStarts_from}
					axisSpecTo={xAxisSpec_quarterStarts_to}
					area={layoutAreas.xAxis}
					{...xAxisDebugColors}
				/>
			</Position>

			{/* semester starts x axis */}
			<Position
				position={{
					left: layoutAreas.xAxis_semesterStarts.x1,
					top: layoutAreas.xAxis_semesterStarts.y1,
				}}
			>
				<Animated_XAxis
					periodsScaleAnimation={periodScaleAnimation}
					axisSpecFrom={xAxisSpec_semesterStarts_from}
					axisSpecTo={xAxisSpec_semesterStarts_to}
					area={layoutAreas.xAxis}
					{...xAxisDebugColors}
				/>
			</Position>
		</>
	);
};
