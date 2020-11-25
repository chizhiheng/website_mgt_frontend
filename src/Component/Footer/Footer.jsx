import React, {useEffect} from 'react';
import './Footer.scss';
import { Row, Col } from 'antd';
import { Layout } from 'antd';
import { PhoneOutlined, MailOutlined, WechatOutlined } from '@ant-design/icons';
import Dic from '../../Assets/Dic/dic.json';

function Footer(props) {
    const { Sider, Content } = Layout;
    const {language} = props;

    useEffect(() => {
    },[language]);

    return (
        <div className="site-footer">
            <Layout>
                <Sider className="black-bg" />
                    <Content className="black-bg">
                        <Row>
                            <Col span={8} className="site-footer-col">
                                
                            </Col>
                            <Col span={8} className="site-footer-col text-align-right">
                                
                            </Col>
                            <Col span={8} className="site-footer-col text-align-right">
                                <p><PhoneOutlined /> {Dic[language].contact.phone}13624280762</p>
                                <p><MailOutlined /> {Dic[language].contact.email}htrchzhhg@163.com</p>
                                <p><WechatOutlined /> {Dic[language].contact.wechat}hunter_chi</p>
                                <p><img src={require("../../Assets/Images/QR_code.jpg")} alt="QR code" width="100" height="100" /></p>
                            </Col>
                        </Row>
                    </Content>
                <Sider className="black-bg"/>
            </Layout>
            
        </div>
    );
}

export default Footer;