# Data Visualization Component Explanation

Component Name: MultipleSimpleSparkline

# What does the component do?

The component gives an overview on four timeseries via displaying a 2x2 matrix of four Sparkline charts, which appear successively on the screen and exit the scene together.

## Component data requirements

The component gets four timeseries of the shape:

```
type TS = {date: Date; value: number};
```

Each timeseries should have the same dates.

Also, each timeseries will display a title, thus we need four titles (`string`).

The component also gets a slide title, which is a `string`.

The component will display the source of the displayed data, thus we need a `string` for that.
