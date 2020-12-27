import React, { useState, useEffect } from 'react';
import {
    Row, Col, Tabs, Modal
} from 'antd';
import Dic from '../../Assets/Dic/dic.json';
import Content from '../../Component/Content/Content';
import TableWithAjax from '../../Component/Content/TableContent';

import { useCookies } from 'react-cookie';
import { host, insertContent, insertImg, getImgs, deleteImg, getContentList, updateContent, deleteContent, getContentDetails } from '../../API/apiPath';
import RequestUtils from '../../Utils/RequestUtils';
import Loading from '../../Component/Loading/Loading';
import './Product.scss';
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';

function Product(props) {
    const { language } = {...props};
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['user_token']);
    const [selectedImgs, setSelectedImgs] = useState([]);
    const [imgInLibrary, setImgInLibrary] = useState([]);
    const { TabPane } = Tabs;
    const imgHost = host.replace('/api', '') + '/upload/';
    const [overLayType, setOverLayType] = useState('');
    const [modifyItem, setModifyItem] = useState({});
    const [showEdit, setShowEdit] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    const [contentDefaultValue, setContentDefaultValue] = useState({});
    const [disabledBtn, setDisabledBtn] = useState(true);

    const callBack = (val) => {
        if (val.flag === 'insert') {
            setLoading(true);
            if (!val.imgs) {
                val.imgs = [];
            }
            const params = {
                url: insertContent,
                param: {
                    code: cookies.user_token.toString(),
                    type: 3,
                    content: val
                }
            }
            RequestUtils(params).then((res) => {
                setLoading(false);
            }).catch((e) => {
                setLoading(false);
                console.log(e);
            });
        } else if (val.flag === 'update') {
            if (window.document.querySelectorAll('.product-edit-popup .red-border').length > 0){
                setDisabledBtn(true);
            } else {
                setDisabledBtn(false);
            }
            val.id = modifyItem.id;
            setModifyItem({...val});
        }
    };

    const getImageFromLib = () => {
        const params = {
            url: getImgs,
            param: {
                code: cookies.user_token.toString()
            }
        };
        RequestUtils(params).then((res) => {
            if (res.result.length) {
                const result = res.result;
                result.forEach((item) => {
                    item.img_path = imgHost + item.img_name;
                    item.selected = false;
                });
                setImgInLibrary([...result]);
                setLoading(false);
            }
        }).catch((e) => {
            setImgInLibrary([]);
            setLoading(false);
            console.log(e);
        });;
    };

    const deleteImageFromLib = (imgId) => {
        const params = {
            url: deleteImg,
            param: {
                code: cookies.user_token.toString(),
                id: imgId
            }
        };
        RequestUtils(params).then((res) => {
            getImageFromLib();
            setLoading(false);
        }).catch((e) => {
            setLoading(false);
            console.log(e);
        });;
    };
    
    useEffect(() => {
        let monted = true;

        if (monted) {
            setLoading(true);
            setSelectedImgs([{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                code: '',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-2',
                name: 'image.png',
                status: 'done',
                code: '',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-3',
                name: 'image.png',
                status: 'done',
                code: '',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-4',
                name: 'image.png',
                status: 'done',
                code: '',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-xxx',
                percent: 50,
                name: 'image.png',
                status: 'uploading',
                code: '',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-5',
                name: 'image.png',
                status: 'error',
                code: '',
            }]);
            getImageFromLib();
        }

        return () => {
            monted = false;
        };
    }, []);

    const tableCallBack = (record, flag) => {
        setModifyItem({ ...record });
        if (flag === 'update') {
            setLoading(true);
            const params = {
                url: getContentDetails,
                param: {
                    code: cookies.user_token.toString(),
                    content_id: record.id,
                    type: 3
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
            setOverLayType('update');
        } else if (flag === 'delete') {
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
                type: 3
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
        setContentDefaultValue({});
        setImgInLibrary([]);
    };

    const clickTab = (e) => {
        if (e === '2') {
            setReloadTable(!reloadTable);
        }
    };

    return (
        <div className="site-product site-content">
            { loading ? <Loading text={Dic[language].common.loading}/> : null}
            <Row className="height-100-per">
                <Col span={24} className="border-1px-light-gray">
                    <Tabs defaultActiveKey="1" type="card" size="small" onTabClick={clickTab}>
                        <TabPane tab={ Dic[language].product.addProduct } key="1">
                            <Content
                                language={language}
                                withImgs
                                type="product"
                                callBack={(val) => {
                                    callBack(val);
                                }}
                                url={host + insertImg}
                                userToken={cookies.user_token.toString()}
                                imgs={selectedImgs}
                                imgInLibrary={imgInLibrary}
                                getImageFromLib={getImageFromLib}
                                deleteImageFromLib={deleteImageFromLib}
                                imgHost={imgHost}
                            />
                        </TabPane>
                        <TabPane tab={ Dic[language].product.productList } key="2">
                            <TableWithAjax
                                postParams={{
                                    url: getContentList,
                                    param: {
                                        code: cookies.user_token.toString(),
                                        type: 3
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
                className="product-edit-popup"
                okButtonProps={{
                    disabled: disabledBtn
                }}
            >
                {
                    overLayType === 'update'
                    ?
                        <Content
                            language={language}
                            withImgs
                            type="product"
                            callBack={(val) => {
                                callBack(val);
                            }}
                            url={host + insertImg}
                            userToken={cookies.user_token.toString()}
                            imgs={selectedImgs}
                            imgInLibrary={imgInLibrary}
                            getImageFromLib={getImageFromLib}
                            deleteImageFromLib={deleteImageFromLib}
                            imgHost={imgHost}
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

export default Product;