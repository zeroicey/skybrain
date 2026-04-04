import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router";
import MonitorMultiNav from "./contents/monitor-multi";
import MonitorLiveNav from "./contents/monitor-live";
import MonitorPlaybackNav from "./contents/monitor-playback";
import TaskListNav from "./contents/task-list";
import TaskDetailNav from "./contents/task-detail";
import TaskCreateNav from "./contents/task-create";
import TaskEditNav from "./contents/task-edit";
import TaskScheduleNav from "./contents/task-schedule";
import TaskLogsNav from "./contents/task-logs";
import CanteenNav from "./contents/canteen";
import ShopNav from "./contents/shop";
import DormitoryNav from "./contents/dormitory";
import BuildingNav from "./contents/building";
import GateNav from "./contents/gate";
import DronesNav from "./contents/device-drones";
import DroneDetailNav from "./contents/device-drone-detail";
import HangarsNav from "./contents/device-hangars";
import BatteriesNav from "./contents/device-batteries";
import MaintenanceNav from "./contents/device-maintenance";
import UsersNav from "./contents/settings-users";
import RolesNav from "./contents/settings-roles";
import LogsNav from "./contents/settings-logs";
import ConfigNav from "./contents/settings-config";
import DashboardNav from "./contents/dashboard";
import FlightRoutesNav from "./contents/flight-routes";

const rightContents = new Map<string, React.ReactNode>([
  ["/dashboard", <DashboardNav key="dashboard" />],
  ["/monitor/live", <MonitorLiveNav key="monitor-live" />],
  ["/monitor/playback", <MonitorPlaybackNav key="monitor-playback" />],
  ["/monitor/multi", <MonitorMultiNav key="monitor-multi" />],
  ["/scenes/canteen", <CanteenNav key="canteen" />],
  ["/scenes/shops", <ShopNav key="shops" />],
  ["/scenes/dormitory", <DormitoryNav key="dormitory" />],
  ["/scenes/building", <BuildingNav key="building" />],
  ["/scenes/gate", <GateNav key="gate" />],
  ["/tasks", <TaskListNav key="tasks" />],
  ["/tasks/create", <TaskCreateNav key="tasks-create" />],
  ["/tasks/schedule", <TaskScheduleNav key="tasks-schedule" />],
  ["/tasks/logs", <TaskLogsNav key="tasks-logs" />],
  // Device module
  ["/devices/drones", <DronesNav key="devices-drones" />],
  ["/devices/hangars", <HangarsNav key="devices-hangars" />],
  ["/devices/batteries", <BatteriesNav key="devices-batteries" />],
  ["/devices/maintenance", <MaintenanceNav key="devices-maintenance" />],
  // Settings module
  ["/settings/users", <UsersNav key="settings-users" />],
  ["/settings/roles", <RolesNav key="settings-roles" />],
  ["/settings/logs", <LogsNav key="settings-logs" />],
  ["/settings/config", <ConfigNav key="settings-config" />],
  ["/flight/routes", <FlightRoutesNav key="flight-routes" />],
]);

// 动态匹配 /tasks/:id 和 /tasks/:id/edit
const getTaskNav = (pathname: string) => {
  if (pathname.match(/^\/tasks\/[^/]+$/)) {
    return <TaskDetailNav key="tasks-detail" />
  }
  if (pathname.match(/^\/tasks\/[^/]+\/edit$/)) {
    return <TaskEditNav key="tasks-edit" />
  }
  return null
}

// 动态匹配 /devices/drones/:id
const getDeviceNav = (pathname: string) => {
  if (pathname.match(/^\/devices\/drones\/[^/]+$/)) {
    return <DroneDetailNav key="devices-drone-detail" />
  }
  return null
}

export default function Navbar() {
  const location = useLocation();
  const taskNav = getTaskNav(location.pathname)
  const deviceNav = getDeviceNav(location.pathname)
  const content = rightContents.get(location.pathname) || taskNav || deviceNav

  return (
    <header className="flex items-center px-4 gap-2 h-16">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2" />
      {content}
    </header>
  );
}
