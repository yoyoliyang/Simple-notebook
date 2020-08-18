import React from 'react'

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

export const Alert = (props) => {
    return (
        <div class="alert alert-success">
            <strong>{props.children}</strong>
        </div>
    )
}
