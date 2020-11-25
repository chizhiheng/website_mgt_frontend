import React, {useEffect, useContext} from 'react';
import './Header.scss';
import Logo from '../../Assets/Images/print';
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import Dic from '../../Assets/Dic/dic.json';
import { AppContext } from '../../context/AppContext';

function Header(props) {
    const {language, callback} = props;
    const { appState, setAppState } = useContext(AppContext);
    const setLanguage = (flag) => {
        callback(flag);
        setAppState({ locale: flag });
    };

    useEffect(() => {
    },[language]);

    return (
        <div className="site-header">
            <h1 className="site-name"><span dangerouslySetInnerHTML={{ __html: Logo }} className="site-logo"/>
                { Dic[language].appTitle.title } <span className="subTitle">{ Dic[language].appTitle.subTitle }</span>
            </h1>
            <div className="site-header-bar text-align-right">
                {language === 'zh' ? <CaretRightOutlined /> : ''}<button onClick={()=>{setLanguage('zh')}}>中文版</button> 
                - 
                <button onClick={()=>{setLanguage('en')}}>English</button>{language === 'en' ? <CaretLeftOutlined /> : ''}
            </div>
        </div>
    );
}

export default Header;