import React, {useState} from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Layout } from 'antd';
import SiteHeader from './Component/Header/Header';
import Login from './Pages/Login/Login';
import Settings from './Pages/Settings/Settings';
import NavMgt from './Pages/NavMgt/NavMgt';
import Error from './Pages/Error/Error'
// import SiteFooter from './Component/Footer/Footer';
import SideBar from './Component/SideBar/SideBar';
import Article from './Pages/Article/Article';
import News from './Pages/News/News';
import Product from './Pages/Product/Product';
import Generate from './Pages/Generate/Generate';
import User from './Pages/Users/User';
import Template from './Pages/Template/Template';
import Advertising from './Pages/Advertising/Advertising';

function App(props) {
  const { Header, Content } = Layout;
  const [currentLang, setCurrentLang] = useState((navigator.language||navigator.userLanguage).substr(0, 2));
  const [cookies, setCookie, removeCookie] = useCookies(['user_token']);
  const setLanguage = (flag) => {
    setCurrentLang(flag);
  };

  const logout = (val) => {
    removeCookie('user_token');
  };

  const loginSuccess = (token) => {
    setCookie('user_token', token, { path: '/' });
  };

  const DefaultContainer = () => {
    return (
      <>
        <SideBar language={currentLang} callback={logout} />
        <Layout className="site-content-container">
          <Content className="white-bg content-main">
            <Route path="/settings/">
              <Settings language={currentLang} />
            </Route>
            <Route path="/content/navmgt/">
              <NavMgt language={currentLang} />
            </Route>
            <Route path="/content/article/">
              <Article language={currentLang} />
            </Route>
            <Route path="/content/news/">
              <News language={currentLang} />
            </Route>
            <Route path="/content/product/">
              <Product language={currentLang} />
            </Route>
            <Route path="/generage/pages/">
              <Generate language={currentLang} />
            </Route>
            <Route path="/generage/template/">
              <Template language={currentLang} />
            </Route>
            <Route path="/user/">
              <User language={currentLang} />
            </Route>
            <Route path="/advertising/">
              <Advertising language={currentLang} />
            </Route>
            {/* <Route path="*">
              <Error language={currentLang} />
            </Route> */}
        </Content>
        </Layout>
      </>
    );
  };

  return (
    <div className="site-main">
      <Layout>
        <Header className="header">
          <SiteHeader className="site-header" language={currentLang} callback={setLanguage} />
        </Header>
        <Layout>
          <Router>
            <Switch>
              <Route exact path="/">
                <Login language={currentLang} callback={loginSuccess} />
              </Route>
              <Route path="/login">
                <Login language={currentLang} callback={loginSuccess} />
              </Route>
              <Route component={DefaultContainer} />
            </Switch>
          </Router>
          {/* <SideBar language={currentLang} />
          <Layout className="site-content-container">
            <Content className="white-bg content-main">
            <Router>
              <Switch>
                <Route exact path="/">
                  <Login language={currentLang} />
                </Route>
                <Route path="/login">
                  <Login language={currentLang} />
                </Route>
                <Route path="/dashboard">
                  <Dashboard language={currentLang} />
                </Route>
              </Switch>
            </Router>
          </Content>
          </Layout> */}
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
