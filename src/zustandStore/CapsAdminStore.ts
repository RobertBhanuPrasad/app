import { create } from "zustand";

interface CapsAdminStore {
  paymentGatewaysData: PaymentGateway[]
  setPaymentGatewaysData:(by: PaymentGateway[]) => void;
}

export const capsAdminStore = create<CapsAdminStore>((set) => ({
    paymentGatewaysData: [],
    setPaymentGatewaysData:(data: PaymentGateway[]) => {
        set(()=>({
          paymentGatewaysData: data
        }))
      },
}))