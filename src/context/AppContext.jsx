/* eslint-disable no-unused-vars */
import React, { useState, createContext } from 'react';
import { isObjectLike, isEmpty, isEqual } from 'lodash';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';

window.appState = {};
const initState = {
    menuList: [],
    locale: (navigator.language||navigator.userLanguage).substr(0, 2)
}

const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
    const [state, setState] = useState(initState);

    const getAppState = () => window.appState;

    const setAppState = (newState, callback) => {
        if (!isObjectLike(newState)) {
          throw new Error('setAppState: Type of `newState` should be Object liked.');
        }
        
        let mergedState = state;
        setState((prevState) => {
            mergedState = { ...prevState, ...newState };

            // Only changed state will emit the event
            //   if (!isEmpty(newState) && !isEqual(prevState, mergedState)) {
            //     window.athenaState = mergedState;
            //     window.eventEmitter.emit('UPDATE_APP_STATE', mergedState);
            //   }
            return mergedState;
        });
    
        if (callback) {
          callback(mergedState);
        }
      };

    return (
        <AppContext.Provider
          value={{
            state: state,
            getAppState,
            setAppState,
            // events: events,
            // setEvents,
          }}
        >
          <ConfigProvider locale={state.locale === 'zh' ? zhCN : enUS} direction="ltr">
            { children }
          </ConfigProvider>
        </AppContext.Provider>
    );
}

export {
    AppContext,
    AppContextProvider
  };