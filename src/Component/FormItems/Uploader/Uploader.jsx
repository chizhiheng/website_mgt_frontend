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
    const {language, title, getImgBase64} = {...props};
    const [fileList, updateFileList] = useState([]);

    const customRequest = (option) => {
      const formData = new FormData();
      formData.append("files[]", option.file);
      const reader = new FileReader();
      reader.readAsDataURL(option.file);
      reader.onloadend = function(e) {
        // console.log(e.target.result);// 打印图片的base64
        if (e && e.target && e.target.result) {
          getImgBase64(e.target.result);
          option.onSuccess();
        }
      };
    };

    const beforeUpload = (file) => {
      const isJpgOrPng = file.type === 'image/jpeg';
      if (!isJpgOrPng) {
        message.error(`${file.name} ${Dic[language].common.imgTypeErrorJPG}`);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error(`${file.name} ${Dic[language].common.imgSizeError}`);
        return false;
      }
      return isJpgOrPng && isLt2M;
    };

    const itemProps = {
      fileList,
      customRequest: customRequest,
      beforeUpload: beforeUpload,
      onChange: info => {
        if (info.fileList.length === 0) {
          getImgBase64('');
        }
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
            size="large"
        >
            { Dic[language].common.upload }
        </Button>&nbsp;&nbsp;
        <Tooltip title={ title }>
            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
        </Tooltip>
      </Upload>
    );
};

export default Uploader;