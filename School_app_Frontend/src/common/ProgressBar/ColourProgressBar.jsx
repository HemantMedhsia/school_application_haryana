const ProgressBar = ({ percentage }) => {
    // Determine the background color based on the percentage value
    const getColor = (percentage) => {
      if (percentage >= 90) return "#00e676"; // Bright green for 90% and above
      if (percentage >= 80) return "#66bb6a"; // Green for 80% to 89%
      if (percentage >= 70) return "#ffeb3b"; // Yellow for 70% to 79%
      if (percentage >= 60) return "#ffa726"; // Orange for 60% to 69%
      if (percentage >= 50) return "#ff7043"; // Dark orange for 50% to 59%
      return "#f44336"; // Red for below 50%
    };
  
    return (
      <div className="flex items-center mb-2">
        <span className="mr-2 text-gray-300 text-xs">{percentage}%</span>
        <div className="relative w-full">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
            <div
              style={{
                width: `${percentage}%`,
                backgroundColor: getColor(percentage),
              }}
              className="h-2 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default ProgressBar;
  