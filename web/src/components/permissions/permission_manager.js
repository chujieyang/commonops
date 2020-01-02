import React, {Component, Fragment} from 'react';
import {Layout, Table, Form, Popconfirm, Row, Col, Button, Modal, Input, message} from 'antd';
import {
    deleteAuthLink,
    getPermissionsList, postAddAuthLink,
} from "../../api/role";
import OpsBreadcrumbPath from "../breadcrumb_path";

const { Content } = Layout;

let columnStyle = {
    overFlow : "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
};

class AuthLinkModal extends Component {

    constructor(props) {
        super(props);
        this.handleAddAuthLink = this.handleAddAuthLink.bind(this);
        this.state = {};
    }

    handleAddAuthLink() {
        const { form, hideModal } = this.props;
        form.validateFields((err, values) => {
            if(!err){
                postAddAuthLink(values).then((res)=>{
                    if(res.code === 0){
                        message.success("创建成功");
                        hideModal();
                        this.props.refreshTableData();
                    } else {
                        form.setFields({
                            name: {
                                errors: [new Error(res.msg)],
                            },
                        });
                        message.error(res.msg);
                    }
                }).catch((err)=>{
                    message.error(err.toLocaleString());
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        return (
            <Fragment>
                <Modal
                    title="新建权限链接"
                    destroyOnClose="true"
                    visible={this.props.authLinkModalVisible}
                    onOk={this.handleAddAuthLink}
                    onCancel={this.props.handleCancelAddAuthLink}
                    okText="确认"
                    cancelText="取消"
                >
                    <Form ref>
                        <Form.Item {...formItemLayout} label='权限名称'>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入路径权限名称' }],
                            })(
                                <Input placeholder='请输入路径权限名称'/>
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label='权限描述'>
                            {getFieldDecorator('description', {
                                rules: [{ required: true, message: '请输入权限描述' }],
                            })(
                                <Input placeholder='请输入权限描述'/>
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label='权限URI路径'>
                            {getFieldDecorator('path', {
                                rules: [{ required: true, message: '请输入权限URI路径' }],
                            })(
                                <Input placeholder='请输入权限URI路径'/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </Fragment>
        )
    }
}

AuthLinkModal = Form.create({ name: 'add_auth_link' })(AuthLinkModal);

class PermissionsManager extends Component {

    constructor(props){
        super(props);
        this.refreshTableData = this.refreshTableData.bind(this);
        this.createAuthLink = this.createAuthLink.bind(this);
        this.handleCancelAddAuthLink = this.handleCancelAddAuthLink.bind(this);
        this.onShowSizeChange = this.onShowSizeChange.bind(this);
        this.state = {
            columns: [
                {
                    title: 'ID', dataIndex: 'Id', key: 'Id', width: 60, className: 'small_font',
                },
                {
                    title: '权限名称', dataIndex: 'name', key: 'name', width: 200, className: 'small_font',
                },
                {
                    title: '权限描述', dataIndex: 'description', key: 'description', className: "small_font "+{columnStyle},  width: 260,
                },
                {
                    title: '权限路径', dataIndex: 'urlPath', key: 'urlPath', className: "small_font "+{columnStyle},  width: 360,
                },
                {},
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 60,
                    align: 'center',
                    className: 'small_font',
                    render: (text, record) => {
                        return (
                            <div>
                                <Popconfirm
                                    title="确定删除该项内容吗?"
                                    onConfirm={this.confirmDeleteAuthLink.bind(this, record)}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button type="danger" size="small">删除</Button>
                                </Popconfirm>
                            </div>
                        )
                    },
                },
            ],
            tableData: [],
            tableLoading: false,
            authLinkModalVisible: false,
            current_data_id: null,
            pagination: {
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '100'],
                onShowSizeChange: this.onShowSizeChange,
                showQuickJumper: false,
                showTotal: (total) => `共 ${total} 条`,
                pageSize: 10,
                page: 1,
                total: 0,
                onChange: (current) => this.changePage(current),
            },
        }
    }

    onShowSizeChange(current, size){
        this.setState({
            pagination: {
                ...this.state.pagination,
                page: 1,
                current: 1,
                pageSize: size,
            }
        }, ()=>{
            this.refreshTableData();
        });
    }

    confirmDeleteAuthLink = (e) => {
        deleteAuthLink({
            "id": e.Id
        }).then((res)=>{
            if(res.code === 0){
                message.success("删除成功");
                this.refreshTableData();
            } else {
                message.error(res.msg);
            }
        }).catch((err)=>{
            message.error(err.toLocaleString());
        })
    };

    changePage = (e) => {
        this.setState({
            pagination: {
                ...this.state.pagination,
                page: e,
                current: e
            }
        }, ()=>{
            this.refreshTableData();
        });
    };

    refreshTableData = () => {
        this.setState({tableLoading: true});
        getPermissionsList(this.state.pagination.page, this.state.pagination.pageSize).then((res)=>{
            const pagination = this.state.pagination;
            pagination.total = parseInt(res.data.total);
            pagination.page = parseInt(res.data.page);
            pagination.showTotal(parseInt(res.data.total));
            this.setState({
                pagination
            });
            let data = res['data']['permissions'];
            let tableData = [];
            for (let i = 0; i < data.length; i++) {
                tableData.push({
                    Id: data[i]['Id'],
                    name: data[i]['name'],
                    description: data[i]['description'],
                    urlPath: data[i]['urlPath'],
                });
            }
            this.setState({tableData: tableData, tableLoading: false});
        }).catch((err)=>{
            console.log(err)
        });
    };

    componentDidMount() {
        this.refreshTableData();
    }

    createAuthLink() {
        this.setState({
            authLinkModalVisible: true
        })
    }

    handleCancelAddAuthLink() {
        this.setState({
            authLinkModalVisible: false
        })
    }

    render() {
        return (
            <Content style={{
                background: '#fff', padding: 20, margin: 0, height: "100%",
            }}>
                <OpsBreadcrumbPath pathData={["权限管理", "链接权限", "权限链接列表"]} />
                <div style={{ padding: "0px 0px 10px 0px" }}>
                    <Row>
                        <Col>
                            <Button type="primary" onClick={this.createAuthLink}>新建权限链接</Button>
                        </Col>
                    </Row>
                </div>
                <AuthLinkModal
                    authLinkModalVisible={this.state.authLinkModalVisible}
                    refreshTableData={this.refreshTableData}
                    hideModal={()=>{this.setState({authLinkModalVisible: false})}}
                    handleCancelAddAuthLink={this.handleCancelAddAuthLink}
                />
                <Table columns={this.state.columns} dataSource={this.state.tableData} scroll={{ x: 'max-content' }} pagination={this.state.pagination} loading={this.state.tableLoading} rowClassName="fixedHeight" size="small"/>
            </Content>
        );
    }
}

PermissionsManager = Form.create({ name: 'permissionsManager' })(PermissionsManager);

export default PermissionsManager;
