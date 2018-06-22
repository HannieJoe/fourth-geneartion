# fourth-generation

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
### 本地项目上传到GitHub:
1. git上创建仓库
2. 打开git bash,输入ssh-keygen -t rsa -C "email",生成公钥与私钥
3. c/administrator/.ssh 下文件 id_rsa(私钥) id_rsa.pub(公钥)
4. 进入github->settings->ssh and GPG keys 添加公钥
5. 在git bash,用ssh -T git@github.com测试是否连接成功
6. 在git bash, git init
7. 在git bash,git add .
8. 在git bash,git commit -m "msg"
9. 在git bash,git remote add origin git@github.com:HannieJoe/fourth-geneartion.git
10. 在git bash,git push -u origin master



For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
