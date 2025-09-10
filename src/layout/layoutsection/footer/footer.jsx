import React, { Fragment } from "react";

const Footer = () => {
  return (
    <Fragment>
      <footer className="mt-auto py-3 border-t dark:border-white/10 bg-white dark:bg-bgdark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center">
            Copyright © <span id="year">2025</span>
            <a href="#" className="text-primary">
              Comet Digisol
            </a>
            . <span className="ri ri-heart-fill text-red-500"></span> by{" "}
            <a className="text-primary" href="#"></a>
            All rights reserved
          </p>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;
