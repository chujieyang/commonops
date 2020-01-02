
const topMenus = [
    {
        "menuTitle": "我的",
        "icon": "user",
        "subMenus": [
            {"title": "修改密码", "route": "/admin/permission/password"},
            {"title": "退出", "route": "/admin/logout"},
        ],
    }
];

const sideMenus = [
    {
        "menuTitle": "云资源",
        "icon": "cloud-server",
        "subMenus": [
            {"title": "服务器", "route": "/admin/cloud_resource/cloud_server"},
            {"title": "数据库", "route": "/admin/cloud_resource/cloud_rds"},
            {"title": "KV-Store", "route": "/admin/cloud_resource/cloud_kv"},
            {"title": "负载均衡", "route": "/admin/cloud_resource/cloud_slb"},
            {"title": "其它资源", "route": "/admin/cloud_resource/cloud_other"},
            {"title": "云账号", "route": "/admin/cloud_resource/cloud_account"},
        ],
    },
    {
        "menuTitle": "工作协助",
        "icon": "team",
        "subMenus": [
            {"title": "提交工单", "route": "/admin/task/deploy_project"},
            {"title": "工单列表", "route": "/admin/task/jobs"},
        ],
    },
    {
        "menuTitle": "CI & CD",
        "icon": "gitlab",
        "subMenus": [
            // {"title": "任务列表", "route": "/admin/cicd/jobs"},
        ],
    },
    {
        "menuTitle": "Kubernetes",
        "icon": "ant-cloud",
        "subMenus": [
            {"title": "集群管理", "route": "/admin/k8s_cluster/info"},
        ],
    },
    {
        "menuTitle": "数据管理",
        "icon": "database",
        "subMenus": [
            {"title": "阿里云", "route": "/admin/data/syncAliyun"},
        ],
    },
    {
        "menuTitle": "权限管理",
        "icon": "eye",
        "subMenus": [
            {"title": "用户管理", "route": "/admin/permission/users"},
            {"title": "角色管理", "route": "/admin/permission/roles"},
            {"title": "权限链接", "route": "/admin/permission/permissions"},
        ],
    },
    {
        "menuTitle": "系统管理",
        "icon": "radius-setting",
        "subMenus": [
            {"title": "用户反馈", "route": "/admin/system/user_feedback"},
        ],
    }
];

const Menus = {
    "topMenus": topMenus,
    "sideMenus": sideMenus,
    "noAuthMenus": ["/admin/task/deploy_project", "/admin/task/jobs"], // 不参与权限校验的菜单
};

export default Menus;
