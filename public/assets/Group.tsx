import React from "react";

function Group({ color }: any) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.375 3V6C14.375 6.16576 14.4408 6.32473 14.5581 6.44194C14.6753 6.55915 14.8342 6.625 15 6.625C15.1658 6.625 15.3247 6.55915 15.4419 6.44194C15.5592 6.32473 15.625 6.16576 15.625 6V3.00009C15.6245 2.30403 15.3478 1.63662 14.8556 1.14443C14.3634 0.652249 13.696 0.375516 13 0.375C12.9999 0.375 12.9999 0.375 12.9999 0.375L13 0.25L14.375 3ZM14.375 3C14.375 2.24196 13.758 1.625 13 1.625H3C2.24196 1.625 1.625 2.24196 1.625 3V17C1.625 17.758 2.24196 18.375 3 18.375H13C13.758 18.375 14.375 17.758 14.375 17V16C14.375 15.8342 14.4408 15.6753 14.5581 15.5581C14.6753 15.4408 14.8342 15.375 15 15.375C15.1658 15.375 15.3247 15.4408 15.4419 15.5581C15.5592 15.6753 15.625 15.8342 15.625 16V16.9999C15.6245 17.696 15.3478 18.3634 14.8556 18.8556C14.3634 19.3478 13.696 19.6245 12.9999 19.625M14.375 3L12.9999 19.625M12.9999 19.625H3.00009C2.30403 19.6245 1.63662 19.3478 1.14443 18.8556C0.652239 18.3634 0.375506 17.696 0.375 16.9999L0.375 3.00005M12.9999 19.625L3.00009 0.375C2.30403 0.375506 1.63662 0.652239 1.14443 1.14443C0.652249 1.63661 0.375516 2.304 0.375 3.00005M0.375 3.00005C0.375 3.00006 0.375 3.00008 0.375 3.00009L0.25 3H0.375V3.00005ZM9.44194 4.55806C9.55915 4.67527 9.625 4.83424 9.625 5C9.625 5.16576 9.55915 5.32473 9.44194 5.44194C9.32473 5.55915 9.16576 5.625 9 5.625H4C3.83424 5.625 3.67527 5.55915 3.55806 5.44194C3.44085 5.32473 3.375 5.16576 3.375 5C3.375 4.83424 3.44085 4.67527 3.55806 4.55806C3.67527 4.44085 3.83424 4.375 4 4.375H9C9.16576 4.375 9.32473 4.44085 9.44194 4.55806ZM6.44194 7.55806C6.55915 7.67527 6.625 7.83424 6.625 8C6.625 8.16576 6.55915 8.32473 6.44194 8.44194C6.32473 8.55915 6.16576 8.625 6 8.625H4C3.83424 8.625 3.67527 8.55915 3.55806 8.44194C3.44085 8.32473 3.375 8.16576 3.375 8C3.375 7.83424 3.44085 7.67527 3.55806 7.55806C3.67527 7.44085 3.83424 7.375 4 7.375H6C6.16576 7.375 6.32473 7.44085 6.44194 7.55806ZM3.55806 10.5581C3.67527 10.4408 3.83424 10.375 4 10.375H5C5.16576 10.375 5.32473 10.4408 5.44194 10.5581C5.55915 10.6753 5.625 10.8342 5.625 11C5.625 11.1658 5.55915 11.3247 5.44194 11.4419C5.32473 11.5592 5.16576 11.625 5 11.625H4C3.83424 11.625 3.67527 11.5592 3.55806 11.4419C3.44085 11.3247 3.375 11.1658 3.375 11C3.375 10.8342 3.44085 10.6753 3.55806 10.5581Z"
        fill={color}
        stroke="#FEF8F6"
        stroke-width="0.25"
      />
      <path
        d="M17.8013 13.9181L17.8502 13.8347C18.3395 13.0009 18.625 12.0346 18.625 11C18.625 7.89904 16.101 5.375 13 5.375C9.89904 5.375 7.375 7.89904 7.375 11C7.375 14.101 9.89904 16.625 13 16.625H13C14.4769 16.6254 15.8943 16.0429 16.9441 15.0041L17.0325 14.9167L17.1204 15.0046L18.5574 16.4416L18.5576 16.4418C18.6155 16.4999 18.6842 16.546 18.76 16.5775C18.8358 16.609 18.917 16.6252 18.999 16.6252C19.081 16.6252 19.1622 16.609 19.238 16.5775C19.3138 16.546 19.3825 16.4999 19.4404 16.4418L19.4406 16.4416C19.4987 16.3835 19.5448 16.3146 19.5762 16.2388C19.6077 16.1629 19.6238 16.0816 19.6238 15.9995C19.6238 15.9174 19.6077 15.8361 19.5762 15.7602C19.5448 15.6844 19.4988 15.6155 19.4407 15.5575M17.8013 13.9181L19.4407 15.5575M17.8013 13.9181L17.8696 13.9864M17.8013 13.9181L17.8696 13.9864M19.4407 15.5575C19.4407 15.5575 19.4407 15.5575 19.4407 15.5575M19.4407 15.5575L19.4407 15.5575M19.4407 15.5575L19.4406 15.5574M19.4407 15.5575C19.4407 15.5575 19.4407 15.5574 19.4406 15.5574M19.4406 15.5574L17.8696 13.9864M19.4406 15.5574L17.8696 13.9864M15.0865 9.38028C15.2425 9.40209 15.3843 9.48175 15.4839 9.60292L15.4991 9.62308C15.5987 9.75566 15.6417 9.92231 15.6187 10.0865C15.5958 10.2507 15.5087 10.3991 15.3766 10.4993C15.3766 10.4993 15.3765 10.4993 15.3765 10.4994L12.7098 12.5082L12.7097 12.5082C12.601 12.5902 12.4686 12.6345 12.3325 12.6344C12.1963 12.6342 12.064 12.5896 11.9555 12.5074L11.9555 12.5074L10.6225 11.4974L10.6224 11.4973C10.4903 11.3973 10.4032 11.2489 10.3805 11.0847C10.3578 10.9206 10.4012 10.7541 10.5012 10.6219C10.6012 10.4898 10.7496 10.4027 10.9138 10.38C11.0779 10.3573 11.2444 10.4007 11.3766 10.5007L11.3766 10.5007L12.2586 11.1677L12.3339 11.2246L12.4092 11.1678L14.6231 9.49994C14.7557 9.40033 14.9223 9.35731 15.0865 9.38028ZM8.625 11C8.625 13.4131 10.588 15.375 13 15.375C15.412 15.375 17.375 13.412 17.375 11C17.375 8.58796 15.412 6.625 13 6.625C10.588 6.625 8.625 8.58695 8.625 11Z"
        fill={color}
        stroke="#FEF8F6"
        stroke-width="0.25"
      />
    </svg>
  );
}

export default Group;