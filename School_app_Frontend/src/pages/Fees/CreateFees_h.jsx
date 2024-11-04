import React, { useEffect, useState } from "react";
import DynamicTable from "../../common/Datatables/DynamicTable";
import axios from "axios";
import { toast } from "react-toastify";

const CreateFees_h = () => {
  const [classes, setClasses] = useState([]);
  const [feeData, setFeeData] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/all-class`
        );
        if (response.data && response.data.success) {
          setClasses(response.data.data);
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

  useEffect(() => {
    if (isUpdateMode) {
      const fetchFeeGroups = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/get-fee-group`
          );
          if (response.data && response.data.success) {
            const feeGroups = response.data.data;
            const updatedFeeData = feeGroups.map((group) => ({
              classId: group.class._id,
              className: group.class.name,
              tuitionFee: group.fees.tuitionFee,
              admissionFee: group.fees.admissionFee,
              annualFee: group.fees.annualFee,
              otherFee: group.fees.otherFee,
              feeGroupId: group._id,
            }));
            setFeeData(updatedFeeData);
          } else {
            toast.error("Failed to fetch fee groups.");
          }
        } catch (error) {
          console.error("Error fetching fee groups:", error);
          toast.error("An error occurred while fetching fee groups.");
        }
      };

      fetchFeeGroups();
    }
  }, [isUpdateMode]);

  const columns = [
    { header: "Class", accessor: "className", type: "text", disabled: true },
    { header: "Tuition Fee", accessor: "tuitionFee", type: "number", inputType: "number" },
    { header: "Admission Fee", accessor: "admissionFee", type: "number", inputType: "number" },
    { header: "Annual Fee", accessor: "annualFee", type: "number", inputType: "number" },
    { header: "Other Fee", accessor: "otherFee", type: "number", inputType: "number" },
  ];

  const handleInputChange = (e, rowIndex, accessor) => {
    const updatedFeeData = [...feeData];
    updatedFeeData[rowIndex][accessor] = e.target.value;
    setFeeData(updatedFeeData);
  };

  const handleSubmit = async () => {
    const formattedFeeData = feeData.map(
      ({ feeGroupId, classId, tuitionFee, admissionFee, annualFee, otherFee }) => ({
        feeGroupId,
        class: classId,
        fees: {
          tuitionFee,
          admissionFee,
          annualFee,
          otherFee,
        },
      })
    );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/update-fee-group`,
        { feeData: formattedFeeData }
      );
      if (response.status === 200) {
        toast.success("Fees updated successfully!");
        setIsUpdateMode(false);
      } else {
        toast.error("Failed to update fees.");
      }
    } catch (error) {
      console.error("Error updating fees:", error);
      toast.error("An error occurred while updating fees.");
    }
  };

  const handleUpdateClick = () => {
    setIsUpdateMode(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Create or Update Fee Structure</h1>
      <DynamicTable
        columns={columns}
        data={feeData}
        handleInputChange={handleInputChange}
        classes={classes}
      />
      <div className="mt-4">
        {isUpdateMode ? (
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Update Fees
          </button>
        ) : (
          <button
            onClick={handleUpdateClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 mb-4"
          >
            Update Fees
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateFees_h;
