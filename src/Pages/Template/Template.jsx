import React from 'react';
import {
    Row, Col, Image
} from 'antd';
import Dic from '../../Assets/Dic/dic.json';
import './Template.scss';

function Template(props) {
    const { language } = {...props};

    const location = () => {
        return;
    };

    const apply = () => {
        console.log();
    };
    return (
        <div className="site-template">
            <Row className="height-100-per">
                <Col span={24} className="border-1px-light-gray">
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
        </div>
    );
}

export default Template;