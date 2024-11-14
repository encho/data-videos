// FlexibleComponent.tsx
import React from 'react';

type AsProp<C extends React.ElementType> = {
	// eslint-disable-next-line
	as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProps<
	C extends React.ElementType,
	Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
	Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicRef<C extends React.ElementType> =
	React.ComponentPropsWithRef<C>['ref'];

type FlexibleComponentProps<C extends React.ElementType> =
	PolymorphicComponentProps<C, {}>;

export const FlexibleElement = React.forwardRef(
	<C extends React.ElementType = 'div'>(
		{as, children, ...rest}: FlexibleComponentProps<C>,
		ref?: PolymorphicRef<C>
	) => {
		const Component = as || 'div';
		return (
			<Component ref={ref} {...rest}>
				{children}
			</Component>
		);
	}
) as <C extends React.ElementType = 'div'>(
	props: FlexibleComponentProps<C> & {ref?: PolymorphicRef<C>}
) => React.ReactElement | null;
