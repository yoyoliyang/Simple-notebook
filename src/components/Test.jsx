import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Md from "./tools/Markdown"
const Test = () => {

    const [img, setImage] = useState([])
    const [value, setValue] = useState('')
    const url = useLocation().pathname

    const clip = async () => {
        let clipPer = await navigator.permissions.query({ name: "clipboard-read" })
        let clipData = await navigator.clipboard.read()
        clipData = await clipData
        const blob = await clipData[0].getType("image/png")
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = () => {
            let base64data = reader.result
            const timestamp = new Date().getTime()
            setImage([...img, {
                name: `${url}-${timestamp}`,
                data: base64data
            }])
            // setValue(value + `![${img.name}](${img.name})`)
            setValue(value + `![${url}-${timestamp}](${url}-${timestamp})`)
        }
    }


    useEffect(() => {
        console.log(value, img)
    }, [value, img])

    const handleKeyDown = (e) => {
        if (e.ctrlKey) {
            if (e.keyCode === 86) {
                clip()
            }
        }
    }
    const handleEdit = (e) => {
        setValue(e.target.value)
    }
    return (
        <>
            <h1>test page</h1>
            {img ?
                <>
                    {img.map((item, index) => {
                        return (
                            <img src={item.data} alt={item.name} key={index} />
                        )
                    })}
                </>
                : ''
            }
            <label htmlFor="test">
                <textarea name="test" onKeyDown={(e) => handleKeyDown(e)} value={value} onChange={handleEdit} />
            </label>
            <Md source={value} />
        </>
    )
}

export default Test