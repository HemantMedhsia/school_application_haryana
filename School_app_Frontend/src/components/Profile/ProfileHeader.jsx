import React from "react";
import FormButton from "../Form/FormButton";

const ProfileHeader = ({ userData }) => {
  const displayName = userData.name
    ? userData.name
    : userData.fatherName
    ? userData.fatherName
    : `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
      "No Name Provided";
      
  return (
    <div className="relative mb-6">
      <img
        src="http://www.localplaner.de/img/timeline.aa03c008.jpg"
        className="w-full h-56 object-cover rounded-lg"
        alt="Cover"
      />
      <div className="absolute bottom-0 left-0 flex items-center p-4 bg-gradient-to-t from-gray-900 to-transparent w-full">
        <img
          src={
            userData.studentPhoto ||
            "https://www.shutterstock.com/image-photo/portrait-attractive-young-asian-woman-260nw-2411114955.jpg"
          }
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-[#65FA9E] object-cover"
        />
        <div className="ml-4">
          <h2 className="text-2xl font-semibold">
            <h2 className="text-2xl font-semibold">{displayName}</h2>
          </h2>
          <p className="text-gray-400">Role: {userData.role}</p>
        </div>
        <div className="ml-auto">
          <FormButton name={"Edit"} />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;