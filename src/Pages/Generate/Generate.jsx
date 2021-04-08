import React, {useEffect, useState} from 'react';
import {
    Row, Col, Divider, Progress, Button
} from 'antd';
import Dic from '../../Assets/Dic/dic.json';
import {
    Html5Outlined, WechatOutlined
} from '@ant-design/icons';
import './Generate.scss';
import { useCookies } from 'react-cookie';
import { getGenerateInfo, generatePage } from '../../API/apiPath';
import RequestUtils from '../../Utils/RequestUtils';
import Loading from '../../Component/Loading/Loading';

function Generate(props) {
    const { language } = {...props};
    const [cookies] = useCookies(['user_token']);
    const [loading, setLoading] = useState(false);
    const [generateInfo, setGeneratedInfo] = useState({
      totalContent: 0,
      totalArticle: 0,
      totalNews: 0,
      totalProduct: 0,
      needToGenerate: 0,
      lastGenerateDate: ''
    });

    useEffect(() => {
      let monted = true;

      setLoading(true);
      const params = {
        url: getGenerateInfo,
        param: {
            code: cookies.user_token.toString(),
        }
      };
      RequestUtils(params).then((res) => {
        setLoading(false);
        if (monted) {
          setGeneratedInfo({...res.result});
        }
      }).catch((e) => {
        setLoading(false);
        console.log(e);
      });

      return () => {
        monted = false;
      };
    }, []);

    const generate = (flag) => {
      if (flag === 'html') {
        const params = {
          url: generatePage,
          param: {
              code: cookies.user_token.toString(),
          }
        };
        RequestUtils(params).then((res) => {
          console.log(res);
        }).catch((e) => {
          console.log(e);
        });
      }
    };
    return (
      <div className="site-generate-html">
        { loading ? <Loading text={Dic[language].common.loading}/> : null}
        <Row className="height-100-per">
          <Col span={24} className="border-1px-light-gray">
            <Row>
              <Col span={6}>
                <p>{ Dic[language].generate.html.total }<span className="total-number">{generateInfo.totalContent}</span></p>
              </Col>
              <Col span={6}>
                <p>{ Dic[language].generate.html.articleNum }<span className="total-a-number">{generateInfo.totalArticle}</span></p>
              </Col>
              <Col span={6}>
                <p>{ Dic[language].generate.html.newsNum }<span className="total-n-number">{generateInfo.totalNews}</span></p>
              </Col>
              <Col span={6}>
                <p>{ Dic[language].generate.html.productNum }<span className="total-p-number">{generateInfo.totalProduct}</span></p>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={24}>
                <span><strong>{generateInfo.totalProduct}</strong></span> {Dic[language].generate.description} <span><strong>{generateInfo.lastGenerateDate === '' ? '---- ----' : generateInfo.lastGenerateDate}</strong></span>
              </Col>
            </Row>
            <Divider />
            <Row className="float-right">
              <Col span={12}>
                <Button
                  type="primary"
                  icon={<Html5Outlined />}
                  onClick={() => {generate('html')}}
                >
                  { Dic[language].generate.generateHTML }
                </Button>
              </Col>
              {/* <Col span={12}>
                <Button
                  type="primary"
                  icon={<WechatOutlined />}
                  // onClick={() => {updateNavItem(item, 'edit')}}
                >
                  { Dic[language].generate.generateWX }
                </Button>
              </Col> */}
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
