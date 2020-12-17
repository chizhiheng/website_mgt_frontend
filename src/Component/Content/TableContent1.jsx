import React from 'react';
import { Table, Space, Button } from 'antd';
import axios from 'axios';
import RequestUtils from '../../Utils/RequestUtils';
import Dic from '../../Assets/Dic/dic.json';

const columns = [
  {
    title: 'Name',
    dataIndex: 'content_title',
    // sorter: true,
    // render: name => `${name.first} ${name.last}`,
    // width: '25%',
  }, {
    title: 'In',
    dataIndex: 'nav_name',
    // width: '15%',
  }, {
    title: 'Created date',
    dataIndex: 'created_date',
    // width: '15%',
  }, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        {/* <Button>{Dic[props.language].common.loading}</Button> */}
        <Button>Delete</Button>
      </Space>
    ),
  }
];
class TableWithAjax extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: props.pageSize,
      },
      loading: false,
      postParams: props.postParams,
      tableCallBack: props.tableCallBack,
      language: props.language
    };
  }

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    this.setState({ loading: true });
    RequestUtils(this.state.postParams).then((res) => {
        this.setState({
          loading: false,
          data: res.result,
          pagination: {
              ...params.pagination,
              total: res.result.length
          },
      });
    }).catch((e) => {
        console.log(e);
    });
  };

  render() {
    const { data, pagination, loading } = this.state;
    return (
      <Table
        columns={columns}
        rowKey={record => record.id}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={this.handleTableChange}
      />
    );
  }
}

export default TableWithAjax;