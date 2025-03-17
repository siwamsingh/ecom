"use client"
import React from 'react'
import Countdown from "react-countdown";

const CountdownShell = () => {
  return <Countdown date={Date.now() + 86400000} />
}

export default CountdownShell