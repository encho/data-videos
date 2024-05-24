import {getMonth} from 'date-fns';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../../../../acetti-viz';
import {TPeriodsScale} from '../../../periodsScale/periodsScale';

// type TTickSpecMapped = {
// 	id: string;
// 	type: 'MAPPED_VALUE';
// 	value: number;
// };

type TTickSpec = {
	id: string;
	value: number;
	// type: 'DOMAIN_VALUE';
	// mappedValue: number;
};

// type TTickSpec = TTickSpecNormal | TTickSpecMapped;

// type TLabelSpecNormal = {
// 	id: string;
// 	value: Date;
// 	mappedValue: number;
// 	label: string;
// 	type: 'DOMAIN_VALUE';
// 	textAnchor?: 'start' | 'middle' | 'end';
// };

type TLabelSpec = {
	id: string;
	value: number;
	label: string;
	// type: 'DOMAIN_VALUE';
	textAnchor?: 'start' | 'middle' | 'end';
};

// type TLabelSpecNormal = {
// 	id: string;
// 	value: Date;
// 	label: string;
// 	type: 'DOMAIN_VALUE';
// 	textAnchor?: 'start' | 'middle' | 'end';
// };

// type TLabelSpecMapped = {
// 	id: string;
// 	value: number;
// 	label: string;
// 	type: 'MAPPED_VALUE';
// 	textAnchor?: 'start' | 'middle' | 'end';
// };

// type TLabelSpec = TLabelSpecNormal | TLabelSpecMapped;

export type TAxisSpec = {
	// scale: BandScale here
	ticks: TTickSpec[];
	labels: TLabelSpec[];
};

// TODO get key from global Theme
export type TTheme_XAxis = {
	fontSize: number;
	strokeWidth: number;
	color: string;
	tickColor: string;
};

export const XAxis_SpecBased: React.FC<{
	area: TGridLayoutArea;
	dates: Date[];
	// TODO periodsScaleStart (for transitioning)
	// TODO periodsScaleEnd (for transitioning)
	// from={frame}? (for transitioning) - or wrap in Sequence?
	// to={frame}? (for transitioning) - or wrap in Sequence?
	periodsScale: TPeriodsScale;
	theme: TTheme_XAxis;
}> = ({area, dates, periodsScale, theme}) => {
	// TODO ideally these are to be found in theme// BUT multiple size options somwehow...
	const TICK_LINE_SIZE = 24;
	const TICK_TEXT_FONT_SIZE = 24;
	const TICK_TEXT_FONT_WEIGHT = 500;
	const TICK_TEXT_LEFT_PADDING = 8;

	const SPEC_TYPE = 'month_starts';

	const axisSpec = getMonthStartsAxisSpec(periodsScale, dates);
	// const SPEC_TYPE = "quarter_start";

	// TODO these things inside some Axis namespace/object...
	// QUICK FIX: this is relatively inefficient, as we compute all monthstartsindicators for all dates
	const monthStartsIndicators = generateMonthStartIndicatorList(dates);

	// how many monthStartsIndicators are visible?
	const roundedVisibleIndices = periodsScale.getRoundedVisibleDomainIndices();
	const slicedMonthStartsIndicators = monthStartsIndicators.slice(
		roundedVisibleIndices[0],
		roundedVisibleIndices[1] + 1
	);
	// const  = array.reduce((acc, curr) => acc + curr, 0);
	const amountSignals = slicedMonthStartsIndicators.filter(
		(it) => it === 1
	).length;

	// const monthIndicators =
	// 	amountSignals > 6
	// 		? generateQuarterStartIndicatorList(dates)
	// 		: monthStartsIndicators;
	// const monthIndicators = monthStartsIndicators;

	// const monthIndicators = generateQuarterStartIndicatorList(dates);
	const monthIndicators = monthStartsIndicators;

	return (
		<svg
			width={area.width}
			height={area.height}
			style={{
				overflow: 'visible',
			}}
		>
			<defs>
				<clipPath id="xAxisAreaClipPath">
					<rect x={0} y={0} width={area.width} height={area.height} />
				</clipPath>
			</defs>

			{axisSpec.ticks.map((xTick) => {
				return (
					<g clipPath="url(#xAxisAreaClipPath)" transform="translate(0,0)">
						<line
							x1={xTick.value}
							x2={xTick.value}
							y1={0}
							y2={TICK_LINE_SIZE}
							stroke="yellow"
							strokeWidth={4}
						/>
					</g>
				);
			})}

			{axisSpec.labels.map((xLabel) => {
				return (
					<g clipPath="url(#xAxisAreaClipPath)" transform="translate(0,0)">
						<text
							textAnchor="left"
							alignmentBaseline="baseline"
							// fill={theme.color}
							fill={'yellow'}
							fontSize={TICK_TEXT_FONT_SIZE}
							fontWeight={TICK_TEXT_FONT_WEIGHT}
							x={xLabel.value}
							y={TICK_TEXT_FONT_SIZE}
						>
							{xLabel.label}
						</text>
					</g>
				);
			})}
		</svg>
	);
};

function generateMonthStartIndicatorList(dates: Date[]): number[] {
	const indicatorList: number[] = [];

	for (let i = 0; i < dates.length; i++) {
		const currentDate = dates[i];
		const isFirstDayOfMonth = currentDate.getDate() === 1;

		// Check if previous date is from a different month
		const isPrecedingMonth =
			i > 0 && dates[i - 1].getMonth() !== currentDate.getMonth();

		// If it's the first day of the month or the previous date is from a different month, mark as 1
		indicatorList.push(isFirstDayOfMonth || isPrecedingMonth ? 1 : 0);
	}

	return indicatorList;
}

function generateMonthStartsNearestDates(dates: Date[]): Date[] {
	const datesList: Date[] = [];

	for (let i = 0; i < dates.length; i++) {
		const currentDate = dates[i];
		const isFirstDayOfMonth = currentDate.getDate() === 1;

		// Check if previous date is from a different month
		const isPrecedingMonth =
			i > 0 && dates[i - 1].getMonth() !== currentDate.getMonth();

		// If it's the first day of the month or the previous date is from a different month, mark as 1
		if (isPrecedingMonth || isFirstDayOfMonth) {
			datesList.push(currentDate);
		}
	}
	return datesList;
}

function getMonthStartsAxisSpec(
	// TODO check if scale is necessary here
	periodsScale: TPeriodsScale,
	dates: Date[]
): TAxisSpec {
	const ticksDates = generateMonthStartsNearestDates(dates);

	const ticks = ticksDates.map((date) => {
		const id = date.getTime().toString();
		return {
			id,
			value: periodsScale.getBandFromDate(date).x1,
		};
	});

	const PADDING = 10;

	const labels = ticksDates.map((date) => {
		const id = date.getTime().toString();
		return {
			id,
			value: periodsScale.getBandFromDate(date).x1 + PADDING,
			textAnchor: 'start' as const,
			label: getMonthName(date),
		};
	});

	return {ticks, labels};
}

// TODO rename: getQuarterStartsPointers
function generateQuarterStartIndicatorList(dates: Date[]): number[] {
	const indicatorList: number[] = [];

	for (let i = 0; i < dates.length; i++) {
		const currentDate = dates[i];
		const monthNumber = currentDate.getMonth() + 1;

		const isFirstMonthOfQuarter =
			monthNumber === 1 ||
			monthNumber === 4 ||
			monthNumber === 7 ||
			monthNumber === 10;

		// TODO quick fix improve on this
		if (i === 0) {
			// indicatorList.push(1);
			indicatorList.push(0);
		} else {
			const previousDate = dates[i - 1];
			const previousMonthNumber = previousDate.getMonth() + 1;
			const prevDateNoQuarterStartMonth =
				previousMonthNumber != 1 &&
				previousMonthNumber != 4 &&
				previousMonthNumber != 7 &&
				previousMonthNumber != 10;

			if (isFirstMonthOfQuarter && prevDateNoQuarterStartMonth) {
				indicatorList.push(1);
			} else {
				indicatorList.push(0);
			}
		}
	}

	return indicatorList;
}

function getMonthName(date: Date): string {
	// Use options to get the month name in the desired language
	// const monthName = date.toLocaleString('default', {month: 'long'});
	const monthName = date.toLocaleString('default', {month: 'short'});
	return monthName;
}
