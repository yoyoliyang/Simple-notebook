import React, { useContext } from "react"
import { Link, withRouter } from "react-router-dom"
import { LoginStatusContext } from "./LoginTokenContext"
import { useCookies } from "react-cookie"

const Header = (props) => {

    const [loginStatus, setLoginStatus] = useContext(LoginStatusContext)
    const [cookies, removeCookie] = useCookies('last_token')

    // console.log('Header debug:',loginStatus)
    const handleLogout = () => {
        removeCookie('last_token')
        setLoginStatus(false)
        props.history.push('/login')
    }

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
                                    <Link className="btn btn-sm text-primary" to="/add">Add</Link>
                                    <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout} >Logout</button>
                                </>
                                :
                                <Link className="btn btn-sm btn-outline-secondary" to="/login">Login</Link>
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