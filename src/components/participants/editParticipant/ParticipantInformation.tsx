import React from "react";
import { useController } from "react-hook-form";
import { Textarea } from "src/ui/textarea";

export default function ParticipnatInformation() {
    const {field:{value:participantMemo,onChange:participantMemoChange}}=useController({name:'participantMemo'})
    console.log(participantMemo)
    return (
        <div id="participants">
            <div className="font-semibold text-[18px] pt-[25px] ">
                Participant Details
            </div>
            <div className="flex gap-4 py-[20px]">
                <div className="w-[303px]">
                    <div className="text-[#999999] ">Participants</div>
                    <div className="font-semibold">Peter Smith</div>
                </div>
                <div className="flex">
                    <div className="w-[303px]">
                        <div>Memo</div>

                        <div>
                            <Textarea
                                value={participantMemo}
                                onChange={(val) => {
                                    participantMemoChange(val?.target?.value);
                                }}
                                placeholder="Add Memo"
                                className="w-[303px] !h-[40px] resize-none rounded-[14px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}
