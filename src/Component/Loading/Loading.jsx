import React from 'react';
import { Spin } from 'antd';
import './Loading.scss';

function Loading(props) {
    const {text} = {...props}
    return (
        <div className="site-loading">
            <Spin tip={text} />
        </div>
    )
}

export default Loading;