import React from 'react';
import { MdDeleteOutline } from "react-icons/md";

// Generic Table Component
const DynamicTable = ({ columns, data, handleInputChange, handleDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-[#283046] to-gray-900 text-white">
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} className="p-4 text-left text-lg font-semibold">{column.header}</th>
                        ))}
                        <th className="p-4 text-right text-lg font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b last:border-none hover:bg-[#283046] transition duration-300">
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="px-4 text-lg">
                                    {column.type === 'text' ? (
                                        row[column.accessor]
                                    ) : (
                                        <input
                                            type={column.type}
                                            value={row[column.accessor]}
                                            onChange={(e) => handleInputChange(e, rowIndex, column.accessor)}
                                            className="p-2 bg-gray-900 text-[#65FA9E] rounded-md focus:outline-none focus:ring-2 focus:ring-[#65FA9E] transition duration-300"
                                        />
                                    )}
                                </td>
                            ))}
                            <td className="p-4 text-right">
                                <button
                                    onClick={() => handleDelete(rowIndex)}
                                    className=" text-red-600 text-3xl rounded-md hover:bg-red-800 hover:text-white transition duration-300"
                                >
                                    <MdDeleteOutline/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DynamicTable;
