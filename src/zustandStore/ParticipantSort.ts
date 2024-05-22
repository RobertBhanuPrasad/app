import {create} from 'zustand';

interface sortStore {
    field: string;
    order: "asc" | "desc";
    setfield: (field: string) => void;
    setOrder: (order: "asc" | "desc") => void;
  }

const sortStore = create<sortStore>((set) => ({
  field: "id",
  order: "desc",

  setfield: (field: string) => {
    set({ field });
  },

  setOrder: (order: "asc" | "desc") => {
    set({ order });
  },
}))

export default sortStore;