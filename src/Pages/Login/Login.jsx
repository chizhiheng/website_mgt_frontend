import React from 'react';
import './Login.scss';
import Dic from '../../Assets/Dic/dic.json';
import {
    LoginOutlined,
    KeyOutlined,
    UserOutlined,EyeTwoTone,EyeInvisibleOutlined
} from '@ant-design/icons';
import { Input, Button } from 'antd';

function Login(props) {
    const { language } = {...props};

    return (
        <div className="login-page">
            <h2><LoginOutlined />&nbsp;&nbsp;{ Dic[language].login.title }</h2><br />
            <Input size="large" placeholder={ Dic[language].login.userName } prefix={<UserOutlined />} /><br /><br />
            <Input.Password
                placeholder={ Dic[language].login.password }
                prefix={<KeyOutlined />}
                size="large"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            /><br /><br /><br /><br />
            <Button type="primary">{ Dic[language].login.login }</Button>
        </div>
    );
};

export default Login;