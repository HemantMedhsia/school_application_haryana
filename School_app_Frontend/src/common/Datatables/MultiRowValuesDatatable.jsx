import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { IoChevronForwardOutline, IoChevronBackOutline, IoEyeOutline } from "react-icons/io5";
import ProgressBar from "../ProgressBar/ColourProgressBar"; // Adjust the path based on your structure

const MultiRowValuesDatatable = ({ data = [], actions = {} }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8; // Number of rows per page

  // Calculate the displayed items for the current page
  const offset = currentPage * itemsPerPage;
  const currentPageData = data.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-[#283046]">
      <div className="rounded-t mb-0 px-4 py-3 border-b border-gray-700">
        {/* Additional header content */}
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full border-collapse text-white">
          <thead>
            <tr>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">Name</th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">Roll No</th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">Exam Type</th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">Percentage</th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">Actions</th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">View All</th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">Overall Percentage</th> {/* New column for overall percentage */}
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[#4a5568]">
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left">{item.name}</td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left">{item.rollNumber}</td>

                {/* Render exam types with percentage bars */}
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left">
                  {item.examTypes.map((examType, examIndex) => (
                    <div key={examIndex} className="flex items-center my-6">
                      <span>{examType}</span>
                    </div>
                  ))}
                </td>

                {/* Render percentage bars for each exam */}
                <td className="border-t-0 align-middle px-6 border-l-0 border-r-0 text-sm whitespace-nowrap text-left">
                  {item.percentage.map((percentage, index) => (
                    <div key={index} className="my-7">
                      <ProgressBar percentage={percentage} />
                    </div>
                  ))}
                </td>

                {/* Render individual action buttons next to each exam type */}
                <td className="border-t-0 mt-4 px-6 align-middle border-l-0 flex justify-center  flex-col border-r-0 text-xl whitespace-nowrap p-4 text-left">
                  {item.examTypes.map((examType, examIndex) => (
                    <div key={examIndex} className="my-2 ">
                      <button
                        onClick={() => actions.onViewExam(item, examType)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <IoEyeOutline />
                      </button>
                    </div>
                  ))}
                </td>

                {/* Separate View All button */}
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4 text-left">
                  <button
                    onClick={() => actions.onViewAll(item)}
                    className="text-green-500 hover:text-green-700"
                  >
                    View All
                  </button>
                </td>

                {/* Render overall percentage progress bar */}
                <td className="border-t-0 align-middle px-6 border-l-0 border-r-0 text-sm whitespace-nowrap text-left">
                  <ProgressBar percentage={item.overallPercentage} /> {/* Using the ProgressBar for overall percentage */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mr-5">
        <ReactPaginate
          previousLabel={<IoChevronBackOutline />}
          nextLabel={<IoChevronForwardOutline />}
          breakLabel={"..."}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default MultiRowValuesDatatable;
