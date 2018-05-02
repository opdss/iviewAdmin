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
                        单元行和单元格两种方式编辑(始终显示编辑单元格按钮)
                    </p>
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
            width: 80,
            key: 'uid',
            align: 'center'
          },
          {
            title: 'username',
            align: 'center',
            key: 'username',
            width: 300
          },
          {
            title: 'email',
            align: 'center',
            key: 'email',
            editable: true
          },
          {
            title: 'mobile',
            align: 'center',
            key: 'mobile',
            editable: true
          },
          {
            title: 'avatar',
            align: 'center',
            key: 'avatar',
            render: (h, params) => {
              return h('Img', {
                props : {
                  class : params.row.avatar
                }
              })
            }
          },
          {
            title: 'role',
            align: 'center',
            key: 'role'
          },
          {
            title: 'role',
            align: 'center',
            key: 'handle',
            handle: ['edit', 'delete']
          }
        ],
        tableData: [],
        showCurrentColumns: [],
        showCurrentTableData: false
      }
    },
    methods: {
      getData () {
        Util.ajax.get('/system/user').then((res) => {
          this.tableData = res.data.data
        })
      },
      handleNetConnect (state) {
        this.breakConnect = state
      },
      handleLowSpeed (state) {
        this.lowNetSpeed = state
      },
      getCurrentData () {
        this.showCurrentTableData = true
      },
      handleDelete (val, index) {
        Util.ajax.delete('/system/user/'+val[index].uid).then((res) => {
          if (res.data.errCode == 0) {
            this.$Message.success('成功删除了第' + (index + 1) + '行数据')
          } else {
            this.$Message.error('删除失败！')
          }
        })
      },
      handleCellChange (val, index, key) {
        let _data = {};
        _data[key] = val[index][key];
        Util.ajax.put('/system/user/'+val[index].uid, {data:_data}).then((res) => {
          if (res.data.errCode == 0) {
            this.$Message.success('成功修改了第' + (index + 1) + '行数据')
          } else {
            this.$Message.error('删除失败！')
          }
        })
        console.log(val, index, key)
        this.$Message.success('修改了第 ' + (index + 1) + ' 行列名为 ' + key + ' 的数据')
      },
      handleChange (val, index) {
        Util.ajax.put('/system/user/'+val[index].uid, {data:val[index]}).then((res) => {
          if (res.data.errCode == 0) {
            this.$Message.success('成功修改了第' + (index + 1) + '行数据')
          } else {
            this.$Message.error('修改失败！')
          }
        })
      }
    },
    created () {
      this.getData()
    }
  }
</script>
