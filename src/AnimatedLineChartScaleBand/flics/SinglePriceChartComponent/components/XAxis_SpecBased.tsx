import {getMonth} from 'date-fns';
import invariant from 'tiny-invariant';
import {number} from 'zod';

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
	const TICK_LINE_SIZE = 24;
	const TICK_TEXT_FONT_SIZE = 24;
	const TICK_TEXT_FONT_WEIGHT = 500;

	// TODO the appropriate SPEC type should be inferred given the:
	// - visible date range
	// - width of the area
	// - font size
	// - etc...
	// const visibleDates = periodsScale.getVisibleDomainDates()
	const numberOfVisibleDays = periodsScale.getVisibleDomain_NumberOfDays();

	const SPEC_TYPE = numberOfVisibleDays < 200 ? 'monthStarts' : 'quarterStarts';

	// const SPEC_TYPE = 'monthStarts';
	// const SPEC_TYPE = 'quarterStarts';

	const axisSpecFns = {
		monthStarts: getMonthStartsAxisSpec,
		quarterStarts: getQuarterStartsAxisSpec,
	};

	const axisSpec = axisSpecFns[SPEC_TYPE](periodsScale, dates);

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

// TODO pass more info, e.g. area width?
function getMonthStartsAxisSpec(
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

function getQuarterStartsAxisSpec(
	periodsScale: TPeriodsScale,
	dates: Date[]
): TAxisSpec {
	const ticksDates = generateQuarterStartsNearestDates(dates);

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

function generateQuarterStartsNearestDates(dates: Date[]): Date[] {
	const datesList: Date[] = [];

	for (let i = 0; i < dates.length; i++) {
		const currentDate = dates[i];
		const monthNumber = currentDate.getMonth() + 1;

		const isFirstMonthOfQuarter =
			monthNumber === 1 ||
			monthNumber === 4 ||
			monthNumber === 7 ||
			monthNumber === 10;

		if (i !== 0) {
			const previousDate = dates[i - 1];
			const previousMonthNumber = previousDate.getMonth() + 1;
			const prevDateNoQuarterStartMonth =
				previousMonthNumber != 1 &&
				previousMonthNumber != 4 &&
				previousMonthNumber != 7 &&
				previousMonthNumber != 10;

			if (isFirstMonthOfQuarter && prevDateNoQuarterStartMonth) {
				datesList.push(currentDate);
			}
		}
	}

	return datesList;
}

function getMonthName(date: Date): string {
	// Use options to get the month name in the desired language
	// const monthName = date.toLocaleString('default', {month: 'long'});
	const monthName = date.toLocaleString('default', {month: 'short'});
	return monthName;
}
