import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const Career = () => {
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState([]);
  const [managerOpener, setManagerOpener] = useState(false);
  const [values, setValues] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallcareer`)
      .then((res) => res.json())
      .then((data) => {
        const rawUrl = JSON.parse(data.data[0].cover_url);
        const rawImage = JSON.parse(data.data[0].images);
        setImage(rawImage);
        setFiles(rawUrl);
        setValues({ ...data.data[0], cover_url: rawUrl, images: rawImage });
      })
      .catch((err) => toast.error(err.message));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prv) => (prv = { ...values, [name]: value }));
  };

  const handleCareerSubmit = () => {
    if (
      !(
        values.title &&
        values.slug &&
        values.meta_title &&
        values.meta_description &&
        values.cover_url &&
        values.images &&
        values.breadcrumb_name &&
        values.description
      )
    ) {
      toast.error("Please Fill all the fields!");
      return;
    }
    const data = {
      ...values,
      images: JSON.stringify(values.images),
      cover_url: JSON.stringify(values.cover_url),
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidcareer/1`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(toast.success("Career Page updated succesfully"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setValues((prv) => (prv = { ...prv, cover_url: files }));
  }, [files]);

  useEffect(() => {
    setValues((prv) => (prv = { ...prv, images: image }));
  }, [image]);

  return (
    values && (
      <>
        {managerOpener === 1 ? (
          <Filemanagermain
            file={files}
            ratio={values.cover_dimension}
            fileSetter={setFiles}
            openSetter={setManagerOpener}
          />
        ) : managerOpener === 2 ? (
          <Filemanagermain
            file={image}
            ratio={values.image_dimension}
            fileSetter={setImage}
            openSetter={setManagerOpener}
          />
        ) : (
          <div>
            <PageHeader
              currentpage="Career Us"
              activepage="Pages"
              mainpage="Career Us"
            />
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12 xxl:col-span-8">
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Career Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={(e) => handleInputChange(e)}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="Career Title"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Career Description
                    </label>
                    <textarea
                      value={values.description}
                      onChange={(e) => handleInputChange(e)}
                      name="description"
                      className="ti-form-input"
                      rows="3"
                    ></textarea>
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
                          name="meta_title"
                          value={values.meta_title}
                          onChange={(e) => handleInputChange(e)}
                          id="input-label1"
                          className="ti-form-input"
                          placeholder="meta title"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 xxl:col-span-6">
                    <div className="box">
                      <div className="box-body space-y-4">
                        <label htmlFor="input-label1" className="ti-form-label">
                          Meta Description
                        </label>
                        <input
                          type="text"
                          name="meta_description"
                          value={values.meta_description}
                          onChange={(e) => handleInputChange(e)}
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
                      name="breadcrumb_name"
                      value={values.breadcrumb_name}
                      onChange={(e) => handleInputChange(e)}
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
                      onChange={(e) => handleInputChange(e)}
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
                      options={[
                        { value: 1, label: "Enable" },
                        { value: 0, label: "Disable" },
                      ]}
                      onChange={(val) =>
                        setValues(
                          (prv) => (prv = { ...values, status: val.value })
                        )
                      }
                      placeholder="Open this select menu"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12">
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title"> Cover URl</h5>
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
                          className="box-img-top h-40 w-full
                       rounded-t-sm"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="box">
                  <div className="box-header">
                    <div className="box-title">Image</div>
                  </div>
                  <div className="box-body">
                    <div>
                      <span className="sr-only">Image</span>
                      <label className="block">
                        <button
                          type="button"
                          onClick={() => setManagerOpener(2)}
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        <img
                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${
                            values.images
                          }`}
                          className="box-img-top h-52
                       rounded-t-sm"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="box">
                    <div className="box-footer bg-transparent">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={handleCareerSubmit}
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
        )}{" "}
      </>
    )
  );
};
export default Career;
