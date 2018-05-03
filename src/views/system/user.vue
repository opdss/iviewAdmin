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
        <Modal :width="600" v-model="showCreateNewColumn" title="添加管理员" :loading="loading" @on-ok="handleCreate('newCloumn')">
            <Row>
                <Col span="24">
                <Form ref="newCloumn" :model="newCloumn"  :label-width="80">
                    <FormItem label="用户名" prop="username">
                        <Input v-model="newCloumn.username"></Input>
                    </FormItem>
                    <FormItem label="密码" prop="password">
                        <Input v-model="newCloumn.password"></Input>
                    </FormItem>
                    <FormItem label="重复密码" prop="repassword">
                        <Input v-model="newCloumn.repassword"></Input>
                    </FormItem>

                    <FormItem label="电子邮箱" prop="email">
                        <Input v-model="newCloumn.email"></Input>
                    </FormItem>
                    <FormItem label="手机号码" prop="mobile">
                        <Input v-model="newCloumn.mobile"></Input>
                    </FormItem>
                    <Form-item label="状态">
                                <Radio-group :model.sync="newCloumn.status">
                                    <Radio value="1">正常</Radio>
                                    <Radio value="0">禁用</Radio>
                                </Radio-group>
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

  export default {
    name: 'editable-table',
    components: {
      canEditTable
    },
    data () {
      return {
        tableColumns: [
          {
            title: 'UID',
            key: 'uid',
            align: 'center'
          },
          {
            title: '头像',
            align: 'center',
            key: 'avatar',
            render: (h, params) => {
              return h('Avatar', {
                props : {
                  src : params.row.avatar
                }
              })
            }
          },
          {
            title: '用户名',
            align: 'center',
            key: 'username',
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
            key: 'last_login_time'
          },
          {
            title: '操作',
            align: 'center',
            key: 'handle',
            handle: ['edit', 'delete']
          }
        ],
        tableData: [],
        newCloumn : {
            'username' : '',
            'status' : '1'
        },
        showCreateNewColumn: false,
        loading: true
      }
    },
    methods: {
      getData () {
        Util.ajax.get('/system/user').then((res) => {
          this.tableData = res.data.data
        })
      },
      handleDelete (val, index, current) {
        Util.ajax.delete('/system/user/'+current.uid).then((res) => {
          if (res.data.errCode == 0) {
            this.$Message.success('成功删除了UID:' + current.uid + '的数据')
          }
        })
      },
      handleCellChange (val, index, key) {
        let _data = {};
        let uid = val[index].uid;
        _data[key] = val[index][key];
        Util.ajax.put('/system/user/'+uid, {data:_data}).then((res) => {
          if (res.data.errCode == 0) {
            this.$Message.success('成功修改了UID:' + uid + '的数据')
          }
        })
      },
      handleChange (val, index) {
        let uid = val[index].uid;
        Util.ajax.put('/system/user/'+uid, {data:val[index]}).then((res) => {
          if (res.data.errCode == 0) {
            this.$Message.success('成功修改了UID:' + uid + '的数据')
          }
        })
      }
    },
    handleCreate (name) {
    },
    created () {
      this.getData()
    }
  }
</script>
