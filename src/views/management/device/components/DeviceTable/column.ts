import { ChevronsUpDown, ArrowUp, ArrowDown } from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";
import DropdownAction from "./DeviceTableDropdown.vue";
import DeviceTagContainer from "./DeviceTagContainer.vue";
import DeviceNameBtn from "./DeviceNameBtn.vue";
import DeviceStatusBadge from "./DeviceStatusBadge.vue";

import { h } from "vue";
import { Device } from "@/types/device";
import { ColumnDef } from "@tanstack/vue-table";
import { useDateFormat } from "@vueuse/core";

function getSortIcon(isSorted: boolean | string) {
  if (isSorted === "asc") {
    return h(ArrowUp, { class: "ml-2 h-4 w-4" });
  } else if (isSorted === "desc") {
    return h(ArrowDown, { class: "ml-2 h-4 w-4" });
  }
  return h(ChevronsUpDown, { class: "ml-2 h-4 w-4" });
}

export const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      const sortIcon = getSortIcon(isSorted);
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(isSorted === "asc"),
        },
        () => ["Name", sortIcon]
      );
    },
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
    // header: () => h("div", { class: "text-left" }, "Status"),
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      const sortIcon = getSortIcon(isSorted);
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(isSorted === "asc"),
        },
        () => ["Status", sortIcon]
      );
    },
    cell: ({ row }) => {
      const device = row.original;
      return h("div", { class: "relative" }, h(DeviceStatusBadge, { device }));
    },
  },
  {
    accessorKey: "tags",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      const sortIcon = getSortIcon(isSorted);
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(isSorted === "asc"),
        },
        () => ["Tags", sortIcon]
      );
    },
    cell: ({ row }) => {
      const device = row.original;
      return h("div", { class: "relative" }, h(DeviceTagContainer, { device }));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      const sortIcon = getSortIcon(isSorted);
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(isSorted === "asc"),
        },
        () => ["Created at", sortIcon]
      );
    },
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
