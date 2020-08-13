import React, { useState } from "react"


const Edit = (props) => {

    const blogDataApi = "http://127.0.0.1:5000/api/blog/"
    const [blogData, setBlogData] = useState({
        _id: props._id,
        subject: props.subject,
        timestamp: props.timestamp,
        data: props.data
    })

    const handleEdit = (e) => {
        setBlogData({
            ...blogData,
            [e.target.name]: e.target.value
        })
    }

    const editBlogDataApi = async () => {
        await fetch(blogDataApi + props.action, {
            method: 'POST',
            body: JSON.stringify(blogData),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    }

    const handleSubmit = (e) => {
        editBlogDataApi()
        // 有待优化 , 重新提交后，父组件不能重新获取api内容，除非重新刷新页面
        props.handleView(false)
        props.fetchBlogData(blogData._id)
        e.preventDefault()
    }
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-group">
                <label htmlFor="subject" />
                <input className="form-control" name="subject" value={blogData.subject} onChange={(e) => handleEdit(e)} />
            </div>
            <div className="form-group">
                <label htmlFor="data" />
                <textarea rows="10" className="form-control" name="data" value={blogData.data} onChange={(e) => handleEdit(e)} />
            </div>
            <button type="submit" className="btn btn-primary" >Submit</button>
            <button className="btn btn-sm" onClick={() => props.handleView(false)}>Cancel</button>
        </form>
    )
}

export default Edit
