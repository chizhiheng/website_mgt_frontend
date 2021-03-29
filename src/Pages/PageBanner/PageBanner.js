import React, { useState, useContext } from 'react';
import {
    Row, Col, Button, Modal, Card
} from 'antd';
import {
  PlusOutlined, PicCenterOutlined, DeleteOutlined
} from '@ant-design/icons';
import NavSelector from '../../Component/Content/NavSelector/';
import Dic from '../../Assets/Dic/dic.json';
import Loading from '../../Component/Loading/Loading';
import './PageBanner.scss';
import { host, insertImg, getImgs } from '../../API/apiPath';
import RequestUtils from '../../Utils/RequestUtils';
import { useCookies } from 'react-cookie';
import PicturesWall from '../../Component/Content/ImgContent';
import { AppContext } from '../../context/AppContext';

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

    const url = host + insertImg;
    console.log('url:', url);
    const setSelectMenu = (val) => {
      console.log(val);
      setSelectedNev(val);
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
        if (res.result.length) {
          const result = res.result;
          result.forEach((item) => {
              item.img_path = imgHost + item.img_name;
              item.selected = false;
          });
          setBannerList([...result]);
          setLoading(false);
        }
      }).catch((e) => {
        setBannerList([]);
        setLoading(false);
        console.log(e);
      });
  };

    return (
      <div className="site-page-banner site-content">
        <Row className="page-banner-details-row">
          <Col span={8} className="padding-right-2rem">
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
                    // getImgList();
                    // setShowImgOverlay(true);
                }}
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
                                    // selectImg(id, item);
                                }}
                            >
                                {/* { item.selected || selectedImageIds.indexOf(item.id) > -1 ? <CheckSquareOutlined key="selected" /> : <BorderOutlined key="unselect" /> } */}
                            </div>,
                            <DeleteOutlined
                                key="edit"
                                // onClick={() => removeImg(item.id)}
                            />
                        ]}
                    >
                        <Meta title={item.img_name} description={item.created_date} />
                    </Card>
                ))
            }
        </Modal>
        </Row>
        {/* <Row className='page-banner-list'>
          <Col span={6}>
            1111
          </Col>
          <Col span={18}>
            22222
          </Col>
        </Row> */}
      </div>
    );
}

export default PageBanner;
