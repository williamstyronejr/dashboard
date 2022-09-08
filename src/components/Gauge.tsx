type Props = {
  className?: string;
  bgColor?: string;
  fillColor?: string;
  value: number;
};

const parentStyles = {
  width: "100%",
};

const svgStyles = {};

const circleStyles = {
  transition: "0.3s",
  strokeWidth: "15",
  animationFillMode: "none",
};

const circleFullStyles = {
  transition: "0.3s",
  strokeWidth: "15",
};

const Gauge: React.FC<Props> = ({
  value,
  bgColor,
  fillColor,
  className = "",
}) => {
  console.log(value);
  return (
    <div style={parentStyles} className={`${className}`}>
      <svg
        className="svgGauge"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        transform="rotate(90)"
      >
        <circle
          className="circle gaugeBG"
          style={circleFullStyles}
          id="gaugeBG"
          cx="50%"
          cy="50%"
          r="45"
          pathLength="100"
          fill="none"
          stroke={bgColor || "rgba(0,0,0,0.1)"}
          strokeDasharray="100 100"
        />

        <circle
          className="circle gaugePercent"
          style={circleStyles}
          id="gauge"
          cx="50%"
          cy="50%"
          r="45"
          pathLength="100"
          fill="none"
          strokeLinecap="butt"
          strokeDasharray={`${value < 0 ? 0 : value} 100`}
          stroke={fillColor || "#e9ad61"}
        />
      </svg>
    </div>
  );
};

export default Gauge;
