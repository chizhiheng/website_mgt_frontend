import React, { useState } from 'react';
import './Login.scss';
import Dic from '../../Assets/Dic/dic.json';
import {
    LoginOutlined
} from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { Input, Button, Form } from 'antd';
import { loginApiPath } from '../../API/apiPath';
import RequestUtils from '../../Utils/RequestUtils';
import Loading from '../../Component/Loading/Loading';

function Login(props) {
    const { language } = {...props};
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState({
        id: '',
        pwd: ''
    });
    const [status, setStatus] = useState({
        id: {
            hasFeedback: false,
            validateStatus: ''
        },
        pwd: {
            hasFeedback: false,
            validateStatus: '',
            help: ''
        }
    });

    const onFinish = async values => {
        setStatus({...status, pwd: {
            help: ''
        }});
        setLoading(true);
        setValue({...value, id: values.username, pwd: values.password});
        const params = {
            url: loginApiPath,
            param: values
        }
        const res = await RequestUtils(params);
        setLoading(false);
        if (res.code === 200) {
            console.log(res);
            history.push('/settings/');
        } else {
            console.log(res);
            setStatus({...status, id: {
                hasFeedback: false,
                validateStatus: 'error'
            },
            pwd: {
                hasFeedback: false,
                validateStatus: 'error',
                help: Dic[language].login.noResult
            }});
        }
    };

    const onFinishFailed = errorInfo => {
        if (!errorInfo.values.username) {
            setStatus((res) => {
                res.id.validateStatus = 'error';
                return res;
            });
        }
        if (!errorInfo.values.password) {
            setStatus({...status, pwd: {
                validateStatus: 'error',
            }});
        }
    };

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 8 },
    };
    const tailLayout = {
        wrapperCol: { offset: 0, span: 24 },
    };

    return (
        <div className="login-page white-bg">
            { loading ? <Loading text={Dic[language].common.loading}/> : null}
            <h2><LoginOutlined />&nbsp;&nbsp;{ Dic[language].login.title }</h2><br />
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                onValuesChange={(e) => {
                    setStatus({
                        id: {
                            hasFeedback: false,
                            validateStatus: ''
                        },
                        pwd: {
                            hasFeedback: false,
                            validateStatus: '',
                            help: ''
                        }
                    });
                    if (e.username === '') {
                        setStatus((res) => {
                            res.id.validateStatus = 'error';
                            return res;
                        });
                    }
                    if (e.password === '') {
                        setStatus({...status, pwd: {
                            validateStatus: 'error',
                        }});
                    }
                }}
                >
                <Form.Item
                    label={ Dic[language].login.userName }
                    name="username"
                    rules={[{ required: true, message: Dic[language].login.invalid.id }]}
                    validateStatus={status.id.validateStatus}
                    hasFeedback={status.id.hasFeedback}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={ Dic[language].login.password }
                    name="password"
                    rules={[{ required: true, message: Dic[language].login.invalid.pwd }]}
                    validateStatus={status.pwd.validateStatus}
                    hasFeedback={status.pwd.hasFeedback}
                    help={status.pwd.help}
                >
                    <Input.Password />
                </Form.Item>

                {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item> */}

                <Form.Item {...tailLayout}>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        { Dic[language].login.login }
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;