import React, { useState } from "react";
import SunEditor from "suneditor-react";
import PageHeader from "../../layout/layoutsection/pageHeader/pageHeader";
import Select from "react-select";
import { toast } from "react-toastify";
import Filemanagermain from "../pagecomponent/fileManager/filemanagermain";
import { useNavigate } from "react-router-dom";

const AddPreProjects = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: "",
    slug: "",
    description: "",
    status: "",
  });

  const [image, setImage] = useState("");
  const [managerOpener, setManagerOpener] = useState();

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setInput((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "name") {
        newState.slug = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/\?/g, "-");
      }
      return newState;
    });
  };

  const SubmitData = () => {
    const newData = {
      name: input.name,
      slug: input.slug,
      description: input.description,
      status: input.status,
      image: JSON.stringify(image),
    };

    fetch(`${import.meta.env.VITE_CMS_URL}api/createpreprojects`, {
      method: "POST",
      body: JSON.stringify(newData),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("Added new service successfully");
          navigate("/cms/projects/service");
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        toast.error("Something went wrong: " + error.message);
      });
  };

  const handleSubmit = () => {
    if (!(input.name && input.description && input.status && image)) {
      toast.error("Please enter all required fields");
      return;
    }

    try {
      SubmitData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {managerOpener === 1 ? (
        <Filemanagermain
          file={image}
          ratio={1030 / 1285}
          fileSetter={setImage}
          openSetter={setManagerOpener}
        />
      ) : (
        <>
          <PageHeader
            currentpage="Add Industry"
            activepage="Pages"
            mainpage="Add Industry"
          />
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12">
              <div className="box">
                <div className="box-body space-y-5">
                  {/* Name */}
                  <div>
                    <label className="ti-form-label">Name</label>
                    <input
                      type="text"
                      className="ti-form-input"
                      placeholder="Enter name"
                      name="name"
                      value={input.name}
                      onChange={handleChangeValue}
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="ti-form-label">Slug</label>
                    <input
                      type="text"
                      className="ti-form-input"
                      placeholder="Slug"
                      name="slug"
                      value={input.slug}
                      disabled
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="ti-form-label">Description</label>
                    <SunEditor
                      height="260"
                      setContents={input.description}
                      name="description"
                      onChange={(value) =>
                        setInput((prev) => ({ ...prev, description: value }))
                      }
                      setOptions={{
                        buttonList: [
                          ["undo", "redo"],
                          ["bold", "italic", "underline"],
                          ["fontColor", "hiliteColor"],
                          ["align", "list"],
                          ["link", "image"],
                          ["removeFormat"],
                        ],
                        defaultTag: "div",
                        minHeight: "300px",
                      }}
                    />
                  </div>

                  {/* Image */}
                  <div className="box">
                    <div className="box-header flex justify-between">
                      <h5 className="box-title">Image</h5>
                      <span className="text-sm font-thin underline text-red-500">
                        1 Image allowed Only
                      </span>
                    </div>
                    <div className="box-body">
                      <div onClick={() => setManagerOpener(1)}>
                        <button
                          type="button"
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus"></i>
                        </button>
                        <div className="grid grid-cols-12 gap-x-2 mt-3">
                          {image &&
                            image.map((pathFile, i) => (
                              <img
                                key={i}
                                src={`${
                                  import.meta.env.VITE_CMS_URL
                                }api/transform/${pathFile}`}
                                className="col-span-4 h-32 rounded-sm"
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-3">
                    <label className="ti-form-label">Status</label>
                    <Select
                      classNamePrefix="react-select"
                      name="status"
                      options={[
                        { value: 1, label: "Enable" },
                        { value: 0, label: "Disable" },
                      ]}
                      value={
                        input.status === 1
                          ? { value: 1, label: "Enable" }
                          : input.status === 0
                          ? { value: 0, label: "Disable" }
                          : null
                      }
                      onChange={(val) =>
                        setInput((prev) => ({ ...prev, status: val.value }))
                      }
                      placeholder="Select Status"
                    />
                  </div>
                </div>

                <div className="box-footer bg-transparent mt-5">
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="py-2 px-3 ti-btn ti-btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddPreProjects;
