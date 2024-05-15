import { DeviceType } from "@/types/device";

export default (): {
  getDeviceType: (item: any) => DeviceType;
} => {
  function getDeviceType(item: any): DeviceType {
    if (item.is_gateway) {
      return "Gateway";
    } else if (item.is_sub_device) {
      return "SubDevice";
    } else {
      return "Device";
    }
  }
  return {
    getDeviceType,
  };
};
