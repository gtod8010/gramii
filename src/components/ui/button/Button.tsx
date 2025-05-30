import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline" | "danger"; // "danger" variant 추가
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  type?: 'button' | 'submit' | 'reset'; // type prop 추가
  isLoading?: boolean; // isLoading prop 추가
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = 'button', // 기본값을 'button'으로 설정
  isLoading = false, // isLoading prop 기본값 설정
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    danger: // danger variant 스타일 정의
      "bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:disabled:bg-red-400",
  };

  return (
    <button
      type={type} // type prop 전달
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled || isLoading ? "cursor-not-allowed opacity-50" : "" // isLoading 시에도 비활성 스타일 적용
      }`}
      onClick={onClick}
      disabled={disabled || isLoading} // isLoading 시에도 버튼 비활성화
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : startIcon}
      {isLoading ? '처리 중...' : children}
      {!isLoading && endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
