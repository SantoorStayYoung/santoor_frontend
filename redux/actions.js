import {TOKEN_VAR_NAME} from '../config'
export const SET_WINDOW_PARAMS = "SET_WINDOW_PARAMS"
export const CHANGE_TAB_TO = "CHANGE_TAB_TO"
export const SHOW_AUTH = "SHOW_AUTH"
export const LOGIN = "LOGIN"
export const LOGOUT = "LOGOUT"
export const ATTEMPTING_LOGIN = "ATTEMPTING_LOGIN"
export const AUTH_UPDATE = "AUTH_UPDATE"
export const SHOW_FIXED_LOADER = "SHOW_FIXED_LOADER"
export const MENU_BTN_CLICK = "MENU_BTN_CLICK"
export const SHOW_MENU = "SHOW_MENU"
export const VOTE = "VOTE"
export function showFixedLoader(bool){
    return {
        type:SHOW_FIXED_LOADER,
        bool,
    }
}
export function authUpdate(obj){
    return {
        type:AUTH_UPDATE,
        obj
    }
}
export function setWindowParams(windowWidth,windowHeight){
    return {
        type:SET_WINDOW_PARAMS,
        windowWidth,
        windowHeight
    }
}
export function changeTabTo(tab){
    return {
        type:CHANGE_TAB_TO,
        tab
    }
}
export function showAuth(bool,tab){
    return {
        type:SHOW_AUTH,
        bool,
        tab
    }
}
export function menuBtnClick(){
    return {
        type:MENU_BTN_CLICK,
    }
}
export function showMenu(bool){
    return {
        type:SHOW_MENU,
    }
}
export function vote(videoid){
    return {
        type:VOTE,
        videoid
    }
}
export function login(isValidMobile,isValidEmail,token,email,phone,name){
    console.log(`setting token var name to ${token}`)
    localStorage.setItem(TOKEN_VAR_NAME,token)
    if(email)
    localStorage.setItem('rememberedEmail',email)
    return {
        type: LOGIN,
        isValidMobile,
        isValidEmail,
        token,
        email,
        phone,
        name
    }
}
export function logout(){
    localStorage.removeItem(TOKEN_VAR_NAME)
    return {
        type: LOGOUT,
    }
}
export function setAttemptingLogin(bool){
    return {
        type: ATTEMPTING_LOGIN,
        bool
    }
}