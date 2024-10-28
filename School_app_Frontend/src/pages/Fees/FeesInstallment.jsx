import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "../../common/Datatables/DynamicTable";
import Input from "../../components/Form/Input";
import SearchableSelect from "../../components/Form/Select";
import { toast, ToastContainer } from "react-toastify";

const FeesInstallment = () => {
  const [installments, setInstallments] = useState([]);
  const [allInstallments, setAllInstallments] = useState([]); // Store all installments data here
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("all");

  const [installmentOptions] = useState([
    { id: "installment1_april", name: "Installment 1 (April)" },
    { id: "installment2_may", name: "Installment 2 (May)" },
    { id: "installment3_june", name: "Installment 3 (June)" },
    { id: "installment4_july", name: "Installment 4 (July)" },
    { id: "installment5_august", name: "Installment 5 (August)" },
    { id: "installment6_september", name: "Installment 6 (September)" },
    { id: "installment7_october", name: "Installment 7 (October)" },
    { id: "installment8_november", name: "Installment 8 (November)" },
    { id: "installment9_december", name: "Installment 9 (December)" },
    { id: "installment10_january", name: "Installment 10 (January)" },
    { id: "installment11_february", name: "Installment 11 (February)" },
    { id: "installment12_march", name: "Installment 12 (March)" },
  ]);

  const [formValues, setFormValues] = useState({
    classId: "",
    installment: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchClasses();
    fetchAllInstallments();
  }, []);

  useEffect(() => {
    filterInstallments();
  }, [selectedClass, allInstallments]);

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/all-class`
      );
      setClasses([
        { id: "all", name: "All Classes" },
        ...response.data.data.map((cls) => ({
          id: cls._id,
          name: `Class ${cls.name}`,
        })),
      ]);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  // Fetch all installments initially
  const fetchAllInstallments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-installment`
      );
      const allInstallments = response.data.data.flatMap((item) =>
        item.installments.map((inst) => ({
          ...inst,
          className: `Class ${item.class.name}`,
          classId: item.class._id,
        }))
      );

      setAllInstallments(allInstallments);
      setInstallments(allInstallments); // Set the initial installments to all data
    } catch (error) {
      console.error("Error fetching installments:", error);
    }
  };

  // Filter installments based on selected class
  // Filter installments based on selected class
  const filterInstallments = () => {
    if (selectedClass === "all") {
      // Use a map to consolidate installments based on unique month to avoid redundancy
      const uniqueInstallmentsMap = new Map();
      allInstallments.forEach((installment) => {
        if (!uniqueInstallmentsMap.has(installment.month)) {
          uniqueInstallmentsMap.set(installment.month, {
            ...installment,
            className: "All Classes", // Set a generic class name for all
          });
        }
      });

      setInstallments(Array.from(uniqueInstallmentsMap.values()));
    } else {
      // Filter installments for a specific class
      const filteredInstallments = allInstallments.filter(
        (inst) => inst.classId === selectedClass
      );
      setInstallments(filteredInstallments);
    }
  };

  // Handle input changes for adding new installment
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle filter dropdown change
  const handleClassFilterChange = (e) => {
    setSelectedClass(e.target.value);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        installment: formValues.installment,
        dueDate: formValues.dueDate,
      };

      if (formValues.classId !== "all") {
        payload.classId = formValues.classId;
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/add-installment`,
        payload
      );
      toast.success("Installment added successfully!");
      setFormValues({
        classId: "",
        installment: "",
        dueDate: "",
      });
      fetchAllInstallments(); // Refetch all installments to update the data
    } catch (error) {
      console.error("Error adding installment:", error);
      toast.error("Failed to add installment");
    }
  };

 // Handle delete installment
const handleDelete = async (index) => {
    const installment = installments[index];
    const payload = {
      classId: installment.classId,
      installmentId: installment._id,
    };
  
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/delete-installment`, {
        data: payload, // Add payload data to delete request
      });
      toast.success('Installment deleted successfully!');
      fetchAllInstallments(); // Refetch all installments to update the data
    } catch (error) {
      console.error('Error deleting installment:', error);
      toast.error('Failed to delete installment');
    }
  };
  

  // Handle update installment
  const handleUpdate = async (index) => {
    const installment = installments[index];
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/update-installment/${
          installment._id
        }`,
        {
          installment: installment.month,
          dueDate: installment.dueDate,
        }
      );
      toast.success("Installment updated successfully!");
      fetchAllInstallments(); // Refetch all installments to update the data
    } catch (error) {
      console.error("Error updating installment:", error);
      toast.error("Failed to update installment");
    }
  };

  const columns = [
    { header: "Installment", accessor: "month", type: "text" },
    { header: "Class", accessor: "className", type: "text" },
    { header: "Installment Date", accessor: "dueDate", type: "date" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Fees Installment Management</h2>

      {/* Add Installment Form */}
      <form
        className="mb-6 p-4 bg-[#283046] rounded shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap">
          <SearchableSelect
            labelName="Class"
            name="classId"
            value={formValues.classId}
            onChange={handleInputChange}
            options={classes}
            placeholder="Select"
          />
          <SearchableSelect
            labelName="Installment"
            name="installment"
            value={formValues.installment}
            onChange={handleInputChange}
            options={installmentOptions}
            placeholder="Select Installment"
            required
          />
          <Input
            labelName="Due Date"
            type="date"
            name="dueDate"
            value={formValues.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-[#6B46C1] text-white rounded-lg shadow hover:bg-[#5a39b1] transition-colors duration-300"
        >
          Submit
        </button>
      </form>

      {/* Class Filter */}
      <div className="mb-4">
        <label className="text-sm font-medium leading-none text-gray-400 mr-2">
          Filter by Class:
        </label>
        <select
          value={selectedClass}
          onChange={handleClassFilterChange}
          className="bg-[#283046] text-sm text-[#FFFFFF] mt-2 w-1/3 h-9 rounded-[5px] border-2 border-[#39424E] focus:border-[#6B46C1] outline-none px-2"
        >
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* Installments Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Update Installment Date</h3>
        <DynamicTable
          columns={columns}
          data={installments}
          handleInputChange={handleInputChange}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default FeesInstallment;
