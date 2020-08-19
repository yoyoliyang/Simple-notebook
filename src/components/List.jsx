import React, { useEffect, useState, useCallback } from "react"
import SideBar from './SideBar'
import { Link } from "react-router-dom"
import Md from "./tools/Markdown"
import {blogDataApi} from "./tools/Env"

const List = (props) => {


    const [blogList, setBlogList] = useState([{ loading: true }])
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [searchData, setSearchData] = useState([])
    const [searchCount, setSearchCount] = useState()
    const [apiInfo, setApiInfo] = useState()


    const fetchBlogList = useCallback(async (count) => {
        if (count) {
            try {
                let result = await fetch(blogDataApi + 'last?page=' + count)
                if (result.ok) {
                    result = await result.json()
                    if (result.count === 0) {
                        // 空数据库（没有任何blog的时候）跳转到add页面以添加
                        props.history.push('/add')
                    }
                    setBlogList(result)
                }
            } catch (err) {
                setApiInfo(`API error(${err.message})`)
            }
        }
        else {
            fetchBlogList(1)
        }
    }, [props.history])

    const handleNext = () => {
        fetchBlogList(page + 1)
        setPage(page + 1)
    }
    const handlePrevious = () => {
        fetchBlogList(page - 1)
        setPage(page - 1)
    }
    const fetchLastPageNumber = async () => {
        let number = await fetch(blogDataApi + 'count')
        number = await number.json()
        setLastPage(Math.ceil(number.count / 10))
    }

    // set search函数，传递给子组件Sidebar
    const handleSetSearch = (s) => {
        setSearchData(s)
        setSearchCount(s.length)
        // List数据隐藏
        setBlogList({ loading: true })
    }
    useEffect(() => {
        page === 1 ? fetchBlogList() : fetchBlogList(page)
    }, [page, fetchBlogList])

    useEffect(() => {
        fetchLastPageNumber()
    })

    const SearchHTML = () => {
        return (
            <>
                {searchCount === 0 ? <h6>Not Found</h6> : ""}
                {searchData.map((item, index) => {
                    return (
                        <div className="blog-post" key={index}>
                            <h2 className="blog-post-title" ><Link to={"/" + item._id}>{item.subject}</Link></h2>
                            <p className="blog-post-meta">
                                {/* 此处将item中的时间戳转化为可读模式 */}
                                {new Date(item.timestamp).toLocaleString()}
                            </p>
                        </div>)
                })
                }
            </>
        )
    }

    const BlogListHTML = () => {
        return (
            <>
                {blogList.map((item, index) => {
                    return (
                        <div className="blog-post" key={index} >
                            <h2 className="blog-post-title" ><Link to={"/" + item._id}>{item.subject}</Link></h2>
                            <p className="blog-post-meta">
                                {/* 此处将item中的时间戳转化为可读模式 */}
                                {new Date(item.timestamp).toLocaleString()}
                            </p>
                            <Md source={item.data} />
                        </div>
                    )
                })}
            </>
        )
    }
    return (
        <>
            <main role="main" className="container">
                <div className="row">
                    <div className="col-md-8 blog-main">
                        {/* 搜索数据列表 */}
                        {searchData ?
                            <SearchHTML />
                            : <></>}
                        <>
                            {/* api获取信息提示 */}
                            {apiInfo ? <h6 className="text-danger">{apiInfo}</h6> :
                                <>
                                    {/* blog列表载入（防止在api数据未获取前渲染空html） */}
                                    {blogList.loading ?
                                        <></>
                                        :
                                        <>
                                            <BlogListHTML />
                                            <div className="blog-pagination">
                                                <button className="btn btn-outline-primary" disabled={page === 1 ? 'disabled' : ''} onClick={handlePrevious}>Previous</button>
                                                <button className="btn btn-outline-secondary" disabled={page === lastPage ? 'disabled' : ''} onClick={handleNext}>Next</button>
                                            </div>
                                        </>
                                    }
                                </>
                            }
                        </>
                    </div>
                    <SideBar handleSetSearch={handleSetSearch} />
                </div>
            </main>
        </>
    )
}

export default List