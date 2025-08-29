import { dimensionNames } from "@/lib/hexaco";

interface HexagonChartProps {
  scores: Record<string, number>;
  size?: number;
}

const HexagonChart = ({ scores, size = 300 }: HexagonChartProps) => {
  const dimensions = ['H', 'E', 'X', 'A', 'C', 'O'];
  const center = size / 2;
  const maxRadius = (size / 2) - 40;

  // Calculate hexagon points for the outer boundary
  const getHexagonPoint = (index: number, radius: number) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2; // Start from top and go clockwise
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  // Create hexagon path
  const createHexagonPath = (radius: number) => {
    const points = dimensions.map((_, index) => getHexagonPoint(index, radius));
    return `M ${points[0].x} ${points[0].y} ` + 
           points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + 
           ' Z';
  };

  // Create data path based on scores
  const createDataPath = () => {
    const points = dimensions.map((dim, index) => {
      const score = scores[dim] || 0;
      const radius = (Math.max(score, 0) / 100) * maxRadius;
      return getHexagonPoint(index, radius);
    });
    
    return `M ${points[0].x} ${points[0].y} ` + 
           points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + 
           ' Z';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <svg width={size} height={size} className="border rounded-lg bg-background">
        {/* Grid lines */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => (
          <path
            key={scale}
            d={createHexagonPath(maxRadius * scale)}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* Axis lines */}
        {dimensions.map((_, index) => {
          const point = getHexagonPoint(index, maxRadius);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}

        {/* Data area */}
        <path
          d={createDataPath()}
          fill="hsl(var(--primary))"
          fillOpacity="0.3"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />

        {/* Data points */}
        {dimensions.map((dim, index) => {
          const score = scores[dim] || 0;
          const radius = (Math.max(score, 0) / 100) * maxRadius;
          const point = getHexagonPoint(index, radius);
          
          return (
            <circle
              key={dim}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="hsl(var(--primary))"
              stroke="hsl(var(--background))"
              strokeWidth="2"
            />
          );
        })}

        {/* Labels */}
        {dimensions.map((dim, index) => {
          const labelPoint = getHexagonPoint(index, maxRadius + 25);
          const shortName = dimensionNames[dim as keyof typeof dimensionNames].split(' ')[0];
          
          return (
            <text
              key={dim}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-foreground"
            >
              {shortName}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
        {dimensions.map((dim) => (
          <div key={dim} className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="truncate">
              {dimensionNames[dim as keyof typeof dimensionNames]}
            </span>
            <span className="text-muted-foreground">
              {Math.round(scores[dim] || 0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HexagonChart;