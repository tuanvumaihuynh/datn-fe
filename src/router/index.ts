import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/stores";

const Layout = () => import("@/layouts/MainLayout.vue");

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      authRequired: false,
    },
    component: () => import("@/views/auth/Login.vue"),
  },
  {
    path: "/dashboard",
    component: Layout,
    redirect: "/dashboard/overview",
    meta: {
      authRequired: true,
    },
    children: [
      {
        path: "overview",
        name: "Overview",
        component: () => import("@/views/dashboard/Overview.vue"),
      },
    ],
  },
  {
    path: "/gateways",
    component: Layout,
    children: [
      {
        path: "",
        name: "Gateways",
        component: () => import("@/views/management/gateway/GatewayList.vue"),
      },
      {
        path: ":id",
        name: "GatewayDetail",
        component: () => import("@/views/management/gateway/GatewayDetail.vue"),
      },
    ],
  },
  {
    path: "/devices",
    component: Layout,
    children: [
      {
        path: "",
        name: "Devices",
        component: () => import("@/views/management/device/DeviceList.vue"),
      },
      {
        path: ":id",
        name: "DeviceDetail",
        component: () => import("@/views/management/device/DeviceDetail.vue"),
      },
    ],
  },
  {
    path: "/tags",
    component: Layout,
    children: [
      {
        path: "",
        name: "Tags",
        component: () => import("@/views/management/tag/TagList.vue"),
      },
    ],
  },
  {
    path: "/system",
    component: Layout,
    redirect: "/system/organization-settings",
    meta: {
      authRequired: true,
    },
    children: [
      {
        path: "organization-settings",
        name: "OrganizationSettings",
        component: () => import("@/views/system/OrganizationSettings.vue"),
      },
      {
        path: "api-keys",
        name: "ApiKeys",
        component: () => import("@/views/system/ApiKeys.vue"),
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("@/views/system/Settings.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const { fullPath, meta } = to;
  const { authRequired = false } = meta;
  const userStore = useUserStore();

  if (authRequired && !userStore.isAuthenticated) {
    toLogin(fullPath);
  }
  next();
});

export function toLogin(path?: string): void {
  const userStore = useUserStore();
  userStore.logout();
  const currentPath = router.currentRoute.value.path;
  currentPath !== "/login" &&
    router.push({
      path: "/login",
      query: { to: path ? path : currentPath ?? undefined },
    });
}

export default router;
