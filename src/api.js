// export const CONTEXT = './api';
export const CONTEXT = '.';

export const LOGIN = CONTEXT + '/login';
export const LOGOUT = CONTEXT + '/logout';
export const CHANGE_PWD = CONTEXT + '/changePwd';

export const SENSOR_LIST  = CONTEXT + '/sensor/list';
export const ALL_SENSOR  = CONTEXT + '/sensor/allList';
export const SENSOR_ADD = CONTEXT + '/sensor/add';
export const SENSOR_UPDATE = CONTEXT + '/sensor/update';
export const SENSOR_DELETE  = CONTEXT + '/sensor/Delete';
export const SENSOR_GET_BY_NAME  = CONTEXT + '/sensor/getSensorsByName';
export const SENSOR_GET_BY_TYPE  = CONTEXT + '/sensor/getSensorsByType';
export const SENSOR_HistoryData  = CONTEXT + '/sensor/getHistoryData';
export const ObsProp_All_ObsPropName  = CONTEXT + '/obs_prop/getAllObsPropNames';

export const SYS_MENU_GET = CONTEXT + '/sys/menu/get';
export const SYS_MENU_UPDATE = CONTEXT + '/sys/menu/update';
export const SYS_MENU_DELETE = CONTEXT + '/sys/menu/delete';
export const SYS_MENU_ADD = CONTEXT + '/sys/menu/add';
export const SYS_MENU_PAGE = CONTEXT + '/sys/menu/page';
export const SYS_MENU_LIST = CONTEXT + '/sys/menu/list';
export const SYS_MENU_LIST2 = CONTEXT + '/sys/menu/list2';

export const SYS_ROLE_GET = CONTEXT + '/sys/role/get';
export const SYS_ROLE_UPDATE = CONTEXT + '/sys/role/update';
export const SYS_ROLE_DELETE = CONTEXT + '/sys/role/delete';
export const SYS_ROLE_ADD = CONTEXT + '/sys/role/add';
export const SYS_ROLE_PAGE = CONTEXT + '/sys/role/page';
export const SYS_ROLE_LIST = CONTEXT + '/sys/role/list';
export const SYS_ROLE_LIST2 = CONTEXT + '/sys/role/list2';
export const SYS_ROLE_RESOURCE = CONTEXT + '/sys/role/resources';
export const SYS_SET_ROLE_RESOURCE = CONTEXT + '/sys/role/setResources';

export const SYS_RESOURCE_GET = CONTEXT + '/sys/resource/get';
export const SYS_RESOURCE_UPDATE = CONTEXT + '/sys/resource/update';
export const SYS_RESOURCE_DELETE = CONTEXT + '/sys/resource/delete';
export const SYS_RESOURCE_ADD = CONTEXT + '/sys/resource/add';
export const SYS_RESOURCE_PAGE = CONTEXT + '/sys/resource/page';
export const SYS_RESOURCE_LIST = CONTEXT + '/sys/resource/list';
export const SYS_RESOURCE_LIST2 = CONTEXT + '/sys/resource/list2';

export const SYS_USER_GET = CONTEXT + '/sys/user/get';
export const SYS_USER_ADD = CONTEXT + '/sys/user/add';
export const SYS_USER_UPDATE = CONTEXT + '/sys/user/update';
export const SYS_USER_DELETE = CONTEXT + '/sys/user/delete';
export const SYS_USER_PAGE = CONTEXT + '/sys/user/page';
export const SYS_USER_ROLE = CONTEXT + '/sys/user/roleIds';
export const SYS_SET_USER_ROLE = CONTEXT + '/sys/user/setRoles';

export const MSG_TOP_TEN = CONTEXT + '/messageList';
export const TEST_DATA = CONTEXT + '/static/data/data.json';

//WebSocket接口地址
export const BASE_URL="ws://127.0.0.1:8081";
export const SENSOR_WEBSOCKET_URL=BASE_URL+"/websocket";
export const ROBOT_WEBSOCKET_URL=BASE_URL+"/robot";

