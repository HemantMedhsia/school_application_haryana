import React, { useEffect, useState } from "react";
import DynamicTable from "../../common/Datatables/DynamicTable";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const FeeManagement = () => {
  const [classes, setClasses] = useState([]);
  const [feeData, setFeeData] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      toast.info("Loading data, please wait..."); // Notify data loading

      try {
        const classesResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/all-class`
        );

        if (classesResponse.data && classesResponse.data.success) {
          setClasses(classesResponse.data.data);

          if (isUpdateMode) {
            const feeGroupsResponse = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/get-fee-group`
            );
            if (feeGroupsResponse.data && feeGroupsResponse.data.success) {
              const feeGroups = feeGroupsResponse.data.data;
              const initialFeeData = feeGroups.map((group) => ({
                classId: group.class._id,
                className: group.class.name,
                tuitionFee: group.fees.tuitionFee || "",
                admissionFee: group.fees.admissionFee || "",
                annualFee: group.fees.annualFee || "",
                otherFee: group.fees.otherFee || "",
                feeGroupId: group._id,
              }));
              setFeeData(initialFeeData);
              toast.success("Fee groups loaded successfully.");
            } else {
              toast.error("Failed to fetch fee groups.");
            }
          } else {
            const initialFeeData = classesResponse.data.data.map((cls) => ({
              classId: cls._id,
              className: cls.name,
              tuitionFee: "",
              admissionFee: "",
              annualFee: "",
              otherFee: "",
            }));
            setFeeData(initialFeeData);
            toast.success("Classes loaded successfully.");
          }
        } else {
          toast.error("Failed to fetch classes.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching data.");
      }
    };

    fetchData();
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
    toast.info("Submitting data, please wait...");

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
      const endpoint = isUpdateMode
        ? `${import.meta.env.VITE_BACKEND_URL}/api/update-fee-group`
        : `${import.meta.env.VITE_BACKEND_URL}/api/add-fee-group`;

      const method = isUpdateMode ? "put" : "post";

      const response = await axios[method](endpoint, { feeData: formattedFeeData });

      if (response.data && response.data.success) {
        toast.success(isUpdateMode ? "Fees updated successfully!" : "Fees created successfully!");
        setIsUpdateMode(false);
      } else {
        toast.error("Failed to submit fees.");
      }
    } catch (error) {
      console.error("Error submitting fees:", error);
      toast.error("An error occurred while submitting fees.");
    }
  };

  return (
    <div className="p-6">
    <ToastContainer />
      <h1 className="text-3xl font-bold mb-4">
        {isUpdateMode ? "Update Fee Structure" : "Create Fee Structure"}
      </h1>
      <DynamicTable
        columns={columns}
        data={feeData}
        handleInputChange={handleInputChange}
      />
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSubmit}
          className={`${
            isUpdateMode ? "bg-green-500" : "bg-blue-500"
          } text-white px-4 py-2 rounded-md hover:${
            isUpdateMode ? "bg-green-700" : "bg-blue-700"
          } transition duration-300 mb-4`}
        >
          {isUpdateMode ? "Save Changes" : "Submit Fees"}
        </button>
        {!isUpdateMode && (
          <button
            onClick={() => setIsUpdateMode(true)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 mb-4"
          >
            Switch to Update Mode
          </button>
        )}
      </div>
    </div>
  );
};

export default FeeManagement;
