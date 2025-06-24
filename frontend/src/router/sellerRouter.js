// src/router/sellerRouter.js
import { Suspense, lazy } from "react";

const SellerList = lazy(() => import("../pages/seller/SellerListPage"));
const SellerRegister = lazy(() => import("../pages/seller/SellerRegisterPage"));
const SellerModify = lazy(() => import("../pages/seller/SellerModifyPage"));
const OrderList = lazy(() => import("../pages/request/OrderListPage"))

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
      <Suspense fallback={Loading}>
        <SellerRegister/>
      </Suspense>
    ),
  },
  {
    path: "modify", // 임시 라우트 추가
    element: (
      <Suspense fallback={Loading}>
        <SellerModify />
      </Suspense>
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
];

export default sellerRouter;
