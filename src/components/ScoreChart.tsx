import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

interface ScoreChartProps {
  data: Array<{ name: string; value: number; fill: string }>;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
}

/**
 * Memoized chart component to prevent unnecessary re-renders
 */
export const ScoreChart = React.memo<ScoreChartProps>(({ 
  data, 
  innerRadius = 60, 
  outerRadius = 100,
  startAngle = 90,
  endAngle = -270
}) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        barSize={10}
        data={data}
        startAngle={startAngle}
        endAngle={endAngle}
      >
        <RadialBar
          label={{ position: 'insideStart', fill: '#fff' }}
          background
          dataKey="value"
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}, (prevProps, nextProps) => {
  // Only re-render if data actually changed
  if (prevProps.data.length !== nextProps.data.length) return false;
  return prevProps.data.every((item, idx) => {
    const nextItem = nextProps.data[idx];
    return item.value === nextItem?.value && item.name === nextItem?.name;
  });
});

ScoreChart.displayName = 'ScoreChart';

