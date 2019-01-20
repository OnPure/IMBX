import * as types from './actionTypes';
import {　login, getUserDetail, getUserSubcount, getLoginStatus, getRecommendResource, getRecommendSongs,
getSongUrl, updateRecommendSongList, updatePlayNext } from '../api';

const defaultState = {
  account: {
    // 登录类型：0 手机号，1 邮箱
    loginType: null,
    // 是否登录
    isLogin: false,
    userName: null,
    password: null,
  },
  // 用户简介
  profile:{
    userId: null,
    nickname: null,
    avatarUrl: null,
    level: null, // 我的等级

  },
  // 选择类型对应名字
  headerName: null,
  // 音乐列表
  musicList: null,
  // 推荐音乐歌单列表
  RecommendResourceList: null,
  // 推荐音乐歌曲列表
  recommendSongsList: null,
  // 推荐音乐列表选中index
  recommendSongIndex: null,
  // 音乐url
  songUrl: null,
  // 播放模式
  // 0 单曲循环,1 列表循环,2 随机播放
  playType: 0,
  // 音乐audio
  audio: null,
  played: null,
  buffered: null,
  // 当前播放音乐
  // currentMusic: null,
}
export const reducer = (state = defaultState, action) => {
  let newState;
  switch(action.type){
    // 判断账号类型：邮箱 or 手机号
    case types.Login_Type:
      newState = deepClone(state);
      console.log('action',action)
      if(action.value !== null){
        newState.account.loginType = action.value;
      }
      return newState;
    // 登录账号
    case types.Remember_Account:
      newState = deepClone(state);
          console.log('denglu');
      if(action.value !== null){
        newState.account.userName = action.value.userName;
        newState.account.password = action.value.password;
        

      }
      return newState;
    // 获得每日推荐歌单
    case types.Recommend_Resource:
      newState = deepClone(state);
      getRecommendSongs().then(({ data }) => {
        newState.headerName = action.value;
        newState.recommendSongsList = data.recommend;
      }).catch((e) => {
        console.log('获得每日推荐歌曲失败', e)
      })
      return newState;
    // 更新每日推荐歌单
    case types.Update_Recomend:
      newState = deepClone(state);
      if(action.value != null){
        newState.recommendSongsList = action.value;
      }
      return newState;
    // 每日推荐列表中选中的当前音乐
    case types.Current_Music:
      newState = deepClone(state);
      if(action.value != null){
        newState.recommendSongIndex = action.value;
      }else{
        console.log('获取每日推荐列表中选中的当前音乐失败');
        return;
      }
      return newState;
    // 获取音乐url
    case types.Song_Url:
      newState = deepClone(state);
      getSongUrl(action.value).then(({data}) => {
        newState.songUrl = data.data[0].url;
      }).catch((e) => {
        console.log('获取音乐url失败');
      })
      return newState;
    // 获取音乐audio
    case types.Song_Audio:
      newState = deepClone(state);
      if(action.value != null){
        newState.audio = action.value.audio;
        newState.played = action.value.played;
        newState.buffered = action.value.buffered;
      }else{
        console.log('获取音乐audio失败');
      }
      return newState;
    // 更新播放模式
    case types.Update_PlayNext:
      newState = deepClone(state);
      if(action.value != null){
        newState.playType = action.value;
      }else{
        console.log('更新播放模式失败');
      }
      return newState;
    default:
      return state;
  }
}


function deepClone (val) {
  return  JSON.parse(JSON.stringify(val));
}
