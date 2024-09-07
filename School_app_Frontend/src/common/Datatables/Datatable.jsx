import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  IoChevronForwardOutline,
  IoChevronBackOutline,
  IoEyeOutline,
  IoTrashOutline,
  IoPencilOutline,
} from "react-icons/io5";

const Datatable = ({ data = [], columns = [], actions = {} }) => {
  // Added default values
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
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-[#283046] pb-6">
      <div className="rounded-t mb-0 px-4 py-3 border-b border-gray-700">
        {/* Additional header content can go here */}
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full border-collapse text-white">
          <thead>
            <tr>
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
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left"
                  >
                    {column.render
                      ? column.render(item[column.accessor], item)
                      : item[column.accessor]}
                  </td>
                ))}
                {/* Action buttons */}
                {Object.keys(actions).length > 0 && (
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl  whitespace-nowrap p-4 text-left">
                    <div className="flex space-x-2 gap-2">
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
