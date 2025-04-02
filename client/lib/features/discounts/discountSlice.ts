import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Discount {
    coupon_code:string;
description: string;
discount_value: string;
end_date: string;
product_id: number
start_date: string;
status: string;
_id: number;
}
export interface Discounts {
    page: number;
    limit: number
    maxPages: number;
    totalCount: number;
    discounts: Discount[];
  }

interface DiscountState {
  discounts: Discount[];
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: DiscountState = {
  discounts: [],
  loading: false,
  error: null,
};

interface ApiResponse {
  data: {
    discounts: Discount[],
  };
  // Add other fields from your API response if needed
}

const serverUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";


// Create an async thunk for fetching categories
export const fetchDiscounts = createAsyncThunk(
  "discounts/fetchDiscounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse>(
        `${serverUrl}/api/discounts/get-discounts`,
        {
            limit: 1000000000
        }
      );
      return response.data.data.discounts; // Assuming your API returns data in this structure
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to fetch categories");
    }
  }
);

export const dicountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDiscounts.fulfilled,
        (state, action: PayloadAction<Discount[]>) => {
          state.loading = false;
          state.discounts = action.payload;
        }
      )
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "An error occurred";
      });
  },
});

// Export actions
export const {} = dicountSlice.actions;

export default dicountSlice.reducer;
