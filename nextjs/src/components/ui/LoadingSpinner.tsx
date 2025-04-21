interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  className = "",
  size = "md",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = fullScreen
    ? "flex items-center justify-center min-h-screen"
    : "flex items-center justify-center min-h-[60vh]";

  return (
    <div className={`max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 ${className}`}>
      <div className={containerClasses}>
        <div
          className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-blue-500`}
        ></div>
      </div>
    </div>
  );
}
