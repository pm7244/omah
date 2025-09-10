import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const Blog = () => {
  const [file, setFile] = useState([]);
  const [image, setImage] = useState("");
  const [managerOpener, setManagerOpener] = useState(false);
  const [values, setValues] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallwebblog`)
      .then((res) => res.json())
      .then((data) => {
        const rawUrl = JSON.parse(data.data[0].cover_url);
        setFile(rawUrl);
        setValues({ ...data.data[0], cover_url: rawUrl });
      })
      .catch((err) => toast.error(err.message));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prv) => (prv = { ...values, [name]: value }));
  };

  const handleBlogSubmit = () => {
    if (
      !(
        values.title &&
        values.slug &&
        values.meta_title &&
        values.meta_description &&
        values.cover_url &&
        values.breadcrumb_name &&
        values.description
      )
    ) {
      toast.error("Please Fill all the fields!");
      return;
    }
    const data = { ...values, cover_url: JSON.stringify(values.cover_url) };
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidwebblog/1`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(toast.success("Blog Page updated succesfully"))
      .catch((err) => toast.error(err.message));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setValues((prv) => (prv = { ...prv, images: image }));
  }, [image]);
  useEffect(() => {
    setValues((prv) => (prv = { ...prv, cover_url: file }));
  }, [file]);

  return (
    values && (
      <>
        {managerOpener ? (
          <Filemanagermain
            file={file}
            ratio={values.dimension}
            fileSetter={setFile}
            openSetter={setManagerOpener}
          />
        ) : (
          <div>
            <PageHeader
              currentpage="Blog Us"
              activepage="Pages"
              mainpage="Blog Us"
            />
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12 xxl:col-span-8">
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Blog Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="Blog Title"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Blog Description
                    </label>
                    <textarea
                      name="description"
                      value={values.description}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      className="ti-form-input"
                      rows="5"
                    ></textarea>
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-4">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Meta Description
                    </label>
                    <textarea
                      name="meta_description"
                      value={values.meta_description}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      rows={4}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="meta description"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12">
                  <div className="col-span-12 xxl:col-span-6"></div>
                  <div className="col-span-12 xxl:col-span-6"></div>
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
                      name="breadcrumb_name"
                      value={values.breadcrumb_name}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
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
                      name="slug"
                      value={values.slug}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
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
                      value={[
                        values.status === 1
                          ? { value: 1, label: "Enable" }
                          : { value: 0, label: "Disable" },
                      ]}
                      classNamePrefix="react-select"
                      onChange={(val) => {
                        setValues(
                          (prv) => (prv = { ...prv, status: val.value })
                        );
                      }}
                      options={[
                        { value: 1, label: "Enable" },
                        { value: 0, label: "Disable" },
                      ]}
                      placeholder="Open this select menu"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-4">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="meta_title"
                      value={values.meta_title}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="meta title"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12">
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title"> Cover Url </h5>
                  </div>
                  <div className="box-body">
                    <div>
                      <span className="sr-only">Cover Url</span>
                      <label className="block">
                        <button
                          type="button"
                          onClick={() => setManagerOpener(1)}
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        <img
                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${
                            values.cover_url
                          }`}
                          className="box-img-top h-96 w-full
                       rounded-t-sm"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12"></div>
            </div>

            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12">
                <div className="box">
                  <div className="box-footer bg-transparent">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleBlogSubmit}
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
        )}
      </>
    )
  );
};
export default Blog;
