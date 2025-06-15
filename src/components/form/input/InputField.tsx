import React, { FC } from "react";

export interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | "checkbox" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  checked?: boolean; // For checkbox
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string | number;
  max?: string | number;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string; // Optional hint text
  required?: boolean; // 추가된 prop
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  defaultValue,
  checked,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  required,
}) => {
  let finalClassNames: string;

  if (type === 'checkbox') {
    finalClassNames = `form-checkbox h-5 w-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-brand-500 ${className}`.trim();
  } else {
    // 기본 스타일 (모든 non-checkbox input에 적용)
    const baseInputClasses = "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3";

    // 상태별 스타일
    let stateSpecificClasses = "";
    if (disabled) {
      stateSpecificClasses = "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400";
    } else if (error) {
      stateSpecificClasses = "border-error-500 text-error-800 focus:border-error-500 focus:ring-error-500/10 dark:border-error-500 dark:text-error-400";
    } else if (success) {
      stateSpecificClasses = "border-success-400 text-success-500 focus:border-success-300 focus:ring-success-500/10 dark:border-success-500 dark:text-success-400";
    } else {
      // 기본 (활성) 상태
      stateSpecificClasses = "border-gray-300 bg-white text-gray-800 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-form-input dark:text-white dark:focus:border-brand-800";
      // TailAdmin의 일반 input은 dark:bg-form-input, dark:text-white, dark:focus:border-primary 등을 사용하므로 이를 참고하여 수정.
      // 이전 코드에서는 dark:bg-gray-900, dark:text-white/90 등을 사용했었음. TailAdmin 기본값에 맞추는 것이 좋음.
    }
    finalClassNames = `${baseInputClasses} ${stateSpecificClasses} ${className}`.replace(/\s+/g, ' ').trim();
  }

  return (
    <div className={type === 'checkbox' ? 'flex items-center' : 'relative'}>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={type !== 'checkbox' ? placeholder : undefined}
        value={type !== 'checkbox' ? value : undefined}
        defaultValue={type !== 'checkbox' ? defaultValue : undefined}
        checked={type === 'checkbox' ? checked : undefined}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={finalClassNames} // 최종적으로 조합된 클래스 사용
        required={required} // 추가된 prop 사용
      />

      {hint && type !== 'checkbox' && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
