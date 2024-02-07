import React from "react";

interface CustomSVGProps {
  width?: number;
  height?: number;
}

const Arrow: React.FC<CustomSVGProps> = ({ width = 17, height = 15 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.588 9C11.2786 13 10.1239 15 8.39188 15C8.39188 15 8.39188 15 8.39187 15C6.65982 15 5.50512 13 3.19572 9C0.886324 5 -0.268377 3 0.597649 1.5C1.46367 0 3.77307 0 8.39188 0C13.0107 0 15.3201 0 16.1861 1.5C16.1861 1.5 16.1861 1.5 16.1861 1.5C17.0521 3 15.8974 5 13.588 9Z"
        fill="#333333"
      />
    </svg>
  );
};

export default Arrow
