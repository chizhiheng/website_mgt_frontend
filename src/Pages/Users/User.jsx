import React from 'react';
import {
    Row, Col
} from 'antd';
import Dic from '../../Assets/Dic/dic.json';
// import {
//     Html5Outlined, WechatOutlined
// } from '@ant-design/icons';
import './User.scss';

function User(props) {
    const { language } = {...props};

    return (
        <div className="site-user">
            <Row className="height-100-per">
                <Col span={24} className="border-1px-light-gray">
                    { Dic[language].user.userList}
                </Col>
            </Row>
        </div>
    );
}

export default User;