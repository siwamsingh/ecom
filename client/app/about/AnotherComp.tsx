'use client'
import React from 'react'
import type { RootState } from '@/lib/store'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '@/lib/features/counter/counterSlice'

export function AnotherComp() {
  const count = useSelector((state: RootState) => state.counter.value)

  return (
    <div>
      <div>

        <span className='text-4xl'>{count}</span>
      </div>
    </div>
  )
}