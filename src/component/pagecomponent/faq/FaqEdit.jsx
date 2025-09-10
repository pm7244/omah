import React, { useEffect, useState } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import Select from "react-select";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";
import { useNavigate, useParams } from "react-router-dom";

const FaqEdit = () => {
  const { id } = useParams();
  const [input, setInput] = useState();
  const [logo1, setLogo1] = useState("");
  const [logo2, setLogo2] = useState("");
  const [managerOpener, setManagerOpener] = useState();

  const navigate = useNavigate();

  const fetchData = (id) => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallwebfaqs`)
      .then((res) => res.json())
      .then((data) => {
        let rawLogo1 = JSON.parse(data.data[0].cover_url);
        let rawLogo2 = JSON.parse(data.data[0].images);
        setLogo1(rawLogo1);
        setLogo2(rawLogo2);
        setInput({ ...data.data[0], cover_url: rawLogo1, images: rawLogo2 });
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchData(id);
  }, []);

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const SubmitData = (id) => {
    const newData = {
      ...input,
      cover_url: JSON.stringify(input.cover_url),
      images: JSON.stringify(input.images),
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidwebfaqs/${id}`, {
      method: "PUT",
      body: JSON.stringify(newData),
      headers: { "Content-Type": "application/json" },
    })
      .then(toast.success(" Data Updated"))
      .catch((err) => {
        toast.message(err.message);
        console.log(err.message);
      });
  };

  const handleSubmit = () => {
    if (
      !(
        input.title &&
        input.meta_title &&
        input.meta_description &&
        input.description &&
        input.breadcrumb_name &&
        input.slug
      )
    ) {
      toast.error("Please enter all field");
      return;
    }
    try {
      SubmitData(input.id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (logo1 && logo2) {
      setInput(
        (prv) => (prv = { ...prv, cover_url: [...logo1], images: [...logo2] })
      );
    }
  }, [logo1, logo2]);

  return (
    input && (
      <div>
        {managerOpener == 1 ? (
          <Filemanagermain
            file={logo1}
            ratio={input.cover_dimension}
            fileSetter={setLogo1}
            openSetter={setManagerOpener}
          />
        ) : managerOpener == 2 ? (
          <Filemanagermain
            file={logo2}
            ratio={input.image_dimension}
            fileSetter={setLogo2}
            openSetter={setManagerOpener}
          />
        ) : (
          <>
            <PageHeader currentpage="FAQ" activepage="Pages" mainpage="FAQ" />
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12 xxl:col-span-8">
                <div className="box">
                  <div className="box-body space-y-5">
                    <div>
                      <label htmlFor="input-label1" className="ti-form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        className="ti-form-input"
                        placeholder="name"
                        value={input.title}
                        name="title"
                        onChange={(e) => handleChangeValue(e)}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-label1" className="ti-form-label">
                        Description
                      </label>
                      <textarea
                        type="text"
                        className="ti-form-input"
                        placeholder="Enter Description"
                        name="description"
                        value={input.description}
                        onChange={(e) => handleChangeValue(e)}
                      ></textarea>
                    </div>
                    {/* Logo1*/}
                    <div className="box">
                      <div className="box-header flex justify-between">
                        <h5 className="box-title">Cover Url</h5>
                        <span className="text-sm font-thin underline text-red-500">
                          1 Image allowed Only
                        </span>
                      </div>
                      <div className="box-body">
                        <div onClick={() => setManagerOpener(1)}>
                          <label className="block">
                            <span className="sr-only">Cover Url</span>
                            <button
                              type="button"
                              className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                            >
                              Change Image <i className="ti ti-file-plus "></i>
                            </button>
                            <div className="grid grid-cols-12 gap-x-2">
                              {input.cover_url &&
                                input.cover_url.map((pathFile, i) => {
                                  return (
                                    <img
                                      key={i}
                                      src={`${
                                        import.meta.env.VITE_CMS_URL
                                      }api/transform/${pathFile}`}
                                      className="col-span-4 h-32 rounded-t-sm"
                                    />
                                  );
                                })}
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* Logo 2 */}
                    <div className="box">
                      <div className="box-header flex justify-between">
                        <h5 className="box-title">Images</h5>
                        <span className="text-sm font-thin underline text-red-500">
                          1 Image allowed Only
                        </span>
                      </div>
                      <div className="box-body">
                        <div onClick={() => setManagerOpener(2)}>
                          <label className="block">
                            <span className="sr-only">Images</span>
                            <button
                              type="button"
                              className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                            >
                              Change Image <i className="ti ti-file-plus "></i>
                            </button>
                            <div className="grid grid-cols-12 gap-x-2">
                              {input.images &&
                                input.images.map((pathFile, i) => {
                                  return (
                                    <img
                                      key={i}
                                      src={`${
                                        import.meta.env.VITE_CMS_URL
                                      }api/transform/${pathFile}`}
                                      className="col-span-4 h-32 rounded-t-sm"
                                    />
                                  );
                                })}
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="sm:grid grid-cols-12 sm:gap-6 space-y-5 sm:space-y-0">
                      <div className="col-span-12 lg:col-span-6">
                        <label className="ti-form-label">Breadcrumb Name</label>
                        <input
                          type="text"
                          className="ti-form-input"
                          placeholder="Enter Breadcrumb Name"
                          value={input.breadcrumb_name}
                          name="breadcrumb_name"
                          onChange={(e) => handleChangeValue(e)}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <label className="ti-form-label">Slug</label>
                        <input
                          type="text"
                          className="ti-form-input"
                          placeholder="Enter Slug"
                          name="slug"
                          value={input.slug}
                          onChange={(e) => handleChangeValue(e)}
                        />
                      </div>
                      <div className="col-span-12 xxl:col-span-9 ">
                        <label className="ti-form-label">Meta Title</label>
                        <input
                          type="text"
                          className="ti-form-input"
                          placeholder="Enter Meta Title"
                          value={input.meta_title}
                          name="meta_title"
                          onChange={(e) => handleChangeValue(e)}
                          required
                        />
                      </div>
                      <div className="col-span-12 xxl:col-span-9 mt-3">
                        <label className="ti-form-label">
                          Meta Description
                        </label>
                        <textarea
                          className="ti-form-input"
                          rows="3"
                          placeholder="This is a textarea placeholder"
                          value={input.meta_description}
                          name="meta_description"
                          onChange={(e) => handleChangeValue(e)}
                        ></textarea>
                      </div>
                      <div className="col-span-12 xxl:col-span-9 mt-3">
                        <label className="ti-form-label">Status</label>
                        <Select
                          className="product-searchs"
                          classNamePrefix="react-select"
                          name="status"
                          options={[
                            { value: 1, label: "Enable" },
                            { value: 0, label: "Disable" },
                          ]}
                          value={[
                            input.status === 1
                              ? { value: 1, label: "Enable" }
                              : { value: 0, label: "Disable" },
                          ]}
                          onChange={(val) =>
                            setInput(
                              (prv) => (prv = { ...input, status: val.value })
                            )
                          }
                          placeholder="Status"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="box-footer bg-transparent">
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
    )
  );
};

export default FaqEdit;
