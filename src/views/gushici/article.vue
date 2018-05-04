
<template>

                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        诗词列表
                    </p>
                    <Row :gutter="10">
                        <i-table :content="self" border :columns="columns" :data="tableData"></i-table>
                    </Row>
                    <br/>
                    <Row type="flex" justify="end">
                        <Page :total="dataTotal" @on-change="setPage" @on-page-size-change="setPageSize" show-elevator show-sizer></Page>
                    </Row>
                </Card>
</template>
<script>
    import Util from '@/libs/util'

    export default {
        data () {
            return {
                self : this,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'title',
                        key: 'title'
                    },
                    {
                        title: 'content',
                        key: 'content',
                        render (row, column, index) {
                            return `<i-button type="primary" size="small" @click="show(${index})">查看</i-button> <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;
                        }
                    },
                    {
                        title: 'dynasty',
                        key: 'dynasty'
                    },
                    {
                        title: 'author_name',
                        key: 'author_name'
                    },
                     {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render (row, column, index) {
                            return column.row.content.substr(0, 12);
                        }
                       }
                ],
                tableData : [],
                dataTotal : 0,
                pageParams : {page:1, pageSize : 10}
            }
        },
        methods : {
            getData() {
                Util.ajax.get('/gushici/article', {params:this.pageParams}).then((res) => {
                    if (res.data.errCode == 0) {
                        this.tableData = res.data.data.records
                        this.dataTotal = res.data.data.pageInfo.totalCount
                    }
                })
            },
            setPage(page) {
                this.pageParams.page = page;
                this.getData();
            },
            setPageSize(pageSize) {
                this.pageParams.pageSize = pageSize;
                this.getData();
            }
        },
        created() {
            this.getData();
         }
    }
</script>
