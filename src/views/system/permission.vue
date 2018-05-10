<template>
    <div class="padding-left-20">
        <My-tree ref="tree" :data="treeData" show-checkbox multiple></My-tree>
        <!--<Button @click="getValue">获取数据</Button>-->
    </div>
</template>

<script>
    import MyTree from '../../components/myTree'
    import Util from '@/libs/util'

    export default {
        name : 'permission',
        components: { MyTree },
        props : {
            permOpts : {
                type : Object,
                default(){
                    return {};
                }
            }
        },
        data () {
            return {
                treeData: [],
                params : {}
            }
        },
        methods: {
            getData () {
                Util.ajax.get('/system/permission', {params:this.params}).then((res) => {
                    let data = this.genCheckBox(res.data.data.permissions);
                    //console.log(this.genCheckBox(this.allPermissions));
                    if (data.length>0) {
                        this.treeData = [{
                                'title':'全选',
                            expand: true,
                            selected: true,
                                'children':data
                            }]
                    }
                    console.log((this.treeData));
                })
            },
            genCheckBox(cbs){
                var ret = [];
                if (this.type(cbs) == 'object') {
                    for (var key in cbs) {
                        let obj = {'title':key, "expand":true, 'children' : []};
                        obj['children'] = this.genCheckBox(cbs[key]);
                        ret.push(obj);
                    }
                } else {
                    for(var i=0,l=cbs.length;i<l;i++){
                        let obj = {'title':cbs[i].name, "expand":true, 'id':cbs[i].pid, 'checked':cbs[i].has?cbs[i].has:false};
                        ret.push(obj)
                    }
                }
                return ret;
            },
            getPermValue(){
                var arr = this.$refs['tree'].getCheckedNodes();
                var perm = [];
                for(var k in arr) {
                    if (arr[k]['id']) {
                        perm.push(arr[k]['id'])
                    }
                }
                return perm;
            },
            getValue(){
                console.log(this.getPermValue());
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
        watch : {
            permOpts() {
                if (this.permOpts) {
                    this.params = this.permOpts;
                    this.getData();
                }
            },
        },
        created(){
            this.getData();
        }
    }
</script>