import {VOTE,SHOW_MENU,MENU_BTN_CLICK,SET_WINDOW_PARAMS,SHOW_AUTH,CHANGE_TAB_TO,ATTEMPTING_LOGIN,LOGIN,LOGOUT,AUTH_UPDATE,SHOW_FIXED_LOADER} from './actions'
import { combineReducers } from 'redux';
function commonReducer(state={vote:false,menuOpen:false,showFixedLoader:false,windowWidth:"0",windowHeight:"0",authTab:"register",authShown:false},action){
	switch(action.type){
		case VOTE:
			return Object.assign({},state,{vote:action.videoid})
		case MENU_BTN_CLICK:
			return Object.assign({},state,{menuOpen:!state.menuOpen})
		case SHOW_MENU:
			return Object.assign({},state,{menuOpen:action.bool})
		case SHOW_FIXED_LOADER:
				return Object.assign({},state,{showFixedLoader:action.bool})
		case SET_WINDOW_PARAMS:
			return Object.assign({},state,{windowWidth:action.windowWidth,windowHeight:action.windowHeight})
		case SHOW_AUTH:
			return Object.assign({},state,{authShown:action.bool,authTab:action.tab?action.tab:state.authTab})
		case CHANGE_TAB_TO:
			return Object.assign({},state,{authTab:action.tab})
		default:
			return state;
	}
}
function authReducer(state={isValidMobile:null,isValidEmail:null,token:null,email:null,phone:null,name:null,attemptingLogin:false},action){
	switch(action.type){
		case ATTEMPTING_LOGIN:
			return Object.assign({},state,{attemptingLogin:action.bool})
		case LOGIN:
			return Object.assign({},state,{isValidMobile:action.isValidMobile,isValidEmail:action.isValidEmail,token:action.token,email:action.email,phone:action.phone,name:action.name})
		case LOGOUT:
			return Object.assign({},state,{isValidMobile:null,isValidEmail:null,token:null,email:null,phone:null,name:null})
		case AUTH_UPDATE:
			return Object.assign({},state,action.obj)
		default:
			return state;
	}
}
const combinedReducer = combineReducers({
	common:commonReducer,
	auth:authReducer
});
export default combinedReducer;
