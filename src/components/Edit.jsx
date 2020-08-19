import React, { useState } from "react"
import { useCookies } from "react-cookie"
import { blogDataApi, imgApi } from "./tools/Env"
import  Clipboard  from './tools/Clipboard'

const Edit = (props) => {

    const [cookies, removeCookie] = useCookies('token')
    const [apiInfo, setApiInfo] = useState()
    const [blogData, setBlogData] = useState({
        _id: props._id,
        subject: props.subject,
        timestamp: Date.now(),
        data: props.data,
        image: props.image,
        token: cookies.token
    })

    const handleEdit = (e) => {
        setBlogData({
            ...blogData,
            [e.target.name]: e.target.value
        })
    }

    // Clipboard组件将imgData markdown代码插入到文本框中
    const handleInsertImage = (imgName, base64str) => {
        setBlogData({
            ...blogData,
            data: blogData.data + `![${imgName}](${imgApi}/${imgName})` + '  ',
            image: {
                ...blogData.image,
                [imgName]: base64str
            }
        })
    }

    const editBlogDataApi = async () => {
        try {
            let result = await fetch(blogDataApi + 'update', {
                method: 'POST',
                body: JSON.stringify(blogData),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            if (result.ok) {
                props.handleEdit(false)
                props.handleRefetch()
            }
        } catch (err) {
            setApiInfo(`API error(${err.message})`)
        }
    }


    const handleSubmit = (e) => {
        editBlogDataApi()
        e.preventDefault()
    }
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-row">
                <div className="col-7">
                    <label htmlFor="subject" />
                    <input className="form-control" name="subject" value={blogData.subject} onChange={(e) => handleEdit(e)} required />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="data" />
                <Clipboard blogData={blogData} handleEdit={handleEdit} handleInsertImage={handleInsertImage} />
            </div>
            <button type="submit" className="btn btn-primary" >Submit</button>
            <button className="btn btn-sm" type="button" onClick={() => props.handleEdit(false)}>Cancel</button> {/* 注意此处的type为button，否则会和form冲突 */}
            {apiInfo ? <span className="ml-4 text-danger">{apiInfo}</span> : ''}
        </form>
    )
}

export default Edit
