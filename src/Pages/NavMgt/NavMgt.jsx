import React, { useState } from 'react';
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

function NavMgt(props) {
    const { language } = {...props};
    const { confirm } = Modal;
    const [updateItem, setUpdateItem] = useState({});
    const [navList, setNavList] = useState([{
        title: '公司简介',
        etitle: 'Company Intro',
        key: '/company/',
        type: 1,
        parentKey: -1
    },{
        title: '产品介绍',
        etitle: 'Product Intro',
        key: '/product/',
        type: 1,
        parentKey: -1,
        children: [{
            title: '产品介绍1',
            etitle: 'Product Intro1',
            key: '/product/1/',
            type: 1,
            parentKey: '/product/',
        },{
            title: '产品介绍2',
            etitle: 'Product Intro2',
            key: '/product/2/',
            type: 1,
            parentKey: '/product/',
        }]
    }]);
    const [showEditOverlay, setShowEditOverlay] = useState(false);

    // nav items edit, up, down & delete function
    const updateNavItem = (item, type) => {
        if (type === 'edit') {
            setUpdateItem({...item});
            setShowEditOverlay(true);
        } else if (type === 'moveUp') {
            const arr = [...navList]
            fetchNav(item.key, arr, 'moveUp');
            setNavList([...arr]);
        } else if (type === 'moveDown') {
            const arr = [...navList]
            fetchNav(item.key, arr, 'moveDown');
            setNavList([...arr]);
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
            console.log('OK');
            const arr = [...navList,];
            fetchNav(item.key, arr, 'delete');
            setNavList([...arr]);
          },
          onCancel() {
            console.log('Cancel');
          },
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
                    console.log('moveDown');
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
        console.log(e.target);
        console.log('send post request to backend the param is: ', navList);
    };

    // generte added nav
    const generteNav = (val, flag) => {
        return val.map((item, id) => (
            <div className="item" key={`nav-${flag}-item-${id}`}>
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <span>{`${Dic[language].NavMgt.addNav.cnName}: ${item.title}`}</span><br />
                            <span>{`${Dic[language].NavMgt.addNav.enName}: ${item.etitle}`}</span><br />
                            <span>{ item.children && item.children.length ? '' : `${Dic[language].NavMgt.addNav.pathName}: ${item.key}` }</span>
                        </>
                    }
                >
                    <span className="nav-label">
                        { language === 'zh' ? item.title : item.etitle } { item.children && item.children.length ? '' : `- ${item.key}` }
                        <span className="nav-item-modify-container float-right">
                            <Button
                                type="primary" 
                                icon={<FormOutlined />}
                                name={item.key}
                                onClick={() => {updateNavItem(item, 'edit')}}
                            >
                            </Button>
                            { id === 0 ? '' :
                                <Button
                                    type="primary" 
                                    icon={<ArrowUpOutlined />}
                                    name={item.key}
                                    onClick={() => {updateNavItem(item, 'moveUp')}}
                                ></Button>
                            }
                            { id === val.length - 1 ? '' :
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
        setNavList([...val]);
        closeEditOverlay();
    };
    
    return (
        <div className="site-navmgt">
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
                                        disabled={ navList.length <= 0 ? true : false }
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
                    />
                </Col>
            </Row>
        </div>
    );
}

export default NavMgt;