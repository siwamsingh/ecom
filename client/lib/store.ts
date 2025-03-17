import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import categoryReducer, { fetchCategories } from './features/categories/categorySlice'
import discountReducer, {fetchDiscounts} from './features/discounts/discountSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    category: categoryReducer,
    discount: discountReducer
  },
})

store.dispatch(fetchCategories());
store.dispatch(fetchDiscounts())

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch