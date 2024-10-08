import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import {
  IoChevronForwardOutline,
  IoChevronBackOutline,
  IoEyeOutline,
} from "react-icons/io5";
import ProgressBar from "../TableColourProgressBar.jsx/ColourProgressBar";
import { IoPrint } from "react-icons/io5";

const MultiRowValuesDatatable = ({ data = [], actions = {} }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8; // Number of rows per page

  // Calculate the displayed items for the current page
  const offset = currentPage * itemsPerPage;
  const currentPageData = data?.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full pb-6 shadow-lg rounded bg-[#283046]">
      <div className="rounded-t mb-0 px-4 py-3 border-b border-gray-700">
        {/* Additional header content */}
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full border-collapse text-white">
          <thead>
            <tr>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                Name
              </th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                Roll No
              </th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                Exam Type
              </th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                Percentage
              </th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                Actions
              </th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                View All
              </th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                Overall Percentage
              </th>
              <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-900 duration-300">
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4 text-left">
                  {item.name}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4 text-left">
                  {item.rollNumber}
                </td>

                {/* Render exam types with percentage bars */}
                <td className="border-t-0 px-6 align-middle border-l-0 border-b-2 duration-300 border-[#7367F0] border-r-0 text-sm whitespace-nowrap p-4 text-left">
                  {item.examTypes.map((examType, examIndex) => (
                    <div key={examIndex} className="flex items-center my-6">
                      <span>{examType}</span>
                    </div>
                  ))}
                </td>

                {/* Render percentage bars for each exam */}
                <td className="border-t-0 align-middle px-6 border-l-2 border-b-2 border-[#7367F0] border-r-0 text-sm whitespace-nowrap text-left">
                  {item.percentage.map((percentage, index) => (
                    <div key={index} className="my-7">
                      <ProgressBar percentage={percentage} />
                    </div>
                  ))}
                </td>

                {/* Render individual action buttons next to each exam type */}
                <td className="border-t-0 px-6 align-middle border-b-2 border-l-2 border-[#7367F0] border-r-0 text-xs font-semibold whitespace-nowrap text-left">
                  {item.examTypeIds.map((examType, examIndex) => (
                    <div key={examIndex} className="my-7">
                      <button
                        onClick={() => actions.onViewExam(item, examType)}
                        className="text-[#65FA9E] border px-3 py-1  duration-300 hover:bg-[#7367F0] hover:opacity-70 rounded-full hover:text-white"
                      >
                        View
                      </button>
                     
                    </div>
                  ))}
                </td>

                {/* Separate View All button */}
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4 text-left">
                  <button
                    onClick={() => actions.onViewAll(item)}
                    className="text-[#65FA9E] border px-5 py-1 rounded-full  duration-300 hover:bg-[#7367F0] hover:opacity-70 hover:text-white"
                  >
                    View All
                  </button>
                </td>

                {/* Render overall percentage progress bar */}
                <td className="border-t-0 align-middle px-6 border-l-0 pt-3  border-r-0 whitespace-nowrap text-left">
                  <ProgressBar percentage={item.overallPercentage} />{" "}
                  {/* Using the ProgressBar for overall percentage */}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl font-semibold whitespace-nowrap p-4 text-left text-[#65FA9E]">
                  {item?.grade}
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
