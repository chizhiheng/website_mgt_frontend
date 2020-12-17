import React, { useState, useEffect } from 'react';
import {
    Row, Col, Input, DatePicker, Space, Radio, Divider, Button, Tooltip, Modal, Card
} from 'antd';
import RichEditor from '../RichEditor/Editor';
import Dic from '../../Assets/Dic/dic.json';
import {
    PlusOutlined,
    InfoCircleOutlined,
    PicCenterOutlined,
    BorderOutlined,
    CheckSquareOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import PicturesWall from './ImgContent';
import NavSelector from './NavSelector';
import Loading from '../Loading/Loading';
import SelectedImgList from './SelectedImgList';
import './content.scss';

function Content(props) {
    const { language, withImgs, type, callBack, imgs, userToken, url, imgInLibrary, getImageFromLib, deleteImageFromLib, imgHost } = {...props};
    const [loading, setLoading] = useState(true);
    const [showAddImgLoading, setShowAddImgLoading] = useState(false);
    const { RangePicker } = DatePicker;
    const { Meta } = Card;
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
        content: '',
        imgIds: []
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

    const [showImgOverlay, setShowImgOverlay] = useState(false);
    const [imgInLibraryList, setImgInLibraryList] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedImageIds, setSelectedImageIds] = useState([]);

    useEffect(() => {
        if (withImgs) {
            setImgInLibraryList([...imgInLibrary]);
            if (selectedImages.length) {
                const arr = imgInLibraryList;
                arr.forEach((item) => {
                    selectedImages.forEach((el) => {
                        if (item.id === el.id) {
                            item.selected = true;
                        }
                    });
                });
                setImgInLibraryList([...arr]);
            }
        }
    }, [imgInLibrary]);

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
        setContentErr(false);
    };

    const setSelectMenu = (val) => {
        setReturnValues((res) => {
            res.nav = val; 
            return res;
         });
        //  setNevErr(false);
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
        if (!navErr){
            callBack(returnValues);
        }
        
    };

    const removeErr = () => {
        // setNevErr(false);
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

    const errCallBack = (flag) => {
        if (flag) {
            setNevErr(true);
        } else {
            setNevErr(false);
        }
    };

    const getImgList = async (list) => {
        // setShowAddImgLoading(true);
        await getImageFromLib();
        // setShowAddImgLoading(false);
    };

    const removeImg = (imgId) => {
        deleteImageFromLib(imgId);
    };

    const selectImg = (id, item) => {
        const tmp = {...item};
        tmp.selected = !tmp.selected;
        setImgInLibraryList((res) => {
            res[id] = {...tmp};
            return res;
        });
        setImgInLibraryList([...imgInLibraryList]);
        
        const imgIds = [];
        const arr2 = [];

        imgInLibraryList.forEach((item) => {
            if (item.selected) {
                const element = {
                    uid: item.id,
                    name: item.img_name,
                    status: 'done',
                    url: imgHost + item.img_name,
                };
                arr2.push(element);
                imgIds.push(item.id);
            }
        });
        setSelectedImages([...arr2]);
        setReturnValues((res) => {
            res.imgs = imgIds;
            return res;
        });
        setSelectedImageIds([...imgIds]);
    };

    const closeSelectOverlay = () => {
        setShowImgOverlay(false);
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
                        type={type}
                        errCallBack={errCallBack}
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
                        <Row>
                            <Col span={24}>
                                {/* current pic list */}
                                <SelectedImgList
                                    imgs={selectedImages}
                                    language={language}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Button
                                    className="float-right margin-right-2rem"
                                    type="dashed" 
                                    icon={<PicCenterOutlined />}
                                    onClick={ () =>  {
                                        getImgList();
                                        setShowImgOverlay(true);
                                    }}
                                >
                                    { Dic[language].product.openImg }
                                </Button>
                                <br />
                                <Divider className="clear-both" />
                            </Col>
                        </Row>
                        {/* add image overlay start */}
                        <Modal
                            visible={showImgOverlay}
                            title={ Dic[language].product.openImg }
                            footer={
                                // add new image
                                <PicturesWall
                                    imgs={0}
                                    callBack={(list) => {
                                        getImgList();
                                    }}
                                    url={url}
                                    userToken={userToken}
                                    maxImgNumber={500}
                                />
                            }
                            className="img-selector-overlay"
                            width={window.screen.availWidth}
                            onCancel={()=> {
                                closeSelectOverlay();
                            }}
                        >
                            {
                                showAddImgLoading ? <Loading text={Dic[language].common.loading}/> : null
                            }
                            {
                                imgInLibraryList.map((item, id) => (
                                    <Card
                                        key={id}
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={item.img_path} />}
                                        actions={[
                                            <div
                                                onClick={() => {
                                                    selectImg(id, item);
                                                }}
                                            >
                                                { item.selected || selectedImageIds.indexOf(item.id) > -1 ? <CheckSquareOutlined key="selected" /> : <BorderOutlined key="unselect" /> }
                                            </div>,
                                            <DeleteOutlined
                                                key="edit"
                                                onClick={() => removeImg(item.id)}
                                            />
                                        ]}
                                    >
                                        <Meta title={item.img_name} description={item.created_date} />
                                    </Card>
                                ))
                            }
                        </Modal>
                        {/* add image overlay stop */}
                    </>
                :
                null
            }
            <Row>
                <Col span={24} className={ contentErr ? 'show-red-border' : '' }>
                    <RichEditor
                        placeholder={Dic[language][type].description}
                        stateCallback={updateDescription}
                    />
                </Col>
            </Row>
            <Row className="float-right">
                <Col span={24}>
                    <Button
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => {
                            submit();
                        }}
                    >
                        { Dic[language].common.add }
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default Content;