import {
	createContext,
	useContext,
	//  useCallback, useMemo, useRef
} from 'react';
import {
	useCurrentFrame,
	// Sequence,
	useVideoConfig,
} from 'remotion';

// type BufferState = {[key: string]: boolean};

type TGlobalVideoContext = {
	globalCurrentFrame: number;
	globalDurationInFrames: number;
	globalAnimationPercentage: number;
	globalFramesPerSecond: number;
};

export const GlobalVideoContext = createContext<TGlobalVideoContext>({
	// By default, do nothing if the context is not set, for example in rendering
	globalCurrentFrame: 0,
	globalDurationInFrames: 0,
	globalAnimationPercentage: 0,
	globalFramesPerSecond: 0,
});

export const GlobalVideoContextWrapper: React.FC<{
	children: React.ReactNode;
}> = ({children}) => {
	const currentFrame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	return (
		// <Sequence durationInFrames={} layout="none">
		<GlobalVideoContext.Provider
			value={{
				globalCurrentFrame: currentFrame,
				globalDurationInFrames: durationInFrames,
				globalAnimationPercentage: currentFrame / durationInFrames,
				globalFramesPerSecond: fps,
			}}
		>
			{children}
		</GlobalVideoContext.Provider>
		// </Sequence>
	);
};

export const useGlobalVideoContext = () => {
	const contextValue = useContext(GlobalVideoContext);
	return contextValue;
};
