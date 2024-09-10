import React from "react";
import SmalldataBlock from "../../common/DataBlock/SmalldataBlock";

const StudentDashboard = () => {
  return (
    <div className="flex gap-4">
      <SmalldataBlock
        title="Total Classes"
        description="Total number of classes"
        iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
        bgColor="bg-[#FF4560]"
        value={200}
      />
      <SmalldataBlock
        title="Total Classes"
        description="Total number of classes"
        iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
        bgColor="bg-[#FF4560]"
        value={200}
      />
      <SmalldataBlock
        title="Total Classes"
        description="Total number of classes"
        iconUrl="https://img.icons8.com/ios/50/000000/graduation-cap--v1.png"
        bgColor="bg-[#FF4560]"
        value={200}
      />
    </div>
  );
};

export default StudentDashboard;
