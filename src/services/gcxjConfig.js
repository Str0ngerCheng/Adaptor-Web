export default {
  data: {
    "data": {
      "name": "场景管理",
      "url": "/video",
      "icon": "icon-camrecorder",
      "isResourceManaged": true,
      "resourceManage": {
        "videoPageButton": true,
        "getResourceListUrl": "http://192.168.0.107:8085/resourcelist",
        "getResourceUrl": "http://192.168.0.107:8085/resource",
        "mainResolution": "3840x2160",
        "nextResolution": "1280x720"
      },
      "maxMagnification": 40,
      "logoPath": "./img/avatars/logo.png"
    },
    "loginData": [{
      "username": "zhkj",
      "password": "zhkj2501"
    }, {
      "username": "admin",
      "password": "12345"
    }]
  }
}
