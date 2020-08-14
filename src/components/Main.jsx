import React, { useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie'
import { LoginStatusContext } from './LoginTokenContext'

export const MainClass = (props) => {
    return (
        <main role="main" className="container">
            <div className="row">
                <div className="col blog-main">
                    <div className="blog-post">
                        {props.children}
                    </div>
                </div>
            </div>
        </main>
    )
}

const Main = (props) => {

    // Main组件用来把cookie存放的token发送到服务端，返回登陆状态，根据状态来render数据
    // 一个重要的组件,尽量把需要编辑管理的组件用该组件包裹起来
    const [cookies, setCookie] = useCookies(['token'])
    const [loginStatus, setLoginStatus] = useContext(LoginStatusContext)

    const tokenApi = 'http://127.0.0.1:5000/api/check_token'
    const checkToken = async () => {
        let result = await fetch(tokenApi, {
            method: 'POST',
            body: JSON.stringify(cookies),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        result = await result.json()
        if (result.loginStatus) {
            setLoginStatus(true)
        } else {
            setLoginStatus(false)
        }
    }

    useEffect(() => {
        checkToken()
    })


    return (
        <>
            {loginStatus ?
                <MainClass>
                    {props.children}
                </MainClass>
                :
                <MainClass>
                    <h3>error login token(需要登陆或token过期)</h3>
                </MainClass>
            }
        </>
    )

}

export default Main
