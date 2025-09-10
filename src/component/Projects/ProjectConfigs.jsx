import React from "react";
import PageHeader from "../../layout/layoutsection/pageHeader/pageHeader";
import ProjectCategories from "./ProjectCategories";
import ProjectAmenities from "./ProjectAmenities";
import ProjectLocations from "./ProjectLocations";
import ProjectStatus from "./ProjectStatus";
import ProjectSubCategories from "./ProjectSubCategories";
import { Link } from "react-router-dom";
const ProjectConfigs = () => {
  return (
    <>
      <PageHeader
        currentpage="Project Configurations"
        activepage="Projects"
        mainpage="Project Configurations"
      />
      <div className="col-span-12">
        <div className="box">
          <div className="box-body">
            <div className="border-b-2 border-gray-200 dark:border-white/10">
              <nav className="-mb-0.5 flex space-x-6 rtl:space-x-reverse">
                <Link
                  className="hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500  dark:text-white/70 hover:text-primary active"
                  to="#"
                  id="underline-item-1"
                  data-hs-tab="#underline-1"
                  aria-controls="underline-1"
                >
                  Categories
                </Link>
                <Link
                  className="hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500  dark:text-white/70 hover:text-primary"
                  to="#"
                  id="underline-item-2"
                  data-hs-tab="#underline-2"
                  aria-controls="underline-2"
                >
                  Amenities
                </Link>
                <Link
                  className="hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500  dark:text-white/70 hover:text-primary"
                  to="#"
                  id="underline-item-3"
                  data-hs-tab="#underline-3"
                  aria-controls="underline-3"
                >
                  Location
                </Link>
                <Link
                  className="hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500  dark:text-white/70 hover:text-primary"
                  to="#"
                  id="underline-item-4"
                  data-hs-tab="#underline-4"
                  aria-controls="underline-4"
                >
                  Status
                </Link>
                <Link
                  className="hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500  dark:text-white/70 hover:text-primary"
                  to="#"
                  id="underline-item-5"
                  data-hs-tab="#underline-5"
                  aria-controls="underline-5"
                >
                  Sub-Categories
                </Link>
                <Link
                  className="hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500  dark:text-white/70 hover:text-primary"
                  to="#"
                  id="underline-item-6"
                  data-hs-tab="#underline-6"
                  aria-controls="underline-6"
                >
                  Options
                </Link>
              </nav>
            </div>

            <div className="mt-3">
              <div
                id="underline-1"
                role="tabpanel"
                aria-labelledby="underline-item-1"
              >
                <ProjectCategories />
              </div>
              <div
                id="underline-2"
                className="hidden"
                role="tabpanel"
                aria-labelledby="underline-item-2"
              >
                <ProjectAmenities />
              </div>
              <div
                id="underline-3"
                className="hidden"
                role="tabpanel"
                aria-labelledby="underline-item-3"
              >
                <ProjectLocations />
              </div>
              <div
                id="underline-4"
                className="hidden"
                role="tabpanel"
                aria-labelledby="underline-item-4"
              >
                <ProjectStatus />
              </div>
              <div
                id="underline-5"
                className="hidden"
                role="tabpanel"
                aria-labelledby="underline-item-5"
              >
                <ProjectSubCategories />
              </div>
              <div
                id="underline-6"
                className="hidden"
                role="tabpanel"
                aria-labelledby="underline-item-6"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectConfigs;
