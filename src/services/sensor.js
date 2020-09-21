import axios from "../common/axios";

export function getAllSensors (url) {
  return new Promise((resolve, reject) => {
    axios.get(url).then(response => {
      resolve({total:response.data.length,records:response.data})
    }, err => {
      resolve(err)
    })
      .catch((error) => {
        reject(error)
      })
  })
}
