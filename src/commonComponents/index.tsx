import React, { ReactNode } from "react";

interface Header2Props {
  children: ReactNode;
}

interface ItemValueProps {
  children: ReactNode;
}

export const Header2: React.FC<Header2Props> = ({ children }) => {
  return (
    <div className="text-[#999999] text-[14px] font-normal">{children}</div>
  );
};

export const ItemValue: React.FC<ItemValueProps> = ({ children }) => {
  return <abbr className="text-base font-semibold truncate no-underline block" title={children}>{children}</abbr>;
};
