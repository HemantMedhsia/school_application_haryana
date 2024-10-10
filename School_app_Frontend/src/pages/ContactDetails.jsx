import React, { useState, useEffect } from "react";
import FormSection from "../components/Form/FormSection";
import Select from "../components/Form/Select"; // Not used in your current code
import Input from "../components/Form/Input";
import FormButton from "../components/Form/FormButton";
import { toast, ToastContainer } from "react-toastify";
import ContactCard from "../components/Form/ContactCard";
import axios from "axios";
import { getAPI } from "../utility/api/apiCall";

const ContactDetails = () => {
  const [formData, setFormData] = useState({
    name: "",
    post: "",
    email: "",
    phone: "",
  });
  const [contacts, setContacts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    await getAPI("getAllContactDetails", {}, setContacts);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/update-contact/${
            contacts[editIndex]._id
          }`,
          formData
        ); // Update endpoint
        const updatedContacts = [...contacts];
        updatedContacts[editIndex] = formData;
        setContacts(updatedContacts);
        toast.success("Contact information updated successfully!");
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/add-contact`,
          formData
        );
        setContacts([...contacts, response.data]);
        toast.success("Contact information added successfully!");
      }

      fetchContacts();

      setFormData({
        name: "",
        post: "",
        email: "",
        phone: "",
      });
      setIsEditing(false);
      setEditIndex(null);
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Failed to save contact.");
    }
  };

  const handleEdit = (index) => {
    setFormData(contacts[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    console.log(contacts[index]._id);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-contact/${
          contacts[index]._id
        }`
      );
      const updatedContacts = contacts.filter((_, i) => i !== index);
      setContacts(updatedContacts);
      toast.success("Contact information deleted successfully!");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact.");
    }
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
            labelName="Post"
            name="post"
            value={formData.post}
            onChange={handleChange}
            placeholder="Enter Post"
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
            labelName="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter Phone Number"
            type="Phone"
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
