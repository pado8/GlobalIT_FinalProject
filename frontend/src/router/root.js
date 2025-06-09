import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";

const Main = lazy(() => import("../pages/MainPage"));
const Community = lazy(() => import("../pages/CommunityPage"));
const Loading = <div>Loading...</div>;
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={Loading}>
            <Main />
          </Suspense>
        ),
      },
      {
        path: "community",
        element: (
          <Suspense fallback={Loading}>
            <Community />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;