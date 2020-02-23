const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//--- promise 封装request
function request(_url,type,data){
  return new Promise(function (resolve, reject) {
    // 发请求之前显示loading
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    // 发送请求
    wx.request({
      url:_url,
      method:type||'GET',
      data,
      success(res){//--成功回调
        resolve(res);
      },
      fail(err){//--失败回调
        reject(err)
      },
      // 请求是否成功都关闭loading
      complete(){
        wx.hideLoading();
      }
    })
  })
}


module.exports = {
  formatTime: formatTime,
  request
}
