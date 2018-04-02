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
                                            refs="table4"
                                            v-model="editInlineAndCellData"
                                            @on-cell-change="handleCellChange"
                                            @on-change="handleChange"
                                            :editIncell="true"
                                            :columns-list="editInlineAndCellColumn"
                                        ></can-edit-table>
                                    </div>
                            </Row>
                        </Card>
                    </Col>
                </Row>
    </div>
</template>

<script>
import canEditTable from '../../components/tables/canEditTable.vue';

export default {
    name: 'editable-table',
    components: {
        canEditTable
    },
    data () {
        return {
            editInlineAndCellColumn: [
                                         {
                                             title: '序号',
                                             type: 'index',
                                             width: 80,
                                             align: 'center'
                                         },
                                         {
                                             title: '姓名',
                                             align: 'center',
                                             key: 'name',
                                             width: 300,
                                             editable: true
                                         },
                                         {
                                             title: '性别',
                                             align: 'center',
                                             key: 'sex'
                                         },
                                         {
                                             title: '岗位',
                                             align: 'center',
                                             width: 300,
                                             key: 'work',
                                             editable: true
                                         },
                                         {
                                             title: '操作',
                                             align: 'center',
                                             width: 200,
                                             key: 'handle',
                                             handle: ['edit', 'delete']
                                         }
                                     ],
            editInlineAndCellData: [
                                       {
                                           name: 'Aresn',
                                           sex: '男',
                                           work: '前端开发'
                                       },
                                       {
                                           name: 'Lison',
                                           sex: '男',
                                           work: '前端开发'
                                       },
                                       {
                                           name: 'lisa',
                                           sex: '女',
                                           work: '程序员鼓励师'
                                       }
                                   ],
            showCurrentColumns: [],
            showCurrentTableData: false
        };
    },
    methods: {
        getData () {
            this.editInlineAndCellColumn = tableData.editInlineAndCellColumn;
            this.showCurrentColumns = tableData.showCurrentColumns;
        },
        handleNetConnect (state) {
            this.breakConnect = state;
        },
        handleLowSpeed (state) {
            this.lowNetSpeed = state;
        },
        getCurrentData () {
            this.showCurrentTableData = true;
        },
        handleDel (val, index) {
            this.$Message.success('删除了第' + (index + 1) + '行数据');
        },
        handleCellChange (val, index, key) {
            this.$Message.success('修改了第 ' + (index + 1) + ' 行列名为 ' + key + ' 的数据');
        },
        handleChange (val, index) {
            this.$Message.success('修改了第' + (index + 1) + '行数据');
        }
    },
    created () {
        this.getData();
    }
};
</script>
