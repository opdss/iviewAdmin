<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="username">
                            <Input v-model="form.username" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">忘记密码请联系管理员</p>
                </div>
            </Card>
        </div>
    </div>
</template>


<script>
    import Cookies from 'js-cookie'
    import Util from '@/libs/util'

    export default {
        data() {
            return {
                form: {
                    username: 'wuxin',
                    password: ''
                },
                rules: {
                    userName: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        Util.ajax.post('/signin', this.form).then((res) => {
                            //res 为成功回调的响应
                            console.log(res)
                            if (res.data.errCode == 0) {
                                let data = res.data.data;
                                Util.ajax.defaults.headers.common['Authorization'] = data.Authorization;
                                this.$store.commit('login', data)
                                this.$store.commit('setAvator', data.user.avatar)
                                this.$router.push({
                                    name: 'home_index'
                                })
                            }
                        })
                    } else {
                        this.$Message.error('请检查用户名或者密码在提交！');
                    }
                })
            }
        }
    }
</script>

<style>

</style>
