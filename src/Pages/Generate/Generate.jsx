import React, {useEffect} from 'react';
import {
    Row, Col, Divider, Progress, Button
} from 'antd';
import Dic from '../../Assets/Dic/dic.json';
import {
    Html5Outlined, WechatOutlined
} from '@ant-design/icons';
import './Generate.scss';

function Generate(props) {
    const { language } = {...props};

    useEffect(() => {
      let monted = true;

      return () => {
        monted = false;
      };
    }, []);

    return (
        <div className="site-generate-html">
            <Row className="height-100-per">
                <Col span={24} className="border-1px-light-gray">
                    <Row>

                    </Row>
                    <Row>
                        <Col span={6}>
                            <p>{ Dic[language].generate.html.total }<span className="total-number">100</span></p>
                        </Col>
                        <Col span={6}>
                            <p>{ Dic[language].generate.html.articleNum }<span className="total-a-number">20</span></p>
                        </Col>
                        <Col span={6}>
                            <p>{ Dic[language].generate.html.newsNum }<span className="total-n-number">50</span></p>
                        </Col>
                        <Col span={6}>
                            <p>{ Dic[language].generate.html.productNum }<span className="total-p-number">30</span></p>
                        </Col>
                    </Row>
                    <Divider />
                    <Row>
                        <Col span={24}>
                            <span><strong>{50}</strong></span> {Dic[language].generate.description} <span><strong>{`2020-10-13`}</strong></span>
                        </Col>
                    </Row>
                    <Divider />
                    <Row className="float-right">
                        <Col span={12}>
                            <Button
                                type="primary"
                                icon={<Html5Outlined />}
                                // onClick={() => {updateNavItem(item, 'edit')}}
                            >
                                { Dic[language].generate.generateHTML }
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                type="primary"
                                icon={<WechatOutlined />}
                                // onClick={() => {updateNavItem(item, 'edit')}}
                            >
                                { Dic[language].generate.generateWX }
                            </Button>
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <Divider />
                    <Row>
                        <Col span={24}>
                            <Progress
                                strokeColor={{
                                    from: '#108ee9',
                                    to: '#87d068',
                                }}
                                percent={0}
                                status="active"
                            />
                        </Col>
                    </Row>
                    <Divider />
                </Col>
            </Row>
        </div>
    );
}

export default Generate;
