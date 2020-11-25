import React, {useEffect, useState} from 'react';
import Dic from '../../../Assets/Dic/dic.json';
import {
    Button,
    Upload, message, Tooltip
} from 'antd';
import {
    UploadOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';

function Uploader(props) {
    const {language} = {...props};
    const [fileList, updateFileList] = useState([]);
    const itemProps = {
      fileList,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      beforeUpload: file => {
        if (file.type !== 'image/jpeg') {
          message.error(`${file.name} ${Dic[language].common.imgTypeErrorJPG}`);
        }
        return file.type === 'image/jpeg';
      },
      onChange: info => {
        // console.log(info.fileList);
        info.fileList = info.fileList.slice(-1);
        // file.status is empty when beforeUpload return false
        updateFileList(info.fileList.filter(file => !!file.status));
      },
    };

    useEffect(() => {
    },[language]);

    return (
      <Upload {...itemProps}>
        <Button
            icon={<UploadOutlined />}
        >
            { Dic[language].settings.tab.siteInfo.siteContact.QRcode }
        </Button>&nbsp;&nbsp;
        <Tooltip title={ Dic[language].settings.tab.siteInfo.siteContact.QRcodeDesc }>
            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
        </Tooltip>
      </Upload>
    );
};

export default Uploader;