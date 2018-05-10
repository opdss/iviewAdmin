<style lang="less">
    @import '../../styles/common.less';
    @import '../../components/tables/table.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="ios-keypad"></Icon>
                角色管理
            </p>
            <Button type="primary" slot="extra" @click="showCreateNewColumn = true">添加角色</Button>
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
            <br/>
            <Button type="primary" @click="showCreateNewColumn = true">添加</Button>
        </Card>
        <Modal :width="600" v-model="showCreateNewColumn" title="添加角色" :loading="loading" @on-ok="handleCreate('newCloumn')">
            <Row>
                <Col span="24">
                <Form ref="newCloumn" :model="newCloumn" :rules="ruleValidate" :label-width="80">
                    <FormItem label="角色名称" prop="title">
                        <Input v-model="newCloumn.title"></Input>
                    </FormItem>
                    <FormItem label="角色简介" prop="description"  :required="true">
                        <Input v-model="newCloumn.description"></Input>
                    </FormItem>
                    <Form-item label="选择权限">
                        <Permission ref="permission" :paramOpts="{uid:1}"></Permission>
                    </Form-item>
                </Form>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
    import canEditTable from '../../components/tables/canEditTable.vue'
    import Util from '@/libs/util'
    import Permission from './permission.vue'

    export default {
        components: {
            canEditTable,
            Permission
        },
        data() {

            return {
                tableColumns: [
                    {
                        title: 'RID',
                        width: 80,
                        key: 'rid',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '角色名称',
                        align: 'center',
                        key: 'title',
                        width: 300,
                        sortable: true,
                        editable: true
                    },
                    {
                        title: '简介说明',
                        align: 'center',
                        key: 'description',
                        editable: true
                    },
                    /*{
                        title: '所有权限',
                        align: 'center',
                        key: 'permissions',
                    },*/
                    {
                        title: '最后更新时间',
                        align: 'center',
                        key: 'updated_at',
                        sortable: true
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'handle',
                        handle: ['edit', 'delete']
                    }
                ],
                ruleValidate: {
                    title: [
                        {required: true, message: '名称不能为空！', trigger: 'blur'}
                    ]
                },
                tableData: [],
                //添加的数据
                newCloumn: {
                    'title': '',
                    'description': '',
                },
                showCreateNewColumn: false,
                loading: true
            }
        },
        methods: {
            getData() {
                Util.ajax.get('/system/role').then((res) => {
                    this.tableData = res.data.data
                    /*if (data.permission) {
                        data.permission.split(',');
                    }*/
                })
            },
            handleDelete(val, index, data) {
                let id = data.rid;
                Util.ajax.delete('/system/role/' + id).then((res) => {
                    if (res.data.errCode == 0) {
                        this.$Message.success('成功删除了ID:' + id + '的数据')
                    }
                })
            },
            handleCellChange(val, index, key) {
                let _data = {};
                _data[key] = val[index][key];
                let id = val[index].rid;
                Util.ajax.put('/system/role/' + id, {data: _data}).then((res) => {
                    if (res.data.errCode == 0) {
                        this.$Message.success('成功修改了ID:' + id + '的数据')
                    }
                })
                console.log(val, index, key, val[index])
            },
            handleChange(val, index) {
                let id = val[index].rid;
                Util.ajax.put('/system/role/' + id, {data: val[index]}).then((res) => {
                    if (res.data.errCode == 0) {
                        this.$Message.success('成功修改了ID:' + id + '的数据')
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
                    var perms = this.$refs['permission'].getPermValue();
                    this.newCloumn.permissions = perms.join(',');
                    Util.ajax.post('/system/role', this.newCloumn).then((res)=>{
                        if (res.data.errCode == 0) {
                            this.$Message.success('添加配置成功！');
                            this.$refs[name].resetFields();
                            this.tableData.push(res.data.data);
                            this.showCreateNewColumn = false;
                        }
                    })
                })
            }
        },
        created() {
            this.getData()
        }
    }
</script>
