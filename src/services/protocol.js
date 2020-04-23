import defaultValue from "./default";
import axios from "../common/axios";

//前端模拟接口，最终还是调用后端接口。
//注意：这些接口中，凡是给出demo数据的，后端接口返回的数据格式要和demo一致，不然无法解析
export function getSensorList (url,params) {
  const sensorList = {total:defaultValue.sensorList.total,records:defaultValue.sensorList.records,
    sensorType:defaultValue.typeData}
  return new Promise((resolve, reject) => {
    axios.get(url,{params}).then(response => {
      resolve(response.data)
    }, err => {
      resolve(sensorList)
    })
      .catch((error) => {
        resolve(sensorList)
      })
  })
}
export function getSensorsByName (url,params) {
  const sensor={total:0,records:[]}
  return new Promise((resolve, reject) => {
    axios.get(url,{params}).then(response => {
      resolve(response.data)
    }, err => {
      resolve(sensor)
    })
      .catch((error) => {
        resolve(sensor)
      })
  })
}
//Type这里是一个数组，即 select * from sensor where type in （type1,type2,...）
export function getSensorsByType (url,params) {
  const sensor={total:0,records:[]}
  return new Promise((resolve, reject) => {
    axios.get(url,{params}).then(response => {
      resolve(response.data)
    }, err => {
      resolve(sensor)
    })
      .catch((error) => {
        resolve(sensor)
      })
  })
}


export function addSensor (url,params) {
  return new Promise((resolve, reject) => {
    axios.post(url, { params }).then(response => {
      resolve(response.data)
    })
      .catch((error) => {
        reject(error)
      })
  })
}
export function editSensor (url,params) {
  return new Promise((resolve, reject) => {
    axios.post(url, { params }).then(response => {
      resolve(response.data)
    })
      .catch((error) => {
        reject(error)
      })
  })
}

export function deleteSensor (url,params) {
  return new Promise((resolve, reject) => {
    axios.get(url, { params }).then(response => {
      resolve(response.data)
    })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getHistoryData (url,params) {
  const historyData = defaultValue.historyData
  return new Promise((resolve, reject) => {
    axios.get(url, { params }).then(response => {
      resolve(response.data)
    }, err => {
      resolve(historyData)
    })
      .catch((error) => {
        resolve(historyData)
      })
  })
}
