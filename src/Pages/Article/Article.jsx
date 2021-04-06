import React, { useState, useEffect, useContext } from 'react';
import {
    Row, Col, Tabs, Modal
} from 'antd';
import Dic from '../../Assets/Dic/dic.json';
import Content from '../../Component/Content/Content';
import TableWithAjax from '../../Component/Content/TableContent';

import { useCookies } from 'react-cookie';
import { insertContent, getContentList, updateContent, deleteContent, getContentDetails, getLangList } from '../../API/apiPath';
import RequestUtils from '../../Utils/RequestUtils';
import Loading from '../../Component/Loading/Loading';
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';
import './Article.scss';
import { AppContext } from '../../context/AppContext';

function Article(props) {
    const { language } = {...props};
    const { appState, setAppState } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['user_token']);
    const { TabPane } = Tabs;
    const [overLayType, setOverLayType] = useState('');
    const [modifyItem, setModifyItem] = useState({});
    const [showEdit, setShowEdit] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    const [contentDefaultValue, setContentDefaultValue] = useState({});
    const [disabledBtn, setDisabledBtn] = useState(true);
    const [responseExisted, setResponseExisted] = useState(false);

    const callBack = (val) => {
      if (val.flag === 'insert') {
          setLoading(true);
          const params = {
              url: insertContent,
              param: {
                  code: cookies.user_token.toString(),
                  type: 1,
                  content: val
              }
          };
          RequestUtils(params).then((res) => {
              setLoading(false);
              if (res.result === 'Content existed with same nav and language.') {
                setResponseExisted(true);
                setAppState({systemPopup: {
                  display: true,
                  type: 'warning',
                  title: Dic[language].common.systemPopup.existed.title,
                  desc: Dic[language].common.systemPopup.existed.description
                }});
              }
          }).catch((e) => {
              setLoading(false);
              console.log(e);
          });
      } else if (val.flag === 'update') {
          if (window.document.querySelectorAll('.article-edit-popup .red-border').length > 0){
              setDisabledBtn(true);
          } else {
              setDisabledBtn(false);
          }
          val.id = modifyItem.id;
          setModifyItem({...val});
      }
    };

    const tableCallBack = (record, flag) => {
      setModifyItem({ ...record });
      if (flag === 'update') {
        setLoading(true);
        const params = {
            url: getContentDetails,
            param: {
                code: cookies.user_token.toString(),
                content_id: record.id,
                type: 1
            }
        };
        RequestUtils(params).then((res) => {
            setLoading(false);
            setContentDefaultValue({...res.result[0]});
            setOverLayType('update');
        }).catch((e) => {
            setLoading(false);
            console.log(e);
        });
      } else if (flag === 'delete') {
        setDisabledBtn(false);
        setOverLayType('delete');
      }
      setShowEdit(true);
    };

    const handleOk = () => {
        setLoading(true);
        let params = {
            url: '',
            param: {
                code: cookies.user_token.toString(),
                contentId: modifyItem.id,
                type: 1
            }
        }
        if (overLayType === 'delete') {
            params.url = deleteContent;
        }
        if (overLayType === 'update') {
            params.param.details = {...modifyItem};
            params.url = updateContent;
        }
        RequestUtils(params).then((res) => {
            setLoading(false);
            setShowEdit(false);
            setReloadTable(!reloadTable);
        }).catch((e) => {
            setLoading(false);
            console.log(e);
        });
    };

    const handleCancel = () => {
        setShowEdit(false);
    };

    const clickTab = (e) => {
        if (e === '2') {
            setReloadTable(!reloadTable);
        }
    };

    return (
        <div className="site-article site-content">
            { loading ? <Loading text={Dic[language].common.loading}/> : null}
            <Row className="height-100-per">
                <Col span={24} className="border-1px-light-gray">
                    <Tabs defaultActiveKey="1" type="card" size="small" onTabClick={clickTab}>
                        <TabPane tab={ Dic[language].article.addArticle } key="1">
                            <Content
                                language={language}
                                withImgs={false}
                                type="article"
                                callBack={(val, flag) => {
                                    callBack(val, flag);
                                }}
                                responseExisted={responseExisted}
                            />
                        </TabPane>
                        <TabPane tab={ Dic[language].article.articleList } key="2">
                            <TableWithAjax
                                postParams={{
                                    url: getContentList,
                                    param: {
                                        code: cookies.user_token.toString(),
                                        type: 1
                                    }
                                }}
                                language={language}
                                pageSize={8}
                                tableCallBack={tableCallBack}
                                reload={reloadTable}
                            />
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
            <Modal
                // title="Basic Modal"
                visible={showEdit}
                onOk={() => handleOk(overLayType)}
                onCancel={handleCancel}
                width={1000}
                className={overLayType === 'update' ? 'article-edit-popup' : 'article-delete-popup'}
                okButtonProps={{
                    disabled: disabledBtn
                }}
            >
                {
                    overLayType === 'update'
                    ?
                        <Content
                            language={language}
                            withImgs={false}
                            type="article"
                            callBack={(val) => {
                                callBack(val);
                            }}
                            defaultVal={contentDefaultValue}
                        />
                    :
                        null
                }
                {
                    overLayType === 'delete'
                    ?
                        <p><ExclamationCircleOutlined /> { Dic[props.language].common.deleteConfirmTitel }</p>
                    :
                    null
                }
            </Modal>
        </div>
    );
}

export default Article;
