import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  _id: number;
  category_name: string;
  url_slug: string;
  status: string;
  parent_categorie_id: number|null;
}

export interface CatState {
  categories: Category[]; // Storing all categories
  category: Category | null; // Optional field for selected category
}

const initialState: CatState = {
  category: null,
  categories: [],
};

const categorySlice = createSlice({
  name: "user ",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<CatState["category"]>) => {
      state.category = action.payload;
    },
    clearCategory: (state) => {
      state.category = null;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      console.log(action.payload);
      
      state.categories = action.payload;
    }
  },
});

export const { setCategory, clearCategory, setCategories } = categorySlice.actions;
export default categorySlice.reducer;
