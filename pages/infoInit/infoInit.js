// pages/infoInit/infoInit.js
const app = getApp()
Page({
  data: {
    showSub: false,
    switch1: false,
    tel: "",
    mark: "",
    school: "",
    region: ['', '', ''],
    regionCode: "",
    grade: ['点击选择', '高 1', '高 2', '高 3'],
    subArray: ['选择文理', '文科', '理科'],
    schoolArray: [
      {
        id: 0,
        name: '点击选择学校'
      }
    ],
    gradeIndex: 0,
    subIndex: 0,
    schoolIndex: 0,
    isSetPlace: false
  },
  onChange(event) {
    const detail = event.detail;
    this.setData({
      'switch1': detail.value
    })
    if (detail.value == 3) {
      this.setData({
        'showSub': true
      })
      console.log("高三")
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindPickerChange: function (e) {
    // console.log('picker1发送选择改变，携带值为', e.detail.value)

    this.setData({
      gradeIndex: e.detail.value
    })
    if (e.detail.value == 3) {
      this.setData({
        showSub: true
      })
    } else {
      this.setData({
        showSub: false
      })
    }
  },
  bindSubChange: function (e) {
    // console.log('picker sub发送选择改变，携带值为', e.detail.value)
    this.setData({
      subIndex: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    var districCode = e.detail.code[2]
    var schoolCodesArray = app.globalData.highschoolIndex[districCode]
    var schoolNamesArray = [
      {
        id: 0,
        name: '点击选择学校'
      }
    ]
    
    for (var i in schoolCodesArray) {
      var shcoolTmp = {
        id: schoolCodesArray[i],
        name: app.globalData.highschoolDictionary[schoolCodesArray[i]]
      }
      schoolNamesArray.push(shcoolTmp)
    }
    // console.log(schoolNamesArray)
    this.setData({
      region: e.detail.value,
      regionCode: e.detail.code,
      isSetPlace: true,
      schoolArray: schoolNamesArray
    })
  },
  bindSchoolChange:function (e) {
    // console.log(e.detail)
    this.setData({
      schoolIndex: e.detail.value
    })
  },
  confirm: function () {
    var that = this
    var telInfo = this.data.tel
    var markInfo = this.data.mark
    var yearInfo = 2020 - parseInt(this.data.gradeIndex)
    var subjectcode = 0
    subjectcode = this.data.subIndex
    if (subjectcode == 2) {
      subjectcode = 5
    }
    var provinceInfo = this.data.regionCode[0]
    var cityInfo = this.data.regionCode[1]
    var districtInfo = this.data.regionCode[2]
    var schoolInfo = this.data.schoolArray[this.data.schoolIndex].id

    console.log(telInfo)
    console.log(markInfo)
    console.log(yearInfo)
    console.log(subjectcode)
    console.log(provinceInfo)
    console.log(cityInfo)
    console.log(districtInfo)
    console.log(schoolInfo)
    if (markInfo == "" || yearInfo == 2020 || (yearInfo == 2017 && subjectcode == 0) || this.data.regionCode == "" || schoolInfo==0){
      wx.showToast({
        title: "请补全全部信息",
        icon: 'none'
      })
    }else{
      wx.request({
        url: "http://localhost:8080/weapp/wxSaveInitInfo",
        method: "POST",
        data: {
          telInfo: telInfo,
          markInfo: markInfo,
          yearInfo: yearInfo,
          subjectcode: subjectcode,
          provinceInfo: provinceInfo,
          cityInfo: cityInfo,
          districtInfo: districtInfo,
          schoolInfo: schoolInfo
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.statusCode == '200') {
            console.log(res.data)
            if (res.data == "success") {
              wx.setStorageSync("phone", that.data.tel)
              wx.redirectTo({
                url: '../homepage/homepage',
              })
            } else {
              console.log("服务器错误");
            }
          } else {
            console.log("网络似乎出小差，请检查wifi或流量")

            // $Message({
            //   content: '与服务器通讯失败',
            //   type: 'error'
            // });
          }
        },
      })
    }
    // end of confirm    
  },
  onLoad: function () {
    var phone = wx.getStorageSync("phone")
    this.setData({
      tel: phone
    });
    console.log("拉取数据")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindKeyInput1: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  bindKeyInput2: function (e) {
    this.setData({
      mark: e.detail.value
    })
  },
  bindKeyInput3: function (e) {
    this.setData({
      school: e.detail.value
    })
  }
})