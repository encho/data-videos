import {TGridLayoutArea} from '../../acetti-layout';
import {TPeriodsScale} from '../../acetti-ts-periodsScale/periodsScale';

export type TTheme_XAxis = {
	fontSize: number;
	strokeWidth: number;
	color: string;
	tickColor: string;
};

export const AnimatedXAxis_MonthStarts: React.FC<{
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

			{/* <rect x={0} y={0} width={area.width} height={area.height} fill="black" /> */}

			{dates.map((date, i) => {
				if (monthIndicators[i] === 1) {
					const band = periodsScale.getBandFromDate(date);
					return (
						<g clipPath="url(#xAxisAreaClipPath)" transform="translate(0,0)">
							<line
								x1={band.x1}
								x2={band.x1}
								y1={0}
								y2={TICK_LINE_SIZE}
								stroke={theme.tickColor}
								strokeWidth={theme.strokeWidth}
							/>
							<text
								textAnchor="left"
								alignmentBaseline="baseline"
								fill={theme.color}
								fontSize={TICK_TEXT_FONT_SIZE}
								fontWeight={TICK_TEXT_FONT_WEIGHT}
								x={band.x1 + TICK_TEXT_LEFT_PADDING}
								y={TICK_TEXT_FONT_SIZE}
							>
								{getMonthName(date)}
							</text>
						</g>
					);
				}
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
