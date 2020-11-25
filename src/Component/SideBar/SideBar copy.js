import React, {useEffect, useState, Fragment} from 'react';
import { Layout, Menu, Icon } from 'antd';
import {
    SettingOutlined,
    LogoutOutlined,
    UserOutlined
} from '@ant-design/icons';
import Dic from '../../Assets/Dic/dic.json';
import { useHistory } from "react-router-dom";

function SideBar(props) {
    const { language } = {...props};
    const { SubMenu } = Menu;
    const { Sider } = Layout;
    const history = useHistory();
    
    const [openNav, setOpenNav] = useState([]);
    const [selectedNav, setSelectedNav] = useState([]);

    const [routes, setRoutes] = useState([{
        name: Dic[language].menu.settings.name,
        key: 'settings',
        path: '/settings/',
        icon: 'SettingOutlined',
        subItems: [{
            key: 'siteInfor',
            name: Dic[language].menu.settings.subItems[0].name,
            path: '/settings/'
        },{
            key: 'navMgt',
            name: Dic[language].menu.settings.subItems[1].name,
            path: '/settings/navmgt/'
        }]
    },{
        name: Dic[language].menu.users.name,
        key: 'users',
        path: '/users/',
        icon: 'UserOutlined',
        subItems: [{
            key: 'addUser',
            name: Dic[language].menu.users.name,
            path: '/users/'
        },{
            key: 'userList',
            name: Dic[language].menu.settings.subItems[1].name,
            path: '/users/userList/'
        }]
    },{
        name: Dic[language].menu.logout,
        key: 'logout',
        path: '/logout/',
        icon: 'LogoutOutlined',
        subItems: []
    }]);
    const goToPage = (path) => {
        history.push(path);
    };

    useEffect(() => {
        let mounted = true;

        if (mounted) {
            if (PerformanceNavigation.TYPE_RELOAD) {
                const pathName = window.location.pathname;
                routes.forEach((element, id) => {
                    if (pathName.indexOf(element.key) !== -1){
                        setOpenNav((res) => {
                            res.length = 0;
                            res.push(element.key);
                            return res;
                        });
                        element.subItems.forEach((item, i) => {
                            if (pathName === item.path){
                                setSelectedNav((res) => {
                                    res.length = 0;
                                    res.push(item.key);
                                    return res;
                                });
                            }
                        });
                    }
                });
            }
        }
        return () => {
            mounted = false;
        };
    });

    const SubNav = (props) => {
        const {items} = {...props};

        return [
            // items.map((item) => (
            //     <Menu.Item key={item.key} onClick={ () => {goToPage(item.path)} }>{ item.name }</Menu.Item>
            // ))
                <Menu.Item key={items[0].key} onClick={ () => {goToPage(items[0].path)} }>{ items[0].name }</Menu.Item>,
                <Menu.Item key={items[1].key} onClick={ () => {goToPage(items[1].path)} }>{ items[1].name }</Menu.Item>
        ];
    };

    const GetMenuList = (props) => {
        const {items, first} = {...props};
        console.log(items, first);
        return (
            <Fragment>
            {
                first
                ?
                <Menu
                    mode="inline"
                    defaultOpenKeys={openNav}
                    defaultSelectedKeys={selectedNav}
                    style={{ height: '100%', borderRight: 0 }}
                >
                    {
                        items.map((item, id) => (
                            item.subItems && item.subItems.length > 0
                            ?
                            <SubMenu key={item.key} title={ items.name }> {/* icon={<item.icon />} */}
                                <GetMenuList items={item.subItems} first={false} />
                            </SubMenu>
                            :
                            <Menu.Item key={item.key} > {/* icon={<item.icon />} */}
                                {item.name}
                            </Menu.Item>
                        ))
                    }
                </Menu>
                :
                items.map((item, id) => (
                    item.subItems && item.subItems.length > 0
                    ?
                    <SubMenu key={item.key} title={ items.name }> {/* icon={<item.icon />} */}
                        <GetMenuList items={item.subItems} first={false} />
                    </SubMenu>
                    :
                    <Menu.Item key={item.key} > {/* icon={<item.icon />} */}
                        {item.name}
                    </Menu.Item>
                ))
            }
            </Fragment>
        );
    }

    return (
        <Sider collapsible className="site-content-left-nav-container site-layout-background">
            <GetMenuList items={routes} first />
            <ul class="ant-menu ant-menu-light ant-menu-root ant-menu-inline" role="menu" style={{height: '100%', borderRight: '0'}}>
                <li class="ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open ant-menu-submenu-active" role="menuitem">{/* ant-menu-submenu-open ant-menu-submenu-active */}
                    <div class="ant-menu-submenu-title" role="button" aria-expanded="false" aria-haspopup="true" style={{paddingLeft: '24px'}}>
                        <span role="img" aria-label="setting" class="anticon anticon-setting">
                            <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="setting" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z"></path></svg>
                        </span>
                        <span>设置</span>
                        <i class="ant-menu-submenu-arrow"></i>
                    </div>
                    <ul id="a$Menu" class="ant-menu ant-menu-sub ant-menu-inline" role="menu">
                        <li class="ant-menu-item ant-menu-item-only-child ant-menu-item-selected" role="menuitem" style={{paddingLeft: '48px'}}>网站信息</li>{/* ant-menu-item-selected */}
                        <li class="ant-menu-item ant-menu-item-only-child" role="menuitem" style={{paddingLeft: '48px'}}>添加导航</li>
                    </ul>
                </li>
                <li class="ant-menu-submenu ant-menu-submenu-inline" role="menuitem">
                    <div class="ant-menu-submenu-title" role="button" aria-expanded="false" aria-haspopup="true" style={{paddingLeft: '24px'}}>
                        <span role="img" aria-label="user" class="anticon anticon-user">
                            <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path></svg>
                        </span>
                        <span>用户管理</span>
                        <i class="ant-menu-submenu-arrow"></i>
                    </div>
                    <div></div>
                </li>
                <li class="ant-menu-item" role="menuitem" style={{paddingLeft: '24px'}}>
                    <span role="img" aria-label="logout" class="anticon anticon-logout">
                        <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="logout" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8-7 8.5-14.5 16.7-22.4 24.5a353.84 353.84 0 01-112.7 75.9A352.8 352.8 0 01512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.84 353.84 0 01-112.7-75.9 353.28 353.28 0 01-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 7.9 7.9 15.3 16.1 22.4 24.5 3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82 271.7 82.6 79.6 277.1 82 516.4 84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7 3.4-5.3-.4-12.3-6.7-12.3zm88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 000-12.6z"></path></svg>
                    </span>
                    <span>退出111</span>
                </li>
            </ul>
            <Menu
              mode="inline"
              defaultOpenKeys={openNav}
              defaultSelectedKeys={selectedNav}
              style={{ height: '100%', borderRight: 0 }}
            >
                {
                    // routes.map((item, id) => (
                    //     item.subItems.length > 0
                    //     ?
                    //     <SubMenu key={item.key} icon={<item.icon />} title={ item.name }>
                    //         {/* <SubNav items={item.subItems} /> */}
                    //         <Sub items={item.subItems} />
                    //     </SubMenu>
                    //     :
                    //     <Menu.Item key={item.key} icon={<item.icon />}>
                    //         {item.name}
                    //     </Menu.Item>
                    // ))
                }
                <SubMenu key="a" icon={<SettingOutlined />} title={ routes[0].name }>
                    <Menu.Item key="aa" onClick={ () => {goToPage(routes[0].subItems[0].path)} }>{ Dic[language].menu.settings.subItems[0].name }</Menu.Item>
                    <Menu.Item key="aaa" onClick={ () => {goToPage(routes[0].subItems[1].path)} }>{ Dic[language].menu.settings.subItems[1].name }</Menu.Item>
                </SubMenu>

                <SubMenu key="b" icon={<UserOutlined />} title={ routes[1].name }>
                    <Menu.Item key="bb" onClick={ () => {goToPage(routes[1].subItems[0].path)} }>{ Dic[language].menu.users.subItems[0].name }</Menu.Item>
                    <Menu.Item key="bbb" onClick={ () => {goToPage(routes[1].subItems[1].path)} }>{ Dic[language].menu.users.subItems[1].name }</Menu.Item>
                </SubMenu>

                <Menu.Item key="c" icon={<LogoutOutlined />}>
                    {Dic[language].menu.logout}
                </Menu.Item>
            </Menu>
          </Sider>
    );
}

const Sub = (props) => {
    const {items} = {...props};

    return (
        items.map((item) => (
            <Menu.Item key={item.key} >{ item.name }</Menu.Item>
        ))
    );
};

export default SideBar;