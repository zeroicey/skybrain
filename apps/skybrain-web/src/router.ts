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
                            { path: "multi", Component: MultiMonitorPage }
                        ]
                    },
                ],
            },
            { path: "*", Component: NotFoundPage },
        ],
    },
]);

export default router;
