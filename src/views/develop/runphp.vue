<style lang="less" scoped>
    .code-pre{
        white-space: pre-wrap;
        word-wrap: break-word;
        /*height: auto;
        border: 1px solid #ddd;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        padding: 10px;
        font: inherit;*/
    }
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="ios-keypad"></Icon>
                PHP代码在线运行 (此功能慎用！未做安全防护与过滤！)
            </p>
            <p slot="extra"></p>
            <Row>
                <codemirror v-model="code" :options="cmOptions"></codemirror>
            </Row>
            <br/>
            <div><Button type="primary" @click="run">执行</Button>&nbsp;&nbsp;运行时间：{{result.runTime}}</div>
            <br/>
            <Alert :type="result.type" v-if="result.type!='success'">{{result.result}}</Alert>
            <div  v-if="result.type=='success'">
                <pre class="code-pre">{{result.result}}</pre>
            </div>
        </Card>
        <!--<Card>
            <p slot="title">运行结果</p>
            <p href="#" slot="extra">运行时间：{{result.runTime}}</p>
            <Row>
                <pre class="code-pre">{{result.result}}</pre>
            </Row>
        </Card>-->
    </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/php/php.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/base16-light.css'
import Util from '@/libs/util'

export default {
        components: {
            codemirror
        },
        data() {
            return {
                code: "//p($var)打印变量 f($file)读取文件 ls($dir)文件列表\r\n p('test', 3232, [1,3,4], (new stdClass()));",
                cmOptions: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'text/javascript',
                    theme: 'base16-light',
                    lineNumbers: true,
                    line: true,
                    // more codemirror options, 更多 codemirror 的高级配置...
                },
                result:{type:'success', result:'', runTime:0},
            }
        },
        methods: {
            run(){
                console.log(this.code);
                Util.ajax.post('/develop/runphp', {code:this.code}).then((res)=>{
                    this.result = res.data.data;
                    //this.$Notice[res.data.data.type]({'title':'代码执行结果','desc':res.data.data.result,'duration':10});
                })
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
