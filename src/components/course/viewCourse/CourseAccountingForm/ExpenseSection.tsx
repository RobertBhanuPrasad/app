import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "src/ui/button";

function ExpenseSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, back } = useRouter();
  function setParamValue(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("current_section", term);
    }
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <div>
      {" "}
      <div>
        expense
        <Button
          className="w-[118px] h-[46px] border border-[#7677F4] rounded-[12px] bg-[white] text-[#7677F4]"
          onClick={() => {
            setParamValue("revenue");
          }}
        >
          Previous
        </Button>
        {/* <Button
          className="w-[87px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white]"
          onClick={() => {
            setParamValue("expense");
          }}
        >
          Next
        </Button> */}
      </div>
    </div>
  );
}

export default ExpenseSection;
