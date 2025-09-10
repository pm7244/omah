import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import Filemanagermain from "../fileManager/filemanagermain";

const AddFAQ = () => {
  const navigate = useNavigate();
  const [managerOpener, setManagerOpener] = useState();
  const [formValue, setFormValue] = useState({
    title: "",
    description: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    breadcrumb_name: "",
    status: 1,
  });

  const [cover_url, setCoverUrl] = useState("");
  const [images, setImages] = useState("");

  const SubmitData = () => {
    const newData = {
      ...formValue,
      cover_url: JSON.stringify(cover_url),
      images: JSON.stringify(images),
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/createwebfaqs`, {
      method: "POST",
      body: JSON.stringify(newData),
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("Added new Data Successfully");
          navigate(`/cms/pages/faq`);
        }
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err.message);
      });
  };

  const handleSubmit = () => {
    if (
      !(
        formValue.title &&
        formValue.description &&
        formValue.breadcrumb_name &&
        formValue.slug &&
        formValue.meta_title &&
        formValue.meta_description
      )
    ) {
      toast.error("Please fill all field");
      return;
    }
    try {
      SubmitData();
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      {managerOpener == 1 ? (
        <Filemanagermain
          file={cover_url}
          fileSetter={setCoverUrl}
          openSetter={setManagerOpener}
          ratio={16 / 9}
        />
      ) : managerOpener == 2 ? (
        <Filemanagermain
          file={images}
          fileSetter={setImages}
          openSetter={setManagerOpener}
          ratio={16 / 9}
        />
      ) : (
        <>
          <PageHeader
            currentpage="Add FAQ"
            activepage="Pages"
            mainpage="Add FAQ"
          />
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
                      name="title"
                      value={formValue.title}
                      onChange={handleInputChange}
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
                      value={formValue.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  {/* cover url*/}
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
                            {cover_url &&
                              cover_url.map((pathFile, i) => {
                                return (
                                  <img
                                    key={i}
                                    src={`${
                                      import.meta.env.VITE_PORT_NO
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
                  {/* images*/}
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
                            {images &&
                              images.map((pathFile, i) => {
                                return (
                                  <img
                                    key={i}
                                    src={`${
                                      import.meta.env.VITE_PORT_NO
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
                        name="breadcrumb_name"
                        value={formValue.breadcrumb_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                      <label className="ti-form-label">Slug</label>
                      <input
                        type="text"
                        className="ti-form-input"
                        placeholder="Enter Slug"
                        name="slug"
                        value={formValue.slug}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-12 xxl:col-span-9 ">
                      <label className="ti-form-label">Meta Title</label>
                      <input
                        type="text"
                        className="ti-form-input"
                        placeholder="Enter Meta Title"
                        name="meta_title"
                        value={formValue.meta_title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-12 xxl:col-span-9 mt-3">
                      <label className="ti-form-label">Meta Description</label>
                      <textarea
                        className="ti-form-input"
                        rows="3"
                        placeholder="This is a textarea placeholder"
                        name="meta_description"
                        value={formValue.meta_description}
                        onChange={handleInputChange}
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
                          formValue.status === 1
                            ? { value: 1, label: "Enable" }
                            : { value: 0, label: "Disable" },
                        ]}
                        onChange={(val) =>
                          setFormValue((prv) => (prv = { status: val.value }))
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
      )}{" "}
    </div>
  );
};

export default AddFAQ;
