import React, { useContext } from 'react';
import { Modal, Button } from 'antd';
import { AppContext } from '../../context/AppContext';
import Dic from '../../Assets/Dic/dic.json';

function SysPopup (props) {
  const {language } = props;
  const { appState, setAppState } = useContext(AppContext);

  const okBtn = () => {
    setAppState({systemPopup: {
      display: false,
      type: '',
      title: '',
      desc: ''
    }})
  }

  return (
    <Modal
      title={appState.systemPopup.title}
      visible={appState.systemPopup.display}
      footer={[
        // <Button type="secondry" onClick={callback}>{ Dic[props.language].common.cancel }</Button>,
        <Button type="primary" onClick={okBtn}>{ Dic[language].common.ok }</Button>
      ]}
    >
      {appState.systemPopup.desc}
    </Modal>
  );
}

export default SysPopup;
