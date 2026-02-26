'use client'

import React from 'react'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
}

export function AuthInput({ id, label, className = '', ...props }: AuthInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        className={`peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-primary transition-colors ${className}`}
        placeholder={label}
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
      >
        {label}
      </label>
    </div>
  )
}
