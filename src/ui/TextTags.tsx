import React from 'react'

interface TextProps {
  color?:string,
  children: React.ReactNode
}

const Heading1: React.FC<TextProps> = ({ children }) => {
  return <p className="text-32px font-semibold text-#333333">{children}</p>
}

const Heading2: React.FC<TextProps> = ({ children }) => {
  return <p className="text-24px font-semibold text-#333333">{children}</p>
}

const Heading3: React.FC<TextProps> = ({ children }) => {
  return <p className="text-18px font-semibold text-#333333">{children}</p>
}

const ItemLabel: React.FC<TextProps> = ({ children }) => {
  return <p className="text-14px font-normal text-#999999">{children}</p>
}


const ItemValue: React.FC<TextProps> = ({ children }) => {
  return <p className="text-16px font-semibold text-#666666">{children}</p>
}

const TableHeader: React.FC<TextProps> = ({ children, color }) => {
  return <p className={`text-14px font-semibold ${color ? `text-${color}` : '#333333'}`}>{children}</p>
}


const Text: React.FC<TextProps> = ({ children }) => {
  return <p className="text-14px font-normal text-#333333">{children}</p>
}

export {Heading1, Heading2, Heading3, ItemLabel, ItemValue, TableHeader, Text};
