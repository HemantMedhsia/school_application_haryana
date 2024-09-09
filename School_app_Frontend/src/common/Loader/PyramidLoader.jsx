import React from "react";

const PyramidLoader = ({desc}) => {
  return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
        <div class="pyramid-loader">
          <div class="wrapper">
            <span class="side side1"></span>
            <span class="side side2"></span>
            <span class="side side3"></span>
            <span class="side side4"></span>
            <span class="shadow"></span>
          </div>
          <h1 class="loaderText">{desc}</h1>
        </div>
      </div>
  );
};

export default PyramidLoader;
