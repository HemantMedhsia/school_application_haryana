import React from "react";
import ContactCard from "../components/Form/ContactCard";

const ViewContact = () => {
  const contacts = [
    {
      name: "John Doe",
      role: "Developer",
      email: "john.doe@example.com",
      mobileNumber: "+1234567890",
    },
    {
      name: "Jane Smith",
      role: "Designer",
      email: "jane.smith@example.com",
      mobileNumber: "+0987654321",
    },
    {
      name: "Michael Johnson",
      role: "Project Manager",
      email: "michael.johnson@example.com",
      mobileNumber: "+1122334455",
    },
    {
      name: "Emily Davis",
      role: "QA Engineer",
      email: "emily.davis@example.com",
      mobileNumber: "+5566778899",
    },
    {
      name: "Chris Brown",
      role: "DevOps Engineer",
      email: "chris.brown@example.com",
      mobileNumber: "+2233445566",
    },
  ];

  const handleEdit = (index) => {
    // Edit logic here
    console.log("Edit contact at index:", index);
  };

  const handleDelete = (index) => {
    // Delete logic here
    console.log("Delete contact at index:", index);
  };

  return (
    <div>
      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact, index) => (
          <ContactCard key={index} contact={contact} />
        ))}
      </div>
    </div>
  );
};

export default ViewContact;
