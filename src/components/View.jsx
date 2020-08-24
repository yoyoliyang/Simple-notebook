import React, { useState, useEffect, useContext, useCallback } from 'react'
import Edit from "./Edit"
import { MainClass } from "./tools/Class"
import { useParams } from "react-router-dom"
import Md from "./tools/Markdown"
import { useCookies } from "react-cookie"
import { LoginStatusContext } from "./LoginTokenContext"
import { blogDataApi, githubPageName } from "./tools/Env"

// /blog
const View = (props) => {

    const [cookies, removeCookie] = useCookies('token')
    const [loginStatus, setLoginStatus] = useContext(LoginStatusContext)
    let { slug } = useParams()

    const [blogData, setBlogData] = useState({ loading: true })
    const [edit, setEdit] = useState(false)
    // 用来更新父组件refetch，以便useEffect重新渲染
    const [refetch, setRefetch] = useState(false)
    const [apiInfo, setApiInfo] = useState()

    const fetchBlogData = useCallback(async (id) => {
        try {
            let result = await fetch(blogDataApi + id)
            if (result.ok) {
                result = await result.json()
                setBlogData(result)
            } else {
                props.history.push(githubPageName + '/404')
            }
        } catch (err) {
            setApiInfo(`API err(${err.message})`)
        }
    }, [props.history])

    const fetchDeleteBlogData = async () => {
        try {
            let result = await fetch(blogDataApi + 'del', {
                method: 'POST',
                body: JSON.stringify({
                    _id: blogData._id,
                    token: cookies.token
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            if (result.ok) {
                props.history.push(githubPageName)
            }
        } catch (err) {
            setApiInfo(`API err(${err.message})`)
        }
    }

    const handleDelete = (e) => {
        fetchDeleteBlogData()
        e.preventDefault()
    }

    const handleEdit = (b) => {
        setEdit(b)
    }

    const handleRefetch = () => {
        setRefetch(true)
    }

    useEffect(() => {
        if (refetch) {
            // 改回原始state，以便下次重新刷新
            setRefetch(false)
            fetchBlogData(slug)
        }
    }, [fetchBlogData, refetch, slug])

    useEffect(() => {
        fetchBlogData(slug)
    }, [fetchBlogData, slug])

    const Content = () => {
        return (
            <>
                <MainClass>
                    {blogData.loading ? '' :
                        <>
                            {
                                edit ?
                                    <Edit _id={blogData._id
                                    } timestamp={blogData.timestamp} subject={blogData.subject} data={blogData.data} image={blogData.image} handleEdit={handleEdit} handleRefetch={handleRefetch} fetchBlogData={fetchBlogData} />
                                    :
                                    <>
                                        <h2 className="blog-post-title" >{blogData.subject}</h2>
                                        <p className="blog-post-meta">
                                            {new Date(blogData.timestamp).toLocaleString()}
                                            {loginStatus ?
                                                <>
                                                    <span><button className="btn btn-primary btn-sm" onClick={() => handleEdit(true)}>编辑</button></span>
                                                    <span><button className="btn btn-sm text-danger" onClick={(e) => handleDelete(e)}>删除</button></span>
                                                </>
                                                : ''
                                            }
                                        </p>
                                        <Md source={blogData.data} />
                                    </>}
                        </>
                    }
                </MainClass>
            </>
        )
    }

    return (
        <>
            {apiInfo ?
                <MainClass><div className="text-danger">{apiInfo}</div></MainClass>
                :
                <Content />
            }
        </>
    )
}

export default View 
