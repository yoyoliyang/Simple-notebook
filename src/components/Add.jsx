import React, { useState, } from "react"
import Main from "./Main"
import Header from "./Header"
import { v4 as uuid4 } from 'uuid'


const Add = (props) => {

    const _id = uuid4()
    const blogDataApi = "http://127.0.0.1:5000/api/blog/"

    const [blogData, setBlogData] = useState({
        _id: _id,
        subject: '',
        timestamp: new Date().toLocaleString(),
        data: ''
    })

    const handleEdit = (e) => {
        setBlogData({
            ...blogData,
            [e.target.name]: e.target.value
        })
    }

    const fetchBlogDataApi = async (e) => {
        await fetch(blogDataApi + 'add', {
            method: 'POST',
            body: JSON.stringify(blogData),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    }
    const handleSubmit = (e) => {
        // post添加后的数据
        fetchBlogDataApi()
        props.history.push("/" + blogData._id)
        e.preventDefault()
    }



    return (
        <>
            <Header />
            <Main>
                <form>
                    <div className="form-group">
                        <label htmlFor="subject" />
                        <input className="form-control" name="subject" value={blogData.subject} onChange={handleEdit} placeholder="标题" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="data" />
                        <textarea rows="10" className="form-control" name="data" value={blogData.data} onChange={handleEdit} placeholder="内容(支持markdown)" />
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                    <button className="btn btn-sm" onClick={() => props.history.push("/")}>Cancel</button>
                </form>
            </Main>
        </>
    )
}

export default Add 