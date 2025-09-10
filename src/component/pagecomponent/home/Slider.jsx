import React, { useEffect, useState } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const AddSlider = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    title: "",
    description: "",
    slider_image: "",
    slug: "",
    status: 1,
  });

  const [image, setImage] = useState("");
  const [managerOpener, setManagerOpener] = useState(false);

  const dataSubmiter = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/createslider`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, slider_image: JSON.stringify(image) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("succesful");
          navigate(`/cms/pages/home`);
        } else {
          toast.error(data.error);
        }
      })

      .catch((err) => toast.error(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    setValues((prv) => (prv = { ...prv, slider_image: image }));
  }, [image]);

  return (
    <>
      {managerOpener ? (
        <Filemanagermain
          file={image}
          ratio={1920 / 300}
          fileSetter={setImage}
          openSetter={setManagerOpener}
        />
      ) : (
        <div>
          <PageHeader
            currentpage="Add Slider"
            activepage="Pages"
            mainpage="Add Slider"
          />
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12">
              <div className="box !bg-transparent border-0 shadow-none">
                <div className="box-body p-0">
                  <div className="col-span-12 xl:col-span-6">
                    <div className="box ">
                      <div className="box-body">
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="ti-form-label mb-0">Title</label>
                            <input
                              type="text"
                              name="title"
                              value={values.title}
                              onChange={(e) => handleInputChange(e)}
                              className="my-auto ti-form-input"
                              placeholder="Slider Title"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="ti-form-label">Description</label>
                            <textarea
                              name="description"
                              value={values.description}
                              onChange={(e) => handleInputChange(e)}
                              className="ti-form-input"
                              rows="2"
                            ></textarea>
                            <label className="ti-form-label mt-1 text-sm font-normal opacity-70 text-gray-500 dark:text-white/70 mb-0">
                              *Description should not exceed 500 letters
                            </label>
                          </div>
                          <div className="space-y-2">
                            <label className="ti-form-label">Slug</label>
                            <input
                              type="text"
                              name="slug"
                              value={values.slug}
                              onChange={(e) => handleInputChange(e)}
                              className="ti-form-input"
                            ></input>
                            <label className="ti-form-label mt-1 text-sm font-normal opacity-70 text-gray-500 dark:text-white/70 mb-0">
                              *Slug should not exceed 100 letters
                            </label>
                          </div>
                          <div className="space-y-2">
                            <label className="block">
                              <div className="box-header flex justify-between">
                                <h5 className="box-title">Slider Image</h5>
                                <span className="text-sm font-thin underline text-red-500">
                                  1 Image allowed Only
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setManagerOpener(1)}
                                className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                              >
                                Change Image
                                <i className="ti ti-file-plus "></i>
                              </button>
                              <img
                                src={`${
                                  import.meta.env.VITE_CMS_URL
                                }api/transform/${values.slider_image}`}
                                className="box-img-top h-72 rounded-t-sm"
                              />
                            </label>
                          </div>
                          <div className="col-span-12 lg:col-span-6">
                            <div className="space-y-2  product-1">
                              <label className="ti-form-label mb-0">
                                Status
                              </label>
                              <Select
                                className="product-search"
                                onChange={(val) =>
                                  setValues(
                                    (prv) =>
                                      (prv = { ...values, status: val.value })
                                  )
                                }
                                value={[
                                  values.status
                                    ? { value: 1, label: "Enable" }
                                    : { value: 0, label: "Disable" },
                                ]}
                                classNamePrefix="react-select"
                                options={[
                                  { value: 1, label: "Enable" },
                                  { value: 0, label: "Disable" },
                                ]}
                                placeholder="Visibility"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-footer text-end border-t-0 px-0">
                  <button
                    onClick={dataSubmiter}
                    className="ti-btn ti-btn-primary"
                  >
                    <i className="ri-add-line"></i>Add Slider
                  </button>
                  <Link to={`/cms/pages/home`} className="ti-btn ti-btn-danger">
                    <i className="ri-delete-bin-line"></i>Discard Slider
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AddSlider;
