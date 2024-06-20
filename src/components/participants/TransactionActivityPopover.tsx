import CrossIcon from "@public/assets/CrossIcon";
import RedReverseIcon from "@public/assets/RedReverseIcon";
import SuccessGreenTick from "@public/assets/SuccessGreenTick";
import { useEffect, useRef, useState } from "react";
import { Separator } from "src/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetFooter } from "src/ui/sheet";
import { Button } from "../../../src/ui/button";
import { useTranslation } from 'next-i18next';
import { translatedText } from "src/common/translations";
import { useGetIdentity, useList, useOne, useUpdate } from "@refinedev/core";
import useGetCountryCode from "src/utility/useGetCountryCode";
import useGetLanguageCode from "src/utility/useGetLanguageCode";
import { getCurrencyFormat, getCurrencySymbol } from "src/utility/CurrencyFormat";
import { formatDateAndTime } from 'src/utility/DateFunctions';
import dayjs from 'dayjs';

export default function TransactionActivity({
  transactionHistory,
  renderHeader,
}: {
  transactionHistory?: any;
  renderHeader?: any;
}) {

  console.log("Transaction History objecy", transactionHistory);
  const { t } = useTranslation(['common', 'course.participants', 'new_strings', 'course.view_course', 'course.find_course']);
  const [open, setOpen] = useState(false);

  const countryCode = useGetCountryCode();
  const languageCode = useGetLanguageCode();

  const { data: countryConfigData } = useList({
    resource: "country_config",
  });
  const currencySymbol = getCurrencySymbol(countryCode, languageCode, countryConfigData?.data?.[0]?.default_currency_code);
  const currencyFormat = getCurrencyFormat(countryCode, languageCode);

  const getTransactionIcon = (typeId: number) => {
    switch (typeId) {
      case 53: //sale
        return <SuccessGreenTick />;
      case 55: //Partial Refund
        return <RedReverseIcon />;
      case 54: //Refund
        return <RedReverseIcon />;
      default:
        return null;
    }
  };

  const getTransactionTypeName = (typeId: number) => {
    switch (typeId) {
      case 53: //sale
        return <div>{t("new_strings:sale_completed")}</div>;
      case 55: //Partial Refund
        return <div>{t("new_strings:partial_refund_raised")}</div>;
      case 54: //Refund
        return <div>{t("new_strings:refund_raised")}</div>;
      default:
        return null;
    }
  };

  const getTransactionStatusName = (typeId: number) => {
    switch (typeId) {
      case 33: //Confirmed
        return <div>{t("course.find_course:completed")}</div>;
      case 34: //Pending
        return <div>{t('course.participants:edit_participant.participants_information_tab.pending')}</div>;
      case 72: //Not Received
        return <div>{t('course.participants:edit_participant.participants_information_tab.not_received')}</div>;
      case 35: //Failed
        return <div>{t('course.participants:edit_participant.participants_information_tab.failed')}</div>;
      default:
        return null;
    }
  };


  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sheetRef]);

  return (
    <Sheet open={open}>
      <SheetTrigger onClick={() => setOpen(true)}>
        <div 
          style={{
            color: transactionHistory[0]?.transaction_type_id &&
              transactionHistory[0]?.transaction_type_id?.id === 53
                ? "#15AF53"
                : "#EC7357",
          }}
        >
          {renderHeader
            ? renderHeader
            : transactionHistory[0]?.transaction_type_id.value}
        </div>
      </SheetTrigger>
      <SheetContent
        className="w-[550px] h-[768px] rounded-l-xl flex flex-col justify-between overflow-hidden"
        ref={sheetRef}
      >
        <div>
          <SheetHeader className="p-3 text-2xl font-semibold flex flex-row">
            <div className="flex justify-between items-center flex-grow">
              <div className="text-2xl font-semibold">{t("new_strings:transaction_activity")}</div>
              <div onClick={() => setOpen(false)} className="cursor-pointer">
                <CrossIcon width={16} height={16} />
              </div>
            </div>
          </SheetHeader>
          <Separator />
          <div className="m-l-5 p-t-10">
            {transactionHistory?.map((transaction: any, index: number) => (
              <div key={index} className="flex flex-row gap-4">
                <div className="flex flex-col items-center justify-start">
                  <div className="flex">
                    {getTransactionIcon(transaction?.transaction_type_id?.id)}
                  </div>
                  {index !== transactionHistory.length - 1 && (
                    <div
                      className={`flex !w-[3px] h-[170px] m-t-2 m-b-2`}
                      style={{
                        background: transaction?.transaction_type_id &&
                          transaction?.transaction_type_id?.id === 53
                            ? "#15AF53"
                            : "#EC7357",
                      }}
                    ></div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div
                    className="flex text-xl font-bold m-b-10"
                    style={{
                      color: transaction?.transaction_type_id &&
                        transaction?.transaction_type_id?.id === 53
                          ? "#15AF53"
                          : "#EC7357",
                    }}
                  >
                    {getTransactionTypeName(transaction?.transaction_type_id?.id)}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex">
                      <span className="font-semibold text-base leading-5 pr-2">
                        {t("new_strings:transaction_amount")}:
                      </span>
                      <span className="font-normal text-base leading-5">
                        {countryConfigData?.data?.[0]?.default_currency_code} {" "}
                        {currencyFormat.format(transaction?.total_amount)}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-base leading-5 pr-2">
                        {t('course.participants:view_participant.time_stamp')}:
                      </span>
                      <span className="font-normal text-base leading-5">
                      {/* TO DO : Date Translation */}
                        {formatDateAndTime(transaction?.created_at)}
                      </span>
                    </div>
                    <div className="flex" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span className="font-semibold text-base leading-5 pr-2">
                        {t('course.participants:view_participant.transaction_id')}:
                      </span>
                      <span className="font-normal text-base leading-5" style={{ display: 'inline-block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {transaction.payment_transaction_id ? transaction.payment_transaction_id : "-"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-base leading-5 pr-2">
                        {t('course.participants:view_participant.transaction_status')}:
                      </span>
                      <span
                        className="font-normal text-base leading-5"
                        style={{
                          color: transaction?.transaction_status_id &&
                            transaction?.transaction_status_id?.id === 33
                              ? "#15AF53"
                              : "#EC7357",
                        }}
                      >
                        {transaction.transaction_status_id.value
                          ? getTransactionStatusName(transaction?.transaction_status_id?.id)
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center p-t-5 p-b-5">
          <Button className="font-bold" onClick={() => setOpen(false)}>
            {t('close')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
