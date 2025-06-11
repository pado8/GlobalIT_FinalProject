import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import communityRouter from "../router/communityRouter";
import requestRouter from "../router/requestRouter";

const Main = lazy(() => import("../pages/MainPage"));
const Community = lazy(() => import("../pages/community/CommunityPage"))
const Request = lazy(() => import("../pages/request/OrderMaster"))
const Loading = <div>Loading...</div>;
const root = createBrowserRouter([
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
        path: "community", element: <Suspense fallback={Loading}><Community /></Suspense>,
        children: communityRouter(),
      },
      {
        path: "request", element: <Suspense fallback={Loading}><Request /></Suspense>,
        children: requestRouter(),
      },
    ],
  },
]);

export default root;