"use client";
import React from "react";
import type { RootState } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "@/lib/features/counter/counterSlice";

export function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  const { discounts, loading, error } = useSelector(
    (state: RootState) => state.discount
  );

  // const { categories, loading, error  } = useSelector(
  //   (state: RootState) => state.category
  // );

  return (
    <div>
      <div>
        {/* {!loading &&
          categories.map((cat) => {
            return (
              <div key={"categories"+cat._id}>
                <div>{cat.category_name}</div>
              </div>
            );
          })} */}

{!loading &&
          discounts.map((cat) => {
            return (
              <div key={"categories"+cat._id}>
                <div>{cat.coupon_code}</div>
              </div>
            );
          })}
        <button
          className="border m-4 bg-blue-400"
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          className="border m-4 bg-slate-500"
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
