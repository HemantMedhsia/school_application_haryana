import React, { useEffect, useState } from "react";
import DynamicTable from "../../common/Datatables/DynamicTable";
import axios from "axios";
import { toast } from "react-toastify";

const CreateFees_h = () => {
  const [classes, setClasses] = useState([]);
  const [feeData, setFeeData] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/all-class`
        );
        if (response.data && response.data.success) {
          setClasses(response.data.data);
          // Initialize feeData with available classes
          const initialFeeData = response.data.data.map((cls) => ({
            classId: cls._id,
            className: cls.name,
            tuitionFee: "",
            admissionFee: "",
            annualFee: "",
            otherFee: "",
          }));
          setFeeData(initialFeeData);
        } else {
          toast.error("Failed to fetch classes.");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("An error occurred while fetching classes.");
      }
    };

    fetchClasses();
  }, []);

  const columns = [
    { header: "Class", accessor: "className", type: "text", disabled: true },
    { header: "Tuition Fee", accessor: "tuitionFee", type: "number", inputType: "number" },
    { header: "Admission Fee", accessor: "admissionFee", type: "number", inputType: "number"},
    { header: "Annual Fee", accessor: "annualFee", type: "number",inputType: "number" },
    { header: "Other Fee", accessor: "otherFee", type: "number",inputType: "number" },
  ];

  // Handle input change in table
  const handleInputChange = (e, rowIndex, accessor) => {
    const updatedFeeData = [...feeData];
    updatedFeeData[rowIndex][accessor] = e.target.value;
    setFeeData(updatedFeeData);
  };

  // Handle delete row (not used in the current version, but keeping for reference)
  const handleDelete = (rowIndex) => {
    const updatedFeeData = [...feeData];
    updatedFeeData.splice(rowIndex, 1);
    setFeeData(updatedFeeData);
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async () => {
    const formattedFeeData = feeData.map(
      ({ classId, tuitionFee, admissionFee, annualFee, otherFee }) => ({
        class: classId,
        fees: {
          tuitionFee,
          admissionFee,
          annualFee,
          otherFee,
        },
      })
    );

    console.log(formattedFeeData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/add-fee-group`,
        { feeData: formattedFeeData }
      );
      if (response.status === 200) {
        toast.success("Fees added successfully!");
      } else {
        toast.error("Failed to add fees.");
      }
    } catch (error) {
      console.error("Error adding fees:", error);
      toast.error("An error occurred while adding fees.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Create Fee Structure</h1>
      <DynamicTable
        columns={columns}
        data={feeData}
        handleInputChange={handleInputChange}
        classes={classes}
        handleDelete={handleDelete}
      />
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateFees_h;
