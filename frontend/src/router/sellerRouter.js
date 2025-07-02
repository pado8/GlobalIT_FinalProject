// src/router/sellerRouter.js
import { Suspense, lazy } from "react";

const SellerList = lazy(() => import("../pages/seller/SellerListPage"));
const SellerRegister = lazy(() => import("../pages/seller/SellerRegisterPage"));
const SellerModify = lazy(() => import("../pages/seller/SellerModifyPage"));
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
      <Suspense fallback={Loading}>
        <SellerRegister/>
      </Suspense>
    ),
  }
];

export default sellerRouter;
