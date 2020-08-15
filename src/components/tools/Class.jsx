import React from 'react'

export const Alert = (props) => {
    return (
        <div class="alert alert-primary" role="alert">
            {props.children}
        </div>
    )
}

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