import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import ModuleLayout from "@/components/layout/module-layout";
import RootLayout from "@/components/layout/root-layout";

const IndexPage = lazy(() => import("@/pages/index"));
const NotFoundPage = lazy(() => import("@/pages/404"));
const ErrorPage = lazy(() => import("@/pages/error"));

const LoginPage = lazy(() => import("@/pages/auth/login"));
const RegisterPage = lazy(() => import("@/pages/auth/register"));

const MultiMonitorPage = lazy(() => import("@/pages/modules/monitor/multi-monitor-page"));
const MonitorLivePage = lazy(() => import("@/pages/modules/monitor/live-page"));
const MonitorPlaybackPage = lazy(() => import("@/pages/modules/monitor/playback-page"));

const TaskListPage = lazy(() => import("@/pages/modules/task/task-list-page"));
const TaskDetailPage = lazy(() => import("@/pages/modules/task/task-detail-page"));
const TaskCreatePage = lazy(() => import("@/pages/modules/task/task-create-page"));
const TaskEditPage = lazy(() => import("@/pages/modules/task/task-edit-page"));
const TaskSchedulePage = lazy(() => import("@/pages/modules/task/task-schedule-page"));
const TaskLogsPage = lazy(() => import("@/pages/modules/task/task-logs-page"));


const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        ErrorBoundary: ErrorPage,
        children: [
            { index: true, Component: IndexPage },
            { path: "login", Component: LoginPage },
            { path: "register", Component: RegisterPage },
            {
                Component: ModuleLayout,
                children: [
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
                ],
            },
            { path: "*", Component: NotFoundPage },
        ],
    },
]);

export default router;