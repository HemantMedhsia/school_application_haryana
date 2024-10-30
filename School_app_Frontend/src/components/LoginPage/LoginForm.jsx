import React from "react";
import loginImg1 from "../../assets/loginImg1.jpg";
import loginImg2 from "../../assets/loginImg2.jpg";
import aradhyaFullLogo from "../../assets/aradhyaFullLogo.png";

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  error,
  role,
  setRole,
}) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-black">
      {/* Full-Screen Background Image */}
      <img
        src={loginImg1}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />

      {/* Watermark Logo - Full Screen */}
      <img
        src={aradhyaFullLogo}
        alt="Watermark Logo"
        className="absolute w-full h-[150%] opacity-20 mx-auto pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Centering the watermark
        }}
      />

      <div
        className="w-11/12 md:w-3/4 lg:w-1/2 h-auto m-5 md:m-10 shadow sm:rounded-lg flex justify-center z-10"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
      >
        <div className="w-full p-6 sm:p-12">
          {/* Logo Section - Top Left */}
          <div className="absolute top-4 left-4 flex justify-start">
            <img src={aradhyaFullLogo} className="w-20 md:w-40 h-auto" alt="Logo" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full flex-1 mt-8">
              <form className="mx-auto max-w-xs" onSubmit={handleLogin}>
                {/* Email Input */}
                <input
                  className="w-full px-4 py-3 md:px-8 md:py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {/* Password Input */}
                <input
                  className="w-full px-4 py-3 md:px-8 md:py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {/* Role Selection */}
                <div className="mt-5">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 md:px-8 md:py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    required
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                    <option value="Admin">Admin</option>
                    <option value="Parent">Parent</option>
                  </select>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-green-400 text-white w-full py-3 md:py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 -ml-2"
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

                {/* Error Message */}
                {error && (
                  <p className="mt-6 text-xs text-red-600 text-center">
                    {error}
                  </p>
                )}

                {/* Terms of Service and Privacy Policy */}
                <p className="mt-6 text-xs text-gray-100 text-center">
                  I agree to abide by Aradhya Technologies{" "}
                  <a
                    href="#"
                    className="border-b border-gray-500 border-dotted"
                  >
                    Terms of Service
                  </a>{" "}
                  and its{" "}
                  <a
                    href="#"
                    className="border-b border-gray-500 border-dotted"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
