import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CatState {
  category: {
    _id: number,
    category_name: string,
    url_slug: string,
    status: string,
  } | null;
}

const initialState: CatState = {
  category: null,
};

const categorySlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<CatState["category"]>) => {
      state.category = action.payload;
    },
    clearCategory: (state) => {
      state.category = null;
    },
  },
});

export const { setCategory, clearCategory } = categorySlice.actions;
export default categorySlice.reducer;
