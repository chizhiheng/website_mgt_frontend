import React, {Fragment, useState, useEffect} from 'react';
import { cloneDeep } from 'lodash';
import {
    Row, Col, Button, Input, Tooltip, Radio, Divider, Select
} from 'antd';
import {
    PlusOutlined,
    InfoCircleOutlined,
    EditOutlined
  } from '@ant-design/icons';
import Dic from '../../../Assets/Dic/dic.json';

function NavFields(props) {
    const {
        language,
        callBack,
        showTitle,
        btnLabel,
        defaultValue,
        isUpdate,
        updateVal
    } = {...props};
    const { Option } = Select;
    const [navList, setNavList] = useState([]);
    const [navItemDetails, setNavItemDetils] = useState({
        title: '',
        etitle: '',
        key: '',
        type: 1,
        parentKey: -1
    });
    const [navLevel, setNavLevel] = useState(-1);
    const [titleIconColor, setTitleIconColor] = useState('rgba(0,0,0,.45)');
    const [eTitleIconColor, setETitleIconColor] = useState('rgba(0,0,0,.45)');
    const [pathIconColor, setPathIconColor] = useState('rgba(0,0,0,.45)');
    const [disabledAddBtn, setDisabledAddBtn] = useState(false);
    const [addItem, setAddItem] = useState(true);

    useEffect(() => {
        defaultValue.length ? setNavList([...defaultValue]) : setNavList([]);
        if (isUpdate) {
            setNavItemDetils({...updateVal});
            setNavLevel(updateVal.parentKey);
        }
        setTitleIconColor('rgba(0,0,0,.45)');
        setETitleIconColor('rgba(0,0,0,.45)');
        setPathIconColor('rgba(0,0,0,.45)');
        setDisabledAddBtn(false);
    }, [defaultValue, isUpdate, updateVal]);

    // add nav to array
    const navModify = () => {
        if (navItemDetails.title === '' || navItemDetails.etitle === '' || navItemDetails.key === '') {
            return;
        }

        setTitleIconColor('rgba(0,0,0,.45)');
        setETitleIconColor('rgba(0,0,0,.45)');
        setPathIconColor('rgba(0,0,0,.45)');

        if (isUpdate) {
            updateNav();
        } else {
            addNav();
        }
    };

    const addNav = () => {
        if (navLevel === -1){
            let add = true;
            navList.forEach((item) => {
                if (item.title === navItemDetails.title){
                    setTitleIconColor('rgba(255,0,0,1)');
                    add = false;
                }
                if (item.etitle === navItemDetails.etitle){
                    setETitleIconColor('rgba(255,0,0,1)');
                    add = false;
                }
                if (item.key === navItemDetails.key){
                    setPathIconColor('rgba(255,0,0,1)');
                    add = false;
                }
            });
            if (add) {
                setNavList((res) => {
                    const obj = {...navItemDetails};
                    res.push(obj);
                    return res;
                });
                setNavItemDetils({
                    title: '',
                    etitle: '',
                    key: '',
                    type: 1,
                    parentKey: -1
                });
                selectNavLevel(-1);
                callBack(navList);
            }
        } else {
            if (addItem) {
                const val = [...navList];
                fetchNav(val, 'add');
                setNavList([...val]);
                setNavItemDetils({
                    title: '',
                    etitle: '',
                    key: '',
                    type: 1,
                    parentKey: -1
                });
                selectNavLevel(-1);
                callBack(navList);
            }
        }
    };

    const updateNav = () => {
        const val = [...navList];
        fetchNav(val, 'update');
        setNavList([...val]);
        callBack(val);
    };

    // loop nav itself
    const fetchNav = (treeList, type) => {
        if (treeList.length > 0){
            for (let index = 0; index < treeList.length; index++) {
                const element = treeList[index];
                if (type === 'add') {
                    if (element.key === navLevel) {
                        if (element.children) {
                            element.children.push(navItemDetails);
                        } else {
                            element.children = [];
                            element.children.push(navItemDetails);
                        }
                        return true; // 或者 break;
                    }
                } else {
                    if (element.key === navItemDetails.key) {
                        element.title = navItemDetails.title;
                        element.etitle = navItemDetails.etitle;
                        element.type = navItemDetails.type;
                        return true; // 或者 break;
                    }
                }
                
                if (element.children && element.children.length) {
                    fetchNav(element.children, type);
                }
            }
        } else {
            treeList.push(navItemDetails);
        }
    };

    // check input nav item is duplicate or not
    const updateNavDetail = (e, type) => {
        let flag = null;
        setTitleIconColor('rgba(0,0,0,.45)');
        setETitleIconColor('rgba(0,0,0,.45)');
        setPathIconColor('rgba(0,0,0,.45)');

        const navArr = cloneDeep(navList);
        if (type === 'navType') {
            setNavItemDetils({...navItemDetails, type: e.target.value});
        } else if (type === 'cnName') {
            setNavItemDetils({...navItemDetails, title: e.target.value});
            flag = checkDuplicateValue(navArr, e.target.value, 'title');
            if (flag || e.target.value === '') {
                setTitleIconColor('rgba(255,0,0,1)');
                setDisabledAddBtn(true);
                setAddItem(false);
            } else {
                setTitleIconColor('rgba(0,0,0,.45)');
                setDisabledAddBtn(false);
                setAddItem(true);
            }
        } else if (type === 'enName') {
            setNavItemDetils({...navItemDetails, etitle: e.target.value});
            flag = checkDuplicateValue(navArr, e.target.value, 'etitle');
            if (flag || e.target.value === '') {
                setETitleIconColor('rgba(255,0,0,1)');
                setDisabledAddBtn(true);
                setAddItem(false);
            } else {
                setETitleIconColor('rgba(0,0,0,.45)');
                setDisabledAddBtn(false);
                setAddItem(true);
            }
        } else if (type === 'path') {
            setNavItemDetils({...navItemDetails, key: e.target.value});
            flag = checkDuplicateValue(navArr, e.target.value, 'key');
            if (flag || e.target.value === '') {
                setPathIconColor('rgba(255,0,0,1)');
                setDisabledAddBtn(true);
                setAddItem(false);
            } else {
                setPathIconColor('rgba(0,0,0,.45)');
                setDisabledAddBtn(false);
                setAddItem(true);
            }
        }
        
    };

    // sub function for check duplicate
    const checkDuplicateValue = (treeList, name, type) => {
        for (let index = 0; index < treeList.length; index++) {
            const element = treeList[index];
            if (element[type] === name || element[type].indexOf(name) !== -1) {
                return true;
            }
            
            if (element.children && element.children.length) {
                if (checkDuplicateValue(element.children, name, type)) {
                    return true;
                }
            }
        }
    };

    const generteOption = (items, counter) =>{
        if (counter === 0){
            counter = 1;
        }
        const style = {
            paddingLeft: `${counter}rem`
        }
        const res = items.map((item, id) => (
            <Fragment key={`nav-${item.key}-${id}`}>
                <Option value={item.key} key={`nav-level-${item.key}-${id}`} style={style}>{item.title}</Option>
                {
                     item.children && item.children.length > 0 ? generteOption(item.children, counter + 1) : ''
                }
            </Fragment>
        ))
        
        return res;
    }

    const selectNavLevel = (val) => {
        console.log(val);
        setNavLevel(val);
        setNavItemDetils({...navItemDetails, parentKey: val});
    };
    
    return(
        <Row className="height-100-per">
            <Col span={24} className="border-1px-light-gray">
                {
                    showTitle ? 
                    <Row>
                        <Col span={24}>
                            <h4>{ Dic[language].NavMgt.addNav.title }</h4>
                        </Col>
                    </Row>
                    : ''
                }
                <Row>
                    <Col span={24}>
                        <Radio.Group defaultValue={1} onChange={(e) => {updateNavDetail(e, 'navType');}} value={navItemDetails.type}>
                            <Radio value={1}>{ Dic[language].NavMgt.addNav.type.article }</Radio>
                            <Radio value={2}>{ Dic[language].NavMgt.addNav.type.news }</Radio>
                            <Radio value={3}>{ Dic[language].NavMgt.addNav.type.product }</Radio>
                        </Radio.Group>
                    </Col>
                </Row>
                <Divider />
                {
                    isUpdate
                    ? ''
                    : (
                        <>
                            <Row>
                                <Col span={24} className="parent-nav-selector">
                                    <p>{ Dic[language].NavMgt.addNav.parentItem.label }</p>
                                    {
                                        <Select defaultValue={-1}  onChange={selectNavLevel} value={navLevel ? navLevel : -1}>
                                            <Option value={-1} key="default-item">{ Dic[language].NavMgt.addNav.parentItem.selector }</Option>
                                            {
                                                generteOption(navList, 0)
                                            }
                                        </Select>
                                    }
                                </Col>
                            </Row>
                            <Divider />
                        </>
                    )
                }
                <Row>
                    <Col span={24}>
                        <Input
                            size="large"
                            placeholder={ Dic[language].NavMgt.addNav.cnName }
                            prefix={<EditOutlined />}
                            value={navItemDetails.title}
                            className={ titleIconColor.indexOf('255') !== -1 ? 'red-border' : '' }
                            suffix={
                                <Tooltip title={ titleIconColor.indexOf('255') !== -1 ? Dic[language].NavMgt.addNav.cnNameTipErr : Dic[language].NavMgt.addNav.cnNameTip }>
                                    <InfoCircleOutlined style={{ color: `${ titleIconColor }` }} />
                                </Tooltip>
                            }
                            onChange={(e) => {
                                updateNavDetail(e, 'cnName');
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Input
                            size="large"
                            placeholder={ Dic[language].NavMgt.addNav.enName }
                            prefix={<EditOutlined />}
                            value={navItemDetails.etitle}
                            className={ eTitleIconColor.indexOf('255') !== -1 ? 'red-border' : '' }
                            suffix={
                                <Tooltip title={ eTitleIconColor.indexOf('255') !== -1 ? Dic[language].NavMgt.addNav.enNameTipErr : Dic[language].NavMgt.addNav.enNameTip }>
                                    <InfoCircleOutlined style={{ color: `${ eTitleIconColor }` }} />
                                </Tooltip>
                            }
                            onChange={(e) => {
                                updateNavDetail(e, 'enName');
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {
                            isUpdate
                            ? <p>{Dic[language].NavMgt.addNav.pathName}: {navItemDetails.key}</p>
                            : (
                                <Input
                                    size="large"
                                    placeholder={ Dic[language].NavMgt.addNav.pathName }
                                    prefix={<EditOutlined />}
                                    value={navItemDetails.key}
                                    className={ pathIconColor.indexOf('255') !== -1 ? 'red-border' : '' }
                                    suffix={
                                        <Tooltip title={ pathIconColor.indexOf('255') !== -1 ? Dic[language].NavMgt.addNav.pathNameTipErr : Dic[language].NavMgt.addNav.pathNameTip }>
                                            <InfoCircleOutlined style={{ color: `${ pathIconColor }` }} />
                                        </Tooltip>
                                    }
                                    onChange={(e) => {
                                        updateNavDetail(e, 'path');
                                    }}
                                />
                            )
                        }
                    </Col>
                </Row>
                <Row className="float-right">
                    <Col span={24}>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            disabled={disabledAddBtn}
                            onClick={() => {navModify()}}
                        >
                            { btnLabel }
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default NavFields;