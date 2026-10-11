// src/components/admin/ui/FormField.tsx
"use client";

import { ReactNode } from "react";

interface BaseProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

interface InputProps extends BaseProps {
  type?: "text" | "email" | "tel" | "number" | "url" | "password";
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  required,
  hint,
}: InputProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-neutral-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error ? "border-red-400" : "border-neutral-200"
        } focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-sm`}
      />
      {hint && !error && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface TextAreaProps extends BaseProps {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
  error,
  required,
  hint,
}: TextAreaProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-neutral-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error ? "border-red-400" : "border-neutral-200"
        } focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-none text-sm`}
      />
      {hint && !error && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface SelectProps extends BaseProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
  hint,
}: SelectProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-neutral-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error ? "border-red-400" : "border-neutral-200"
        } focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white text-sm`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface ToggleProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}

export function ToggleField({ label, name, checked, onChange, hint }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-neutral-200">
      <div>
        <label htmlFor={name} className="text-sm font-semibold text-neutral-800 cursor-pointer">
          {label}
        </label>
        {hint && <p className="text-xs text-neutral-500 mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        id={name}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-brand-green" : "bg-neutral-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

interface FormWrapperProps {
  children: ReactNode;
  title?: string;
}

export function FormSection({ children, title }: FormWrapperProps) {
  return (
    <div className="space-y-5">
      {title && (
        <h3 className="font-heading text-lg font-bold text-brand-green border-b border-neutral-100 pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}