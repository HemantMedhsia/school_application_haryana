import React, { useState } from "react";
import FormSection from "../components/Form/FormSection";
import Select from "../components/Form/Select";
import Input from "../components/Form/Input";
import FormButton from "../components/Form/FormButton";
import { toast, ToastContainer } from "react-toastify";
import ContactCard from "../components/Form/ContactCard";

const ContactDetails = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    mobileNumber: "",
  });
  const [contacts, setContacts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      const updatedContacts = [...contacts];
      updatedContacts[editIndex] = formData;
      setContacts(updatedContacts);
      toast.success("Contact information updated successfully!");
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setContacts([...contacts, formData]);
      toast.success("Contact information added successfully!");
    }

    setFormData({
      name: "",
      role: "",
      email: "",
      mobileNumber: "",
    });
  };

  const handleEdit = (index) => {
    setFormData(contacts[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
    toast.success("Contact information deleted successfully!");
  };

  return (
    <>
      <form
        className="max-w-full mx-auto p-6 bg-[#283046] rounded-lg shadow-lg text-[#E0E0E0]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-[#7367F0]">
          {isEditing ? "Edit Contact Information" : "Add Contact Information"}
        </h2>

        {/* Staff Details Section */}
        <FormSection>
          <Input
            labelName="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Name"
          />

          <Input
            labelName="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Enter Role"
          />
        </FormSection>

        <FormSection>
          <Input
            labelName="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            type="email"
          />

          <Input
            labelName="Mobile Number"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="Enter Mobile Number"
            type="tel"
          />
        </FormSection>

        {/* Submit Button */}
        <FormButton
          name={isEditing ? "Update Information" : "Add Information"}
        />

        <ToastContainer />
      </form>

      {/* Display Contact Cards */}
      {contacts.length > 0 && (
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact, index) => (
            <ContactCard
              key={index}
              contact={contact}
              onEdit={() => handleEdit(index)}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ContactDetails;
