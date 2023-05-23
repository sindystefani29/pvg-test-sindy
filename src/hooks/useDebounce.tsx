"use client"

import { useEffect, useRef, useState } from "react"

export default function useDebounce(val: string, time: number) {
    const [stringVal, setStringVal] = useState(val)
    const timer = useRef<ReturnType<typeof setTimeout>>()

    useEffect(() => {
        if (val) {
            timer.current = setTimeout(() => {
                setStringVal(val)
            }, time)
        }
        return () => {
            clearTimeout(timer.current)
        }
    }, [val, time])

    return stringVal;
}