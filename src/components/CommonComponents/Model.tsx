import CrossIcon from "@public/assets/CrossIcon";
import React, { ReactNode } from "react";

interface ModalProps {
  visible: boolean;
  handleClose: ()=>void;
  children: ReactNode;
  closeIcon?: boolean;
  styles?: string;
  id?: string;
}

export default function Modal({
  visible,
  handleClose,
  children,
  closeIcon,
  styles,
  id = "modal",
}: ModalProps) {
  if (!visible) return null;
  return (
    <div
      id={id}
      className="inset-0 fixed w-full z-[500] h-full overflow-y-auto bg-black bg-opacity-30 "
    >
      <div
        className={`card relative bg-[#FFFFFF] mx-auto shadow-lg rounded-[10px] py-5  my-16  ${styles} `}
      >
        {closeIcon !== false && (
          <button
            className="flex ml-auto w-[26px] h-[26px] top-[22px] right-[22px] absolute cursor-pointer"
            onClick={handleClose}
          >
            <CrossIcon />
          </button>
        )}
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
}
