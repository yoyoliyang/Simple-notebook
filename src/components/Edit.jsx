import React, { useState } from "react"
import { useCookies } from "react-cookie"

const Edit = (props) => {

    const [cookies, removeCookie] = useCookies('token')
    const [blogData, setBlogData] = useState({
        _id: props._id,
        subject: props.subject,
        timestamp: Date.now(),
        data: props.data,
        token: cookies.token
    })

    const handleEdit = (e) => {
        setBlogData({
            ...blogData,
            [e.target.name]: e.target.value
        })
    }

    const blogDataApi = "http://127.0.0.1:5000/api/blog/"
    const editBlogDataApi = async () => {
        await fetch(blogDataApi + 'update', {
            method: 'POST',
            body: JSON.stringify(blogData),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    }

    const handleSubmit = (e) => {
        editBlogDataApi()
        props.handleView(false)
        props.handleRefetch()
        e.preventDefault()
    }
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-group">
                <label htmlFor="subject" />
                <input className="form-control" name="subject" value={blogData.subject} onChange={(e) => handleEdit(e)} required />
            </div>
            <div className="form-group">
                <label htmlFor="data" />
                <textarea rows="10" className="form-control" name="data" value={blogData.data} onChange={(e) => handleEdit(e)} required />
            </div>
            <button type="submit" className="btn btn-primary" >Submit</button>
            <button className="btn btn-sm" onClick={() => props.handleView(false)}>Cancel</button>
        </form>
    )
}

export default Edit
