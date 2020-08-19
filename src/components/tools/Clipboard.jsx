import React, { useState, useEffect } from "react"
const Clipboard = (props) => {


    const clip = async () => {
        let clipPer = await navigator.permissions.query({ name: "clipboard-read" })
        console.log(clipPer)
        let clipData = await navigator.clipboard.read()
        clipData = await clipData
        const blob = await clipData[0].getType("image/png")
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = () => {
            let base64data = reader.result
            const timestamp = new Date().getTime()
            const imgName = `${props.blogData._id}--${timestamp}`
            props.handleInsertImage(imgName, base64data)
        }
    }


    useEffect(() => {
        console.log(props.blogData.data)
    }, [props.blogData.data])

    const handleKeyDown = (e) => {
        if (e.ctrlKey) {
            if (e.keyCode === 86) {
                clip()
            }
        }
    }
    
    return (
        <div className="form-group">
            <label htmlFor="data" />
                <textarea rows="10" className="form-control" onKeyDown={(e) => handleKeyDown(e)} name="data" value={props.blogData.data} onChange={(e) => props.handleEdit(e)} placeholder="内容(支持markdown)" required />
        </div>
    )
}

export default Clipboard