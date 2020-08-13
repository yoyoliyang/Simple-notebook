import React, { useState, createContext } from "react"

export const LoginTokenContext = createContext()
export const LoginStatusContext = createContext()

export const LoginTokenProvider = (props) => {
    const [token, setToken] = useState({
        last_token: '',
        username: ''
    })
    return (
        <LoginTokenContext.Provider value={[token, setToken]}>
            {props.children}
        </LoginTokenContext.Provider>
    )
}

export const LoginStatusProvider = (props) => {
    const [loginStatus, setLoginStatus] = useState(false)
    return (
        <LoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
            {props.children}
        </LoginStatusContext.Provider>
    )
}