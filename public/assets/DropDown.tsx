import React from "react";

function DropDown({fill="#333333"}) {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke={fill}
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default DropDown;
