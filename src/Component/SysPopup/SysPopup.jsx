import React, { useContext } from 'react';
import { Modal, Button } from 'antd';
import { AppContext } from '../../context/AppContext';
import Dic from '../../Assets/Dic/dic.json';

function SysPopup (props) {
  const { language } = props;
  const { appState, setAppState } = useContext(AppContext);
  const okBtn = () => {
    console.log(appState.systemPopup.tmpVal.key);
    if (appState.systemPopup.tmpVal && appState.systemPopup.tmpVal.key && appState.systemPopup.tmpVal.key !== '') {
      console.log(1111);
      appState.systemPopup.callBack(appState.systemPopup.tmpVal.key);
    } else {
      console.log(22222);
    }
    setAppState({systemPopup: {
      display: false,
      withCancelBtn: false,
      tmpVal: {},
      callBack: () => {}
    }});
  }

  const cancelBtn = () => {
    setAppState({systemPopup: {
      display: false,
      withCancelBtn: false,
      tmpVal: {},
      callBack: () => {}
    }});
  }

  const FooterBtn = () => {
    return (
      <>
        { appState.systemPopup.withCancelBtn ? <Button key={`cancelbtn-${appState.systemPopup.title}`} type="secondry" onClick={cancelBtn}>{ Dic[props.language].common.cancel }</Button> : null }
        <Button key={`okbtn-${appState.systemPopup.title}`} type="primary"
        onClick={okBtn}
        >{ Dic[language].common.ok }</Button>
      </>
    )
  }

  return (
    <Modal
      title={appState.systemPopup.title}
      visible={appState.systemPopup.display}
      destroyOnClose
      onCancel={cancelBtn}
      footer={[
        <FooterBtn key={`footer-${new Date().getMinutes()}`} />
      ]}
    >
      {appState.systemPopup.desc}
    </Modal>
  );
}

export default SysPopup;
