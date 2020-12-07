import React, {Fragment, useState, useEffect} from 'react';
import {
    Select
} from 'antd';

import Dic from '../../../Assets/Dic/dic.json';

import { useCookies } from 'react-cookie';
import { getMenu } from '../../../API/apiPath';
import RequestUtils from '../../../Utils/RequestUtils';
import Loading from '../../Loading/Loading';

function NavSelector(props) {
    const { Option } = Select;
    const {language, setSelectMenu, removeLoading} = {...props};
    const [selectValue, setSelectValue] = useState('');

    const [cookies] = useCookies(['user_token']);
    const [navList, setNavList] = useState([]);
    
    useEffect(() => {
        let monted = true;

        if (monted) {
            const params = {
                url: getMenu,
                param: { code: cookies.user_token.toString() }
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

    const selectNavLevel = (val) => {
        setSelectValue(val);
        setSelectMenu(val);
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