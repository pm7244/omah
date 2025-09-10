import React, { useState } from "react";
import ALLImages from "../../../common/imagesdata";
import Select from "react-dropdown-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
// registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

const Header = () => {
  // const [startDate, setStartDate] = useState(new Date()); //React date picker

  // const [files, setFiles] = useState([]); //file pond

  return (
    <div>
      <PageHeader
        currentpage="Header Us"
        activepage="Pages"
        mainpage="Header Us"
      />
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 xxl:col-span-8">
          <div className="box">
            <div className="box-body space-y-5">
              <label htmlFor="input-label1" className="ti-form-label">
                Header Title
              </label>
              <input
                type="text"
                id="input-label1"
                className="ti-form-input"
                placeholder="Header Title"
              />
            </div>
          </div>
          <div className="box">
            <div className="box-body space-y-5">
              <label htmlFor="input-label1" className="ti-form-label">
                Header Description
              </label>
              <textarea className="ti-form-input" rows="3"></textarea>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-12 xxl:col-span-6">
              <div className="box">
                <div className="box-body space-y-4">
                  <label htmlFor="input-label1" className="ti-form-label">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="input-label1"
                    className="ti-form-input"
                    placeholder="meta title"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-12 xxl:col-span-6">
              {" "}
              <div className="box">
                <div className="box-body space-y-4">
                  <label htmlFor="input-label1" className="ti-form-label">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    id="input-label1"
                    className="ti-form-input"
                    placeholder="meta description"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 xxl:col-span-4">
          <div className="box">
            <div className="box-body space-y-4">
              <label htmlFor="input-label1" className="ti-form-label">
                Breadcrumb name
              </label>
              <input
                type="text"
                id="input-label1"
                className="ti-form-input"
                placeholder="breadcrum"
              />
            </div>
          </div>
          <div className="box">
            <div className="box-body space-y-4">
              <label htmlFor="input-label1" className="ti-form-label">
                Slug
              </label>
              <input
                type="text"
                id="input-label1"
                className="ti-form-input"
                placeholder="slug"
              />
            </div>
          </div>

          <div className="box">
            <div className="box-header">
              <h5 className="box-title">Status</h5>
            </div>
            <div className="box-body">
              <Select
                classNamePrefix="react-select"
                // options={}
                placeholder="Open this select menu"
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-body space-y-5">
              <label
                htmlFor="input-label"
                className="ti-form-label text-medium"
              >
                Vision Description
              </label>
              <SunEditor
                setOptions={{
                  buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize"],
                    ["paragraphStyle", "blockquote"],
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "subscript",
                      "superscript",
                    ],
                    ["fontColor", "hiliteColor"],
                    ["align", "list", "lineHeight"],
                    ["outdent", "indent"],
                    ["table", "horizontalRule", "link", "image", "video"],
                    ["preview", "print"],
                    ["removeFormat"],
                  ],
                  defaultTag: "div",
                  minHeight: "300px",
                  showPathLabel: false,
                  attributesWhitelist: {
                    all: "style",
                    table: "cellpadding|width|cellspacing|height|style",
                    tr: "valign|style",
                    td: "styleinsert|height|style",
                    img: "title|alt|src|style",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>  */}

      {/* <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-body space-y-5">
              <label
                htmlFor="input-label"
                className="ti-form-label text-medium"
              >
                Mission Description
              </label>
              <SunEditor
                setOptions={{
                  buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize"],
                    ["paragraphStyle", "blockquote"],
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "subscript",
                      "superscript",
                    ],
                    ["fontColor", "hiliteColor"],
                    ["align", "list", "lineHeight"],
                    ["outdent", "indent"],
                    ["table", "horizontalRule", "link", "image", "video"],
                    ["preview", "print"],
                    ["removeFormat"],
                  ],
                  defaultTag: "div",
                  minHeight: "300px",
                  showPathLabel: false,
                  attributesWhitelist: {
                    all: "style",
                    table: "cellpadding|width|cellspacing|height|style",
                    tr: "valign|style",
                    td: "styleinsert|height|style",
                    img: "title|alt|src|style",
                  },
                }}
              />
            </div>
            <div className="box-footer bg-transparent">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="py-2 px-3 ti-btn ti-btn-secondary"
                >
                  Save To Draft
                </button>
                <button
                  type="button"
                  className="py-2 px-3 ti-btn ti-btn-primary"
                >
                  Publish Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-body space-y-5">
              <div>
                <label className="block">
                  <span className="sr-only">Cover Image</span>
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500 dark:text-white/70 focus:outline-0 ltr:file:mr-4 rtl:file:ml-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary focus-visible:outline-none"
                  />
                  <img
                    src={ALLImages("jpg22")}
                    className="box-img-top h-1/6  rounded-t-sm"
                    alt="cover image"
                  />
                </label>
              </div>
            </div>
            <div className="box">
              <div className="box-footer bg-transparent">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="py-2 px-3 ti-btn ti-btn-primary"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
