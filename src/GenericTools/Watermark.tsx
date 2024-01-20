import {AbsoluteFill, Img} from 'remotion';

// import {Theme} from '../theme';

export const Watermark: React.FC<{
	// watermark?: boolean | null;
	watermark?: boolean;
	// theme: Theme;
	baselines: (n: number) => number;
}> = ({
	// theme,
	watermark,
	baselines,
}) => {
	return (
		<AbsoluteFill>
			{watermark ? (
				<div
					style={{
						position: 'absolute',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						gap: baselines(0.25),
						bottom: baselines(1.5),
						right: baselines(2),
					}}
				>
					<Img
						style={{
							display: 'inline-block',
							height: baselines(4.5),
							width: baselines(4.5),
							borderRadius: 9999,
							objectFit: 'cover',
						}}
						// src={theme.Watermark.image}
						src={
							'https://s3.eu-central-1.amazonaws.com/dataflics.com/lorenzo-brown-wall.JPG'
						}
						alt=""
					/>
					<div
						style={{
							// fontFamily: theme.fonts.text.name,
							// color: theme.Slide.titleColor,
							color: 'orange',
							fontSize: baselines(1),
						}}
					>
						{/* {theme.Watermark.text} */}
						{'Hello Watermark'}
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
