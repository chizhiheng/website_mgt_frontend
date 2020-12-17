import React, {Fragment, useState, useEffect} from 'react';
import {
    Select
} from 'antd';

import Dic from '../../../Assets/Dic/dic.json';

import { useCookies } from 'react-cookie';
import { getMenu } from '../../../API/apiPath';
import RequestUtils from '../../../Utils/RequestUtils';

function NavSelector(props) {
    const { Option } = Select;
    const { language, setSelectMenu, removeLoading, type, errCallBack } = {...props};
    const [selectValue, setSelectValue] = useState('');

    const [cookies] = useCookies(['user_token']);
    const [navList, setNavList] = useState([]);
    
    useEffect(() => {
        let monted = true;

        if (monted) {
            let typeVal = 1;
            if (type === 'article') {
                typeVal = 1;
            } else if (type === 'news') {
                typeVal = 2;
            } else if (type === 'product') {
                typeVal = 3;
            }
            const params = {
                url: getMenu,
                param: { code: cookies.user_token.toString(), type: typeVal }
            }
            RequestUtils(params).then((res) => {
                formatNav(res.result);
                removeLoading(false);
            }).catch((e) => {
                removeLoading(false);
                console.log(e);
            });
        }

        return () => {
            monted = false;
        };
    }, []);

    const formatNav = (result) => {
        let parentArr = [];
        result.forEach((element) => {
            if (element.s_id === '' || element.s_id === '-1') {
                element.children = restructureData(element, result);
                parentArr.push(element);
            }
        });
        setNavList([...parentArr]);
    };

    const restructureData = (element, result) => {
        let res = [];
        result.forEach((item) => {
            if (item.s_id === element.key) {
                item.children = restructureData(item, result);
                res.push(item);
            }
        });
        return res;
    };

    // loop nav itself
    const fetchNav = (key, treeList) => {
        for (let index = 0; index < treeList.length; index++) {
            const element = treeList[index];
            if (element.key === key) {
                if (element.children && element.children.length !== 0) {
                    return true;
                }
            }
            if (element.children && element.children.length) {
                return fetchNav(key, element.children);
            }
        }
    };

    const selectNavLevel = (val) => {
        const hasChild = fetchNav(val, navList);
        if (hasChild) {
            errCallBack(true);
        } else {
            errCallBack(false);
        }
        setSelectValue(val);
        setSelectMenu(val);
        console.log('val: ', val, navList, hasChild);
    };
    const generteOption = (items, counter) =>{
        if (counter === 0){
            counter = 1;
        }
        const style = {
            paddingLeft: `${counter}rem`
        }
        const res = items.map((item, id) => (
            <Fragment key={`nav-${item.key}-${id}`}>
            {
                item.key !== '/'
                ? (
                    <>
                        <Option value={item.key} key={`nav-level-${item.key}-${id}`} style={style}>{item.title}</Option>
                        {
                            item.children && item.children.length > 0 ? generteOption(item.children, counter + 1) : ''
                        }
                    </>
                ) : null
            }
            </Fragment>
        ))
        
        return res;
    }

    return (
        <Select
            onChange={selectNavLevel}
            className="nav-selector"
            placeholder={Dic[language].common.selectOne}
        >
            {
                generteOption(navList, 0)
            }
        </Select>
    );
}

export default NavSelector;