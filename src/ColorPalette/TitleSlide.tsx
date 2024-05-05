import {AbsoluteFill, Sequence} from 'remotion';

// import {Position} from '../Position';
import {Position} from '../AnimatedLineChartScaleBand/components/Position';
import {SubtleSlideIn, SubtleSlideOut} from './SubtleSlideIn';

export const TitleSlide: React.FC<{
	titleColor: string;
	title: string;
	subTitle: string;
	titleFontSize: number;
	subTitleFontSize: number;
}> = ({titleColor, title, subTitle, titleFontSize, subTitleFontSize}) => {
	return (
		<div style={{display: 'flex', flexDirection: 'column'}}>
			<Sequence layout="none">
				<SubtleSlideIn>
					<SubtleSlideOut>
						<div
							style={{
								// fontFamily: 'Inter-Variable',
								// fontVariationSettings: `"wght" ${600}`,
								fontSize: titleFontSize,
								lineHeight: 1.2,
								color: titleColor,
								// letterSpacing: '-0.025em',
							}}
						>
							{title}
						</div>
					</SubtleSlideOut>
				</SubtleSlideIn>
			</Sequence>
			<Sequence from={15} layout="none">
				<SubtleSlideIn>
					<SubtleSlideOut>
						<div
							style={{
								maxWidth: 1100,
								// fontFamily: 'Inter-Variable',
								// fontVariationSettings: `"wght" ${400}`,
								fontSize: subTitleFontSize,
								color: titleColor,
								lineHeight: 1.1,
								// letterSpacing: '-0.025em',
							}}
						>
							{subTitle}
						</div>
					</SubtleSlideOut>
				</SubtleSlideIn>
			</Sequence>
		</div>
	);
};
