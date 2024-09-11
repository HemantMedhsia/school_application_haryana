import React from "react";

const ProfileCard = ({ title, details }) => {
  return (
    <div className="bg-gray-900 shadow overflow-hidden sm:rounded-lg mb-6 w-full">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-xl font-semibold leading-6 text-[#7367F0]">
          {title}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Details and information about {title.toLowerCase()}.
        </p>
      </div>
      <div>
        <dl>
          {details.map((detail, index) => (
            <div
              key={index}
              className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-grhover:bg-slate-500 rounded-md ${
                index % 2 === 0 ? "bg-[#283046]" : "bg-gray-900"
              }`}
            >
              <dt className="text-md font-medium text-[#65FA9E]">
                {detail.label}
              </dt>
              <dd className="mt-1 text-lg text-gray-100 sm:mt-0 sm:col-span-2">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default ProfileCard;
