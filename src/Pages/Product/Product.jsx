import React from 'react';
import {
    Row, Col, Tabs
} from 'antd';
import Dic from '../../Assets/Dic/dic.json';
import Content from '../../Component/Content/Content';
import TableWithAjax from '../../Component/Content/TableContent';

function Product(props) {
    const { language } = {...props};
    const { TabPane } = Tabs;

    const callBack = (val) => {
        console.log('callBack val: ', val);
    }
    
    return (
        <div className="site-product site-content">
            <Row className="height-100-per">
                <Col span={24} className="border-1px-light-gray">
                    <Tabs defaultActiveKey="1" type="card" size="small">
                        <TabPane tab={ Dic[language].product.addProduct } key="1">
                            <Content language={language} withImgs type="product" callBack={callBack} />
                        </TabPane>
                        <TabPane tab={ Dic[language].product.productList } key="2">
                            <TableWithAjax />
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
    );
}

export default Product;