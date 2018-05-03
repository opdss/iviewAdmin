<style lang="less">
    @import '../../styles/common.less';
    @import '../../components/tables/table.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="ios-keypad"></Icon>
                系统配置
            </p>
            <Button type="primary" slot="extra" @click="showCreateNewColumn = true">添加配置</Button>
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
        <Modal :width="600" v-model="showCreateNewColumn" title="添加配置" :loading="loading" @on-ok="handleCreate('newCloumn')">
            <Row>
                <Col span="24">
                <Form ref="newCloumn" :model="newCloumn" :rules="ruleValidate" :label-width="80">
                    <FormItem label="配置名称" prop="title">
                        <Input v-model="newCloumn.title"></Input>
                    </FormItem>
                    <FormItem label="键名" prop="key">
                        <Input v-model="newCloumn.key" placeholder="创建后不可修改"></Input>
                    </FormItem>
                    <FormItem label="键值" prop="val">
                        <Input v-model="newCloumn.val"></Input>
                    </FormItem>
                </Form>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
    import canEditTable from '../../components/tables/canEditTable.vue'
    import Util from '@/libs/util'

    export default {
        components: {
            canEditTable
        },
        data() {
            //远程校验是否存在key
            const validateKey = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('键名不能为空！'));
                }
                Util.ajax.get('/system/config?hasKey='+value).then(function (res) {
                    console.log(res.data.data);
                    if (res.data.data.status == 1) {
                        return callback(new Error('key:'+value+'已经存在！'));
                    }
                    return callback();
                })
            };

            return {
                tableColumns: [
                    {
                        title: 'ID',
                        width: 80,
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: '名称',
                        align: 'center',
                        key: 'title',
                        width: 300,
                        editable: true
                    },
                    {
                        title: '键名',
                        align: 'center',
                        key: 'key',
                    },
                    {
                        title: '键值',
                        align: 'center',
                        key: 'val',
                        editable: true
                    },
                    {
                        title: '最后更新时间',
                        align: 'center',
                        key: 'updated_at',
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
                    ],
                    key: [
                        {validator: validateKey, trigger: 'blur'}
                    ],
                },
                tableData: [],
                //添加的数据
                newCloumn: {
                    'key': '',
                    'val': '',
                    'title': ''
                },
                showCreateNewColumn: false,
                loading: true
            }
        },
        methods: {
            getData() {
                console.log(this.$route.title);
                Util.ajax.get('/system/config').then((res) => {
                    this.tableData = res.data.data
                })
            },
            handleDelete(val, index, data) {
                let id = data.id;
                Util.ajax.delete('/system/config/' + id).then((res) => {
                    if (res.data.errCode == 0) {
                        this.$Message.success('成功删除了ID:' + id + '的数据')
                    }
                })
            },
            handleCellChange(val, index, key) {
                let _data = {};
                _data[key] = val[index][key];
                let id = val[index].id;
                Util.ajax.put('/system/config/' + id, {data: _data}).then((res) => {
                    if (res.data.errCode == 0) {
                        this.$Message.success('成功修改了ID:' + id + '的数据')
                    }
                })
                console.log(val, index, key, val[index])
            },
            handleChange(val, index) {
                let id = val[index].id;
                Util.ajax.put('/system/config/' + id, {data: val[index]}).then((res) => {
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
                    Util.ajax.post('/system/config', this.newCloumn).then((res)=>{
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
