import axios from 'axios';
import Constant from '../components/Constant';
import { getUserInfoFromToken } from '../tokenutil';

let BASEURL = Constant.BASEURL;

export default {

    [Constant.SEARCH_CONTACT] : (store, payload)=> {   //Constant.BASE_URL + payload.name)
        axios.get('http://localhost:8080/api/opmanager/user/ajax-list?searchKeyword=' + payload.searchKeyword + '&searchType=' + payload.searchType)
            .then((response)=> {
                store.commit(Constant.SEARCH_CONTACT, { contacts: response.data })
            })
    },

    [Constant.LOGIN] : (store, payload) => {
        let { loginId, password } = payload;
        axios.post(`${BASEURL}/api/user/login`, { loginId, password })
            .then((token)=> {
               // if (response.data.status === "success") {

                    window.localStorage.setItem("token", token);    //컨트롤러에서 200뜸
                    console.log("로그인액션=============="+token);

                   const userInfo = getUserInfoFromToken();
                   store.commit(Constant.SET_USER_INFO, { token, userInfo })
                    //commit : 변이를 수행한다. 페이로드값을 매개변수로. state에 저장한다.
                       // payload.callback(token);
                // } else {
                //     payload.callback(response.data);
                // }
            })
            .catch((error)=>{
                payload.callback({ status:"fail", message:"로그인 실패222 : " + error});
            })
    },
    [Constant.SET_USER_INFO] : (store, payload)=> {
        store.commit(Constant.SET_USER_INFO, { token: payload.token, userInfo: payload.userInfo })
    },

    [Constant.CREATE_USER] : (store, payload) => {
        let { id, password, username } = payload;
        axios.post(`${BASEURL}/api/user/create`, {
            id, password, username
        })
            .then((response)=> {
                payload.callback(response.data);
            })
            .catch((error)=> {
                console.log("## 사용자 생성 실패 : " + error);
                payload.callback({ message: "사용자 계정 생성 실패", status:"fail" });
            })
    },
    [Constant.LOAD_TODOLIST] : (store)=> {
        axios.get(`${BASEURL}/api/opmanager/user/ajax-list`, {
            headers: { Authorization: "Bearer " + store.state.token }
        })
            .then((response)=>{
                console.log("리스트 데이터 받아오는중");
                console.log(response.data.content[0]);    //받아와진다.
                store.commit(Constant.LOAD_TODOLIST, { todolist: response.data.content });
                //commit : 변이를 수행한다. 페이로드값을 매개변수로. state에 불러온 리스트 데이터를 저장한다.
            })
            .catch((error)=> {
                console.log("## 에러 : ", error);
            })
    },

    [Constant.ADD_TODO] : (store, payload) => {
        let { todo, desc } = payload.todoitem;
        store.commit(Constant.CHANG_ISLOADING, { isloading: true })
        axios.post(`${BASEURL}/api/opmanager/user/create`, { todo, desc }, {
            headers: { Authorization: "Bearer " + store.state.token }
        })
            .then((response)=>{
                if (response.data.status === "success") {
                    payload.todoitem.id = response.data.todo.id;
                    store.commit(Constant.ADD_TODO, payload);
                } else {
                    console.log("할일 추가 실패 : ", response.data.message);
                }
                store.commit(Constant.CHANG_ISLOADING, { isloading: false })
            })
            .catch((error)=>{
                console.log("할일 추가 실패 : ", error);
                store.commit(Constant.CHANG_ISLOADING, { isloading: false })
            })
    },
    [Constant.DELETE_TODO] : (store, payload) => {
        store.commit(Constant.CHANG_ISLOADING, { isloading: true })
        axios.post('http://localhost:8080/api/opmanager/user/delete/' + payload.id , {
            headers: { Authorization: "Bearer " + store.state.token }
        })
            .then((response)=>{
              //  if (response.data.status === "success") {
                    store.commit(Constant.DELETE_TODO, payload);
                console.log("할일 삭제: ", response.data.message);
                store.commit(Constant.CHANG_ISLOADING, { isloading: false })
                // } else {
                //     console.log("할일 삭제 실패 : ", response.data.message);
                // }
            })
            .catch((error)=>{
                console.log("===액션 할일 삭제 실패 : ", error);
               store.commit(Constant.CHANG_ISLOADING, { isloading: false })
            })
    },
    [Constant.UPDATE_TODO] : (store, payload) => {
        store.commit(Constant.CHANG_ISLOADING, { isloading: true })
        let { id, todo, desc, done } = payload.todoitem;
        axios.put(`${BASEURL}/api/opmanager/user/edit/${id}`, { todo, desc, done }, {
            headers: { Authorization: "Bearer " + store.state.token }
        })
            .then((response)=>{
                if (response.data.status === "success") {
                    store.commit(Constant.UPDATE_TODO, payload);
                } else {
                    console.log("할일 완료 변경 실패 : ", response.data.message);
                }
                store.commit(Constant.CHANG_ISLOADING, { isloading: false })
            })
            .catch((error)=>{
                console.log("할일 완료 변경 실패 : ", error);
                store.commit(Constant.CHANG_ISLOADING, { isloading: false })
            })
    },
    [Constant.INITIALIZE_TODOITEM] : (store, payload) => {
        store.commit(Constant.INITIALIZE_TODOITEM, payload);
    },

    [Constant.EDIT_DETAIL] : (store) => {
        store.commit(Constant.CHANG_ISLOADING, { isloading: false })

        axios.get(`http://localhost:8080/api/user/edit-detail`, {
            //headers: { Authorization: "Bearer" + store.state.token }
        })
            .then((response)=>{
                store.commit(Constant.EDIT_DETAIL , { userDetail: response});
                store.commit(Constant.CHANG_ISLOADING, { isloading: false })
                console.log(response);
            })
            .catch((error)=>{
                console.log("=======수정 정보 불러오기 실패 : ", error);
                store.commit(Constant.CHANG_ISLOADING, { isloading: false })
            })
    }

}
