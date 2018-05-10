<style lang="less">
    @import '../../styles/common.less';
    @import '../../components/tables/table.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="ios-keypad"></Icon>
                JS代码在线运行
            </p>
            <Row :gutter="10">
                <codemirror v-model="code" :options="cmOptions"></codemirror>
            </Row>
            <br/>
            <Button type="primary" @click="run">执行</Button>

        </Card>
    </div>
</template>

<script>// require component
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/base16-light.css'

export default {
        components: {
            codemirror
        },
        data() {
            return {
                code: "//可以使用p函数打印结果\r\nvar f1 = function(){return true;}\r\np(6)\r\np('test')\r\np([1,2,3])\r\np({a:2, b:f1})\r\np(null)\r\nvar t\r\np(t)\r\np(true)\r\np(new Date())\r\np(f1)\r\n",
                cmOptions: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'text/javascript',
                    theme: 'base16-light',
                    lineNumbers: true,
                    line: true,
                    // more codemirror options, 更多 codemirror 的高级配置...
                }
            }
        },
        methods: {
            run(){
                var _this = this;
                function p(msg, method, title){
                    console.log(msg);
                    method = method || 'info'
                    var type = _this.type(msg);
                    var title = title || '代码执行成功'
                    title += '  ('+type+')';
                    switch (type){
                        case "object":
                            msg = JSON.stringify(msg);
                            break;
                        case "array":
                            msg = JSON.stringify(msg);
                            break;
                        case "null":
                            msg = 'null';
                            break;
                        case "undefined":
                            msg = 'undefined';
                            break;
                        default:
                            msg = msg.toString();
                            break;
                    }
                    _this.$Notice[method]({'title':title,'desc':msg,'duration':10});
                }
                console.log(this.code);
                try {
                    var res = eval(this.code);
                    if (res) {
                        p(res, 'success', 'eval返回结果');
                    }
                } catch (exception) {
                    _this.$Notice.error({'title':'代码执行错误！','desc':exception,'duration':10});
                }
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
        }
    }
</script>
