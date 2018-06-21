import axios from "axios";
import { Message } from "element-ui";

axios.defaults.baseURL = "/api/";
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

const $promise = (url, params) => {
    return new Promise((reslove, reject) => {
        axios
            .post(url, params)
            .then(res => {
                reslove(res.data);
            })
            .catch(error => {
                if (error.response) {
                    Message({
                        message: "服务器连接错误" + error.response,
                        type: "error"
                    });
                }
                reject(error);
            });
    });
};
export default {
    $promise
};
