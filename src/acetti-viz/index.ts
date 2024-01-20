// export { default as ThemeInspector } from "./ThemeInspector";

export * from './atoms';
export * from './hooks';
export * from './types2';

export type TVizTheme = {
	colors: {
		background: string;
		text: string;
		primary: string;
		secondary: string;
	};
};
