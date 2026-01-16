import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface REAOPieChartProps {
  data: Array<{ name: string; value: number; fill: string }>;
}

/**
 * Memoized REAO pie chart component to prevent unnecessary re-renders
 */
export const REAOPieChart = React.memo<REAOPieChartProps>(({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
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

REAOPieChart.displayName = 'REAOPieChart';

