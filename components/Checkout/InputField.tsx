// components/Checkout/InputField.tsx
import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = ({ label, error, ...props }: Props) => {
  return (
    <div className="relative w-full mb-4">
      <input
        {...props}
        placeholder=" "
        className={`peer w-full px-4 pt-6 pb-2 border-2 rounded-xl outline-none transition-all
          ${error ? "border-red-400 focus:border-red-500" : "border-gray-100 focus:border-orange-500"}
          bg-gray-50 focus:bg-white text-gray-800`}
      />
      <label
        className="absolute left-4 top-2 text-xs font-semibold uppercase tracking-wider text-gray-400 transition-all 
        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-500 peer-focus:font-bold"
      >
        {label}
      </label>
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-2 font-medium">{error}</p>
      )}
    </div>
  );
};
