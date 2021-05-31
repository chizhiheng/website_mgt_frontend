import React, {useEffect, useState} from 'react';
import {
    Row, Col, Image, Tabs
} from 'antd';
import { useCookies } from 'react-cookie';
import Dic from '../../Assets/Dic/dic.json';
import './Template.scss';
import { host, getTemplates } from '../../API/apiPath';
import Loading from '../../Component/Loading/Loading';
import RequestUtils from '../../Utils/RequestUtils';

function Template(props) {
    const { language } = {...props};
    const { TabPane } = Tabs;
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['mgt_user_token']);
    const [templateList, setTemplateList] = useState([]);

    const location = () => {
        return;
    };

    const apply = () => {
        // console.log();
    };

    const tabClick = (e) => {
      if (e === '1') {
        setLoading(true);
        const params = {
          url: getTemplates,
          param: {
              code: cookies.mgt_user_token.toString()
          }
        };
        RequestUtils(params).then((res) => {
          setLoading(false);
          setTemplateList([...res.imgPath]);
        }).catch((e) => {
          setLoading(false);
          console.log(e);
        });
      }
    };
    useEffect(() => {
      let monted = true;

      tabClick('1');

      return () => {
        monted = false;
      };
    }, []);

    return (
        <div className="site-template site-content">
          { loading ? <Loading text={Dic[language].common.loading}/> : null}
          <Row className="height-100-per">
            <Col span={24} className="border-1px-light-gray">
              <Tabs
                onChange={(e) => {
                  tabClick(e);
                }}
                defaultActiveKey="1"
                type="card"
                size="small"
              >
                <TabPane tab={ Dic[language].template.tab.webPage } key="1">
                    <Row>
                      <Col span={24}>
                        <div className="template-container">
                          {/* <div className="template-item">
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
                          </div> */}
                          {
                            templateList.map((item) => (
                              <>
                                <div className="template-item">
                                  <div className="template-img">
                                    <Image
                                        height={240}
                                        src={host + '/' + item.imgPath + '/' + item.imgName}
                                    />
                                  </div>
                                  <div className="template-title">
                                    <span>
                                      {/* <a
                                          href={location}
                                          onClick={(e)=>{
                                              apply(e);
                                          }}
                                      > */}
                                          { Dic[language].template.current }
                                      {/* </a> */}
                                    </span>
                                  </div>
                                </div>
                              </>
                            ))
                          }
                        </div>
                      </Col>
                    </Row>
                </TabPane>
                <TabPane tab={ Dic[language].template.tab.weiChat } key="2">
                    <Row>
                        <Col span={24}>
                          { Dic[language].common.comingSoon }
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
