import React from "react"
import { imgApi } from "./Env"
import { useEffect, useRef, useState } from "react"
const Clipboard = (props) => {


    const [cursor, setCursor] = useState(0)
    const textareaRef = useRef()
    // value为e.target.value数据，cursorPostion为当前光标位置，在光标位置插入剪切板数据
    const clip = async (value, cursorPosition) => {
        let clipData = await navigator.clipboard.read()
        clipData = await clipData
        const blob = await clipData[0].getType("image/png")
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = () => {
            let base64data = reader.result
            const timestamp = new Date().getTime()
            const imgName = `${props.blogData._id}--${timestamp}`
            let valueLength = value.length
            let markdownText = `![${imgName}](${imgApi}/${imgName})` + '\n'
            let data = value.slice(0, cursorPosition) + markdownText + value.slice(cursorPosition, valueLength)
            props.handleInsertImage(data, imgName, base64data)
            setCursor(cursorPosition + markdownText.length)
        }
    }

    useEffect(() => {
        //  处理光标位置，markdown字符串后
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = cursor
    }, [cursor])

    const handleKeyDown = (e) => {
        if (e.ctrlKey) {
            if (e.keyCode === 86) {
                let value = e.target.value
                let cursorPosition = e.target.selectionStart
                clip(value, cursorPosition)
            }
        }
    }


    return (
        <div className="form-group">
            <label htmlFor="data" />
            <textarea id='text' rows="10" ref={textareaRef} className="form-control" onKeyDown={(e) => handleKeyDown(e)} name="data" value={props.blogData.data} onChange={(e) => props.handleEdit(e)} placeholder="内容(支持markdown)" required />
        </div>
    )
}

export default Clipboard