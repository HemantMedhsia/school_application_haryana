import React from "react";

const Datatable = ({ data }) => {
  return (
    <section className="py-4 bg-[#1a202c]">
      <div className="w-full xl:w-4/12 px-4 mx-auto mt-8">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-[#2d3748]">
          <div className="rounded-t mb-0 px-4 py-3 border-b border-gray-700">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-white">
                  Social Traffic
                </h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <button
                  className="bg-indigo-600 text-white active:bg-indigo-700 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  See all
                </button>
              </div>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="items-center w-full border-collapse text-white">
              <thead>
                <tr>
                  <th className="px-6 bg-[#2d3748] text-gray-300 align-middle border-b border-gray-700 py-3 text-xs uppercase font-semibold text-left">
                    Referral
                  </th>
                  <th className="px-6 bg-[#2d3748] text-gray-300 align-middle border-b border-gray-700 py-3 text-xs uppercase font-semibold text-left">
                    Visitors
                  </th>
                  <th className="px-6 bg-[#2d3748] text-gray-300 align-middle border-b border-gray-700 py-3 text-xs uppercase font-semibold text-left min-w-140-px">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-[#4a5568]">
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {item.referral}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {item.visitors}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className="mr-2">{item.percentage}%</span>
                        <div className="relative w-full">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-600">
                            <div
                              style={{ width: `${item.percentage}%`, backgroundColor: item.color }} // Using style for colors
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Datatable;
