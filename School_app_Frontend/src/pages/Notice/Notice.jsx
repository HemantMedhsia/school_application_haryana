import React, { useState } from "react";
import FormSection from "../../components/Form/FormSection";
import Input from "../../components/Form/Input";
import Select from "../../components/Form/Select";
import FormButton from "../../components/Form/FormButton";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notice = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    audience: "",
    // date: "",
    description: "",
    // attachments: [],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    const schoolId = import.meta.env.SchoolId;
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-notice/${schoolId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log("Notice created successfully:", response.data);
      toast.success("Notice created successfully!");
    } catch (error) {
      console.error("Error creating notice:", error);
      toast.error("Error creating notice! Please try again.");
    }
  };

  return (
    <div className="w-full bg-[#283046] rounded-md p-12">
      <form onSubmit={handleSubmit}>
        <FormSection title={"Create Notice"}>
          <Input
            labelName="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter Notice Title"
          />

          <Select
            labelName="Category"
            name="category"
            placeholder="Select"
            value={formData.category}
            onChange={handleChange}
            options={[
              { id: "Event", name: "Event" },
              { id: "Holiday", name: "Holiday" },
              { id: "Announcement", name: "Announcement" },
              { id: "General", name: "General" },
            ]}
          />

          <Select
            labelName="Audience"
            name="audience"
            placeholder="Select"
            value={formData.audience}
            onChange={handleChange}
            options={[
              { id: "Student", name: "Student" },
              { id: "Teacher", name: "Teacher" },
              { id: "Parent", name: "Parent" },
              { id: "All", name: "All" },
            ]}
          />

          <textarea
            className="bg-[#283046] mt-2 text-sm w-full h-32 rounded-[5px] p-2.5 text-[#FFFFFF] border-2 border-gray-600 focus:border-[#6B46C1] outline-none"
            placeholder="Enter Notice Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </FormSection>
        <div className="flex gap-2 flex-row-reverse">
          <FormButton name="Create Notice" />
          <FormButton name="Publish" />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Notice;
