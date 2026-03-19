import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router";
import MonitorMultiNav from "./contents/monitor-multi";

const rightContents = new Map<string, React.ReactNode>([
  ["/monitor/multi", <MonitorMultiNav key="monitor" />],
]);

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="flex items-center border-b px-4 py-4 gap-2 h-16">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2" />
      {rightContents.get(location.pathname)}
    </header>
  );
}
