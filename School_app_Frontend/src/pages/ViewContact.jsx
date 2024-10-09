import React, { useEffect, useState } from "react";
import ContactCard from "../components/Form/ContactCard";
import { getAPI } from "../utility/api/apiCall";

const ViewContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      setLoading(true);
      await getAPI("getAllContactDetails", {}, setContacts);
      setLoading(false);
    };
    fetchContact();
  }, []);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <ContactCard
            key={contact._id}
            contact={{
              name: contact.name,
              post: contact.post,
              email: contact.email,
              phone: `+91${contact.phone}`, // Formatting phone number as needed
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewContact;
