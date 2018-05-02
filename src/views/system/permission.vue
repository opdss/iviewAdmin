<style lang="less">
    @import '../../styles/common.less';
</style>

<template>

    <div class="access">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="android-contact"></Icon>
                        选择权限
                    </p>
                    <div>
                        <div>
                            <Checkbox>全选</Checkbox>
                            <div style="padding-left:40px;margin-top:10px">
                                <CheckboxGroup v-model="checkAllGroup">
                                    <Checkbox label="香蕉"></Checkbox>
                                    <Checkbox label="苹果"></Checkbox>
                                    <Checkbox label="西瓜"></Checkbox>
                                    <div>
                                        <Checkbox>系统</Checkbox>
                                        <div style="padding-left:40px;margin-top:10px">
                                            <CheckboxGroup v-model="checkAllGroup">
                                                <Checkbox label="香蕉"></Checkbox>
                                                <Checkbox label="苹果"></Checkbox>
                                                <Checkbox label="西瓜"></Checkbox>
                                                <div>
                                                    <Checkbox>系统</Checkbox>
                                                    <div style="padding-left:40px;margin-top:10px">
                                                        <CheckboxGroup v-model="checkAllGroup">
                                                            <Checkbox label="香蕉"></Checkbox>
                                                            <Checkbox label="苹果"></Checkbox>
                                                            <Checkbox label="西瓜"></Checkbox>
                                                        </CheckboxGroup>
                                                    </div>
                                                </div>
                                            </CheckboxGroup>
                                        </div>
                                    </div>
                                    <div>
                                                                            <Checkbox>测试</Checkbox>
                                                                            <div style="padding-left:40px;margin-top:10px">
                                                                                <CheckboxGroup v-model="checkAllGroup">
                                                                                    <Checkbox label="香蕉"></Checkbox>
                                                                                    <Checkbox label="苹果"></Checkbox>
                                                                                    <Checkbox label="西瓜"></Checkbox>
                                                                                    <div>
                                                                                        <Checkbox>系统</Checkbox>
                                                                                        <div style="padding-left:40px;margin-top:10px">
                                                                                            <CheckboxGroup v-model="checkAllGroup">
                                                                                                <Checkbox label="香蕉"></Checkbox>
                                                                                                <Checkbox label="苹果"></Checkbox>
                                                                                                <Checkbox label="西瓜"></Checkbox>
                                                                                            </CheckboxGroup>
                                                                                        </div>
                                                                                    </div>
                                                                                </CheckboxGroup>
                                                                            </div>
                                                                        </div>
                                </CheckboxGroup>
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
            data () {
                return {
                    indeterminate: true,
                    checkAll: false,
                    checkAllGroup: ['香蕉', '西瓜'],
                    allPermissions : []
                }
            },
            methods: {
              getData () {
                Util.ajax.get('/system/permission').then((res) => {
                  this.allPermissions = res.data.data
                })
              },
            }
        }
</script>
