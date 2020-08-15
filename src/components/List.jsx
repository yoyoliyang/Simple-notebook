import React, { useEffect, useState } from "react"
import SideBar from './SideBar'
import { Link } from "react-router-dom"
import Md from "./tools/Markdown"

const List = (props) => {

    const [blogList, setBlogList] = useState([])
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const blogListApi = 'http://127.0.0.1:5000/api/blog/'

    const fetchBlogList = async (count) => {
        if (count) {
            let listData = await fetch(blogListApi + 'last?page=' + count)
            listData = await listData.json()
            if ("error" in listData) {
                props.history.push('/add')
            }
            setBlogList(listData)
        }
        else {
            fetchBlogList(1)
        }
    }

    const handleNext = () => {
        fetchBlogList(page + 1)
        setPage(page + 1)
    }
    const handlePrevious = () => {
        fetchBlogList(page - 1)
        setPage(page - 1)
    }
    const fetchLastPageNumber = async () => {
        let number = await fetch(blogListApi + 'count')
        number = await number.json()
        setLastPage(Math.ceil(number.count / 10))
    }

    useEffect(() => {
        page === 1 ? fetchBlogList() : fetchBlogList(page)
        fetchLastPageNumber()
    }, [page])

    return (
        <>
            <main role="main" className="container">
                <div className="row">
                    <div className="col-md-8 blog-main">
                        {blogList.map((item, index) => {
                            return (
                                <div className="blog-post" key={index} >
                                    <h2 className="blog-post-title" ><Link to={"/" + item._id}>{item.subject}</Link></h2>
                                    <p className="blog-post-meta">
                                        {item.timestamp}
                                    </p>
                                    <Md source={item.data} />
                                </div>
                            )
                        })}
                        <div className="blog-pagination">
                            <button className="btn btn-outline-primary" disabled={page === 1 ? 'disabled' : ''} onClick={handlePrevious}>Previous</button>
                            <button className="btn btn-outline-secondary" disabled={page === lastPage ? 'disabled' : ''} onClick={handleNext}>Next</button>
                        </div>
                    </div>
                    <SideBar />
                </div>
            </main>
        </>
    )
}

export default List