import React, { useState, useEffect, useContext } from 'react';
import {
    Row, Col, Button, Modal, Card
} from 'antd';
import {
  PlusOutlined, PicCenterOutlined, DeleteOutlined, CheckSquareOutlined, BorderOutlined
} from '@ant-design/icons';
import NavSelector from '../../Component/Content/NavSelector/';
import Dic from '../../Assets/Dic/dic.json';
import Loading from '../../Component/Loading/Loading';
import './PageBanner.scss';
import { host, insertImg, getImgs, upsertNavImg, getNavImg, deleteNavImg, deleteImg } from '../../API/apiPath';
import RequestUtils from '../../Utils/RequestUtils';
import { useCookies } from 'react-cookie';
import PicturesWall from '../../Component/Content/ImgContent';
import { AppContext } from '../../context/AppContext';

const RowItem = (props) => {
  const { list, language, callBackRemove } = { ...props };

  return (
    list.map((item, id) => (
      <Row className='page-banner-list' key={`item-${id}`}>
        <Col span={6}>
          <p>{ Dic[language].banner.navPageTitle }</p>
          <p>{ language === 'zh' ? item.nav.title : item.nav.en_title }</p>
        </Col>
        <Col span={14}>
          <p className="margin-bottom-0">{ Dic[language].banner.applyBanner }{ item.nav.order === '-1' ? Dic[language].banner.applyIndexBannerSize : Dic[language].banner.applyBannerSize }</p>
          <a href={`${item.img.url}`}><img src={`${item.img.url}`} alt={ language === 'zh' ? item.nav.title : item.nav.en_title} /></a>
        </Col>
        <Col span={4}>
          <p>&nbsp;</p>
          <p>
            <Button
              type="secondry"
              icon={<DeleteOutlined />}
              onClick={ () =>  {
                callBackRemove(item.id);
              }}
            >
                { Dic[language].common.delete }
            </Button>
          </p>
        </Col>
      </Row>
    ))
  )
};

function PageBanner(props) {
  const { language } = {...props};
  const [cookies] = useCookies(['user_token']);
  const [loading, setLoading] = useState(false);
  const [bannerList, setBannerList] = useState([]);
  const [selectedNav, setSelectedNev] = useState('');
  const [selectorLoading, setSelectorLoading] = useState(false);
  const [showImgOverlay, setShowImgOverlay] = useState(false);
  const [showAddImgLoading, setShowAddImgLoading] = useState(false);
  const imgHost = host.replace('/api', '') + '/upload/';
  const { appState, setAppState } = useContext(AppContext);
  const { Meta } = Card;
  const [selectedImageIds, setSelectedImageIds] = useState([]);

  const [disabledAddBannerBtn, setDisabledAddBannerBtn] = useState(true);
  const [selectedItem, setSelectedItem] = useState({
    id: '',
    nav: {
      id: '',
      title: '',
      en_title: '',
      key: ''
    },
    img: {
      id: '',
      url: ''
    }
  });
  const [selectedBannerList, setSelectedBannerList] = useState([]);
  const [navErr, setNavErr] = useState(false);

  const url = host + insertImg;
  const setSelectMenu = (val) => {
    setNavErr(false);
    if (selectedBannerList.length) {
      let flag = 0;
      selectedBannerList.forEach((item) => {
        if (item.nav.id === val.id) {
          console.log(item.nav.id, val.id);
          setNavErr(true);
          setDisabledAddBannerBtn(true);
          flag = 1;
        }
      });
      if (flag) {
        return;
      }
    }

    if (val.id && val.id !== '') {
      const item = {
        nav: {
          id: val.id,
          title: val.title,
          en_title: val.en_title,
          order: val.order,
          key: val.key
        },
        img: selectedItem.img ? {...selectedItem.img} : {}
      };
      setSelectedItem({ ...item });
      setSelectedNev(val);
    }
    setAddBannerBtnDisabled(selectedItem);
  };

  const setAddBannerBtnDisabled = (item) => {
    if (item.nav.id && item.img.id && item.nav.id !== '' && item.img.id !== '') {
      setDisabledAddBannerBtn(false);
    } else {
      setDisabledAddBannerBtn(true);
    }
  };
  const removeLoading = (val) => {
    setSelectorLoading(val);
  };
  const getImgList = () => {
    setLoading(true);
    const params = {
      url: getImgs,
      param: {
          code: cookies.user_token.toString(),
          type: 'banner'
      }
    };
    RequestUtils(params).then((res) => {
      setLoading(false);
      if (res.result.length) {
        const result = res.result;
        result.forEach((item) => {
            item.img_path = imgHost + item.img_name;
            item.selected = false;
        });
        setBannerList([...result]);
      }
    }).catch((e) => {
      setBannerList([]);
      setLoading(false);
      console.log(e);
    });
  };

  const initData = () => {
    setLoading(true);
    const params = {
      url: getNavImg,
      param: {
          code: cookies.user_token.toString()
      }
    };
    RequestUtils(params).then((res) => {
      setLoading(false);
      let list = [];
      res.result.forEach((item) => {
        const listItem = {
          id: item.id,
          nav: {
            id: item.nav_id,
            title: item.title,
            en_title: item.en_title,
            order: item.order
          },
          img: {
            id: item.img_id,
            url: imgHost + item.img_name
          }
        };
        list.push(listItem);
      });
      setSelectedBannerList([...list]);
    }).catch((e) => {
      setLoading(false);
      console.log(e);
    });
  };

  useEffect(() => {
    let monted = true;

    if (monted) {
      initData();
    }
    return() => {
      monted = false;
    }
  }, []);

  const selectImg = (id, item) => {
    const tmp = {...item};
    tmp.selected = !tmp.selected;
    let tmpList = [...bannerList];
    tmpList[id] = {...tmp};
    setBannerList([...tmpList]);

    setSelectedItem((res) => {
      const img = {
        id: item.id,
        url: item.img_path
      };
      const element = {...res};
      element.img = {...img};
      res = {...element};
      setAddBannerBtnDisabled(res);
      return res;
    });
  };

  const addBanner = () => {
    console.log(selectedItem);
    setSelectedBannerList((res) => {
      res.push(selectedItem);
      return res;
    });
    const params = {
      url: upsertNavImg,
      param: {
          code: cookies.user_token.toString(),
          nav_key: selectedItem.nav.key,
          img_id: selectedItem.img.id
      }
    };
    RequestUtils(params).then((res) => {
      setLoading(false);
      initData();
    }).catch((e) => {
      setLoading(false);
      console.log(e);
    });
    setSelectedItem({
      nav: {
        id: '',
        title: '',
        en_title: '',
        key: ''
      },
      img: {
        id: '',
        url: ''
      }
    });
    setSelectedNev('');
    setDisabledAddBannerBtn(true);
  };

  const rowItemRemoveConfirm = (id) => {
    console.log(id);
    const newSystemPopup = {
      display: true,
      type: 'error',
      title: '',
      desc: Dic[language].common.deleteConfirmTitel,
      withCancelBtn: true,
      tmpVal: {
        key: id
      },
      callBack: (id) => {toRemove(id)}
    };
    setAppState({
      systemPopup: newSystemPopup
    });
  };

  const toRemove = (id) => {
    setLoading(true);
    const params = {
      url: deleteNavImg,
      param: {
          code: cookies.user_token.toString(),
          id: id
      }
    };
    RequestUtils(params).then((res) => {
      setLoading(false);
      initData();
    }).catch((e) => {
      setLoading(false);
      console.log(e);
    });
  };

  const removeImg = (imgId) => {
    setLoading(true);
      const params = {
          url: deleteImg,
          param: {
              code: cookies.user_token.toString(),
              id: imgId
          }
      };
      RequestUtils(params).then((res) => {
        setLoading(false);
        getImgList();
      }).catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  return (
    <div className="site-page-banner site-content">
      { loading ? <Loading text={Dic[language].common.loading}/> : null}
      <Row className="page-banner-details-row">
        <Col span={8} className={`padding-right-2rem ${navErr ? 'red-border' : '' }`}>
          <p>{ Dic[language].banner.selectPage }</p>
          <NavSelector
            language={language}
            setSelectMenu={setSelectMenu}
            removeLoading={removeLoading}
            type='all'
            errCallBack={()=>{}}
            value={null}
          />
        </Col>
        <Col span={8} className="padding-right-2rem">
          <p>&nbsp;</p>
          <Button
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
        <Col span={8} className="padding-right-2rem">
          <p>&nbsp;</p>
          <Button
              className="float-right margin-right-2rem"
              type="primary"
              icon={<PlusOutlined />}
              onClick={ () =>  {
                  addBanner();
              }}
              disabled={disabledAddBannerBtn}
          >
              { Dic[language].common.add }
          </Button>
        </Col>
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
                  type="banner"
                  url={url}
                  userToken={cookies.user_token.toString()}
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
            setShowImgOverlay(false);
          }}
      >
          {
              showAddImgLoading ? <Loading text={Dic[language].common.loading}/> : null
          }
          {
              bannerList.map((item, id) => (
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
      </Row>
      <RowItem
        list={selectedBannerList}
        language={language}
        callBackRemove={(id) => {rowItemRemoveConfirm(id);}}
      />
    </div>
  );
}

export default PageBanner;
