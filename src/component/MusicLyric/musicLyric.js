import React, { Component } from 'react';
import { connect } from 'react-redux';
import Lyric from 'lyric-parser';
import './musicLyric.scss';
let rotateTimer;
class MusicLyric extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 音乐歌词
      lyric: null,
      noLyric: false,
      // 当前歌词行数
      currentLineNum: 0,
      musicTime: 0,
      showP: 1, // 切换显示场景
      // 音乐列表
      playList: '',
      currentIndex: '',
      // 封面图片
      coverImgUrl: '',
      // 头像旋转角度
      angle: 0,
    }
    // 切换显示场景
    this.changeView = this.changeView.bind(this);
  }
  componentDidMount(){
    this.mount = true;
    this.props.onRef(this);
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.currentMusicLyric){
      return;
    }
    // 当上一个props 的歌词和 这个 props 的歌词一样时，直接返回
     const r =
       JSON.stringify(nextProps.currentMusicLyric) ===
       JSON.stringify(this.props.currentMusicLyric) && JSON.stringify(nextProps.playList) ===
       JSON.stringify(this.props.playList) && JSON.stringify(nextProps.currentIndex) ===
       JSON.stringify(this.props.currentIndex);
     if (r) {
       return;
     }
     // 这个时候歌词已经发生了变化
     if (this.state.lyric !== null) {
       // 如果之前已经有被处理过的歌词的话，先将原来的歌词暂停
       this.state.lyric.stop();
     }
    if(this.mount){
      let lyric = new Lyric(nextProps.currentMusicLyric.lrc.lyric,this.handleLyric);
      this.setState({
        lyric: lyric,
        noLyric: false,
        playList: nextProps.playList,
        currentIndex: nextProps.currentIndex,
      },
      () => {
        this.setState({
            coverImgUrl: this.state.playList[this.state.currentIndex].album.picUrl,
          },() => {
          rotateTimer = setInterval(() => {
            this.setState({
              angle: this.state.angle + 1
            },() => {
              this.refs.musicAvator.style.transform = `rotate(${this.state.angle}deg)`;
            })
          }, 33);
          this.refs.musicAvator.style.transform = `rotate(${this.state.angle}deg)`;
          // 初始化完成之后，播放当前歌词
          this.state.lyric.play();
          this.refs.lyricList.scrollTo(0, 0);
        })
      }
      )
    }
  }
  // 切换显示场景
  changeView() {
    this.setState(() => ({
      showP: !this.state.showP,
    }));
  }
  // 歌词继续滚动
  playLyric = () => {
    this.state.lyric.togglePlay();
    // rotateTimer = setInterval(() => {
    //   this.setState({
    //     angle: this.state.angle + 1
    //   },() => {
    //     this.refs.musicAvator.style.transform = `rotate(${this.state.angle}deg)`;
    //   })
    // }, 33);
  }
  // 停止歌词滚动
  stopLyric = () => {
    this.state.lyric.stop();
    clearInterval(rotateTimer);
  }
  // 指定到位置歌词
  seek = (startTime) => {
    this.state.lyric.seek(startTime * 1000);
  };
  // 歌词向上滚动控制
  handleLyric = ({ lineNum }) => {
    if (this.state.noLyric) {
      return;
    }
    if(this.mount){
      this.setState(() => ({
        currentLineNum: lineNum
      }));
      if (lineNum > 5) {
        const parentDom = document.querySelector('.lyric_container');
        const distance =
        parentDom.childNodes[lineNum].offsetTop -
        72 -
        (parentDom.childNodes[5].offsetTop - 72);
        this.refs.lyricList.scrollTo(0, distance);
      } else {
        this.refs.lyricList.scrollTo(0, 0);
      }
    }
  };
  componentWillUnmount(){
    this.mount = false;
  }
  render() {
    return(
      <div className="unstable_area"
        onMouseMove={this.changeView}
      >
        <div className="picArea" style={{ 'display': this.state.showP ? 'flex' : 'none'}}>
          <div className="coverImg">
            <img src={ this.state.coverImgUrl ? this.state.coverImgUrl : '' } alt="" ref="musicAvator"/>
          </div>
        </div>
        <ul className="lyric_container" ref="lyricList" style={{ 'display': this.state.showP ? 'none' : 'block'}}>
              {
                this.state.lyric ?
                this.state.lyric.lines.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={[
                        this.state.currentLineNum === index ? 'highlight' : '',
                        'lyric-list'
                      ].join(' ')}
                    >
                      {item.txt}
                    </li>
                  );
                }): <li className="noLyric">暂无歌词</li>
              }
          </ul>
      </div>

    )
  }
}
const mapStateToProps = (action) => {
  console.log('action', action)
  return {
    currentMusicLyric: action.reducer.currentMusicLyric,
    playList: action.reducer.playList,
    currentIndex: action.reducer.currentIndex,
  }
}

const mapDispatchToProps = (value) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps, null,
  { forwardRef: true })(MusicLyric)
