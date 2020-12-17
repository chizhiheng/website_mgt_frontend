import React, {useEffect, useState} from 'react';
import { Table, Space, Button } from 'antd';
import RequestUtils from '../../Utils/RequestUtils';
import Dic from '../../Assets/Dic/dic.json';

function TableWithAjax(props) {
    const [state, setState] = useState({
        data: [],
        pagination: {
            current: 1,
            pageSize: props.pageSize,
        },
        loading: false
    });
    const [columns, setColumns] = useState([
        {
          title: Dic[props.language].article.table.title,
          dataIndex: 'content_title',
          // sorter: true,
          // render: name => `${name.first} ${name.last}`,
          // width: '25%',
        }, {
          title: Dic[props.language].article.table.belong,
          dataIndex: 'nav_name',
          // width: '15%',
        }, {
          title: Dic[props.language].article.table.createdDate,
          dataIndex: 'created_date',
          // width: '15%',
        }, {
          title: Dic[props.language].article.table.action,
          key: 'action',
          render: (record) => (
            <Space size="middle">
              <Button
                onClick={() => {
                  props.tableCallBack(record, 'update');
                }}
              >
                {Dic[props.language].common.update}
              </Button>
              <Button
                onClick={() => {
                  props.tableCallBack(record, 'delete');
                }}
              >
                {Dic[props.language].common.delete}
              </Button>
            </Space>
          ),
        }
    ]);

    useEffect(() => {
      if (props.language !== 'zh') {
        const arr = [ ...columns ];
        arr[1] = {
          title: Dic[props.language].article.table.belong,
          dataIndex: 'nav_ename',
        }
        setColumns([ ...arr ]);
      }
      
      fetch(state);
    }, [props.language]);

    const handleTableChange = (pagination, filters, sorter) => {
        fetch({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination,
            ...filters,
        });
    };

    const fetch = (params = {}) => {
        setState({ loading: true });
        RequestUtils(props.postParams).then((res) => {
            setState({
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

    return (
        <Table
          columns={columns}
          rowKey={record => record.id}
          dataSource={state.data}
          pagination={state.pagination}
          loading={state.loading}
          onChange={handleTableChange}
        />
    );
}

export default TableWithAjax;