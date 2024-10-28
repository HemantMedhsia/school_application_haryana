import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DynamicTable from '../../common/Datatables/DynamicTable';
import Input from '../../components/Form/Input';
import SearchableSelect from '../../components/Form/Select';
import { toast, ToastContainer } from 'react-toastify';

const FeesInstallment = () => {
  const [installments, setInstallments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [installmentOptions] = useState([
    { id: 'installment1', name: 'Installment 1' },
    { id: 'installment2', name: 'Installment 2' },
    { id: 'installment3', name: 'Installment 3' },
    { id: 'installment4', name: 'Installment 4' },
  ]);
  const [formValues, setFormValues] = useState({
    classId: '',
    installment: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchClasses();
    fetchInstallments();
  }, []);

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/all-class`);
      setClasses(
        response.data.data.map((cls) => ({
          id: cls._id,
          name: `Class ${cls.name}`,
        }))
      );
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // Fetch all installments
  const fetchInstallments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-installments`);
      setInstallments(response.data);
    } catch (error) {
      console.error('Error fetching installments:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/add-installment`, formValues);
      toast.success('Installment added successfully!');
      setFormValues({
        classId: '',
        installment: '',
        dueDate: '',
      });
      fetchInstallments();
    } catch (error) {
      console.error('Error adding installment:', error);
      toast.error('Failed to add installment');
    }
  };

  // Handle delete installment
  const handleDelete = async (index) => {
    const installmentId = installments[index]._id;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/delete-installment/${installmentId}`);
      toast.success('Installment deleted successfully!');
      fetchInstallments();
    } catch (error) {
      console.error('Error deleting installment:', error);
      toast.error('Failed to delete installment');
    }
  };

  const columns = [
    { header: 'Installment', accessor: 'installment', type: 'text' },
    { header: 'Class', accessor: 'className', type: 'text' },
    { header: 'Installment Date', accessor: 'dueDate', type: 'date' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Fees Installment Management</h2>

      {/* Add Installment Form */}
      <form className="mb-6 p-4 bg-[#283046] rounded shadow-sm" onSubmit={handleSubmit}>
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

      {/* Installments Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Update Installment Date</h3>
        <DynamicTable
          columns={columns}
          data={installments.map((installment) => ({
            ...installment,
            className: classes.find((cls) => cls.id === installment.classId)?.name || 'N/A',
          }))}
          handleInputChange={handleInputChange}
          handleDelete={handleDelete}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default FeesInstallment;
