  import { configureStore } from "@reduxjs/toolkit";
  import userReducer from "./slices/userSlice";
  import categoryReducer from "./slices/categorySlice"

  export const store = configureStore({
    reducer: {
      user: userReducer,
      category: categoryReducer
    },
  });

  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
