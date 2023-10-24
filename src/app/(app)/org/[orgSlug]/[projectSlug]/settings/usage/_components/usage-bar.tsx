import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const unprocessedItemColor = "#E5E7EB";
const groupingColor = "#3B82F6";
const colorsArray = [
  "#EF4444", // Red
  "#F59E0B", // Yellow
  "#10B981", // Green
  "#6366F1", // Indigo
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
];

const UsageBarChart = ({
  data,
  projectSlug,
}: {
  data: any;
  projectSlug?: string;
}) => {
  const transformedData = data.reduce((acc, item) => {
    acc[item.title] = item.value;
    return acc;
  }, {});
  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <BarChart
      width={600}
      height={200}
      data={[transformedData]}
      layout="vertical"
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" domain={[0, totalValue]} />
      <YAxis type="category" dataKey="title" />
      <Tooltip />
      <Legend />
      {Object.keys(transformedData).map((key, index) => {
        const currItemIsUnprocessed = data.find((item) => item.title === key)
          ?.isUnprocessedItem;
        return (
          <Bar
            key={key}
            dataKey={key}
            name={key}
            stackId={"a"}
            fill={
              currItemIsUnprocessed
                ? unprocessedItemColor
                : projectSlug && projectSlug !== key
                ? groupingColor
                : colorsArray[index % colorsArray.length]
            }
          />
        );
      })}
    </BarChart>
  );
};

export default UsageBarChart;
