<template>
    <div>
        <div v-if="!isEmpty">
            <Checkbox
                    :indeterminate="roleMap.indeterminate"
                    :value="true"
                    @click.prevent.native="handleCheckAll">{{title}}

            </Checkbox>
            <div style="padding-left:24px;margin-top:6px">
                <!--<CheckboxGroup>-->
                <CheckboxGroup v-model="roleMap.data" @on-change="checkAllGroupChange">
                    <template v-if="isArray" v-for="(_item, index) in initItems">
                        <Checkbox :label="_item.pid">{{_item.name}}</Checkbox>
                    </template>
                    <perm-ckb
                            v-if="!isArray"
                            v-for="(_item, name) in initItems"
                            :itemsName="name"
                            :items="_item"
                            :key="name"
                    ></perm-ckb>
                </CheckboxGroup>
            </div>
        </div>
        <div v-if="isEmpty">啥也没有！</div>
    </div>
</template>
<script>
    export default {
        name: 'permCkb',
        props: {
            itemsName: {
                type: String
            },
            items: {
                default() {
                    return {};
                }
            },
        },
        data() {
            return {
                initItems: {}, //处理后数据数组
                title: this.itemsName || '全部', //处理后数据数组
                allperms: [],
                //role map
                roleMap : {}
            }
        },
        computed: {
            isEmpty() {
                if (this.type(this.initItems) == 'array') {
                    return this.initItems.length == 0;
                } else {
                    return JSON.stringify(this.initItems) == "{}"
                }
            },
            isArray() {
                return this.type(this.initItems) == 'array';
            }
        },
        watch: {
            items() {
                if (this.items) {
                    this.initItems = this.items;
                }
            },
        },
        mounted() {
        },
        methods: {
            handleCheckAll() {
                console.log(444);
                console.log(3);
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.checkAllGroup = ['香蕉', '苹果', '西瓜'];
                } else {
                    this.checkAllGroup = [];
                }
            },
            checkAllGroupChange(data) {
                console.log(2222);
                console.log(data);
                if (data.length === 3) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },
            genCheckBox(cbs){
                if (this.type(cbs) == 'object') {
                    var ret = {
                        'indeterminate' : false,
                        'data' : this.getCkbData(cbs)
                    };
                    for (var key in cbs) {
                        let obj = {}
                        let tt = this.genCheckBox(cbs[key]);
                        obj['indeterminate'] = false;
                        if (this.type(tt) == 'object') {
                            for(var _k in tt) {
                                obj[_k] = tt[_k];
                            }
                        } else {
                            obj['data'] = tt;
                        }
                        ret[key] = obj;
                    }
                } else {
                    var ret = {
                        'indeterminate' : false,
                        'data' : this.getCkbData(cbs)
                    };
                }
                return ret;
            },
            getCkbData(cbs){
                var ret = []
                if (this.type(cbs) == 'object') {
                    for (var key in cbs) {
                        let tt = this.getCkbData(cbs[key]);
                        ret = ret.concat(tt)
                    }
                } else {
                    for(var i=0,l=cbs.length;i<l;i++){
                        ret.push(cbs[i].pid)
                    }
                }
                return ret;
            },
            type(obj) {
                var toString = Object.prototype.toString;
                var map = {
                    '[object Boolean]': 'boolean',
                    '[object Number]': 'number',
                    '[object String]': 'string',
                    '[object Function]': 'function',
                    '[object Array]': 'array',
                    '[object Date]': 'date',
                    '[object RegExp]': 'regExp',
                    '[object Undefined]': 'undefined',
                    '[object Null]': 'null',
                    '[object Object]': 'object'
                };
                return map[toString.call(obj)];
            }
        },
        created() {
            this.initItems = this.items;
            console.log(1111111111)
            console.log(this.title)
            console.log(this.items)
            this.roleMap = this.genCheckBox(this.initItems)
            console.log(this.roleMap)
        }
    }
</script>
<style>
</style>