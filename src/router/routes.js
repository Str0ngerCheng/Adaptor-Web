import NotFoundView from "../components/404.vue";
import menuList from "../pages/sys/menu.vue";
import role from "../pages/sys/role.vue";
import resource from "../pages/sys/resource.vue";
import login from "../pages/login.vue";
import app from "../App.vue";
import sysUser from "../pages/sys/user.vue";
import userAdd from "../pages/sys/userAdd.vue";
import resetPwd from "../pages/resetPwd.vue";
import index from "../pages/index.vue";
import sensorAdd from "../pages/sensors/sensorAdd.vue";
import zigbee from "../pages/sensors/zigbee.vue";
import rtsp from "../pages/sensors/rtsp.vue";
import basemap from "../components/amap/basemap.vue";
import BLE from "../pages/sensors/BLE.vue";


// Routes
const routes = [
  {path: '/login', component: login},
  {
    path: '/test', component: app, children: [
      {path: '*', component: NotFoundView}
    ]
  },
  {
    path: '', component: app, children: [
      {path: '/resetPwd', component: resetPwd},
      {path: '/index', component: index},
      {path: '/protocol/sensorAdd', name: 'sensorAdd' ,component: sensorAdd},
      {path: '/protocol/zigbee', component: zigbee},
      {path: '/protocol/BLE', component: BLE},
      {path: '/protocol/rtsp', component: rtsp},
      {path: '/tree', component: basemap},
      {path: '/sys/menuList', component: menuList},
      {path: '/sys/roleList', component: role},
      {path: '/sys/userList', component: sysUser},
      {path: '/sys/userAdd', component: userAdd},
      {path: '/sys/resource', component: resource}
    ]
  },
  {path: '*', component: NotFoundView}
]


export default routes

