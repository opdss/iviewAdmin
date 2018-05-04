import Cookies from 'js-cookie';

const user = {
    state: {},
    mutations: {
        logout (state, vm) {
            Cookies.remove('user');
            Cookies.remove('access');
            Cookies.remove('Authorization');
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        },
        login (state, data) {
            console.log('store.login');
            console.log(data)
            Cookies.set('Authorization', data.Authorization)
            Cookies.set('user', data.user.username)
            Cookies.set('permissions', data.user.permissions.toString())
            localStorage.permissions = data.user.permissions.toString();
        }
    }
};

export default user;
