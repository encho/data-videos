import {Position} from '../../../../acetti-layout/atoms/Position';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {Animated_XAxis} from '../utils/Animated_XAxis';
import {TPeriodScaleAnimationContext} from '../utils/usePeriodScaleAnimation';
import {usePage} from '../../../../acetti-components/PageContext';

import {
	getAxisSpecType,
	getAxisSpec,
	TAxisSpecTypeEnum,
	getWidthInTickLabelSize,
} from '../utils/xAxisSpecUtils_periodScale';

export const LineChart_XAxisShowcase: React.FC<{
	periodScaleAnimation: TPeriodScaleAnimationContext;
	layoutAreas: {
		xAxis: TGridLayoutArea;
		xAxis_days: TGridLayoutArea;
		xAxis_monthStarts: TGridLayoutArea;
		xAxis_quarterStarts: TGridLayoutArea;
		xAxis_semesterStarts: TGridLayoutArea;
		xAxis_yearStarts: TGridLayoutArea;
	};
}> = ({periodScaleAnimation, layoutAreas}) => {
	const {baseline, theme} = usePage();

	const fromPeriodScale =
		periodScaleAnimation.currentSliceInfo.periodsScaleFrom;
	const toPeriodScale = periodScaleAnimation.currentSliceInfo.periodsScaleTo;

	const fromSpecType = getAxisSpecType({
		periodsScale: fromPeriodScale,
		theme,
		baseline,
		width: layoutAreas.xAxis.width,
	});

	const toSpecType = getAxisSpecType({
		periodsScale: toPeriodScale,
		theme,
		baseline,
		width: layoutAreas.xAxis.width,
	});

	const axisSpecFrom = getAxisSpec(fromPeriodScale, fromSpecType);
	const axisSpecTo = getAxisSpec(toPeriodScale, toSpecType);

	const xAxisDebugColors = {
		debugEnterColor: 'lime',
		debugUpdateColor: 'blue',
		debugExitColor: 'red',
	};

	const numberOfVisibleDays =
		periodScaleAnimation.periodsScale.getVisibleDomain_NumberOfDays();

	// this metric is used in getAxisSpecType to determine wheter we have
	// a scenario with large or small Fonts, relative to the x-axis area width
	const widthInTickLabelSize = getWidthInTickLabelSize({
		theme,
		baseline,
		width: layoutAreas.xAxis.width,
	});

	return (
		<>
			<div
				style={{
					position: 'fixed',
					bottom: 70,
					right: 70,
					color: 'red',
					zIndex: 1000,
					fontSize: 50,
				}}
			>
				<div>
					Number of visible days:{' '}
					<span style={{fontWeight: 800}}>{numberOfVisibleDays}</span>
				</div>
				<div>
					Width in TickLabel size:{' '}
					<span style={{fontWeight: 800}}>{widthInTickLabelSize}</span>
				</div>
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

			{numberOfVisibleDays < 500 ? (
				<LineChart_XAxis_Specific
					axisSpecType="days"
					area={layoutAreas.xAxis_days}
					periodScaleAnimation={periodScaleAnimation}
				/>
			) : null}

			{numberOfVisibleDays < 2500 ? (
				<LineChart_XAxis_Specific
					axisSpecType="monthStarts"
					area={layoutAreas.xAxis_monthStarts}
					periodScaleAnimation={periodScaleAnimation}
				/>
			) : null}

			{/* quarter starts x axis */}
			<LineChart_XAxis_Specific
				axisSpecType="quarterStarts"
				area={layoutAreas.xAxis_quarterStarts}
				periodScaleAnimation={periodScaleAnimation}
			/>

			{/* semester starts x axis */}
			<LineChart_XAxis_Specific
				axisSpecType="semesterStarts"
				area={layoutAreas.xAxis_semesterStarts}
				periodScaleAnimation={periodScaleAnimation}
			/>

			{/* year starts x axis */}
			<LineChart_XAxis_Specific
				axisSpecType="yearStarts"
				area={layoutAreas.xAxis_yearStarts}
				periodScaleAnimation={periodScaleAnimation}
			/>
		</>
	);
};

export const LineChart_XAxis_Specific: React.FC<{
	axisSpecType: TAxisSpecTypeEnum;
	periodScaleAnimation: TPeriodScaleAnimationContext;
	area: TGridLayoutArea;
}> = ({periodScaleAnimation, area, axisSpecType}) => {
	const fromPeriodScale =
		periodScaleAnimation.currentSliceInfo.periodsScaleFrom;
	const toPeriodScale = periodScaleAnimation.currentSliceInfo.periodsScaleTo;

	const xAxisSpecFrom = getAxisSpec(fromPeriodScale, axisSpecType);
	const xAxisSpecTo = getAxisSpec(toPeriodScale, axisSpecType);

	const xAxisDebugColors = {
		debugEnterColor: 'lime',
		debugUpdateColor: 'blue',
		debugExitColor: 'red',
	};

	return (
		<Position position={{left: area.x1, top: area.y1}}>
			<Animated_XAxis
				periodsScaleAnimation={periodScaleAnimation}
				axisSpecFrom={xAxisSpecFrom}
				axisSpecTo={xAxisSpecTo}
				area={area}
				{...xAxisDebugColors}
			/>
		</Position>
	);
};
