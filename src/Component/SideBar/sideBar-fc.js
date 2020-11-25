// left-menu.jsx
import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import './SideBar.scss';
import Dic from '../../Assets/Dic/dic.json';
import {
  LogoutOutlined,
  InfoCircleOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  FileDoneOutlined,
  FileOutlined,
  FileTextOutlined,
  FileImageOutlined,
  ContainerOutlined,
  Html5Outlined,
  WechatOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;

function SideBar(props) {
    const { appState, setAppState } = useContext(AppContext);
    const language = props.language;
    let openKey = [];
    const [state, setState]  = useState({
        openKey: [],
        menuList: [
            {
                title: Dic[language].menu.settings.name,
                key: '/settings/',
                icon: InfoCircleOutlined,
            }, {
                title: Dic[language].menu.content.name,
                key: '/content/',
                icon: FileDoneOutlined,
                children: [{
                    title: Dic[language].menu.content.nav,
                    key: '/content/navmgt/',
                    icon: MenuUnfoldOutlined
                }, {
                    title: Dic[language].menu.content.article,
                    key: '/content/article/',
                    icon: FileOutlined,
                }, {
                    title: Dic[language].menu.content.news,
                    key: '/content/news/',
                    icon: FileTextOutlined,
                }, {
                    title: Dic[language].menu.content.product,
                    key: '/content/product/',
                    icon: FileImageOutlined,
                }, {
                    title: Dic[language].menu.content.generate.name,
                    key: '/content/generage/',
                    icon: ContainerOutlined,
                    children: [{
                        title: Dic[language].menu.content.generate.html,
                        key: '/content/generage/HTML/',
                        icon: Html5Outlined,
                    }, {
                        title: Dic[language].menu.content.generate.weixin,
                        key: '/content/generage/WeiXin/',
                        icon: WechatOutlined,
                    }]
                }]
            }, {
                title: Dic[language].menu.users,
                key: '/users/',
                icon: TeamOutlined,
            }, {
                title: Dic[language].menu.logout,
                key: '/logout/',
                icon: LogoutOutlined,
            }
        ]
    });
   
    const handleChangeMenu = ({key}) => {
        props.history.push(key);
    };

    const handleOpenChange = (v) => {
        setState({
            openKey: v
        })
    };

    useEffect(() => {
        let mounted = true;

        if (mounted) {
            setState({
                openKey: [openKey]
            });
            setAppState({menuList: state.menuList});
            output(appState);
        }

        // CLEAN UP THE EFFECT
        return () => {
            mounted = false;
        };
    }, []);
    // componentDidMount = () => {
    //     setState({
    //         openKey: [openKey]
    //     });
    //     this.appState.setAppState({menuList: this.state.menuList}, this.output);
    // };

    const output = (val) => {
        // val.menuList.push({
        //     title: Dic[this.language].menu.logout,
        //     key: '/logouta/',
        //     icon: ArrowRightOutlined
        // });
        console.log(val);
    }

    const createMenuListMap = (list) => {
        console.log(list);
        return list.map((item) => {
            if(item.children) {
                const path = window.location.pathname;
                const res = item.children.find(child => path.indexOf(child.key) >= 0);
                if(res) setState({...state, openKey: item.key});
                // return (
                //     <SubMenu
                //         key={item.key}
                //         title={
                //             <span>
                //             <item.icon />
                //             <span>{item.title}</span>
                //             </span>
                //         }
                //     >
                //         {
                //             createMenuListMap(item.children)
                //         }
                //     </SubMenu>
                // );
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

    return (
        <Sider collapsible className="site-content-left-nav-container site-layout-background">
            <Menu
                mode="inline"
                theme="white"
                onClick={handleChangeMenu}
                selectedKeys={[props.location.pathname]}
                onOpenChange={handleOpenChange}
                openKeys={state.openKey}
            >
            {
                // 获取并渲染动态的菜单内容
                createMenuListMap(state.menuList)
            }
            </Menu>
        </Sider>
    )
}
export default withRouter(SideBar)