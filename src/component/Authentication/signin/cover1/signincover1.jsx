import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "../../../../layout/AuthContext";
import ALLImages from "../../../../common/imagesdata";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SignInCover1 = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const submitData = async (e) => {
    e.preventDefault();
    const status = await login({ username, password });
    if (status.status === "success") {
      navigate("/cms/");
    }
  };

  return (
    <div className="flex justify-center min-h-screen align-middle">
      <ToastContainer />
      <Helmet>
        <html dir="ltr" className="h-full"></html>
        <body className="cover1 justify-center"></body>
      </Helmet>
      <main id="content" className="w-full max-w-md mx-auto my-auto p-6">
        <Link to={`/cms/`} className="header-logo">
          <img src={ALLImages("omahLogo")} alt="Omah Logo" className="mx-auto block" width={200} />
        </Link>
        <div className="mt-7 bg-white rounded-sm shadow-sm dark:bg-bgdark">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Sign in
              </h1>
            </div>
            <form onSubmit={submitData}>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="Username"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="Username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                      required
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="shrink-0 mt-0.5 border-gray-200 rounded text-primary pointer-events-none focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:checked:bg-primary dark:checked:border-primary dark:focus:ring-offset-white/10"
                    />
                  </div>
                  <div className="ltr:ml-3 rtl:mr-3">
                    <label
                      htmlFor="remember-me"
                      className="text-sm dark:text-white"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-sm border border-transparent font-semibold bg-primary text-white hover:bg-primary focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 transition-all text-sm dark:focus:ring-offset-white/10"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInCover1;
