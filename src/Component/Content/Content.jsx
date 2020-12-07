import React, { useState, useEffect } from 'react';
import {
    Row, Col, Input, DatePicker, Space, Radio, Divider, Button, Tooltip
} from 'antd';
import RichEditor from '../RichEditor/Editor';
import Dic from '../../Assets/Dic/dic.json';
import {
    PlusOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import PicturesWall from './ImgContent';
import NavSelector from './NavSelector';
import Loading from '../Loading/Loading';
import './content.scss';

function Content(props) {
    const { language, withImgs, type } = {...props};
    const [loading, setLoading] = useState(true);
    const { RangePicker } = DatePicker;
    const [datePickerRadio, setDatePickerRadio] = useState(1);
    const [markTopRadio, setMarkTopRadio] = useState(1);
    const [disableDatePicker, setDisableDatePicker] = useState(true);
    const [returnValues, setReturnValues] = useState({
        title: '',
        nav: '',
        keyword: '',
        description: '',
        expireDate: {
            status: false,
            value: []
        },
        top: false,
        content: ''
    });

    const[navErr, setNevErr] = useState(false);
    const[titleErr, setTitleErr] = useState(false);
    const[keyWordErr, setKeyWordErr] = useState(false);
    const[descriptionErr, setDescriptionErr] = useState(false);
    const[expireDateErr, setExpireDateErr] = useState(false);
    const[contentErr, setContentErr] = useState(false);

    let titleText = null;
    let keywordsText = null;
    let descriptionText = null;
    let keywordsTip = null;
    let descTip = null;
    if (type === 'article') {
        titleText = 'articleTitle';
        keywordsText = 'articleKeyWords';
        descriptionText = 'articleDesc';
        keywordsTip = 'articleKeyWordsTips';
        descTip = 'articleDescTips';
    } else if (type === 'news') {
        titleText = 'newsTitle';
        keywordsText = 'newsKeyWords';
        descriptionText = 'newsDesc';
        keywordsTip = 'newsKeyWordsTips';
        descTip = 'newsDescTips';
    } else if (type === 'product') {
        titleText = 'productTitle';
        keywordsText = 'productKeyWords';
        descriptionText = 'productDesc';
        keywordsTip = 'productKeyWordsTips';
        descTip = 'productDescTips';
    }

    const makeTop = (val) => {
        let flag = false;
        if (val.target.value === 1){
            setMarkTopRadio(1);
            flag = false;
        } else {
            setMarkTopRadio(0);
            flag = true;
        }
        setReturnValues({...returnValues, top: flag});
    };
    const updateDescription = (val) => {
        setReturnValues((res) => {
            res.content = val; 
            return res;
        });
        setNevErr(false);
    };

    const setSelectMenu = (val) => {
        setReturnValues((res) => {
            res.nav = val; 
            return res;
         });
         setNevErr(false);
    };
    const removeLoading = (val) => {
        setLoading(val);
    };

    const enableDatePicker = (val) => {
        if (val.target.value === 1) {
            setDatePickerRadio(1);
            setDisableDatePicker(true);
            setReturnValues((res) => {
                res.expireDate.status = false;
                return res;
            });
            setExpireDateErr(false);
        } else {
            setDatePickerRadio(0);
            setDisableDatePicker(false);
            setReturnValues((res) => {
                res.expireDate.status = true;
                return res;
            });
        }
    };

    const submit = () => {
        console.log('submit, values is: ', returnValues, returnValues.title);
        removeErr();
        if (returnValues.title === '') {
            setTitleErr(true);
            return;
        }
        if (returnValues.nav === '') {
            setNevErr(true);
            return;
        }
        if (returnValues.keyword === '') {
            setKeyWordErr(true);
            return;
        }
        if (returnValues.description === '') {
            setDescriptionErr(true);
            return;
        }
        if (returnValues.expireDate.status && returnValues.expireDate.value.length !== 2) {
            setExpireDateErr(true);
            return;
        }
        if (returnValues.content === '') {
            setContentErr(true);
            return;
        }
    };

    const removeErr = () => {
        setNevErr(false);
        setTitleErr(false);
        setKeyWordErr(false);
        setDescriptionErr(false);
        setExpireDateErr(false);
        setContentErr(false);
    };

    const updateValue = (e, val) => {
        const value = e.target.value;
        removeErr();
        setReturnValues((res) => {
            if (val === 'title') {
                res.title = value; 
            } else if (val === 'kw') {
                res.keyword = value; 
            } else if (val === 'desc') {
                res.description = value; 
            }
            return res;
         });
        
    };

    return (
        <>
            { loading ? <Loading text={Dic[language].common.loading}/> : null}
            <Row>
                <Col span={12}>
                    <Input
                        placeholder={ Dic[language][type][titleText] }
                        className={ titleErr ? 'red-border' : '' }
                        onChange={(e) => {
                            updateValue(e, 'title');
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={12} className={ navErr ? 'show-red-border' : '' }>
                    <NavSelector
                        language={language}
                        setSelectMenu={setSelectMenu}
                        removeLoading={removeLoading}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Input
                        placeholder={ Dic[language][type][keywordsText] }
                        className={ keyWordErr ? 'red-border' : '' }
                        onChange={(e) => {
                            updateValue(e, 'kw');
                        }}
                        suffix={
                            <Tooltip title={ Dic[language][type][keywordsTip] }>
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Input
                        placeholder={ Dic[language][type][descriptionText] }
                        className={ descriptionErr ? 'red-border' : '' }
                        onChange={(e) => {
                            updateValue(e, 'desc');
                        }}
                        suffix={
                            <Tooltip title={ Dic[language][type][descTip] }>
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />
                </Col>
            </Row>
            <Divider />
            <Row>
            <Col span={12}>
                    { Dic[language].common.expireDate }:&nbsp;&nbsp;
                    <Radio.Group defaultValue={1} onChange={enableDatePicker} value={datePickerRadio}>
                        <Radio value={1}>{ Dic[language].common.no }</Radio>
                        <Radio value={0}>{ Dic[language].common.yes }</Radio>
                    </Radio.Group>
                </Col>
                <Col span={12}>
                    { Dic[language].common.top }:&nbsp;&nbsp;
                    <Radio.Group defaultValue={1} onChange={makeTop} value={markTopRadio}>
                        <Radio value={1}>{ Dic[language].common.no }</Radio>
                        <Radio value={0}>{ Dic[language].common.yes }</Radio>
                    </Radio.Group>
                </Col>
            </Row>
            <Row>
                <Col span={12} className={ expireDateErr ? 'show-red-border' : '' }>
                    <Space direction="vertical">
                        <RangePicker
                            size="middle"
                            disabled={disableDatePicker}
                            onCalendarChange={(date, dateStrings) => {
                                setReturnValues((res) => {
                                    res.expireDate.value = dateStrings;
                                    return res;
                                });
                            }}
                        />
                    </Space>
                </Col>
            </Row>
            <Divider />
            {
                withImgs
                ?
                    <>
                        <PicturesWall />
                        <Divider />
                    </>
                :
                null
            }
            <Row>
                <Col span={24} className={ contentErr ? 'show-red-border' : '' }>
                    <RichEditor
                        placeholder={Dic[language].article.description}
                        stateCallback={updateDescription}
                    />
                </Col>
            </Row>
            <Row className="float-right">
                <Col span={24}>
                    <Button
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={submit}
                    >
                        { Dic[language].common.add }
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default Content;