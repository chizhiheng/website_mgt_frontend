import React, { useState, useEffect } from 'react';
import {
    Row, Col, Button, Modal, Tooltip
} from 'antd';
import {
    PlusOutlined,
    FormOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    DeleteOutlined,
    WarningOutlined
  } from '@ant-design/icons';
import Dic from '../../Assets/Dic/dic.json';
import './NavMgt.scss';
import NavFields from '../../Component/NavMgt/NavFields/';

import { useCookies } from 'react-cookie';
import { getMenu, upsertMenu } from '../../API/apiPath';
import RequestUtils from '../../Utils/RequestUtils';
import Loading from '../../Component/Loading/Loading';

function NavMgt(props) {
    const { language } = {...props};
    const { confirm } = Modal;
    const [updateItem, setUpdateItem] = useState({});
    const [cookies] = useCookies(['user_token']);
    const [loading, setLoading] = useState(false);
    const [navList, setNavList] = useState([]);
    const [showEditOverlay, setShowEditOverlay] = useState(false);
    const [disableApplyBtn, setDisableApplyBtn] = useState(true);
    const [supportLangs, setSupportLangs] = useState({});

    useEffect(() => {
        let monted = true;

        if (monted) {
            setLoading(true);
            getMenuList();
        }

        return () => {
            monted = false;
        };
    }, []);

    // nav items edit, up, down & delete function
    const updateNavItem = (item, type) => {
        if (type === 'edit') {
            setUpdateItem({...item});
            setShowEditOverlay(true);
        } else if (type === 'moveUp') {
            const arr = [...navList]
            fetchNav(item.key, arr, 'moveUp');
            setNavList([...arr]);
            setDisableApplyBtn(false);
        } else if (type === 'moveDown') {
            const arr = [...navList]
            fetchNav(item.key, arr, 'moveDown');
            setNavList([...arr]);
            setDisableApplyBtn(false);
        } else if (type === 'delete') {
            showConfirm(item);
        }
    };

    const showConfirm = (item) => {
        confirm({
          title: Dic[language].common.deleteConfirmTitel,
          icon: <WarningOutlined />,
          content: Dic[language].NavMgt.currentNav.deleteConfirmDesc,
          cancelText: Dic[language].common.cancel,
          okText: Dic[language].common.ok,
          okType: 'danger',
          onOk() {
            const arr = [...navList,];
            fetchNav(item.key, arr, 'delete');
            setNavList([...arr]);
            setDisableApplyBtn(false);
          },
          onCancel() {
            // console.log('Cancel');
          },
        });
    };

    const formatNav = (result) => {
        let parentArr = [];
        result.forEach((element) => {
            if (element.s_id === '' || element.s_id === '-1') {
                element.children = restructureData(element, result);
                parentArr.push(element);
            }
        });
        setNavList([...parentArr]);
    };

    const restructureData = (element, result) => {
        let res = [];
        result.forEach((item) => {
            if (item.s_id === element.key) {
                item.children = restructureData(item, result);
                res.push(item);
            }
        });
        return res;
    };

    const getMenuList = () => {
        const params = {
            url: getMenu,
            param: { code: cookies.user_token.toString(), type: 'all' }
        }
        RequestUtils(params).then((res) => {
            setSupportLangs(res.lang);
            formatNav(res.result);
            setLoading(false);
        }).catch((e) => {
            setLoading(false);
            console.log(e);
        });
    };

    // loop nav itself
    const fetchNav = (key, treeList, type) => {
        for (let index = 0; index < treeList.length; index++) {
            const element = treeList[index];
            if (element.key === key) {
                if (type === 'moveUp') {
                    upGo(treeList, index);
                } else if (type === 'moveDown') {
                    // console.log('moveDown');
                    downGo(treeList, index);
                } else if (type === 'delete') {
                    treeList.splice(index, 1);
                }
                return true;
            }
            if (element.children && element.children.length) {
                fetchNav(key, element.children, type);
            }
        }
    };

    const upGo = (fieldData,index) => {
        if(index !== 0) {
            fieldData[index] = fieldData.splice(index-1, 1, fieldData[index])[0];
        }else{
            fieldData.push(fieldData.shift());
        }
    }
    const downGo= (fieldData,index) => {
        if(index !== fieldData.length-1) {
            fieldData[index] = fieldData.splice(index+1, 1, fieldData[index])[0];
        }else{
            fieldData.unshift( fieldData.splice(index,1)[0]);
        }
    }

    const closeEditOverlay = () => {
        setShowEditOverlay(false);
    };

    const applyNavToSite = (e) => {
        setLoading(true);
        const params = {
            url: upsertMenu,
            param: {
                code: cookies.user_token.toString(),
                values: navList
            }
        }
        RequestUtils(params).then((res) => {
            setLoading(false);
            setDisableApplyBtn(true);
            // getMenuList();
        }).catch((e) => {
            setLoading(false);
            console.log(e);
        });
    };

    // generte added nav
    const generteNav = (val, flag) => {
        return val.map((item, id) => (
            <div className="item" key={`nav-${flag}-item-${id}`}>
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <span>{ supportLangs.cn === '1' ? `${Dic[language].NavMgt.addNav.cnName}: ${item.title}` : ''}</span><br />
                            <span>{ supportLangs.en === '1' ? `${Dic[language].NavMgt.addNav.enName}: ${item.en_title}` : '' }</span><br />
                            <span>{ supportLangs.jp === '1' ? `${Dic[language].NavMgt.addNav.jpName}: ${item.jp_title}` : '' }</span><br />
                            <span>{ supportLangs.kr === '1' ? `${Dic[language].NavMgt.addNav.krName}: ${item.kr_title}` : '' }</span><br />
                            <span>{ item.children && item.children.length ? '' : `${Dic[language].NavMgt.addNav.pathName}: ${item.key}` }</span>
                        </>
                    }
                >
                    <span className="nav-label">
                        { language === 'zh' ? item.title : item.en_title } { item.children && item.children.length ? '' : `- ${item.key}` }
                        <span className="nav-item-modify-container float-right">
                            <Button
                                type="primary"
                                icon={<FormOutlined />}
                                name={item.key}
                                onClick={() => {updateNavItem(item, 'edit')}}
                            ></Button>
                            { id === 0 ? null :
                                <Button
                                    type="primary"
                                    icon={<ArrowUpOutlined />}
                                    name={item.key}
                                    onClick={() => {updateNavItem(item, 'moveUp')}}
                                ></Button>
                            }
                            { id === val.length - 1 ? null :
                                <Button
                                    type="primary"
                                    icon={<ArrowDownOutlined />}
                                    name={item.key}
                                    onClick={() => {updateNavItem(item, 'moveDown')}}
                                ></Button>
                            }
                            <Button
                                type="primary"
                                icon={<DeleteOutlined />}
                                name={item.key}
                                onClick={() => {updateNavItem(item, 'delete')}}
                            ></Button>
                        </span>
                    </span>
                </Tooltip>
                {
                    item.children && item.children.length > 0 ?
                        generteNav(item.children, 'children')
                    : ''
                }
            </div>
        ));
    };

    const navFieldsCallBack = (val) => {
        // console.log('navFieldsCallBack', val);
        setDisableApplyBtn(false);
        setNavList([...val]);
        closeEditOverlay();
    };

    return (
        <div className="site-navmgt">
            { loading ? <Loading text={Dic[language].common.loading}/> : null}
            {/* update nav item popup start */}
            <Modal
                title={ Dic[language].common.update }
                visible={showEditOverlay}
                onCancel={closeEditOverlay}
                cancelText={ Dic[language].common.cancel }
                onOk={closeEditOverlay}
                okText={ Dic[language].common.ok }
                className="edit-nav-overlay"
            >
                <NavFields
                    language={language}
                    callBack={navFieldsCallBack}
                    showTitle={false}
                    defaultValue={navList}
                    btnLabel={ Dic[language].common.update }
                    isUpdate
                    updateVal={updateItem}
                    langSupport={supportLangs}
                />
            </Modal>
            {/* update nav item popup stop */}

            <Row className="height-100-per">
                <Col span={12}>
                    <Row className="height-100-per">
                        <Col span={24} className="border-1px-light-gray">
                            <Row>
                                <Col span={24}>
                                    <h4>{ Dic[language].NavMgt.currentNav.title }</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <div className="nav-display-area">
                                        {
                                            generteNav(navList, 'parent')
                                        }
                                    </div>
                                </Col>
                            </Row>
                            <Row className="float-right">
                                <Col span={24}>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={applyNavToSite}
                                        disabled={ navList.length <= 0 || disableApplyBtn ? true : false }
                                    >
                                        { Dic[language].NavMgt.currentNav.apply }
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <NavFields
                        language={language}
                        callBack={navFieldsCallBack}
                        showTitle
                        defaultValue={navList}
                        btnLabel={ Dic[language].NavMgt.addNav.addNew }
                        isUpdate={false}
                        updateVal={false}
                        langSupport={supportLangs}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default NavMgt;
