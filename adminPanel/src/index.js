import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import "font-awesome/css/font-awesome.min.css";
import "./index.scss";
import Spinner from "./components/spinner/spinner";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';


const LazyApp = lazy(() => import("./app/app"));
ReactDOM.render(
   <Suspense fallback={<Spinner />}>
      <LazyApp />
   </Suspense>,
   document.getElementById("root")
);
// registerServiceWorker();
