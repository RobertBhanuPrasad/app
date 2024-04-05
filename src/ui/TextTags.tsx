import React, { HTMLAttributes } from 'react';

/** Component for a level 1 heading with a font size of 32px and semibold font weight
 * 
 * @param Example  "Happiness Program for Youth"
 */
const MainHeading: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return <h1 className="text-[32px] font-semibold text-[#333333]" {...props}>{children}</h1>;
}

/** Component for a level 2 heading with a font size of 24px and semibold font weight
 *
 * @param Example "Happiness Program for Youth"
 */
const SubHeading: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return <h2 className="text-2xl font-semibold text-[#333333]" {...props}>{children}</h2>;
}

/** Component for a level 3 heading with a font size of 18px and semibold font weight
 *
 * @param Example "Course Information"
 */
const Heading: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return <h3 className="text-lg font-semibold text-[#333333]" {...props}>{children}</h3>;
}

/** Component for an item label with a font size of 14px and normal font weight, and light gray color
 *
 * @param Example "Course ID"
 */
const CardLabel: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({ children, ...props }) => {
  return <p className="text-sm font-normal text-[#999999]" {...props}>{children}</p>;
}

/** Component for an item value with a font size of 16px and semibold font weight, and dark gray color
 *
 * @param Example "ALTABC740"
 */
const CardValue: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({ children, ...props }) => {
  return <p className="text-base font-semibold text-[#666666]" {...props}>{children}</p>;
}

/** Component for a table header with a font size of 14px and semibold font weight,
 * and either the specified color or default dark gray color
 *
 * @param Example "Deposit date"
 * @param OptionalProp color
 */
const TableHeader: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({ children, ...props }) => {
  return <p className={`text-sm font-semibold ${props.color ? `text-${props.color}` : 'text-[#333333]'}`} {...props}>{children}</p>;
}

/** Component for generic text with a font size of 14px, normal font weight, and dark gray color
 *
 * @param Example "Instructions in course accounting form"
 */
const Text: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({ children, ...props }) => {
  return <p className="text-sm font-normal text-[#333333]" {...props}>{children}</p>;
}

export { MainHeading, SubHeading, Heading, CardLabel, CardValue, TableHeader, Text };
