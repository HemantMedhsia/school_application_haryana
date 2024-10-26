import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../../components/Form/Input';
import FormSection from '../../components/Form/FormSection';
import FormButton from '../../components/Form/FormButton';
import SearchableSelect from '../../components/Form/Select';

const FeesDiscount = () => {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    discountCode: '',
    description: '',
    discountType: 'fixAmount',
    fixAmountValue: 0,
    percentageValue: 0,
  });

  useEffect(() => {
    // Fetch all discounts on mount
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-all-fees-discount`);
      setDiscounts(response.data.data);
    } catch (error) {
      toast.error('Error fetching discounts');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateDiscount = async () => {
    const { discountType, fixAmountValue, percentageValue, ...rest } = formData;
    const payload = {
      ...rest,
      discountType,
      ...(discountType === 'fixAmount' ? { fixAmountValue } : { percentageValue }),
    };
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/create-fees-discount`, payload);
toast.success('Discount created successfully');
      fetchDiscounts();
    } catch (error) {
      toast.error('Error creating discount');
    }
  };

  const handleUpdateDiscount = async (id) => {
    const { discountType, fixAmountValue, percentageValue, ...rest } = formData;
    const payload = {
      ...rest,
      discountType,
      ...(discountType === 'fixAmount' ? { fixAmountValue } : { percentageValue }),
    };
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/update-fees-discount/${id}`, payload);
toast.success('Discount updated successfully');
      fetchDiscounts();
    } catch (error) {
      toast.error('Error updating discount');
    }
  };

  const handleDeleteDiscount = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/delete-fees-discount/${id}`);
toast.success('Discount deleted successfully');
      fetchDiscounts();
    } catch (error) {
      toast.error('Error deleting discount');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex">
      <div className="w-full md:w-2/3 lg:w-1/2">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#65FA9E]">Fees Discount Management</h1>

        <div className="bg-[#283046] p-6 rounded-lg shadow-lg mb-8">
          <FormSection title="Create Discount">
            <Input
              labelName="Discount Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter discount name"
            />
            <Input
              labelName="Discount Code"
              name="discountCode"
              value={formData.discountCode}
              onChange={handleInputChange}
              placeholder="Enter discount code"
            />
            <Input
              labelName="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
            />
            <SearchableSelect
              labelName="Discount Type"
              name="discountType"
              value={formData.discountType}
              onChange={handleInputChange}
              options={[{ id: 'fixAmount', name: 'Fixed Amount' }, { id: 'percentage', name: 'Percentage' }]}
              placeholder="Select"
            />
            {formData.discountType === 'fixAmount' ? (
              <Input
                labelName="Fixed Amount Value"
                type="number"
                name="fixAmountValue"
                value={formData.fixAmountValue}
                onChange={handleInputChange}
                placeholder="Enter fixed amount"
              />
            ) : (
              <Input
                labelName="Percentage Value"
                type="number"
                name="percentageValue"
                value={formData.percentageValue}
                onChange={handleInputChange}
                placeholder="Enter percentage value"
              />
            )}
            <FormButton name="Create Discount" onClick={handleCreateDiscount} />
          </FormSection>
        </div>
      </div>

      <div className="w-full md:w-1/3 lg:w-1/2 pl-6">
        <div className="bg-[#283046] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-[#7367F0] mb-4">All Discounts</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
            {discounts.map((discount) => (
              <div key={discount._id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#65FA9E] mb-2">{discount.name}</h3>
                <p className="text-gray-300 mb-1">Code: {discount.discountCode}</p>
                <p className="text-gray-300 mb-1">Description: {discount.description}</p>
                <p className="text-gray-300 mb-1">Type: {discount.discountType === 'fixAmount' ? 'Fixed Amount' : 'Percentage'}</p>
                <p className="text-gray-300 mb-4">
                  Value: {discount.discountType === 'fixAmount' ? discount.fixAmountValue : discount.percentageValue}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleUpdateDiscount(discount._id)}
                    className="bg-[#7367F0] text-white font-bold py-1 px-3 rounded hover:bg-[#5e5bd0] transition duration-200 ease-in-out"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => navigate(`/school/assign-discount/${discount._id}`)}
                    className="bg-green-500 text-white font-bold py-1 px-3 rounded hover:bg-green-400 transition duration-200 ease-in-out"
                  >
                    Assign to Student
                  </button>
                  <button
                    onClick={() => handleDeleteDiscount(discount._id)}
                    className="bg-red-600 text-white font-bold py-1 px-3 rounded hover:bg-red-500 transition duration-200 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesDiscount;
