import React from 'react';
import LoginForm from '../components/LoginPage/LoginForm';

const LoginPage = () => {
  return (
    <div className="contain py-16">
    <div className='flex justify-center'>
      <h1>
        <span className="text-3xl font-medium">School</span>
        <span className="text-3xl font-medium text-blue-500">App</span>
      </h1>
    </div>
      <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
        <h2 className="text-2xl uppercase font-medium mb-1">Login</h2>
        <p className="text-gray-600 mb-6 text-sm">Welcome! So good to have you back!</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;