import React, { useState } from 'react';
import {
    Row, Col, Button
} from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';
import NavSelector from '../../Component/Content/NavSelector/';
import Dic from '../../Assets/Dic/dic.json';
import './PageBanner.scss';
import useSelection from 'antd/lib/table/hooks/useSelection';

function PageBanner(props) {
    const { language } = {...props};
    const [bannerList, setBannerList] = useState({});
    const [selectedNav, setSelectedNev] = useState('');
    const [selectorLoading, setSelectorLoading] = useState(false);

    const setSelectMenu = (val) => {
      console.log(val);
      setSelectedNev(val);
    };

    const removeLoading = (val) => {
      setSelectorLoading(val);
    };

    return (
        <div className="site-template site-content">
            <Row className="height-100-per">
                <Col span={12} className="padding-right-2rem">
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
                <Col span={12} className="padding-right-2rem">
                  <p>&nbsp;</p>
                  <Button
                      // type="dashed"
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
            </Row>
        </div>
    );
}

export default PageBanner;
