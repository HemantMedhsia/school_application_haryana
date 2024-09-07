import React from "react";
import FormSection from "../components/Form/FormSection";
import Input from "../components/Form/Input";
import Select from "../components/Form/Select";
import FormButton from "../components/Form/FormButton";

const Notice = () => {
  return (
    <div className="w-full bg-[#283046] rounded-md p-12">
      <FormSection title={"Create Notice"}>
        <Input
          labelName="Title"
          name="title"
          //   value={}
          //   onChange={}
          placeholder="Enter Notice Title"
        />

        <Select labelName="Category" name="catefory" placeholder="Select" options={[
            { id: "Event", name: "Event" },
            { id: "Holiday", name: "Holiday" },
            { id: "Announcement", name: "Announcement" },
            { id: "General", name: "General" },
          ]} />

        <Select labelName="Audience" name="audience" placeholder="Select" options={[
            { id: "Student", name: "Student" },
            { id: "Teacher", name: "Teacher" },
            { id: "Parent", name: "Parent" },
            { id: "All", name: "All" },
          ]} />

        <textarea className="bg-[#283046] mt-2 text-sm w-full h-32 rounded-[5px] p-2.5 text-[#FFFFFF] border-2 border-gray-600 focus:border-[#6B46C1] outline-none" placeholder="Enter Notice Description"></textarea>
      </FormSection>
      <div className="flex gap-2 flex-row-reverse"><FormButton name="Create Notice" />
      <FormButton name="Publish" /></div>
    </div>
  );
};

export default Notice;
