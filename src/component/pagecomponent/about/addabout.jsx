import React, { useState } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // SunEditor styles

const AddAbout = () => {
  const navigate = useNavigate();

  const [managerOpener, setManagerOpener] = useState(false);
  const [b_title, setBTitle] = useState("");
  const [b_des, setBDes] = useState("");
  const [b_image, setBImage] = useState([]);
  const [status, setStatus] = useState(1);

  const handleSubmit = () => {
    if (!(b_title && b_des)) {
      toast.error("Please fill all required fields");
      return;
    }

    const newData = {
      b_title,
      b_des,
      b_image: JSON.stringify(b_image),
      status,
    };

    fetch(`${import.meta.env.VITE_CMS_URL}api/create-about`, {
      method: "POST",
      body: JSON.stringify(newData),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("About section created successfully");
          navigate(`/cms/general/about`);
        } else {
          toast.error("Creation failed");
        }
      })
      .catch((err) => toast.error(err.message));
  };

  return managerOpener ? (
    <Filemanagermain
      file={b_image}
      ratio={120 / 100}
      fileSetter={setBImage}
      openSetter={setManagerOpener}
    />
  ) : (
    <div>
      <PageHeader currentpage="Add About" activepage="General" mainpage="Add About" />
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12">
          <div className="box !bg-transparent border-0 shadow-none">
            <div className="box-body p-0">
              <div className="col-span-12">
                <div className="box">
                  <div className="box-body space-y-4">
                    {/* Title */}
                    <div>
                      <label className="ti-form-label">Title</label>
                      <input
                        type="text"
                        className="ti-form-input"
                        value={b_title}
                        onChange={(e) => setBTitle(e.target.value)}
                        placeholder="Enter title"
                      />
                    </div>

                    {/* Description / Overview */}
                    <div>
                      <label htmlFor="b_des" className="ti-form-label">
                        Overview
                      </label>
                      <SunEditor
                        height="300px"
                        setContents={b_des}
                        onChange={(content) => setBDes(content)}
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
                        }}
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="ti-form-label">Cover Image</label>
                      <div onClick={() => setManagerOpener(true)}>
                        <button
                          type="button"
                          className="ti-btn ti-btn-outline ti-btn-outline-primary"
                        >
                          Select Image <i className="ti ti-file-plus"></i>
                        </button>
                      </div>
                      <div className="grid grid-cols-12 gap-x-2 mt-2">
                        {b_image &&
                          b_image.map((img, i) => (
                            <img
                              key={i}
                              src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                              className="col-span-4 h-32 rounded-sm"
                              alt="preview"
                            />
                          ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="ti-form-label">Status</label>
                      <Select
                        classNamePrefix="react-select"
                        options={[
                          { value: 1, label: "Enable" },
                          { value: 0, label: "Disable" },
                        ]}
                        value={[
                          status === 1
                            ? { value: 1, label: "Enable" }
                            : { value: 0, label: "Disable" },
                        ]}
                        onChange={(val) => setStatus(val.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="box-footer text-end border-t-0 px-0 mt-4">
              <button className="ti-btn ti-btn-primary" onClick={handleSubmit}>
                <i className="ri-add-line"></i> Add About
              </button>
              <Link to="#" className="ti-btn ti-btn-danger ml-2">
                <i className="ri-delete-bin-line"></i> Discard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAbout;
