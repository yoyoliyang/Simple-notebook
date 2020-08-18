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
    const blogDataApi = "http://192.168.1.123:5000/api/blog/"

    const [blogData, setBlogData] = useState({
        _id: _id,
        subject: '',
        timestamp: Date.now(),
        data: '',
        token: cookies.token
    })

    const [apiInfo, setApiInfo] = useState()

    const handleEdit = (e) => {
        setBlogData({
            ...blogData,
            [e.target.name]: e.target.value
        })
    }

    // 注意此处不能为异步fetch，下方需要获取发布后的数据
    const fetchBlogDataApi = async () => {
        try {
            let result = await fetch(blogDataApi + 'add', {
                method: 'POST',
                body: JSON.stringify(blogData),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            if (result.ok) {
                result = await result.json()
                props.history.push('/' + blogData._id)
            }
        } catch (err) {
            setApiInfo(`API err(${err.message})`)
        }
    }

    const handleSubmit = (e) => {
        fetchBlogDataApi()
        e.preventDefault()
    }


    return (
        <>
            {loginStatus ?
                <>
                    <MainClass>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="subject" />
                                <input className="form-control" name="subject" value={blogData.subject} onChange={(e) => handleEdit(e)} placeholder="标题" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="data" />
                                <textarea rows="10" className="form-control" name="data" value={blogData.data} onChange={(e) => handleEdit(e)} placeholder="内容(支持markdown)" required />
                            </div>
                            <button type="submit" className="btn btn-primary" >Submit</button>
                            <button className="btn btn-sm" >Cancel</button>
                            {apiInfo ? <span className="ml-4 text-danger">{apiInfo}</span> : ''}
                        </form>
                    </MainClass>
                </>
                :
                <NotFound />
            }
        </>
    )
}

export default Add 