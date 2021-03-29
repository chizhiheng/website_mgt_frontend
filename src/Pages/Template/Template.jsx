import React from 'react';
import {
    Row, Col, Image, Tabs
} from 'antd';
import Dic from '../../Assets/Dic/dic.json';
import './Template.scss';

function Template(props) {
    const { language } = {...props};
    const { TabPane } = Tabs;

    const location = () => {
        return;
    };

    const apply = () => {
        // console.log();
    };
    return (
        <div className="site-template site-content">
            <Row className="height-100-per">
                <Col span={24} className="border-1px-light-gray">
                <Tabs defaultActiveKey="1" type="card" size="small">
                        <TabPane tab={ Dic[language].template.tab.weiChat } key="1">
                            <Row>
                                <Col span={24}>
                                    aaaaaa
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab={ Dic[language].template.tab.webPage } key="2">
                            <Row>
                                <Col span={24}>
                                    <div className="template-container">
                                        <div className="template-item">
                                            <div className="template-img">
                                                <Image
                                                    width={200}
                                                    height={240}
                                                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                                />
                                            </div>
                                            <div className="template-title">
                                                <span className="current-use">{ Dic[language].template.current }</span>
                                            </div>
                                        </div>
                                        <div className="template-item">
                                            <div className="template-img">
                                                <Image
                                                    width={200}
                                                    height={240}
                                                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                                />
                                            </div>
                                            <div className="template-title">
                                                <span>
                                                    <a
                                                        href={location}
                                                        onClick={(e)=>{
                                                            apply(e);
                                                        }}
                                                    >
                                                        { Dic[language].template.apply }
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
    );
}

export default Template;
