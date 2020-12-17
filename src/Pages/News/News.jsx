import React, { useState } from 'react';
import {
    Row, Col, Tabs, Modal
} from 'antd';
import Dic from '../../Assets/Dic/dic.json';
import Content from '../../Component/Content/Content';
import TableWithAjax from '../../Component/Content/TableContent';

import { useCookies } from 'react-cookie';
import { upsertContent, getContentList } from '../../API/apiPath';
import RequestUtils from '../../Utils/RequestUtils';
import Loading from '../../Component/Loading/Loading';
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';

function News(props) {
    const { language } = {...props};
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['user_token']);
    const { TabPane } = Tabs;
    const [overLayType, setOverLayType] = useState('');
    const [modifyItem, setModifyItem] = useState({});
    const [showEdit, setShowEdit] = useState(false);

    const callBack = (val) => {
        setLoading(true);
        const params = {
            url: upsertContent,
            param: {
                code: cookies.user_token.toString(),
                type: 2,
                content: val
            }
        }
        RequestUtils(params).then((res) => {
            console.log(res.result);
            setLoading(false);
        }).catch((e) => {
            setLoading(false);
            console.log(e);
        });
    };

    const tableCallBack = (record, flag) => {
        setModifyItem({ ...record });
        if (flag === 'update') {
            setOverLayType('update');
        } else if (flag === 'delete') {
            setOverLayType('delete');
        }
        setShowEdit(true);
    };
    
    const handleOk = () => {
        setShowEdit(false);
        console.log(overLayType);
        console.log(modifyItem);
    };

    const handleCancel = () => {
        setShowEdit(false);
    };

    return (
        <div className="site-news site-content">
            { loading ? <Loading text={Dic[language].common.loading}/> : null}
            <Row className="height-100-per">
                <Col span={24} className="border-1px-light-gray">
                    <Tabs defaultActiveKey="1" type="card" size="small">
                        <TabPane tab={ Dic[language].news.addNews } key="1">
                            <Content
                                language={language}
                                withImgs={false}
                                type="news"
                                callBack={(val) => {
                                    callBack(val);
                                }}
                            />
                        </TabPane>
                        <TabPane tab={ Dic[language].news.newsList } key="2">
                            <TableWithAjax
                                postParams={{
                                    url: getContentList,
                                    param: {
                                        code: cookies.user_token.toString(),
                                        type: 2
                                    }
                                }}
                                language={language}
                                pageSize={8}
                                tableCallBack={tableCallBack}
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
            >
                {
                    overLayType === 'update'
                    ?
                        <p>is update</p>
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

export default News;