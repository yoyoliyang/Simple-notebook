import React, { useState, useCallback, useEffect } from "react"
import useClipboardData from "./hooks/useClipboardData"

const Test = () => {


    const [value, setValue] = useState()
    const clipboard = useClipboardData()
    const handleKeyDown = (e) => {
        if (e.ctrlKey) {
            if (e.keyCode === 86) {
                setValue(clipboard)
            }
        }
    }


    return (
        <>
            <h1>test page</h1>
            <label htmlFor="test">
                <textarea name="test" value={value} onKeyDown={(e) => handleKeyDown(e)} />
            </label>



        </>
    )
}

export default Test