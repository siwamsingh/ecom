import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Category {
  category_name: string;
  parent_categorie_id: number;
  status: string;
  url_slug: string;
  _id: number;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

interface ApiResponse {
  data: {
    categories: Category[],
  };
  // Add other fields from your API response if needed
}

// Create an async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse>(
        "/api/category/get-categories",
        {}
      );
      return response.data.data.categories; // Assuming your API returns data in this structure
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to fetch categories");
    }
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "An error occurred";
      });
  },
});

// Export actions
export const {} = categorySlice.actions;

export default categorySlice.reducer;
