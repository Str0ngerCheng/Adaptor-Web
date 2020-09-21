import axios from "../common/axios";

//前端模拟接口，最终还是调用后端接口。
//注意：这些接口中，凡是给出demo数据的，后端接口返回的数据格式要和demo一致，不然无法解析
export function getSensorList (url,params) {
  let typeData=[]
  return new Promise((resolve, reject) => {
    axios.get(url,{params}).then(response => {
      for(let i=0;i<response.data.length;i++)
        typeData.push({ text: response.data[i].type, value: response.data[i].type})
      let res = new Map();
      typeData=typeData.filter((data) => !res.has(data.text) && res.set(data.text, 1));//typeData去重
      resolve({total:response.data.length,records:response.data,typeData:typeData})
    }, err => {
      resolve(err)
    })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getSensorsByName (url,params) {
  return new Promise((resolve, reject) => {
    axios.get(url,{params}).then(response => {
      resolve({total:response.data.length,records:response.data})
    }, err => {
      reject(err)
    })
      .catch((error) => {
        reject(error)
      })
  })
}
//Type这里是一个数组，即 select * from sensor where type in （type1,type2,...）
export function getSensorsByType (url,params) {

  return new Promise((resolve, reject) => {
    axios.get(url,{params}).then(response => {
      resolve({total:response.data.length,records:response.data})
    }, err => {
      reject(err)
    })
      .catch((error) => {
        reject(error)
      })
  })
}


export function addSensor (url,params) {
  debugger
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
  return new Promise((resolve, reject) => {
    axios.get(url, { params }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getAllObsPropNames (url) {
  let typeOptions=[]
  return new Promise((resolve, reject) => {
    axios.get(url).then(response => {
      let data=response.data.data
      for(let i=0;i<data.length;i++)
        typeOptions.push({ value: data[i], label: data[i]})
      resolve(typeOptions)
    }, err => {
      reject(err)
    }).catch((error) => {
        reject(error)
      })
  })
}

