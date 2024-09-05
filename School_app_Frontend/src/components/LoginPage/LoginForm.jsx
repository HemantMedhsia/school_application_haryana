import React from "react";

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  error,
  role,
  setRole,
}{
  email,
  setEmail,
  teacherLoginPassword,
  setTeacherLoginPassword,
  error,
  role,
  setRole,
  handleLogin,
}) => {
  return (
    <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
      <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <div>
          <img
            src="https://drive.google.com/uc?export=view&id=1MFiKAExRFF0-2YNpAZzIu1Sh52J8r16v"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mx-auto"
            alt="Logo"
          />
        </div>
        <div className="mt-12 flex flex-col items-center">
          <div className="w-full flex-1 mt-8">
            <form className="mx-auto max-w-xs" onSubmit={handleLogin}>
              <input
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                type="password"
                placeholder="Password"
                value={password}
              value={teacherLoginPassword}
              onChange={(e) => setTeacherLoginPassword(e.target.value)}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Role Selection */}
              <div className="mt-5">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                >
                  <option value="Teacher">Teacher</option>
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <button className="mt-5 tracking-wide font-semibold bg-green-400 text-white w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                <svg
                  className="w-6 h-6 -ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                <span className="ml-2">Sign In</span>
              </button>
              {error && (
                <p className="mt-6 text-xs text-red-600 text-center">
                  {error}
                </p>
              )}
              <p className="mt-6 text-xs text-gray-600 text-center">
                I agree to abide by Cartesian Kinetics
                <a
                  href="#"
                  className="border-b border-gray-500 border-dotted"
                >
                  Terms of Service
                </a>
                and its
                <a
                  href="#"
                  className="border-b border-gray-500 border-dotted"
                >
                  Privacy Policy
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-green-100 text-center hidden lg:flex">
        <div
          className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://drive.google.com/uc?export=view&id=1KZ_Ub_2lZ0dHbKV0fAIhxVhiQA183RCz')",
          }}
        ></div>
      </div>
    </div>
  );
};

export default LoginForm;
