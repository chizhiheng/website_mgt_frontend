import React, { useState } from 'react';
import {
    Row, Col
} from 'antd';
import Dic from '../../Assets/Dic/dic.json';
import './PageBanner.scss';

function PageBanner(props) {
    const { language } = {...props};
    const [bannerList, setBannerList] = useState({});

    return (
        <div className="site-template site-content">
            <Row className="height-100-per">
                <Col span={12} className="padding-right-2rem">
                    <h4>hello</h4>
                </Col>
                <Col span={12}>
                    <h4>hello</h4>
                </Col>
            </Row>
        </div>
    );
}

export default PageBanner;
