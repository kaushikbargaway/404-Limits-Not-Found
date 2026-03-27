import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow active:shadow-none';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/20 focus:ring-blue-500',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 shadow-none hover:shadow-none'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
