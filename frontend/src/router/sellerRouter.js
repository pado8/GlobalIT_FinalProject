// src/router/sellerRouter.js
import { Suspense, lazy } from "react";
import RequireAuth from "../components/RequireAuth.js"

const SellerList = lazy(() => import("../pages/seller/SellerListPage"));
const SellerRegister = lazy(() => import("../pages/seller/SellerRegisterPage"));
const SellerModify = lazy(() => import("../pages/seller/SellerModifyPage"));
const OrderList = lazy(() => import("../pages/request/OrderListPage"));
const BizRegister = lazy(() => import("../pages/biz/BizRegisterPage.js"))

const Loading = <div>Loading...</div>;

const sellerRouter = () => [
  {
    path: "",
    element: (
      <Suspense fallback={Loading}>
        <SellerList />
      </Suspense>
    ),
  },
  {
    path: "register",
    element: (
      <RequireAuth>
      <Suspense fallback={Loading}>
        <SellerRegister/>
      </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: "modify", // 임시 라우트 추가
    element: (
      <RequireAuth>
      <Suspense fallback={Loading}>
        <SellerModify />
      </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: "orderlist", // 임시 라우트 추가
    element: (
      <Suspense fallback={Loading}>
        <OrderList/>
      </Suspense>
    ),
  },
  {
    path: "bizregister", // 임시 라우트 추가
    element: (
      <Suspense fallback={Loading}>
        <BizRegister/>
      </Suspense>
    ),
  },
];

export default sellerRouter;
