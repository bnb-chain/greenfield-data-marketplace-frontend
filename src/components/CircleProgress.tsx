import { useState, useEffect } from 'react';

function CircleProgress({
  progress,
  size,
  strokeWidth,
  circleOneStroke,
  circleTwoStroke,
}: {
  progress: number;
  size: number;
  strokeWidth: number;
  circleOneStroke: string;
  circleTwoStroke: string;
}) {
  const [offset, setOffset] = useState(0);

  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = ((100 - progress) / 100) * circumference;

  useEffect(() => {
    setOffset(progressOffset);
  }, [circumference, progressOffset]);

  return (
    <svg className="svg" width={size} height={size}>
      <circle
        className="svg-circle-bg"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        stroke={circleOneStroke}
        fill="none"
      />
      <circle
        className="svg-circle"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        stroke={circleTwoStroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default CircleProgress;
