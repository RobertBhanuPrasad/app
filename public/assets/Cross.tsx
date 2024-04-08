<<<<<<< HEAD
export default function Cross() {
    return (
        <div>
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M18 2L2 18M2 2L18 18"
                    stroke="#333333"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </div>
    );
}
=======
import React from "react";

function Cross() {
  return (
    <div>
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_3690_12028)">
          <path
            d="M30 59.9802C46.5685 59.9802 60 46.5575 60 29.9998C60 13.4422 46.5685 0.0195312 30 0.0195312C13.4315 0.0195312 0 13.4422 0 29.9998C0 46.5575 13.4315 59.9802 30 59.9802Z"
            fill="#FF6D6D"
          />
          <path
            d="M20.4855 15.8418L15.8459 20.4814L39.5174 44.1529L44.157 39.5133L20.4855 15.8418Z"
            fill="white"
          />
          <path
            d="M39.5152 15.8402L15.8438 39.5117L20.4833 44.1513L44.1548 20.4798L39.5152 15.8402Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_3690_12028">
            <rect width="60" height="60" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default Cross;
>>>>>>> 3586548d3cbacb2007a037b79c94aecc43a0a63d
