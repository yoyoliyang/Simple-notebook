import React, { useState } from "react"
import { useCookies } from "react-cookie"

const Edit = (props) => {

    const [cookies, removeCookie] = useCookies('token')
    const [apiInfo, setApiInfo] = useState()
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

    const blogDataApi = "http://192.168.1.123:5000/api/blog/"
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
            {apiInfo ? <span className="ml-4 text-danger">{apiInfo}</span> : ''}
        </form>
    )
}

export default Edit
