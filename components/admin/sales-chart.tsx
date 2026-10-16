import { formatBdt } from "@/lib/format";

export function SalesChart({
  days,
}: {
  days: Array<{ label: string; total: number; orders: number }>;
}) {
  const max = Math.max(...days.map((day) => day.total), 1);
  const width = 640;
  const height = 160;
  const gap = 8;
  const barWidth = (width - gap * (days.length - 1)) / days.length;

  return (
    <figure>
      <svg viewBox={`0 0 ${width} ${height + 28}`} className="w-full" role="img" aria-label="Order value for the last 14 days">
        {days.map((day, index) => {
          const barHeight = day.total <= 0 ? 0 : Math.max(6, (day.total / max) * height);
          const x = index * (barWidth + gap);
          return (
            <g key={day.label + index}>
              <rect
                x={x}
                y={height - barHeight}
                width={barWidth}
                height={barHeight}
                rx={6}
                fill={day.total > 0 ? "#f06bb4" : "#f3e7ee"}
              >
                <title>
                  {day.label}: {formatBdt(day.total)} · {day.orders} orders
                </title>
              </rect>
              <text
                x={x + barWidth / 2}
                y={height + 18}
                textAnchor="middle"
                fontSize="11"
                fill="#6b6166"
              >
                {index % 2 === 0 ? day.label.split(" ")[0] : ""}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-1 text-xs text-muted">Order value in BDT, last 14 days in Dhaka time.</figcaption>
    </figure>
  );
}
