import React, { Fragment, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backtotop from "./layoutsection/backtotop/backtotop";
import Footer from "./layoutsection/footer/footer";
import Header from "./layoutsection/header/header";
import Switcher from "./layoutsection/switcher/switcher";
import Sidebar from "./layoutsection/sidemenu/sidemenubar";
import { Provider } from "react-redux";
import store from "../redux/store";
import { useState } from "react";

const App = () => {
  let [MyclassName, setMyClass] = useState("");

  const Bodyclickk = () => {
    if (localStorage.getItem("Syntoverticalstyles") == "icontext") {
      setMyClass("");
    }
  };
  useEffect(() => {
    import("preline");
  }, []);
  return (
    <Fragment>
      <Provider store={store}>
        <Switcher />
        <div className="page">
          <ToastContainer />
          <Sidebar />
          <Header />
          <div className="content">
            <div className="main-content" onClick={Bodyclickk}>
              <Outlet />
            </div>
          </div>
          <Footer />
        </div>
        <Backtotop />
        <div id="responsive-overlay"></div>
      </Provider>
    </Fragment>
  );
};

export default App;
