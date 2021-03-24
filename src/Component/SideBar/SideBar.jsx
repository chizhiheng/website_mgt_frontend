// left-menu.jsx
import React, { Component } from 'react'
import { AppContext } from '../../context/AppContext';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import './SideBar.scss';
import Dic from '../../Assets/Dic/dic.json';
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  FileDoneOutlined,
  FileOutlined,
  FileTextOutlined,
  FileImageOutlined,
  ContainerOutlined,
  Html5Outlined,
  SoundOutlined,
  SettingOutlined,
  LayoutOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;

class SideBar extends Component {
    static contextType = AppContext;
    appState = this.context;
    language = this.props.language;
    callback = this.props.callback;

    state = {
        openKey: [],
        menuList: [
            {
                title: Dic[this.language].menu.settings.name,
                key: '/settings/',
                icon: SettingOutlined,
            }, {
                title: Dic[this.language].menu.content.name,
                key: '/content/',
                icon: FileDoneOutlined,
                children: [{
                    title: Dic[this.language].menu.content.nav,
                    key: '/content/navmgt/',
                    icon: MenuUnfoldOutlined
                }, {
                    title: Dic[this.language].menu.content.article,
                    key: '/content/article/',
                    icon: FileOutlined,
                }, {
                    title: Dic[this.language].menu.content.news,
                    key: '/content/news/',
                    icon: FileTextOutlined,
                }, {
                    title: Dic[this.language].menu.content.product,
                    key: '/content/product/',
                    icon: FileImageOutlined,
                }, {
                    title: Dic[this.language].menu.content.pageImg,
                    key: '/content/pageBanner/',
                    icon: LayoutOutlined
                }]
            }, {
                title: Dic[this.language].menu.generate.name,
                key: '/generage/template/',
                icon: ContainerOutlined,
                children: [{
                    title: Dic[this.language].menu.generate.template,
                    key: '/generage/template/',
                    icon: ContainerOutlined
                }, {
                    title: Dic[this.language].menu.generate.html,
                    key: '/generage/pages/',
                    icon: Html5Outlined
                }]
            }, {
                title: Dic[this.language].menu.users,
                key: '/user/',
                icon: TeamOutlined,
            }, {
                title: Dic[this.language].menu.advertising,
                key: '/advertising/',
                icon: SoundOutlined,
            }, {
                title: Dic[this.language].menu.logout,
                key: '/logout/',
                icon: LogoutOutlined,
            }
        ]
    };
   
    handleChangeMenu = ({key}) => {
        if (key === '/logout/') {
            this.callback(key);
            this.props.history.push('/');
        } else {
            this.props.history.push(key);
        }
    };

    handleOpenChange = (v) => {
        this.setState({
            openKey: v
        });
    };

    componentDidMount() {
        this.setState({
            openKey: [this.openKey]
        });
        this.appState.setAppState({menuList: this.state.menuList}, this.output);
    }
    // componentDidUpdate(prevProps) {
    //     if (prevProps.location.pathname !== this.props.location.pathname) {
            
    //     }
    // }

    output = (val) => {
        // val.menuList.push({
        //     title: Dic[this.language].menu.logout,
        //     key: '/logouta/',
        //     icon: ArrowRightOutlined
        // });
    }

    createMenuListMap = (list) => {
        return list.map((item) => {
            if(item.children) {
            const path = window.location.pathname;
            const res = item.children.find(child => path.indexOf(child.key) >= 0);
            if(res) this.openKey = item.key;  
            return (
                <SubMenu
                key={item.key}
                title={
                    <span>
                    <item.icon />
                    <span>{item.title}</span>
                    </span>
                }
                >
                {
                    this.createMenuListMap(item.children)
                }
                </SubMenu>
            );
            } else {
            return (
                <Menu.Item key={item.key}>
                    <item.icon />
                    <span>{item.title}</span>
                </Menu.Item>
            );
            }
        });
    };

    render() {
        return (
            <Sider collapsible className="site-content-left-nav-container site-layout-background">
                <Menu
                mode="inline"
                theme="white"
                onClick={this.handleChangeMenu}
                selectedKeys={[this.props.location.pathname]}
                onOpenChange={this.handleOpenChange}
                openKeys={this.state.openKey}
                >
                {
                    // 获取并渲染动态的菜单内容
                    this.createMenuListMap(this.state.menuList)
                }
                </Menu>
            </Sider>
        )
    }
}
export default withRouter(SideBar)