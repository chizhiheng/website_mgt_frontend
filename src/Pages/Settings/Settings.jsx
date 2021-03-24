import React, { useEffect, useState } from 'react';
import { Uniq } from 'lodash';
import './Settings.scss';
import Dic from '../../Assets/Dic/dic.json';
import Uploader from '../../Component/FormItems/Uploader/Uploader';
import {
    Input, Row, Col, Button, Divider,
    Tooltip, Tabs, Form, Checkbox
} from 'antd';
import {
    HomeOutlined,
    SearchOutlined,
    SolutionOutlined,
    MailOutlined,
    PhoneOutlined,
    InfoCircleOutlined,
    EnvironmentOutlined,
    BankOutlined
} from '@ant-design/icons';
import { useCookies } from 'react-cookie';
import { getSiteInfo, upsertSiteInfo } from '../../API/apiPath';
import RequestUtils from '../../Utils/RequestUtils';
import Loading from '../../Component/Loading/Loading';

function Dashboard(props) {
    const { language } = {...props};
    const { TabPane } = Tabs;
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['user_token']);
    const [qrCode, setQrCode] = useState(false);
    const [imgContent, setImgContent] = useState('');
    const [formValues, setFormValues] = useState({
        siteInfo: {
            site_name: '',
            site_keywords: '',
            site_description: '',
            site_language: {
                cn: true,
                en: false,
                jp: false,
                kr: false
            },
            site_company_address: '',
            site_contact_email: '',
            site_contact_phone1: '',
            site_contact_phone2: '',
            site_contact_QR_code: ''
        }
    });
    const [en, setEn] = useState(false);
    const [jp, setJp] = useState(false);
    const [kr, setKr] = useState(false);

    const layout = {
        labelCol: {
            xs: { span: 0 },
            sm: { span: 5 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
    };

    const validateMessages = {
        required: Dic[language].common.isRequired
    };

    const getImgBase64 = (val) => {
        val === '' ? setQrCode(false) : setQrCode(true);
        setFormValues((res) => {
            res.siteInfo.site_contact_QR_code = val;
            return res;
        });
        setImgContent(val);
    }

    const onFinish = values => {
        const lang = formValues.siteInfo.site_language;
        setFormValues((res) => {
            res.siteInfo = {...values.siteInfo};
            res.siteInfo.site_contact_QR_code = imgContent;
            res.siteInfo.site_language = lang;
            return res;
        });
        setLoading(true);
        const params = {
            url: upsertSiteInfo,
            param: {
                code: cookies.user_token.toString(),
                values: formValues.siteInfo
            }
        }
        RequestUtils(params).then((res) => {
            setLoading(false);
        }).catch((e) => {
            setLoading(false);
            console.log(e);
        });
    };

    const setLanguage = (el) => {
        if (el.target.value === 'en') {
            setEn(el.target.checked);
        }
        if (el.target.value === 'jp') {
            setJp(el.target.checked);
        }
        if (el.target.value === 'kr') {
            setKr(el.target.checked);
        }
        setFormValues((res) => {
            const lang = {...res.siteInfo.site_language};
            lang[el.target.value] = el.target.checked;
            res.siteInfo.site_language = {...lang};
            return res;
        });
    };

    useEffect(() => {
        let monted = true;
        setLoading(true);
        if (monted) {
            const params = {
                url: getSiteInfo,
                param: { code: cookies.user_token.toString() }
            }
            RequestUtils(params).then((val) => {
                if (val !== null) {
                    setFormValues((res) => {
                        res.siteInfo.site_name = val.result.site_name;
                        res.siteInfo.site_keywords = val.result.site_keywords;
                        res.siteInfo.site_description = val.result.site_description;
                        res.siteInfo.site_language = val.result.site_language;
                        res.siteInfo.site_company_address = val.result.site_company_address;
                        res.siteInfo.site_contact_email = val.result.site_contact_email;
                        res.siteInfo.site_contact_phone1 = val.result.site_contact_phone1;
                        res.siteInfo.site_contact_phone2 = val.result.site_contact_phone2;
                        res.siteInfo.site_contact_QR_code = val.result.site_contact_QR_code;
                        return res;
                    });

                    setEn(val.result.site_language.en);
                    setJp(val.result.site_language.jp);
                    setKr(val.result.site_language.kr);

                    if (val.result.site_contact_QR_code !== '') {
                        setQrCode(true);
                        setImgContent(val.result.site_contact_QR_code);
                    }
                }
                setLoading(false);
            }).catch((e) => {
                setLoading(false);
                console.log(e);
            });
            console.log('123123', formValues.siteInfo.site_language.en, formValues.siteInfo.site_language.jp, formValues.siteInfo.site_language.kr);
        }

        return () => {
            monted = false;
        };
    }, []);

    return (
        <div className="site-settings">
            { loading ? <Loading text={Dic[language].common.loading}/> : null}
            <Row className="height-100-per">
                <Col span={24} className="border-1px-light-gray">
                <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} initialValues={formValues}>
                    <Form.Item name={['siteInfo', 'site_name']} label={ Dic[language].settings.tab.siteInfo.siteName } rules={[{ required: true }]}>
                        <Input 
                            size="large"
                            prefix={<HomeOutlined />}
                            suffix={
                                <Tooltip title={ Dic[language].settings.tab.siteInfo.siteNameDesc }>
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        />
                    </Form.Item>
                    <Form.Item name={['siteInfo', 'site_keywords']} label={ Dic[language].settings.tab.siteInfo.siteKeywords } rules={[{ required: true }]}>
                        <Input
                            size="large"
                            prefix={<SearchOutlined />}
                            suffix={
                                <Tooltip title={ Dic[language].settings.tab.siteInfo.siteKeywordsDesc }>
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        />
                    </Form.Item>
                    <Form.Item name={['siteInfo', 'site_description']} label={ Dic[language].settings.tab.siteInfo.siteDescription } rules={[{ required: true }]}>
                        <Input.TextArea
                            size="large"
                            prefix={<SolutionOutlined />}
                            suffix={
                                <Tooltip title={ Dic[language].settings.tab.siteInfo.siteDescriptionDesc }>
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        />
                    </Form.Item>
                    <Form.Item name={['siteInfo', 'site_language']} label={ Dic[language].settings.tab.siteInfo.siteLanguage } rules={[{ required: true }]}>
                        <Row>
                            <Col span={4}>
                                <Checkbox value="cn" defaultChecked disabled checked>
                                    中文
                                </Checkbox>
                            </Col>
                            <Col span={4}>
                                <Checkbox value="en" onChange={(e) => {setLanguage(e)}} checked={en}>
                                    English
                                </Checkbox>
                            </Col>
                            <Col span={4}>
                                <Checkbox value="jp" onChange={(e) => {setLanguage(e)}} checked={jp}>
                                    日本語
                                </Checkbox>
                            </Col>
                            <Col span={4}>
                                <Checkbox value="kr" onChange={(e) => {setLanguage(e)}} checked={kr}>
                                    한국어
                                </Checkbox>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Divider />
                    <Form.Item name={['siteInfo', 'site_company_address']} label={ Dic[language].settings.tab.siteInfo.siteContact.companyAddress } rules={[{ required: true }]}>
                        <Input
                            size="large"
                            prefix={<EnvironmentOutlined />}
                            suffix={
                                <Tooltip title={ Dic[language].settings.tab.siteInfo.siteContact.companyAddress }>
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        />
                    </Form.Item>
                    <Form.Item name={['siteInfo', 'site_contact_email']} label={ Dic[language].settings.tab.siteInfo.siteContact.email } rules={[{ required: true, type: 'email' }]}>
                        <Input
                            size="large"
                            prefix={<MailOutlined />}
                            suffix={
                                <Tooltip title={ Dic[language].settings.tab.siteInfo.siteContact.emailDesc }>
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        />
                    </Form.Item>
                    <Form.Item name={['siteInfo', 'site_contact_phone1']} label={ Dic[language].settings.tab.siteInfo.siteContact.phone1 } rules={[{ required: true }]}>
                        <Input
                            size="large"
                            prefix={<PhoneOutlined />}
                            suffix={
                                <Tooltip title={ Dic[language].settings.tab.siteInfo.siteContact.phoneDesc }>
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        />
                    </Form.Item>
                    <Form.Item name={['siteInfo', 'site_contact_phone2']} label={ Dic[language].settings.tab.siteInfo.siteContact.phone2 } >
                        <Input
                            size="large"
                            prefix={<PhoneOutlined />}
                            suffix={
                                <Tooltip title={ Dic[language].settings.tab.siteInfo.siteContact.phoneDesc }>
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        />
                    </Form.Item>
                    <Form.Item name={['siteInfo', 'site_contact_QR_code']} label={ Dic[language].settings.tab.siteInfo.siteContact.QRcode } >
                        <Uploader language={language} title={Dic[language].settings.tab.siteInfo.siteContact.QRcodeDesc} getImgBase64={getImgBase64} />
                    </Form.Item>
                    {
                        qrCode
                        ? 
                            <Form.Item className="text-align-center">
                                <img src={imgContent} width="100" height="100" alt={Dic[language].settings.tab.siteInfo.siteContact.QRcode} />
                            </Form.Item>
                        : null
                    }
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }} className="clear-both">
                        <Button type="primary" htmlType="submit">
                            { Dic[language].common.update }
                        </Button>
                    </Form.Item>
                </Form>
                    {/* <Tabs defaultActiveKey="1" type="card" size="small">
                        <TabPane tab={ Dic[language].settings.tab.siteInfo.name } key="1">
                            
                        </TabPane>
                        <TabPane tab={ Dic[language].settings.tab.banner.name } key="2">
                            
                        </TabPane>
                    </Tabs> */}
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;