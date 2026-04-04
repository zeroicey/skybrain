import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import ModuleLayout from "@/components/layout/module-layout";
import RootLayout from "@/components/layout/root-layout";
const LandingPage = lazy(() => import("@/pages/landing"));
const DashboardPage = lazy(() => import("@/pages/modules/dashboard/dashboard-page"));

const NotFoundPage = lazy(() => import("@/pages/404"));
const ErrorPage = lazy(() => import("@/pages/error"));

const LoginPage = lazy(() => import("@/pages/auth/login"));

const MultiMonitorPage = lazy(() => import("@/pages/modules/monitor/multi-monitor-page"));
const MonitorLivePage = lazy(() => import("@/pages/modules/monitor/live-page"));
const MonitorPlaybackPage = lazy(() => import("@/pages/modules/monitor/playback-page"));

const TaskListPage = lazy(() => import("@/pages/modules/task/task-list-page"));
const TaskDetailPage = lazy(() => import("@/pages/modules/task/task-detail-page"));
const TaskCreatePage = lazy(() => import("@/pages/modules/task/task-create-page"));
const TaskEditPage = lazy(() => import("@/pages/modules/task/task-edit-page"));
const TaskSchedulePage = lazy(() => import("@/pages/modules/task/task-schedule-page"));
const TaskLogsPage = lazy(() => import("@/pages/modules/task/task-logs-page"));

const CanteenPage = lazy(() => import("@/pages/modules/scene/canteen-page"));
const ShopsPage = lazy(() => import("@/pages/modules/scene/shops-page"));
const DormitoryPage = lazy(() => import("@/pages/modules/scene/dormitory-page"));
const BuildingPage = lazy(() => import("@/pages/modules/scene/building-page"));
const GatePage = lazy(() => import("@/pages/modules/scene/gate-page"));

const DronesPage = lazy(() => import("@/pages/modules/device/drones-page"));
const DroneDetailPage = lazy(() => import("@/pages/modules/device/drone-detail-page"));
const HangarsPage = lazy(() => import("@/pages/modules/device/hangars-page"));
const BatteriesPage = lazy(() => import("@/pages/modules/device/batteries-page"));
const MaintenancePage = lazy(() => import("@/pages/modules/device/maintenance-page"));

const UsersPage = lazy(() => import("@/pages/modules/setting/users-page"));
const RolesPage = lazy(() => import("@/pages/modules/setting/roles-page"));
const LogsPage = lazy(() => import("@/pages/modules/setting/logs-page"));
const ConfigPage = lazy(() => import("@/pages/modules/setting/config-page"));

const FlightRoutesPage = lazy(() => import("@/pages/modules/flight/routes-page"));
const FlightRouteTeachPage = lazy(() => import("@/pages/modules/flight/route-teach-page"));
const FlightRouteDetailPage = lazy(() => import("@/pages/modules/flight/route-detail-page"));


const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        ErrorBoundary: ErrorPage,
        children: [
            { index: true, Component: LandingPage },
            { path: "login", Component: LoginPage },
            {
                Component: ModuleLayout,
                children: [
                    { path: "dashboard", Component: DashboardPage },
                    {
                        path: "monitor",
                        children: [
                            { path: "live", Component: MonitorLivePage },
                            { path: "playback", Component: MonitorPlaybackPage },
                            { path: "multi", Component: MultiMonitorPage }
                        ]
                    },
                    {
                        path: "tasks",
                        children: [
                            { index: true, Component: TaskListPage },
                            { path: "create", Component: TaskCreatePage },
                            { path: ":id", Component: TaskDetailPage },
                            { path: ":id/edit", Component: TaskEditPage },
                            { path: "schedule", Component: TaskSchedulePage },
                            { path: "logs", Component: TaskLogsPage },
                        ]
                    },
                    {
                        path: "scenes",
                        children: [
                            { path: "canteen", Component: CanteenPage },
                            { path: "shops", Component: ShopsPage },
                            { path: "dormitory", Component: DormitoryPage },
                            { path: "building", Component: BuildingPage },
                            { path: "gate", Component: GatePage },
                        ]
                    },
                    {
                        path: "devices",
                        children: [
                            { path: "drones", Component: DronesPage },
                            { path: "drones/:id", Component: DroneDetailPage },
                            { path: "hangars", Component: HangarsPage },
                            { path: "batteries", Component: BatteriesPage },
                            { path: "maintenance", Component: MaintenancePage },
                        ]
                    },
                    {
                        path: "settings",
                        children: [
                            { path: "users", Component: UsersPage },
                            { path: "roles", Component: RolesPage },
                            { path: "logs", Component: LogsPage },
                            { path: "config", Component: ConfigPage },
                        ]
                    },
                    {
                        path: "flight",
                        children: [
                            { path: "routes", Component: FlightRoutesPage },
                            { path: "routes/teach", Component: FlightRouteTeachPage },
                            { path: "routes/:id", Component: FlightRouteDetailPage },
                        ]
                    },
                ],
            },
            { path: "*", Component: NotFoundPage },
        ],
    },
]);

export default router;