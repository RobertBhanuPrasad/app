import classNames from "classnames";
import { Card } from "./card";
import { RadioGroupCircleItem } from "./radio-group";
import { Label } from "./label";

interface RadioItemProps {
  selectedRadioValue?: string;
  value: string;
  className?: string;
  label: string;
}
export const RadioButtonCard: React.FC<RadioItemProps> = ({
  selectedRadioValue,
  value,
  label,
  className,
}) => {
  const cardClassName = classNames(
    "flex pl-4 py-3 gap-2",
    {
      "border-[#7677F4]": selectedRadioValue === value,
    },
    className
  );
  return (
    <Card className={cardClassName}>
      <RadioGroupCircleItem
        value={value}
        id={value}
        className={classNames({
          "!bg-[#7677F4]": selectedRadioValue === value,
          "border !border-[#D6D7D8] border-[1.5px] ":
            selectedRadioValue !== value,
        })}
      />
      <Label
        htmlFor={value}
        className={`text-[#333333] font-normal ${
          selectedRadioValue === value ? "text-[#7677F4]" : ""
        }`}
      >
        {label}
      </Label>
    </Card>
  );
};
