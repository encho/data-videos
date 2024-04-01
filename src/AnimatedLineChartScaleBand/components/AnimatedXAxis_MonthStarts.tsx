import {TGridLayoutArea} from '../../acetti-viz';
import {TPeriodsScale} from '../periodsScale';

export const AnimatedXAxis_MonthStarts: React.FC<{
	linesColor: string;
	area: TGridLayoutArea;
	dates: Date[];
	periodsScale: TPeriodsScale;
}> = ({linesColor, area, dates, periodsScale}) => {
	// TODO these things inside some Axis namespace/object...
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

	const monthIndicators =
		amountSignals > 6
			? generateQuarterStartIndicatorList(dates)
			: monthStartsIndicators;

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

			{dates.map((date, i) => {
				// if (monthStartsIndicators[i] === 1) {
				if (monthIndicators[i] === 1) {
					const band = periodsScale.getBandFromDate(date);
					return (
						<g clipPath="url(#xAxisAreaClipPath)" transform="translate(0,0)">
							<line
								x1={band.x1}
								x2={band.x1}
								y1={0}
								y2={25}
								stroke={linesColor}
								strokeWidth={3}
							/>
							<text
								textAnchor="left"
								alignmentBaseline="baseline"
								fill={linesColor}
								fontSize={16}
								fontWeight={500}
								x={band.x1 + 12}
								y={25}
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
			indicatorList.push(1);
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
	const monthName = date.toLocaleString('default', {month: 'long'});
	return monthName;
}
