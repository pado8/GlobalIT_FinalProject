import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../components/Layout";
import communityRouter from "../router/communityRouter";
import requestRouter from "../router/requestRouter";

const Main = lazy(() => import("../pages/MainPage"));
const Community = lazy(() => import("../pages/community/CommunityPage"));
const SellerList = lazy(() => import("../pages/SellerListPage"));
const SellerRegister = lazy(() => import("../pages/SellerRegisterPage"));

const Login = lazy(() => import("../pages/login/LoginPage"));
const Signup = lazy(() => import("../pages/login/SignupPage"));
const Signups = lazy(() => import("../pages/login/SignupPageSeller"));
const Request = lazy(() => import("../pages/request/OrderMaster"));

const Loading = <div>Loading...</div>;
const root = createBrowserRouter([
  //주석:: 로그인,회원가입은 네비게이션 바 미적용
  {
    path: "login",
    element: (
      <Suspense fallback={Loading}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "signup",
    element: (
      <Suspense fallback={Loading}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "signups",
    element: (
      <Suspense fallback={Loading}>
        <Signups />
      </Suspense>
    ),
  },

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
        children: communityRouter(),
      },
      {
        path: "request", element: <Suspense fallback={Loading}><Request /></Suspense>,
        children: requestRouter(),
      },
      {
        path: "sellerlist", element: <Suspense fallback={Loading}><SellerList /></Suspense>
      },
      {
        path: "sellerlist/register", element: <Suspense fallback={Loading}><SellerRegister mno={1}/></Suspense>
      },
    ],
  },
]);

export default root;
