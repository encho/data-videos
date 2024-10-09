import {Sequence} from 'remotion';
import {FadeInAndOutText} from '../../acetti-typography/TextEffects/FadeInAndOutText';

export const TitleSlide: React.FC<{
	titleColor: string;
	subTitleColor: string;
	title: string;
	subTitle: string;
	titleFontSize: number;
	subTitleFontSize: number;
}> = ({
	titleColor,
	subTitleColor,
	title,
	subTitle,
	titleFontSize,
	subTitleFontSize,
}) => {
	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
			<Sequence name="TitleSlide_Title" layout="none">
				<div
					style={{
						fontSize: titleFontSize,
						lineHeight: 1.2,
						color: titleColor,
						fontWeight: 600,
					}}
				>
					<FadeInAndOutText>{title}</FadeInAndOutText>
				</div>
			</Sequence>
			<Sequence name="TitleSlide_SubTitle" from={15} layout="none">
				<div
					style={{
						maxWidth: 1100,
						fontSize: subTitleFontSize,
						color: subTitleColor,
						lineHeight: 1.1,
						fontWeight: 400,
					}}
				>
					<FadeInAndOutText>{subTitle}</FadeInAndOutText>
				</div>
			</Sequence>
		</div>
	);
};
