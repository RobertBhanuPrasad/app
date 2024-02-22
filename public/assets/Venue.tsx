import React from "react";

function Venue({color}:any) {
  return (
    <div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 11.9995C9.67378 11.9995 7.78125 10.107 7.78125 7.78076C7.78125 5.45454 9.67378 3.56201 12 3.56201C14.3262 3.56201 16.2188 5.45454 16.2188 7.78076C16.2188 10.107 14.3262 11.9995 12 11.9995ZM12 4.49951C10.1907 4.49951 8.71875 5.97148 8.71875 7.78076C8.71875 9.59004 10.1907 11.062 12 11.062C13.8093 11.062 15.2812 9.59004 15.2812 7.78076C15.2812 5.97148 13.8093 4.49951 12 4.49951Z"
          fill={color}
        />
        <path
          d="M12 10.1245C10.7077 10.1245 9.65625 9.07311 9.65625 7.78076C9.65625 6.48842 10.7077 5.43701 12 5.43701C13.2923 5.43701 14.3438 6.48842 14.3438 7.78076C14.3438 9.07311 13.2923 10.1245 12 10.1245ZM12 6.37451C11.2246 6.37451 10.5938 7.00536 10.5938 7.78076C10.5938 8.55617 11.2246 9.18701 12 9.18701C12.7754 9.18701 13.4062 8.55617 13.4062 7.78076C13.4062 7.00536 12.7754 6.37451 12 6.37451Z"
          fill={color}
        />
        <path
          d="M5.82417 21.9643C4.06345 21.0839 3.09375 19.8756 3.09375 18.5619C3.09375 17.6329 3.58584 16.7427 4.51673 15.9877C5.36269 15.3015 6.55111 14.7435 7.95347 14.374C8.20378 14.3081 8.46023 14.4576 8.52614 14.7079C8.59209 14.9582 8.44261 15.2147 8.1923 15.2806C5.66456 15.9466 4.03125 17.2345 4.03125 18.5619C4.03125 20.5946 7.68052 22.3119 12 22.3119C16.3195 22.3119 19.9688 20.5946 19.9688 18.5619C19.9688 17.2345 18.3354 15.9466 15.8077 15.2806C15.5573 15.2147 15.4079 14.9582 15.4738 14.7079C15.5397 14.4575 15.7962 14.3079 16.0465 14.374C17.4489 14.7435 18.6373 15.3015 19.4832 15.9877C20.4142 16.7427 20.9062 17.6329 20.9062 18.5619C20.9062 19.8756 19.9365 21.0839 18.1758 21.9643C14.7473 23.6785 9.25406 23.6792 5.82417 21.9643Z"
          fill={color}
        />
        <path
          d="M11.7445 18.9551C11.6753 18.9101 10.0299 17.831 8.3655 15.9229C6.33966 13.6004 4.96875 10.8257 4.96875 7.78076C4.96875 3.90373 8.12297 0.749512 12 0.749512C15.877 0.749512 19.0312 3.90373 19.0312 7.78076C19.0312 10.826 17.6601 13.6008 15.6345 15.9229C13.97 17.831 12.3247 18.9101 12.2555 18.9551C12.1794 19.0045 12.0907 19.0308 12 19.0308C11.9093 19.0308 11.8206 19.0045 11.7445 18.9551ZM12 1.68701C8.63991 1.68701 5.90625 4.42067 5.90625 7.78076C5.90625 10.9922 7.61864 13.6354 9.05517 15.2873C10.2617 16.6748 11.4834 17.6182 12 17.9909C12.5165 17.6184 13.7381 16.675 14.9448 15.2873C16.3814 13.6354 18.0938 10.9922 18.0938 7.78076C18.0938 4.42067 15.3601 1.68701 12 1.68701Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

export default Venue;
