import React, { Suspense } from 'react'
import OrderConfirmation from './OrderConfirmation'

const page = () => {
  return (
    <div>
      <Suspense fallback={<p>Loading order details...</p>}>
      <OrderConfirmation/>
      </Suspense>
    </div>
  )
}

export default page