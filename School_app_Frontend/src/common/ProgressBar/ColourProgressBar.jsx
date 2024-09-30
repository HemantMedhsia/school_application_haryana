const ProgressBar = ({ percentage }) => {
    const getColor = (percentage) => {
      if (percentage >= 80) return "bg-green-500";
      if (percentage >= 50) return "bg-yellow-500";
      return "bg-red-500";
    };
  
    return (
      <div className="w-full bg-gray-300 rounded h-3">
        <div
          className={`h-full rounded ${getColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };
  
  export default ProgressBar;
  