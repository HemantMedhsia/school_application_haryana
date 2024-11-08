import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import {
  IoChevronForwardOutline,
  IoChevronBackOutline,
  IoEyeOutline,
  IoTrashOutline,
  IoPencilOutline,
} from "react-icons/io5";
import { BsPersonFillCheck, BsPersonFillSlash } from "react-icons/bs";

const Datatable = ({
  data = [],
  columns = [],
  actions = {},
  attendanceStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20; // Number of rows per page

  // Calculate the displayed items for the current page
  const offset = currentPage * itemsPerPage;
  const currentPageData = data.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-[#283046] pb-6">
      <div className="rounded-t mb-0 px-4 py-3 border-b border-gray-700">
        {/*  Additional header content can go here */}
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full border-collapse text-white">
          <thead>
            <tr>
              {/* Serial Number Header */}
              <th className="px-6 bg-[#2d3748] text-gray-300 align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                S.No
              </th>

              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 bg-[#2d3748] text-gray-300 align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left"
                >
                  {column.header}
                </th>
              ))}

              {/* Action column */}
              {Object.keys(actions).length > 0 && (
                <th className="px-6 bg-[#2d3748] text-gray-300 align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[#4a5568]">
                {/* Serial Number Cell */}
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left">
                  {offset + rowIndex + 1}
                </td>

                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left"
                  >
                    {column.render // If render method is defined, use it
                      ? column.render(item)
                      : typeof column.accessor === "function"
                      ? column.accessor(item) // Call accessor function if it's a function
                      : item[column.accessor] || "N/A"}
                  </td>
                ))}

                {/* Action buttons */}
                {Object.keys(actions).length > 0 && (
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4 text-left">
                    <div className="flex space-x-2 gap-2">
                      {actions.onCustomAction && (
                        <button
                          className={`flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-sm text-[#65fa9e] 
                            drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] hover:drop-shadow-[0_0_20px_rgba(34,197,94,1)] hover:border
                            transition duration-300 ease-in-out`}
                          onClick={() => actions.onCustomAction(item)}
                        >
                          Add Siblings
                        </button>
                      )}

                      {actions.onViewSibblings && (
                        <button
                          className={`flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-sm text-[#65fa9e] 
                            drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] hover:drop-shadow-[0_0_20px_rgba(34,197,94,1)] hover:border
                            transition duration-300 ease-in-out`}
                          onClick={() => actions.onViewSibblings(item)}
                        >
                          View Siblings
                        </button>
                      )}

                      {actions.onView && (
                        <button onClick={() => actions.onView(item)}>
                          <IoEyeOutline className="text-blue-500 hover:text-blue-700" />
                        </button>
                      )}
                      {actions.onEdit && (
                        <button onClick={() => actions.onEdit(item)}>
                          <IoPencilOutline className="text-green-500 hover:text-green-700" />
                        </button>
                      )}
                      {actions.onDelete && (
                        <button onClick={() => actions.onDelete(item)}>
                          <IoTrashOutline className="text-red-500 hover:text-red-700" />
                        </button>
                      )}
                      {actions.onPresent && (
                        <button
                          className={`flex hover:bg-gray-800 hover:-translate-y-1 duration-200 gap-2 border px-2 shadow-sm shadow-[#65FA9E] py-1 rounded-lg bg-gray-900 border-gray-900 text-md font-mono justify-center items-center ${
                            attendanceStatus[item._id] === "Present"
                              ? "opacity-50"
                              : ""
                          }`}
                          onClick={() => actions.onPresent(item)}
                          disabled={attendanceStatus[item._id] === "Present"}
                        >
                          <BsPersonFillCheck className="text-[#65FA9E]" />
                          <div className="text-sm">Present</div>
                        </button>
                      )}
                      {actions.onAbsent && (
                        <button
                          className={`flex gap-2 hover:bg-gray-800 hover:-translate-y-1 duration-200 border px-2 py-1 shadow-sm shadow-[#F87171] rounded-lg bg-gray-900 border-gray-900 justify-center font-mono items-center ${
                            attendanceStatus[item._id] === "Absent"
                              ? "opacity-50"
                              : ""
                          }`}
                          onClick={() => actions.onAbsent(item)}
                          disabled={attendanceStatus[item._id] === "Absent"}
                        >
                          <BsPersonFillSlash className="text-[#F87171]" />
                          <div className="text-sm">Absent</div>
                        </button>
                      )}
                    </div>
                  </td>
                )}
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

export default Datatable;
