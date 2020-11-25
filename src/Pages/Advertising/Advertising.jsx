import React from 'react';
import {
    Row, Col
} from 'antd';
import Dic from '../../Assets/Dic/dic.json';

function Advertising(props) {
    const { language } = {...props};

    return (
        <div className="site-article">
            <Row className="height-100-per">
                <Col span={24} className="border-1px-light-gray">
                    Advertising
                </Col>
            </Row>
        </div>
    );
}

export default Advertising;