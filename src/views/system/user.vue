<style lang="less">
    @import '../../styles/common.less';
    @import '../../components/tables/table.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title">
                    <Icon type="ios-keypad"></Icon>
                    管理员列表
                </p>
                <Button type="primary" slot="extra" @click="showCreateNewColumn = true">添加管理员</Button>
                <Row :gutter="10">
                    <div class="edittable-table-height-con">
                        <can-edit-table
                                refs="table"
                                v-model="tableData"
                                @on-cell-change="handleCellChange"
                                @on-change="handleChange"
                                @on-delete="handleDelete"
                                :editIncell="true"
                                :columns-list="tableColumns"
                        ></can-edit-table>
                    </div>
                </Row>
            </Card>
            </Col>
        </Row>
        <Modal :width="600" v-model="showCreateNewColumn" title="添加管理员" :loading="loading"
               @on-ok="handleCreate('newCloumn')">
            <Row>
                <Col span="24">
                <Form ref="newCloumn" :model="newCloumn" :rules="ruleValidate" :label-width="80">
                    <Row>
                        <Col span="16">
                        <FormItem label="用户名" prop="username" :required="true">
                            <Input v-model="newCloumn.username"></Input>
                        </FormItem>
                        <FormItem label="密码" prop="password" :required="true">
                            <Input v-model="newCloumn.password"></Input>
                        </FormItem>
                        <FormItem label="重复密码" prop="repassword" :required="true">
                            <Input v-model="newCloumn.repassword"></Input>
                        </FormItem>

                        <FormItem label="手机号码" prop="mobile">
                            <Input v-model="newCloumn.mobile"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <div class="margin-left-10">

                            <img :src="uploadAvatar" style="height: 160px;width: 160px;">

    <Button-group>
        <i-button type="ghost"><Upload ref="uploadAvatar"
                                                                       :show-upload-list="false"
                                                                       :headers="uploadHeaders"
                                                                       :on-success="uploadSuccess"
                                                                       :format="['jpg','jpeg','png','gif','bmp']"
                                                                       action="http://admin.api.1tools.net/upload/avatar"
                                                               >
                                                                   <p>上传头像</p>
                                                               </Upload></i-button>
        <i-button type="ghost" @click="uploadRemove">删除</i-button>
    </Button-group>
                            <!--<div>
                                <img v-if="uploadAvatar" :src="uploadAvatar" style="height: 160px;width: 160px;">
                                <div class="admin-upload-list-cover">
                                    <Upload ref="uploadAvatar"
                                            :headers="uploadHeaders"
                                            :on-success="uploadSuccess"
                                            :format="['jpg','jpeg','png','gif','bmp']"
                                            type="drag"
                                            action="http://admin.api.1tools.net/upload/avatar"
                                    >重新上传
                                    </Upload>
                                    <span @click="handleCreate()">删除</span>
                                </div>
                            </div>
                            <div  v-if="!uploadAvatar">
                            <Upload ref="uploadAvatar"
                                    :headers="uploadHeaders"
                                    :on-success="uploadSuccess"
                                    :format="['jpg','jpeg','png','gif','bmp']"
                                    type="drag"
                                    action="http://admin.api.1tools.net/upload/avatar"
                            >
                                <div style="padding: 20px;height: 160px;">
                                    <Icon type="ios-cloud-upload" size="64" style="color: #3399ff"></Icon>
                                    <p>上传头像<br/>点击或拖拽到这里</p>
                                </div>
                            </Upload>
                            </div>-->
                        </div>
                        </Col>

                    </Row>
                    <FormItem label="电子邮箱" prop="email">
                        <Input v-model="newCloumn.email"></Input>
                    </FormItem>
                    <Form-item label="状态">
                        <RadioGroup v-model="newCloumn.status">
                            <Radio label="1">正常</Radio>
                            <Radio label="0">禁用</Radio>
                        </RadioGroup>
                    </Form-item>
                    <Form-item label="角色">
                        <Select v-model="newCloumn.rid" style="width:200px">
                            <Option v-for="item in roleData" :value="item.rid" :key="item.title">{{ item.title }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="选择权限">
                        <Permission :paramOpts="{uid:1}"></Permission>
                    </Form-item>
                </Form>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
    import canEditTable from '../../components/tables/canEditTable.vue'
    import Permission from './permission.vue'
    import Util from '@/libs/util'
    import Cookies from 'js-cookie'

    export default {
        name: 'editable-table',
        components: {
            canEditTable,
            Permission
        },
        data() {

            //远程校验是否存在key
            const validateUsername = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户名不能为空！'));
                }
                Util.ajax.get('/system/user?hasUsername=' + value).then(function (res) {
                    if (res.data.data.status == 1) {
                        return callback(new Error('用户名:' + value + '已经存在！'));
                    }
                    return callback();
                })
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空！'));
                } else {
                    if (this.newCloumn.repassword !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.newCloumn.validateField('repassword');
                    }
                    callback();
                }
            };
            const validateRePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再输一遍密码！'));
                } else if (value !== this.newCloumn.password) {
                    callback(new Error('两次密码不一致！'));
                } else {
                    callback();
                }
            };
            return {
                tableColumns: [
                    {
                        title: 'UID',
                        key: 'uid',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '头像',
                        align: 'center',
                        key: 'avatar',
                        render: (h, params) => {
                            return h('Avatar', {
                                props: {
                                    src: params.row.avatar
                                }
                            })
                        }
                    },
                    {
                        title: '用户名',
                        align: 'center',
                        key: 'username',
                        sortable: true
                    },
                    {
                        title: '邮箱',
                        align: 'center',
                        key: 'email',
                        editable: true
                    },
                    {
                        title: '电话',
                        align: 'center',
                        key: 'mobile',
                        editable: true
                    },
                    {
                        title: '角色组',
                        align: 'center',
                        key: 'rid'
                    },
                    {
                        title: '最后登陆时间',
                        align: 'center',
                        key: 'last_login_time',
                        sortable: true
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'handle',
                        handle: ['edit', 'delete']
                    }
                ],
                tableData: [],
                roleData: [], //所有角色
                newCloumn: {
                    'username': '',
                    'status': '1'
                },
                showCreateNewColumn: false,
                loading: true,

                ruleValidate: {
                    avatar: [
                        //{required: true, message: '名称不能为空！', trigger: 'blur'}
                    ],
                    username: [
                        {validator: validateUsername, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    repassword: [
                        {validator: validateRePass, trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '邮箱不能为空！', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '手机不能为空！', trigger: 'blur'}
                    ],
                },
                uploadAvatar : '',
                uploadHeaders : {'Authorization':Cookies.get('Authorization')}
            }
        },
        methods: {
            getData() {
                Util.ajax.get('/system/user').then((res) => {
                    if (res.data.errCode == 0) {
                        this.tableData = res.data.data
                    }
                })
            },
            getRoleData() {
                Util.ajax.get('/system/role').then((res) => {
                    this.roleData = res.data.data;
                })
            },
            handleDelete(val, index, current) {
                Util.ajax.delete('/system/user/' + current.uid).then((res) => {
                    if (res.data.errCode == 0) {
                        this.$Message.success('成功删除了UID:' + current.uid + '的数据')
                    }
                })
            },
            handleCellChange(val, index, key) {
                let _data = {};
                let uid = val[index].uid;
                _data[key] = val[index][key];
                Util.ajax.put('/system/user/' + uid, {data: _data}).then((res) => {
                    if (res.data.errCode == 0) {
                        this.$Message.success('成功修改了UID:' + uid + '的数据')
                    }
                })
            },
            handleChange(val, index) {
                let uid = val[index].uid;
                Util.ajax.put('/system/user/' + uid, {data: val[index]}).then((res) => {
                    if (res.data.errCode == 0) {
                        this.$Message.success('成功修改了UID:' + uid + '的数据')
                    }
                })
            },
            handleCreate(name) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.showCreateNewColumn = false;
                        this.$Message.error('请修改成正确的表单在提交!');
                        return;
                    }
                    if (this.uploadAvatar) {
                        this.newCloumn.avatar = this.uploadAvatar;
                    }
                    Util.ajax.post('/system/user', this.newCloumn).then((res) => {
                        if (res.data.errCode == 0) {
                            this.$Message.success('添加管理员成功！');
                            this.$refs[name].resetFields();
                            this.tableData.push(res.data.data);
                            this.showCreateNewColumn = false;
                            this.uploadAvatar = '';
                            this.newCloumn.avatar = '';
                        }
                    })
                })
            },
            uploadSuccess(response, file, fileList) {
                if (response.errCode == 0) {
                    this.uploadAvatar = response.data.domain + response.data.path;
                } else {
                    this.$Message.error(response.errMsg ? response.errMsg : '上传失败！');
                }
            },
            uploadRemove() {
                this.uploadAvatar = '';
            }
        },
        created() {
            this.getData();
            this.getRoleData();
        }
    }
</script>
