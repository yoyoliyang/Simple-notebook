import React, { useContext, useEffect, useState, useCallback } from "react"
import { Link, withRouter } from "react-router-dom"
import { LoginStatusContext } from "./LoginTokenContext"
import { useCookies } from "react-cookie"

const Header = (props) => {

    const [loginStatus, setLoginStatus] = useContext(LoginStatusContext)
    const [cookies, removeCookie] = useCookies('token')
    const [error, setError] = useState(false)

    const handleLogout = () => {
        removeCookie('token')
        setLoginStatus(false)
        props.history.push('/login')
    }

    const tokenApi = 'http://127.0.0.1:5000/api/check_token'
    const checkToken = useCallback(async () => {
        // api post数据并返回erorr
        let result = await fetch(tokenApi, {
            method: 'POST',
            body: JSON.stringify(cookies),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        result = await result.json()
        console.log('Debug: Header-', result)
        if (result.message === 'success') {
            setLoginStatus(true)
        } else {
            setLoginStatus(false)
            setError(true)
        }
    }, [cookies, setLoginStatus, error])


    useEffect(() => {
        if (cookies.token === undefined) {
            setLoginStatus(false)
        } else {
            checkToken()
        }
    }, [cookies.token, checkToken, setLoginStatus])

    return (
        <div className="container">
            <header className="blog-header py-3">
                <div className="row flex-nowrap justify-content-between align-items-center">
                    <div className="col-4 text-left">
                        <Link className="blog-header-logo text-dark" to="/">Simple notebook</Link>
                    </div>
                    <div className="col-4 d-flex justify-content-end align-items-center">
                        {loginStatus ?
                            <>
                                <Link className="btn btn-sm text-primary" to="/add" >Add</Link>
                                <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout} >Logout</button>
                            </>
                            :
                            <>
                                {error ?
                                    <span className="text-danger mr-1">token已过期，重新登录</span>:''
                                }
                                <Link className="btn btn-sm btn-outline-secondary" to="/login">Login</Link>
                            </>
                        }
                    </div>
                </div>
            </header>
            <div className="nav-scroller py-1 mb-2">
                <nav className="nav d-flex justify-content-between">
                    <Link className="p-2 text-muted" to="/">Home</Link>
                    <Link className="p-2 text-muted" to="/page">Page</Link>
                </nav>
            </div>
        </div>
    )
}

export default withRouter(Header)