import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import {
    Row, Col, Input, DatePicker, Space, Radio, Divider, Button, Tooltip, Modal, Card, Select
} from 'antd';
import { useCookies } from 'react-cookie';
import RichEditor from '../RichEditor/Editor';
import Dic from '../../Assets/Dic/dic.json';
import {
    PlusOutlined,
    InfoCircleOutlined,
    PicCenterOutlined,
    BorderOutlined,
    CheckSquareOutlined,
    DeleteOutlined,
    ClearOutlined
} from '@ant-design/icons';
import PicturesWall from './ImgContent';
import NavSelector from './NavSelector';
import Loading from '../Loading/Loading';
import SelectedImgList from './SelectedImgList';
import './Content.scss';
import { getLangList } from '../../API/apiPath';
import RequestUtils from '../../Utils/RequestUtils';
import { AppContext } from '../../context/AppContext';

function Content(props) {
    const [cookies] = useCookies(['user_token']);
    const { appState, setAppState } = useContext(AppContext);
    const {
        language,
        withImgs,
        type,
        callBack,
        imgs,
        userToken,
        url,
        imgInLibrary,
        getImageFromLib,
        deleteImageFromLib,
        imgHost,
        defaultVal,
    } = {...props};
    const { Option } = Select;
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
        imgIds: [],
        langKey: 'cn'
    });

    const[navErr, setNevErr] = useState(false);
    const[titleErr, setTitleErr] = useState(false);
    const[keyWordErr, setKeyWordErr] = useState(false);
    const[descriptionErr, setDescriptionErr] = useState(false);
    const[expireDateErr, setExpireDateErr] = useState(false);
    const[contentErr, setContentErr] = useState(false);

    const [langList, setLangList] = useState([]);

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
    const [title, setTitle] = useState('');
    const [keywords, setKeywords] = useState('');
    const [description, setDescription] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const [editorContent, setEditorContent] = useState('');
    const [navValue, setNavValue] = useState(null);
    const [selectedLang, setSelectedLang] = useState('');

    useEffect(() => {
      let monted = true;
      // const abortController = new AbortController();
      // const signal = abortController.signal;

      const params = {
        url: getLangList,
        param: {
            code: cookies.user_token.toString()
        }
        // signal: signal
      };
      RequestUtils(params).then((res) => {
        if (monted) {
          // setSelectedLang(res.result[0].key);
          selectLang(res.result[0].key);
          setLangList(res.result);
        }
      }).catch((e) => {
        if (monted) {
          setLoading(false);
          console.log(e);
        }
      });

      return () => {
          monted = false;
          // abortController.abort();
      };
    }, []);

    useEffect(() => {
      let monted = true;

      if (monted) {
        if (withImgs) {
          if (selectedImages.length) {
            const arr = [...imgInLibrary];
            arr.forEach((item) => {
                selectedImages.forEach((el) => {
                    if (item.id === el.id) {
                        item.selected = true;
                    }
                });
            });
            setImgInLibraryList([...arr]);
          } else {
            setImgInLibraryList([...imgInLibrary]);
          }
        }

        if (defaultVal) {
          selectLang(defaultVal.lang_key);
          setReturnValues((res) => {
              res.title = defaultVal.title;
              res.keyword = defaultVal.keywords;
              res.description = defaultVal.description;
              res.nav = defaultVal.key;
              res.expireDate = {
                  status: true,
                  value: [defaultVal.start_date, defaultVal.end_date]
              };
              res.imgs = [];
              res.top = defaultVal.is_top === '1' ? true : false;
              res.content = defaultVal.content;
              res.langKey = defaultVal.lang_key;
              return res;
          });
          if (defaultVal.title !== '') {
              setTitle(defaultVal.title);
          }
          if (defaultVal.keywords !== '') {
              setKeywords(defaultVal.keywords);
          }
          if (defaultVal.description !== '') {
              setDescription(defaultVal.description);
          }
          if (defaultVal.start_date && defaultVal.end_date){
              enableDatePicker(0);
              setDateRange([moment(defaultVal.start_date, 'YYYY-MM-DD'), moment(defaultVal.end_date, 'YYYY-MM-DD')]);
          }
          if (defaultVal.is_top === '1') {
              makeTop(0);
          }
          setNavValue(defaultVal.key)
          if (defaultVal.content !== '') {
              updateDescription(defaultVal.content);
              setEditorContent(defaultVal.content)
          }
          if (defaultVal.imgs && defaultVal.imgs.length > 0) {
            const arr = [];
            let imgs = [];
            defaultVal.imgs.forEach((item)=>{
                imgs.push(item.id);
            });
            setReturnValues((res) => {
                res.imgs = imgs;
                return res;
            });
            defaultVal.imgs.forEach((item) => {
                const element = {
                    uid: item.id,
                    name: item.img_name,
                    status: 'done',
                    url: imgHost + item.img_name,
                };
                arr.push(element);
            });
            const imgList = [...imgInLibrary];
            arr.forEach((item)=>{
                imgList.forEach((el) => {
                    if (item.uid === el.id) {
                        el.selected = true;
                    }
                });
            });
            setSelectedImages([...arr]);
            setImgInLibraryList([...imgList]);
          } else {
            setSelectedImages([]);
            setImgInLibraryList([]);
          }
        }
        removeErr();
      }

      return () => {
        monted = false;
      };
    }, [imgInLibrary, defaultVal, navValue, langList]);

    const makeTop = (val) => {
        let flag = false;
        if (val === 1){
            setMarkTopRadio(1);
            flag = false;
        } else {
            setMarkTopRadio(0);
            flag = true;
        }
        setReturnValues((res) => {
            res.top = flag;
            return res;
        });
        if (defaultVal) {
            sendReturnVal();
        }
    };
    const updateDescription = (val) => {
        setReturnValues((res) => {
            res.content = val;
            return res;
        });
        setContentErr(false);
        if (defaultVal) {
            sendReturnVal();
        }
    };
    const setSelectMenu = (val) => {
      setReturnValues((res) => {
          res.nav = val.key;
          return res;
      });
      setNavValue(val.key);
      if (defaultVal) {
          sendReturnVal();
      }
    };
    const removeLoading = (val) => {
        setLoading(val);
    };
    const enableDatePicker = (val) => {
        if (val === 1) {
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
        if (defaultVal) {
            const obj = {...returnValues};
            obj.flag = 'update';
            submit(obj);
        }
    };
    const submit = (vals) => {
        removeErr();
        if (returnValues.title === '') {
            setTitleErr(true);
            if (!defaultVal) {
                return;
            }
        }
        if (!vals.nav) {
            setNevErr(true);
            return;
        }
        if (vals.keyword === '') {
            setKeyWordErr(true);
            if (!defaultVal) {
                return;
            }
        }
        if (vals.description === '') {
            setDescriptionErr(true);
            if (!defaultVal) {
                return;
            }
        }
        if (vals.expireDate.status && vals.expireDate.value.length !== 2) {
            setExpireDateErr(true);
            if (!defaultVal) {
                return;
            }
        }
        if (vals.content === '') {
            setContentErr(true);
            if (!defaultVal) {
                return;
            }
        }
        callBack(vals);
    };
    const cleanData = () => {
      setTitle('');
      setKeywords('');
      setDescription('');
      setDateRange([]);
      setSelectedImages([]);
      setImgInLibraryList([]);
      setNavValue(null);
      setEditorContent('');
    };
    const removeErr = () => {
        setNevErr(false);
        setTitleErr(false);
        setKeyWordErr(false);
        setDescriptionErr(false);
        setExpireDateErr(false);
        setContentErr(false);
    };
    const sendReturnVal = () => {
        setTimeout(()=>{
            let vals = {...returnValues};
            vals.flag = 'update';
            submit(vals);
        }, 100);
    };
    const updateValue = (e, val) => {
        const value = e.target.value;
        removeErr();
        setReturnValues((res) => {
            if (val === 'title') {
                res.title = value;
                setTitle(value);
            } else if (val === 'kw') {
                res.keyword = value;
                setKeywords(value);
            } else if (val === 'desc') {
                res.description = value;
                setDescription(value);
            }
            return res;
        });
        if (defaultVal) {
            sendReturnVal();
        }
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
        if (defaultVal) {
            sendReturnVal();
        }
        setSelectedImageIds([...imgIds]);
    };
    const closeSelectOverlay = () => {
        setShowImgOverlay(false);
    };
    const selectLang = (val, flag) => {
        if (defaultVal && !flag) {
            val = defaultVal.lang_key;
        }
        setSelectedLang(val);
        setReturnValues((res)=>{
            res.langKey = val;
            return res;
        });
        if (flag) {
            sendReturnVal();
        }
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
                        value={title}
                    />
                </Col>
                <Col span={12} className="text-align-right padding-right-2rem">
                    <span>{ Dic[language].common.selectOne }: </span>
                    <Select
                    onChange={(e) => {
                        selectLang(e, true);
                    }}
                    value={selectedLang}
                    >
                        {
                            langList.map((item, id) => {
                                return <Option value={item.key} key={`nav-level-${item.key}-${id}`}>{language === 'zh' ? item.name : item.eName}</Option>
                            })
                        }
                    </Select>
                </Col>
            </Row>
            <Row>
                <Col span={12} className={ navErr ? 'red-border' : '' }>
                  <NavSelector
                      language={language}
                      setSelectMenu={setSelectMenu}
                      removeLoading={removeLoading}
                      type={type}
                      errCallBack={errCallBack}
                      value={navValue}
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
                        value={keywords}
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
                        value={description}
                    />
                </Col>
            </Row>
            <Divider />
            <Row>
            <Col span={12}>
                    { Dic[language].common.expireDate }:&nbsp;&nbsp;
                    <Radio.Group defaultValue={1} onChange={(e) => {enableDatePicker(e.target.value)}} value={datePickerRadio}>
                        <Radio value={1}>{ Dic[language].common.no }</Radio>
                        <Radio value={0}>{ Dic[language].common.yes }</Radio>
                    </Radio.Group>
                </Col>
                <Col span={12}>
                    { Dic[language].common.top }:&nbsp;&nbsp;
                    <Radio.Group defaultValue={1} onChange={(e) => {makeTop(e.target.value)}} value={markTopRadio}>
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
                                if (dateStrings[0] !== '' && dateStrings[1] !== '') {
                                    setDateRange([moment(dateStrings[0], 'YYYY-MM-DD'), moment(dateStrings[1], 'YYYY-MM-DD')]);
                                    setReturnValues((res) => {
                                        res.expireDate.value = dateStrings;
                                        return res;
                                    });
                                    if (defaultVal) {
                                        const obj = {...returnValues};
                                        obj.flag = 'update';
                                        submit(obj);
                                    }
                                }
                            }}
                            value={dateRange.length ? dateRange : []}
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
                            </Col>
                        </Row>
                        <Divider className="clear-both" />
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
                                    type="product"
                                    url={url}
                                    userToken={userToken}
                                    maxImgNumber={500}
                                    errCB = {(err) => {
                                      setAppState({systemPopup: {
                                        display: true,
                                        type: 'error',
                                        title: Dic[language].common.systemPopup.imgErr.title,
                                        desc: Dic[language].common.systemPopup.imgErr.description + '(' + err.max_size + ')'
                                      }});
                                    }}
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
                                                { item.selected || selectedImageIds.indexOf(item.id) > -1 ? <CheckSquareOutlined key="selected" className="icon-fill-blue" /> : <BorderOutlined key="unselect" className="icon-fill-blue" /> }
                                            </div>,
                                            <DeleteOutlined
                                                key="edit"
                                                onClick={() => removeImg(item.id)}
                                                className="icon-fill-red"
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
                        value={editorContent}
                    />
                </Col>
            </Row>
            {
                !defaultVal
                ?
                    <Row className="float-right">
                        <Col span={24}>
                            <Button
                                type="secondry"
                                icon={<ClearOutlined />}
                                onClick={() => {
                                  cleanData();
                                }}
                            >
                                { Dic[language].common.clean }
                            </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    let vals = {...returnValues};
                                    vals.flag = 'insert';
                                    submit(vals);
                                }}
                            >
                                { Dic[language].common.add }
                            </Button>
                        </Col>
                    </Row>
                : null
            }

        </>
    );
}

export default Content;
