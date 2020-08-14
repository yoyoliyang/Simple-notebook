import React, { useState, useEffect, useContext } from 'react'
import Edit from "./Edit"
import NotFound from './NotFound'
import Main from "./Main"
import Header from "./Header"
import { useParams } from "react-router-dom"
// import Prism from "prismjs"
import ReactMarkdown from "react-markdown"

// /blog
const View = (props) => {

    const blogDataApi = "http://127.0.0.1:5000/api/blog/"
    let { slug } = useParams()

    const [blogData, setBlogData] = useState({})
    const [edit, setEdit] = useState(false)
    // 用来更新父组件refetch，以便useEffect重新渲染
    const [refetch, setRefetch] = useState(false)
    const [error, setError] = useState(false)

    const fetchBlogData = async (id) => {
        let data = await fetch(blogDataApi + id)
        data = await data.json()
        if ('error' in data) {
            setError(true)
        }
        setBlogData(data)
    }

    const fetchDeleteBlogData = async () => {
        await fetch(blogDataApi + 'del', {
            method: 'POST',
            body: JSON.stringify({
                _id: blogData._id
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    }

    const handleDelete = (e) => {
        fetchDeleteBlogData()
        e.preventDefault()
        props.history.push("/")
    }

    const handleEdit = (b) => {
        setEdit(b)
    }

    const handleRefetch = () => {
        setRefetch(true)
    }

    useEffect(() => {
        // Prism.highlightAll()
        fetchBlogData(slug)
        if (refetch) {
            console.log('reloading')
            // 改回原始state，以便下次重新刷新
            setRefetch(false)
            fetchBlogData(slug)
        }
    }, [refetch, slug])

    const Content = () => {
        return (
            <>
                <Header />
                <Main>
                    {
                        edit ?
                            <Edit _id={blogData._id
                            } timestamp={blogData.timestamp} subject={blogData.subject} data={blogData.data} action="update" handleView={handleEdit} handleRefetch={handleRefetch} fetchBlogData={fetchBlogData} />
                            :
                            <>
                                <h2 className="blog-post-title" >{blogData.subject}</h2>
                                <p className="blog-post-meta">
                                    {blogData.timestamp}
                                    <span><button className="btn btn-primary btn-sm" onClick={() => handleEdit(true)}>编辑</button></span>
                                    <span><button className="btn btn-sm text-danger" onClick={(e) => handleDelete(e)}>删除</button></span>
                                </p>
                                <ReactMarkdown source={blogData.data} />
                            </>}
                </Main>
            </>
        )
    }

    return (
        <>
            {error ? <NotFound /> : <Content />}
        </>
    )
}

export default View 
