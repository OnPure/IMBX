/**
* 播放详情页
**/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRecommendSongIndex, updateRecommendSongList, getChangePlayListAction} from '../../store/actionCreator';
import { Link } from 'react-router-dom';
import { getMusicUrl, getMusicLyric} from '../../api';
import MusicLyric from '../../component/MusicLyric/musicLyric';
import Player from '../../component/Player/player';
import MusicList from '../../component/MusicList/musicList';
import axios from 'axios';
import './playDetails.scss';

class PlayDetails extends Component{
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      artists: '',
      musicUrl: '',
      currentMusicLyric: '',
      playList: '',
      currentIndex: '',
    }
    // 滚动条拖动后修改歌词
    this.changeMusicLyric = this.changeMusicLyric.bind(this);
    // 点击显示歌曲列表
    this.showMusicList = this.showMusicList.bind(this);
    // 点击暂停音乐按钮时禁止歌词滚动
    this.stopLyric = this.stopLyric.bind(this);
    // 歌词继续滚动
    this.playLyric = this.playLyric.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(!nextProps.currentMusic){
      return;
    }
    // 当上一个props 的歌词和 这个 props 的歌词一样时，直接返回
     const r =
       JSON.stringify(nextProps.currentMusic) ===
       JSON.stringify(this.props.currentMusic) && JSON.stringify(nextProps.playList) ===
       JSON.stringify(this.props.playList);
     if (r) {
       return;
     }
    this.setState({
      name: nextProps.currentMusic.name,
      artists: nextProps.currentMusic.artists,
      musicUrl: nextProps.currentMusic.musicUrl,
      currentMusicLyric: nextProps.currentMusic.currentMusicLyric,
      playList: nextProps.playList,
      currentIndex: nextProps.currentIndex,
    },() => {
      this.setState({
        bcCovImg: this.state.playList[this.state.currentIndex].album.picUrl,
      });
    });
  }
  // 滚动条拖动后修改歌词
  changeMusicLyric (currentTime) {
    this.musicLyric.seek(currentTime);
  }
  // 歌词继续滚动
  playLyric () {
    this.musicLyric.playLyric();
  }
  // 点击暂停音乐按钮时禁止歌词滚动
  stopLyric () {
    this.musicLyric.stopLyric();
  }
  // 点击显示歌曲列表
  showMusicList () {
    this.musicList.showMusicList();
  }
  onRef = (ref) => {
    this.musicLyric = ref;
  }
  onRef1 = (ref) => {
    this.musicList = ref;
  }
  render(){
    return(
      <div className="playDetails">
        <img className="bcCovImg" src={ this.state.bcCovImg } alt="" ></img>
        {/*导航*/}
        <div className="header">
          <Link to="/mrtj">
            <i className="iconfont icon" onClick={this.stopM}>&#xe611;</i>
          </Link>
          <div className="header_name">
            <div className="music_name">{this.state.name ?　this.state.name : null}</div>
            <div className="music_author">{this.state.artists ?
              this.state.artists.map((item) => {
                return item.name
              }) : null
            }</div>
          </div>
        </div>
        {/*音乐盒组装*/}
        <div className="music_box">
          {/*歌词*/}
          <MusicLyric onRef={this.onRef} currentMusicLyric = { this.state.musicLyric }></MusicLyric>
          {/*功能列表*/}
          {/*播放器*/}
          <Player ref="player" currentMusicSrc={ this.state.musicUrl } getChangePosLyric={ this.changeMusicLyric }
          showMusicList={ this.showMusicList } playLyric={ this.playLyric } stopLyric={ this.stopLyric }></Player>
          // 音乐列表
          <MusicList onRef1={this.onRef1}></MusicList>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return{
    currentMusic: state.reducer.currentMusic,
    playList: state.reducer.playList,
    currentIndex: state.reducer.currentIndex,
    currentMusicLyric: state.reducer.currentMusicLyric,
  }
}
const mapDispatchToProps = (dispatch) => {
  return{
    updateRecommendSongIndex(value){
      dispatch(getRecommendSongIndex(value));
    },
    // getAudio(value){
    //   dispatch(getAudio(value));
    // },
    updateRecommendSongList(value){
      dispatch(updateRecommendSongList(value));
    },
    getChangePlayListAction(value){
      dispatch(getChangePlayListAction(value));
    },
    // updatePlayNext(value){
    //   dispatch(updatePlayNext(value));
    // },
    // updateCurrentMusicLyric(value){
    //   dispatch(updateCurrentMusicLyric(value));
    // }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(PlayDetails);
