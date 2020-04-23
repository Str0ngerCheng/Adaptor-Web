import defaultValue from "./default";
import axios from "../common/axios";

export function getSensorList (url) {
  const sensorList = {total:defaultValue.sensorList.total,records:defaultValue.sensorList.records,
    sensorType:defaultValue.typeData}
  return new Promise((resolve, reject) => {
    axios.get(url).then(response => {
      resolve(response.data)
    }, err => {
      resolve(sensorList)
    })
      .catch((error) => {
        resolve(sensorList)
      })
  })
}

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
