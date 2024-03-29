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
        updateVal,
        langSupport
    } = {...props};
    const { Option } = Select;
    const [navList, setNavList] = useState([]);
    const [navItemDetails, setNavItemDetils] = useState({
        title: '',
        en_title: '',
        jp_title: '',
        kr_title: '',
        key: '',
        type: 1,
        show_in_index: 0,
        s_id: -1
    });
    const [navLevel, setNavLevel] = useState(-1);
    const [titleIconColor, setTitleIconColor] = useState('rgba(0,0,0,.45)');
    const [eTitleIconColor, setETitleIconColor] = useState('rgba(0,0,0,.45)');
    const [jTitleIconColor, setJTitleIconColor] = useState('rgba(0,0,0,.45)');
    const [kTitleIconColor, setKTitleIconColor] = useState('rgba(0,0,0,.45)');
    const [pathIconColor, setPathIconColor] = useState('rgba(0,0,0,.45)');
    const [disabledAddBtn, setDisabledAddBtn] = useState(false);
    const [addItem, setAddItem] = useState(true);

    useEffect(() => {
      defaultValue.length ? setNavList([...defaultValue]) : setNavList([]);
      if (isUpdate) {
        setNavItemDetils({...updateVal});
      }
      setTitleIconColor('rgba(0,0,0,.45)');
      setETitleIconColor('rgba(0,0,0,.45)');
      setJTitleIconColor('rgba(0,0,0,.45)');
      setKTitleIconColor('rgba(0,0,0,.45)');
      setPathIconColor('rgba(0,0,0,.45)');
      setDisabledAddBtn(false);
    }, [defaultValue, isUpdate, updateVal, langSupport]);

    // add nav to array
    const navModify = () => {
        if (navItemDetails.title === '') {
            setTitleIconColor('rgba(255,0,0,1)');
            return;
        }
        if (navItemDetails.en_title === '') {
            setETitleIconColor('rgba(255,0,0,1)');
            return;
        }
        if (navItemDetails.jp_title === '') {
            setETitleIconColor('rgba(255,0,0,1)');
            return;
        }
        if (navItemDetails.kr_title === '') {
            setETitleIconColor('rgba(255,0,0,1)');
            return;
        }
        if (navItemDetails.key === '') {
            setPathIconColor('rgba(255,0,0,1)');
            return;
        }
        if (navItemDetails.key.search(/^[/].*[/]$/igm) < 0){
            setPathIconColor('rgba(255,0,0,1)');
            return;
        }
        setTitleIconColor('rgba(0,0,0,.45)');
        setETitleIconColor('rgba(0,0,0,.45)');
        setJTitleIconColor('rgba(0,0,0,.45)');
        setKTitleIconColor('rgba(0,0,0,.45)');
        setPathIconColor('rgba(0,0,0,.45)');

        if (isUpdate) {
          console.log('update');
          updateNav();
        } else {
          console.log('add');
          addNav();
        }
        setNavItemDetils({
            title: '',
            en_title: '',
            jp_title: '',
            kr_title: '',
            key: '',
            type: 1,
            show_in_index: 0,
            s_id: -1
        })
    };

    const addNav = () => {
        if (navLevel === -1){
          let add = true;
          navList.forEach((item) => {
            if (item.title === navItemDetails.title){
                setTitleIconColor('rgba(255,0,0,1)');
                add = false;
            }
            if (item.en_title === navItemDetails.en_title){
                setETitleIconColor('rgba(255,0,0,1)');
                add = false;
            }
            if (item.jp_title === navItemDetails.jp_title){
                setJTitleIconColor('rgba(255,0,0,1)');
                add = false;
            }
            if (item.kr_title === navItemDetails.kr_title){
                setKTitleIconColor('rgba(255,0,0,1)');
                add = false;
            }
            if (item.key === navItemDetails.key){
                setPathIconColor('rgba(255,0,0,1)');
                add = false;
            }
          });
          if (add) {
            const list = [...navList];
            list.push(navItemDetails);
            setNavList();
            setNavList((res) => {
              res = [...list];
              return res;
            });
            setNavItemDetils({
              title: '',
              en_title: '',
              jp_title: '',
              kr_title: '',
              key: '',
              type: 1,
              show_in_index: 0,
              s_id: -1
            });
            selectNavLevel(-1);
            callBack(list);
          }
        } else {
          if (addItem) {
            const val = [...navList];
            fetchNav(val, 'add');
            setNavList([...val]);
            setNavItemDetils({
              title: '',
              en_title: '',
              jp_title: '',
              kr_title: '',
              key: '',
              type: 1,
              show_in_index: 0,
              s_id: -1
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
                        element.en_title = navItemDetails.en_title;
                        element.jp_title = navItemDetails.jp_title;
                        element.kr_title = navItemDetails.kr_title;
                        element.type = navItemDetails.type;
                        element.show_in_index = navItemDetails.show_in_index;
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
      setJTitleIconColor('rgba(0,0,0,.45)');
      setKTitleIconColor('rgba(0,0,0,.45)');
      setPathIconColor('rgba(0,0,0,.45)');

      const navArr = cloneDeep(navList);
      if (type === 'navType') {
        setNavItemDetils({...navItemDetails, type: e.target.value});
      } else if (type === 'navShowInIndex') {
        let val = {...navItemDetails};
        val.show_in_index = e.target.value;
        // setNavItemDetils({...navItemDetails, show_in_index: e.target.value.toString()});
        setNavItemDetils({...val});
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
        setNavItemDetils({...navItemDetails, en_title: e.target.value});
        flag = checkDuplicateValue(navArr, e.target.value, 'en_title');
        if (flag || e.target.value === '') {
          setETitleIconColor('rgba(255,0,0,1)');
          setDisabledAddBtn(true);
          setAddItem(false);
        } else {
          setETitleIconColor('rgba(0,0,0,.45)');
          setDisabledAddBtn(false);
          setAddItem(true);
        }
      } else if (type === 'jpName') {
        setNavItemDetils({...navItemDetails, jp_title: e.target.value});
        flag = checkDuplicateValue(navArr, e.target.value, 'jp_title');
        if (flag || e.target.value === '') {
          setJTitleIconColor('rgba(255,0,0,1)');
          setDisabledAddBtn(true);
          setAddItem(false);
        } else {
          setJTitleIconColor('rgba(0,0,0,.45)');
          setDisabledAddBtn(false);
          setAddItem(true);
        }
      } else if (type === 'krName') {
        setNavItemDetils({...navItemDetails, kr_title: e.target.value});
        flag = checkDuplicateValue(navArr, e.target.value, 'kr_title');
        if (flag || e.target.value === '') {
          setKTitleIconColor('rgba(255,0,0,1)');
          setDisabledAddBtn(true);
          setAddItem(false);
        } else {
          setKTitleIconColor('rgba(0,0,0,.45)');
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
            {
                item.key !== '/'
                ? (
                    <>
                        <Option value={item.key} key={`nav-level-${item.key}-${id}`} style={style}>{item.title}</Option>
                        {
                            item.children && item.children.length > 0 ? generteOption(item.children, counter + 1) : ''
                        }
                    </>
                ) : null
            }
            </Fragment>
        ))

        return res;
    }

    const selectNavLevel = (val) => {
        setNavLevel(val);
        setNavItemDetils({...navItemDetails, s_id: val});
        // console.log('navItemDetails: ', navItemDetails);
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
                        <Radio.Group
                          disabled={isUpdate}
                          defaultValue={1}
                          onChange={(e) => {
                            updateNavDetail(e, 'navType');
                          }}
                          value={Number(navItemDetails.type)}
                        >
                          <Radio value={1}>{ Dic[language].NavMgt.addNav.type.article }</Radio>
                          <Radio value={2}>{ Dic[language].NavMgt.addNav.type.news }</Radio>
                          <Radio value={3}>{ Dic[language].NavMgt.addNav.type.product }</Radio>
                        </Radio.Group>
                    </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={24}>
                    <h4>{ Dic[language].NavMgt.addNav.showInIndex }</h4>
                      <Radio.Group
                        defaultValue={0}
                        onChange={(e) => {
                          updateNavDetail(e, 'navShowInIndex');
                        }}
                        value={Number(navItemDetails.show_in_index)}
                      >
                        <Radio value={1}>{ Dic[language].common.yes }</Radio>
                        <Radio value={0}>{ Dic[language].common.no }</Radio>
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
                {
                  langSupport.en === '1' ?
                  <Row>
                    <Col span={24}>
                      <Input
                        size="large"
                        placeholder={ Dic[language].NavMgt.addNav.enName }
                        prefix={<EditOutlined />}
                        value={navItemDetails.en_title}
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
                  : ''
                }
                {
                  langSupport.jp === '1' ?
                  <Row>
                    <Col span={24}>
                      <Input
                        size="large"
                        placeholder={ Dic[language].NavMgt.addNav.jpName }
                        prefix={<EditOutlined />}
                        value={navItemDetails.jp_title}
                        className={ jTitleIconColor.indexOf('255') !== -1 ? 'red-border' : '' }
                        suffix={
                          <Tooltip title={ jTitleIconColor.indexOf('255') !== -1 ? Dic[language].NavMgt.addNav.jpNameTipErr : Dic[language].NavMgt.addNav.jpNameTip }>
                              <InfoCircleOutlined style={{ color: `${ jTitleIconColor }` }} />
                          </Tooltip>
                        }
                        onChange={(e) => {
                          updateNavDetail(e, 'jpName');
                        }}
                      />
                    </Col>
                  </Row>
                  : ''
                }
                {
                  langSupport.kr === '1' ?
                  <Row>
                    <Col span={24}>
                      <Input
                        size="large"
                        placeholder={ Dic[language].NavMgt.addNav.krName }
                        prefix={<EditOutlined />}
                        value={navItemDetails.kr_title}
                        className={ kTitleIconColor.indexOf('255') !== -1 ? 'red-border' : '' }
                        suffix={
                          <Tooltip title={ kTitleIconColor.indexOf('255') !== -1 ? Dic[language].NavMgt.addNav.krNameTipErr : Dic[language].NavMgt.addNav.krNameTip }>
                            <InfoCircleOutlined style={{ color: `${ kTitleIconColor }` }} />
                          </Tooltip>
                        }
                        onChange={(e) => {
                          updateNavDetail(e, 'krName');
                        }}
                      />
                    </Col>
                  </Row>
                  : ''
                }
                <Row>
                  <Col span={24}>
                    {
                      isUpdate
                      ? <p>{Dic[language].NavMgt.addNav.currentPathName}: {navItemDetails.key}</p>
                      : (
                        <>
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
                        </>
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
