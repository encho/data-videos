import {TGridLayoutArea} from '../../acetti-viz';
import {TPeriodsScale} from '../periodsScale';

export const AnimatedXAxis: React.FC<{
	linesColor: string;
	area: TGridLayoutArea;
	dates: Date[];
	periodsScale: TPeriodsScale;
	// xScaleCurrent: ScaleTime<Date, number>;
	// axisSpecType: 'STANDARD' | 'INTER_MONTHS';
}> = ({linesColor, area, dates, periodsScale}) => {
	// const xAxisSpec = getXAxisSpecFromScale(xScaleCurrent, axisSpecType);

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
