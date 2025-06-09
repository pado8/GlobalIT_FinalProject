import { Suspense, lazy } from "react";
import communityRouter from "../router/communityRouter";

const { createBrowserRouter } = require("react-router-dom");

const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/MainPage"))
const Community = lazy(() => import("../pages/community/CommunityPage"))

const root = createBrowserRouter([
    {
        path: "", element: <Suspense fallback={Loading}><Main /></Suspense>
    },
    {
        path: "community", element: <Suspense fallback={Loading}><Community /></Suspense>,
        children: communityRouter()
    },
])

export default root;