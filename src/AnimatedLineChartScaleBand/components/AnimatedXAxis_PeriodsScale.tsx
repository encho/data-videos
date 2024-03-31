import {TGridLayoutArea} from '../../acetti-viz';
import {TPeriodsScale} from '../periodsScale';

export const AnimatedXAxis_PeriodsScale: React.FC<{
	linesColor: string;
	area: TGridLayoutArea;
	dates: Date[];
	periodsScale: TPeriodsScale;
}> = ({linesColor, area, dates, periodsScale}) => {
	const monthStartsIndicators = generateMonthStartIndicatorList(dates);

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

			{/* TODO keep this visualization, as it may be useful for debugging the periodsScale */}
			{dates.map((date, i) => {
				const band = periodsScale.getBandFromDate(date);
				return (
					<g clipPath="url(#xAxisAreaClipPath)">
						<rect
							x={band.x1}
							y={0}
							width={band.width}
							height={40}
							stroke={linesColor}
							strokeWidth={1}
							fill={i % 5 === 0 ? linesColor : 'transparent'}
						/>
						{i % 5 === 0 ? (
							<text
								textAnchor="middle"
								alignmentBaseline="middle"
								fill={'black'}
								fontSize={18}
								fontWeight={500}
								x={band.centroid}
								y={20}
							>
								{i.toString()}
							</text>
						) : null}
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

function getMonthName(date: Date): string {
	// Use options to get the month name in the desired language
	const monthName = date.toLocaleString('default', {month: 'long'});
	return monthName;
}
