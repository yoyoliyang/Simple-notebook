import React, { useContext, useEffect, useCallback, useState } from "react"
import { Link, withRouter } from "react-router-dom"
import { LoginStatusContext } from "./LoginTokenContext"
import { useCookies } from "react-cookie"
import {tokenApi} from './tools/Env'

const Header = (props) => {
    // Header包含了一个check_token的函数，用来检测token是否有效

    const [loginStatus, setLoginStatus] = useContext(LoginStatusContext)
    const [cookies, removeCookie] = useCookies('token')
    const [apiInfo, setApiInfo] = useState()

    const handleLogout = () => {
        removeCookie('token')
        setLoginStatus(false)
        props.history.push('/login')
    }

    const checkToken = useCallback(async () => {
        // api post数据并返回erorr
        try {
            let result = await fetch(tokenApi, {
                method: 'POST',
                body: JSON.stringify(cookies),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            if (result.ok) {
                result = await result.json()
                // console.log('Debug: Header-', result)
                setLoginStatus(true)
            } else {
                setLoginStatus(false)
                setApiInfo(`token has expired`)
            }
        } catch (err) {
            setApiInfo(`API error(${err.message})`)
        }
    }, [cookies, setLoginStatus])


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
                        {/* 此处暂时不要用Link的形式来跳转 */}
                        <a href="/" className="blog-header-logo text-dark" >Simple notebook</a>
                    </div>
                    <div className="col-4 d-flex justify-content-end align-items-center">
                        {loginStatus ?
                            <>
                                <Link className="btn btn-sm text-primary" to="/add" >Add</Link>
                                <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout} >Logout</button>
                            </>
                            :
                            <>
                                {apiInfo ? <span className="mr-4 text-danger">{apiInfo}</span> : ''}
                                <Link className="btn btn-sm btn-outline-secondary" to="/login" >Login</Link>
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