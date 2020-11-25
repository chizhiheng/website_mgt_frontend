import React from 'react';
import { Table, Space } from 'antd';
import axios from 'axios';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    render: name => `${name.first} ${name.last}`,
    width: '20%',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
    ],
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  // {
  //   title: 'Action',
  //   key: 'action',
  //   render: (text, record) => (
  //     <Space size="middle">
  //       <a>Invite {record.name}</a>
  //       <a>Delete</a>
  //     </Space>
  //   ),
  // }
];

const getRandomuserParams = params => {
  return {
    results: params.pagination.pageSize,
    page: params.pagination.current,
    ...params,
  };
};

class TableWithAjax extends React.Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
  };

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
    console.log('params: ', params);
    this.setState({ loading: true });
    axios.get('https://randomuser.me/api', {
        data: getRandomuserParams(params)
    }).then((response) => {
        // handle success
        console.log('success', response.data.results);
        this.setState({
            loading: false,
            data: response.data.results,
            pagination: {
                ...params.pagination,
                total: 200,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
            },
        });
    }).catch((error) => {
        // handle error
        console.log(error);
    });
  };

  render() {
    const { data, pagination, loading } = this.state;
    return (
      <Table
        columns={columns}
        rowKey={record => record.login.uuid}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={this.handleTableChange}
      />
    );
  }
}

export default TableWithAjax;