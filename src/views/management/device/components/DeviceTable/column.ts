import { h } from "vue";
import { Device } from "@/types/device";
import { ColumnDef } from "@tanstack/vue-table";
import { useDateFormat } from "@vueuse/core";
import DropdownAction from "./DeviceTableDropdown.vue";
import DeviceTagContainer from "./DeviceTagContainer.vue";
import DeviceNameBtn from "./DeviceNameBtn.vue";
import DeviceStatusBadge from "./DeviceStatusBadge.vue";

export const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-left" }, "Name"),
    cell: ({ row }) => {
      const device = row.original;
      return h("div", { class: "relative" }, h(DeviceNameBtn, { device }));
    },
  },
  {
    accessorKey: "isGateway",
    header: () => h("div", { class: "text-left" }, "Type"),
    cell: ({ row }) => {
      const device = row.original;
      return h("div", { class: "text-left" }, device.type);
    },
  },
  {
    accessorKey: "connected",
    header: () => h("div", { class: "text-left" }, "Status"),
    cell: ({ row }) => {
      const device = row.original;
      return h("div", { class: "relative" }, h(DeviceStatusBadge, { device }));
    },
  },
  {
    accessorKey: "tags",
    header: () => h("div", { class: "text-left" }, "Tags"),
    cell: ({ row }) => {
      const device = row.original;
      return h("div", { class: "relative" }, h(DeviceTagContainer, { device }));
    },
  },
  {
    accessorKey: "createdAt",
    header: () => h("div", { class: "text-left" }, "Created at"),
    cell: ({ row }) => {
      const device = row.original;
      return h(
        "div",
        { class: "relative" },
        useDateFormat(device.createdAt, "YYYY-MM-DD HH:mm:ss").value
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const device = row.original;
      return h(
        "div",
        { class: "relative" },
        h(DropdownAction, {
          device,
        })
      );
    },
  },
];
