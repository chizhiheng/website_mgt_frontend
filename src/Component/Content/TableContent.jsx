import React, {useEffect, useState} from 'react';
import { Table, Space, Button } from 'antd';
import RequestUtils from '../../Utils/RequestUtils';
import Dic from '../../Assets/Dic/dic.json';
import './TableContent.scss';

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
          width: '37%',
        }, {
          title: Dic[props.language].article.table.belong,
          dataIndex: 'nav_name',
          width: '20%',
        }, {
          title: Dic[props.language].article.table.top,
          dataIndex: 'is_top',
          render: (is_top) => is_top === '1' ? Dic[props.language].common.yes : Dic[props.language].common.no,
          width: '8%',
          className: 'text-align-center',
        }, {
          title: Dic[props.language].article.table.createdDate,
          dataIndex: 'created_date',
          className: 'text-align-right',
          width: '20%',
        }, {
          title: Dic[props.language].article.table.action,
          key: 'action',
          className: 'text-align-right',
          width: '15%',
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
      let monted = true;

      if (monted) {
        if (props.reload) {
          
        }

        if (props.language !== 'zh') {
          const arr = [ ...columns ];
          arr[1] = {
            title: Dic[props.language].article.table.belong,
            dataIndex: 'nav_ename',
          }
          setColumns([ ...arr ]);
        }
        
        fetch(state);
      }

      return () => {
        monted = false;
      };
    }, [props.reload]);

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
          className="table-content"
        />
    );
}

export default TableWithAjax;