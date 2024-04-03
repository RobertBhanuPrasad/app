import React from "react";

function Tick() {
  return (
    <div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" fill="#4DD459" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.5714 16L7 12.1538L8 11.0769L10.5714 13.8462L16 8L17 9.07692L10.5714 16Z"
          fill="white"
        />
      </svg>
    </div>
  );
}

export default Tick;
