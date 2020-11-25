import React from 'react';
import './Settings.scss';
import Dic from '../../Assets/Dic/dic.json';
import Uploader from '../../Component/FormItems/Uploader/Uploader';
import {
    Input, Row, Col, Button, Divider,
    Tooltip, Tabs
} from 'antd';
import {
    HomeOutlined,
    SearchOutlined,
    SolutionOutlined,
    MailOutlined,
    PhoneOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';

function Dashboard(props) {
    const { language } = {...props};
    const { TabPane } = Tabs;

    return (
        <div className="site-settings">
            <Row className="height-100-per">
                <Col span={24} className="border-1px-light-gray">
                    <Tabs defaultActiveKey="1" type="card" size="small">
                        <TabPane tab={ Dic[language].settings.tab.siteInfo.name } key="1">
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={24}>
                                            <Input 
                                                size="large"
                                                placeholder={ Dic[language].settings.tab.siteInfo.siteName }
                                                prefix={<HomeOutlined />}
                                                suffix={
                                                    <Tooltip title={ Dic[language].settings.tab.siteInfo.siteNameDesc }>
                                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                                    </Tooltip>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Input
                                                size="large"
                                                placeholder={ Dic[language].settings.tab.siteInfo.siteKeywords }
                                                prefix={<SearchOutlined />}
                                                suffix={
                                                    <Tooltip title={ Dic[language].settings.tab.siteInfo.siteKeywordsDesc }>
                                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                                    </Tooltip>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Input
                                                size="large"
                                                placeholder={ Dic[language].settings.tab.siteInfo.siteDescription }
                                                prefix={<SolutionOutlined />}
                                                suffix={
                                                    <Tooltip title={ Dic[language].settings.tab.siteInfo.siteDescriptionDesc }>
                                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                                    </Tooltip>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}></Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Divider />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={24}>
                                            <Input
                                                size="large"
                                                placeholder={ Dic[language].settings.tab.siteInfo.siteContact.email }
                                                prefix={<MailOutlined />}
                                                suffix={
                                                    <Tooltip title={ Dic[language].settings.tab.siteInfo.siteContact.emailDesc }>
                                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                                    </Tooltip>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Input
                                                size="large"
                                                placeholder={ Dic[language].settings.tab.siteInfo.siteContact.phone1 }
                                                prefix={<PhoneOutlined />}
                                                suffix={
                                                    <Tooltip title={ Dic[language].settings.tab.siteInfo.siteContact.phoneDesc }>
                                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                                    </Tooltip>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Input
                                                size="large"
                                                placeholder={ Dic[language].settings.tab.siteInfo.siteContact.phone2 }
                                                prefix={<PhoneOutlined />}
                                                suffix={
                                                    <Tooltip title={ Dic[language].settings.tab.siteInfo.siteContact.phoneDesc }>
                                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                                    </Tooltip>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={12} className="line-height-40px">
                                            <Uploader language={language} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} className="line-height-40px text-align-right">
                                    <Button type="primary" className="margin-right-2rem">{ Dic[language].common.update }</Button>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab={ Dic[language].settings.tab.banner.name } key="2">
                            
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;