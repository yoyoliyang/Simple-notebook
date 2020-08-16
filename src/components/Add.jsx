import React, { useState, useContext } from "react"
import { MainClass } from "./tools/Class"
import NotFound from "./NotFound"
import { v4 as uuid4 } from 'uuid'
import { useCookies } from "react-cookie"
import { LoginStatusContext } from "./LoginTokenContext"

const Add = (props) => {

    const [loginStatus, setLoginStatus] = useContext(LoginStatusContext)
    const [cookies, removeCookie] = useCookies('token')
    const _id = uuid4()
    const blogDataApi = "http://127.0.0.1:5000/api/blog/"

    const [blogData, setBlogData] = useState({
        _id: _id,
        subject: '',
        timestamp: Date.now(),
        data: '',
        token: cookies.token
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
            {loginStatus ?
                <MainClass>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="subject" />
                            <input className="form-control" name="subject" value={blogData.subject} onChange={handleEdit} placeholder="标题" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="data" />
                            <textarea rows="10" className="form-control" name="data" value={blogData.data} onChange={handleEdit} placeholder="内容(支持markdown)" required />
                        </div>
                        <button type="submit" className="btn btn-primary" >Submit</button>
                        <button className="btn btn-sm" onClick={() => props.history.push("/")}>Cancel</button>
                    </form>
                </MainClass>
                :
                <NotFound />
            }
        </>
    )
}

export default Add 