import { Suspense, lazy } from "react";

const { createBrowserRouter } = require("react-router-dom");

const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/MainPage"))
const Community = lazy(() => import("../pages/CommunityPage"))
const SellerList = lazy(() => import("../pages/SellerListPage"))

const root = createBrowserRouter([
    {
        path: "", element: <Suspense fallback={Loading}><Main /></Suspense>
    },
    {
        path: "community", element: <Suspense fallback={Loading}><Community /></Suspense>
    },
    {
        path: "sellerlist", element: <Suspense fallback={Loading}><SellerList /></Suspense>
    },
])

export default root;