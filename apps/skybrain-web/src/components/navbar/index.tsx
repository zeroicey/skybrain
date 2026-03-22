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

const rightContents = new Map<string, React.ReactNode>([
  ["/monitor/live", <MonitorLiveNav key="monitor-live" />],
  ["/monitor/playback", <MonitorPlaybackNav key="monitor-playback" />],
  ["/monitor/multi", <MonitorMultiNav key="monitor-multi" />],
  ["/tasks", <TaskListNav key="tasks" />],
  ["/tasks/create", <TaskCreateNav key="tasks-create" />],
  ["/tasks/schedule", <TaskScheduleNav key="tasks-schedule" />],
  ["/tasks/logs", <TaskLogsNav key="tasks-logs" />],
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

export default function Navbar() {
  const location = useLocation();
  const taskNav = getTaskNav(location.pathname)
  const content = rightContents.get(location.pathname) || taskNav

  return (
    <header className="flex items-center border-b px-4 py-4 gap-2 h-16">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2" />
      {content}
    </header>
  );
}