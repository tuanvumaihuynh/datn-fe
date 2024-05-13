import { Component } from "vue";
import {
  Home,
  KeyRound,
  NotepadText,
  Settings,
  Router,
  Package,
  Tag,
} from "lucide-vue-next";

export interface Menu {
  title: string;
  path: string;
  icon: Component;
}

export interface Section {
  sectionName: string;
  menus: Menu[];
}

export default (): {
  sections: Section[];
} => {
  const dashboardMenus = [
    {
      title: "Overview",
      path: "/dashboard/overview",
      icon: Home,
    },
  ];

  const managementMenus = [
    {
      title: "Gateways",
      path: "/gateways",
      icon: Router,
    },
    {
      title: "Devices",
      path: "/devices",
      icon: Package,
    },
    {
      title: "Tags",
      path: "/tags",
      icon: Tag,
    },
  ];

  const systemMenus = [
    {
      title: "Organization Settings",
      path: "/system/organization-settings",
      icon: NotepadText,
    },
    {
      title: "API Keys",
      path: "/system/api-keys",
      icon: KeyRound,
    },
    {
      title: "Settings",
      path: "/system/settings",
      icon: Settings,
    },
  ];

  const sections = [
    {
      sectionName: "Dashboard",
      menus: dashboardMenus,
    },
    {
      sectionName: "Management",
      menus: managementMenus,
    },
    {
      sectionName: "System",
      menus: systemMenus,
    },
  ];
  return {
    sections,
  };
};
