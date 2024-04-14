import { number } from "zod";
import { create } from "zustand";

export const editParticipantStore = create((set) => ({
    editParticipantData: null,
    id: '',
    full_name: '',
    memo: '',
    transaction_fee_level_id: '',
    created_at: new Date(),
    currency_code: '',
    total_amount: 0,
    accommodation_type_id: 0,
    accommodation_snore: false,
    roommate_snore: false,
    participant_code: '',
    program_id:0,
    accommodation_fee: 0,
    roommate_preferences_1: '',
    roommate_preferences_2: '',
    roommate_preferences_3: '',
    discount_code: '',
    participant_attendence_status_id: 0,
    transaction_status_id: 0,
    payment_date: '',
    payment_method_id: 0,
    send_payment_confirmation: false,
    payment_transaction_id: '',
    response_message: '',
    error_message: '',
    expense_fee: 0,
    setEditParticipantData:(data:any)=>{
        set(()=>({
            editParticipantData:data
        }))
    },
    setFullName: (data: string) => {
        set(() => ({
            full_name: data
        }));
    },
    setMemo: (data: string) => {
        set(() => ({
            memo: data
        }));
    },
    setTransactionFeeLevel: (data: string) => {
        set(() => ({
            transaction_fee_level_id: data
        }));
    },
    setCreatedAt: (data: any) => {
        set(() => ({
            created_at: data
        }));
    },
    setCurrencyCode: (data: string) => {
        set(() => ({
            currency_code: data
        }));
    },
    setTotalAmount: (data: string) => {
        set(() => ({
            total_amount: data
        }));
    },
    setAccommodationType: (data: number) => {
        set(() => ({
            accommodation_type_id: data
        }));
    },
    setAccommodationSnore: (data: boolean) => {
        set(() => ({
            accommodation_snore: data
        }));
    },
    setRoommateSnore: (data: boolean) => {
        set(() => ({
            roommate_snore: data
        }));
    },
    setProgramId:(data:number)=>{
        set(()=>({
            program_id:data
        }))
    },
    setParticipantCode: (data: string) => {
        set(() => ({
            participant_code: data
        }));
    },
    setAccommodationFee: (data: string) => {
        set(() => ({
            accommodation_fee: data
        }));
    },
    setRoommatePreference1: (data: string) => {
        set(() => ({
            roommate_preferences_1: data
        }));
    },
    setRoommatePreference2: (data: string) => {
        set(() => ({
            roommate_preferences_2: data
        }));
    },
    setRoommatePreference3: (data: string) => {
        set(() => ({
            roommate_preferences_3: data
        }));
    },
    setDiscountCode: (data: string) => {
        set(() => ({
            discount_code: data
        }));
    },
    setParticipantAttendanceStatus: (data: number) => {
        set(() => ({
            participant_attendence_status_id: data
        }));
    },
    setTransactionStatus: (data: number) => {
        set(() => ({
            transaction_status_id: data
        }));
    },
    setPaymentDate: (data: string) => {
        set(() => ({
            payment_date: data
        }));
    },
    setPaymentMethodId: (data: number) => {
        set(() => ({
            payment_method_id: data
        }));
    },
    setSendPaymentConfirmation: (data: boolean) => {
        set(() => ({
            send_payment_confirmation: data
        }));
    },
    setPaymentTransactionId: (data: string) => {
        set(() => ({
            payment_transaction_id: data
        }));
    },
    setResponseMessage: (data: string) => {
        set(() => ({
            response_message: data
        }));
    },
    setErrorMessage: (data: string) => {
        set(() => ({
            error_message: data
        }));
    },
}));

