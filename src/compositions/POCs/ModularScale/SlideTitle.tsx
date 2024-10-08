import {FadeInAndOutText} from '../../SimpleStats/FadeInAndOutText';
import {ThemeType} from '../../../acetti-themes/themeTypes';

export const SlideTitle: React.FC<{children: string; theme: ThemeType}> = ({
	children,
	theme,
}) => {
	return (
		<div style={{display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					color: theme.typography.title.color,
					// color: 'magenta',
					fontSize: 70,
					marginTop: 60,
					fontFamily: 'Inter',
					fontWeight: 700,
				}}
			>
				<FadeInAndOutText>{children}</FadeInAndOutText>
			</div>
		</div>
	);
};
