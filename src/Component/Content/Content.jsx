import React, { useState } from 'react';
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

function Content(props) {
    const { language, withImgs, type } = {...props};
    const { RangePicker } = DatePicker;
    const [datePickerRadio, setDatePickerRadio] = useState(1);
    const [markTopRadio, setMarkTopRadio] = useState(1);
    const [disableDatePicker, setDisableDatePicker] = useState(true);
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
    const enableDatePicker = (val) => {
        if (val.target.value === 1) {
            setDatePickerRadio(1);
            setDisableDatePicker(true);
        } else {
            setDatePickerRadio(0);
            setDisableDatePicker(false);
        }
    };

    const makeTop = (val) => {
        if (val.target.value === 1){
            setMarkTopRadio(1);
        } else {
            setMarkTopRadio(0);
        }
    };
    const updateDescription = () => {

    };

    return (
        <>
            <Row>
                <Col span={12}>
                    <Input placeholder={ Dic[language][type][titleText] } />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Input
                        placeholder={ Dic[language][type][keywordsText] }
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
                <Col span={12}>
                    <Space direction="vertical">
                        <RangePicker
                            size="middle"
                            disabled={disableDatePicker}
                            onCalendarChange={(date, dateStrings) => {
                                console.log(dateStrings);
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
                <Col span={24}>
                    <RichEditor placeholder={Dic[language].article.description} stateCallback={updateDescription} />
                </Col>
            </Row>
            <Row className="float-right">
                <Col span={24}>
                    <Button
                        type="primary" 
                        icon={<PlusOutlined />}
                        // onClick={() => {updateNavItem(item, 'edit')}}
                    >
                        {Dic[language].common.add}
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default Content;