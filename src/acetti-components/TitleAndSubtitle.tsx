import {Sequence} from 'remotion';

// import {Position} from '../Position';
// import {Position} from '../AnimatedLineChartScaleBand/components/Position';
import {SubtleSlideIn, SubtleSlideOut} from './SubtleSlideIn';

export const TitleAndSubtitle: React.FC<{
	title: string;
	titleColor: string;
	titleFontSize: number;
	titleFontFamily: string;
	subTitle: string;
	subTitleColor: string;
	subTitleFontSize: number;
	subTitleFontFamily: string;
	// titleFontWeight: number;
	// subTitleFontWeight: number;
	// TODO TFontFamilyEnum??
}> = ({
	titleColor,
	subTitleColor,
	title,
	subTitle,
	titleFontSize,
	subTitleFontSize,
	// titleFontWeight,
	// subTitleFontWeight,
	titleFontFamily,
	subTitleFontFamily,
}) => {
	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
			<Sequence layout="none">
				<SubtleSlideIn>
					<SubtleSlideOut>
						<div
							style={{
								fontFamily: titleFontFamily,
								// fontFamily: 'Inter-Variable',
								// fontVariationSettings: `"wght" ${600}`,
								fontSize: titleFontSize,
								lineHeight: 1.2,
								color: titleColor,
								// fontWeight: titleFontWeight,
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
								fontFamily: subTitleFontFamily,
								// fontFamily: 'Inter-Variable',
								// fontVariationSettings: `"wght" ${400}`,
								fontSize: subTitleFontSize,
								color: subTitleColor,
								lineHeight: 1.1,
								// fontWeight: 400,
								// fontWeight: subTitleFontWeight,
								// fontWeight: 600,
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
