import React, { useState } from "react";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Filemanagermain from "../fileManager/filemanagermain";

const BuyersAdd = () => {
  const [coverImage, setCoverImage] = useState("");
  const [managerOpener, setManagerOpener] = useState(false);

  const navigate = useNavigate();

  const SubmitData = () => {
    const SubmitterData = {
      ...formInput,
      cover_image: JSON.stringify(coverImage),
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/createbuyer`, {
      method: "POST",
      body: JSON.stringify(SubmitterData),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("Added new data Successfully"),
            navigate(`/cms/pages/buyers-guide`);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const handleSubmit = () => {
    if (
      !(
        formInput.title &&
        formInput.question &&
        formInput.answer &&
        formInput.breadcumb_name
      )
    ) {
      toast.error("Please enter all field");
      return;
    }
    try {
      SubmitData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [formInput, setFormInput] = useState({
    title: "",
    question: "",
    breadcumb_name: "",
    answer: "",
    status: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      {managerOpener ? (
        <Filemanagermain
          file={coverImage}
          ratio={240 / 136}
          fileSetter={setCoverImage}
          openSetter={setManagerOpener}
        />
      ) : (
        <>
          <PageHeader
            currentpage="Add BuyerGuide"
            activepage="Pages"
            mainpage="Add BuyerGuide"
          />
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 xxl:col-span-10">
              <div className="box">
                <div className="box-body space-y-5">
                  <div>
                    <label htmlFor="input-label1" className="ti-form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="ti-form-input"
                      placeholder="Title"
                      value={formInput.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="input-label1" className="ti-form-label">
                      Question
                    </label>
                    <textarea
                      type="text"
                      rows={6}
                      name="question"
                      className="ti-form-input"
                      placeholder="Enter Question"
                      value={formInput.question}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="input-label1" className="ti-form-label">
                      Answer
                    </label>
                    <textarea
                      type="text"
                      name="answer"
                      rows={6}
                      className="ti-form-input"
                      placeholder="Enter Answer"
                      value={formInput.answer}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="input-label1" className="ti-form-label">
                      Breadcrumb Name
                    </label>
                    <input
                      type="text"
                      name="breadcumb_name"
                      className="ti-form-input"
                      placeholder="Breadcrumb name"
                      value={formInput.breadcumb_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <div className="box">
                      <div className="box-header flex justify-between">
                        <h5 className="box-title"> Cover Image</h5>
                        <span className="text-sm font-thin underline text-red-500">
                          1 Image allowed Only
                        </span>
                      </div>
                      <div className="box-body">
                        <div onClick={() => setManagerOpener(true)}>
                          <label className="block">
                            <span className="sr-only">Cover Image</span>
                            <button
                              type="button"
                              className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                            >
                              Select Image <i className="ti ti-file-plus "></i>
                            </button>
                            <div className="grid grid-cols-12 gap-x-2">
                              {coverImage &&
                                coverImage.map((pathFile, i) => {
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
                  </div>
                  <div className="sm:grid grid-cols-12 sm:gap-6 space-y-5 sm:space-y-0">
                    <div className="col-span-12 lg:col-span-6 blog-input">
                      <label className="ti-form-select-label">Status</label>
                      <Select
                        className="blog-tag3"
                        value={[
                          formInput.status === 1
                            ? { value: 1, label: "Enable" }
                            : { value: 0, label: "Disable" },
                        ]}
                        classNamePrefix="react-select"
                        options={[
                          { value: 1, label: "Enable" },
                          { value: 0, label: "Disable" },
                        ]}
                        onChange={(val) =>
                          setFormInput((prev) => ({
                            ...prev,
                            status: val.value,
                          }))
                        }
                        placeholder="Status"
                      />
                    </div>
                  </div>
                </div>
                <div className="box-footer bg-transparent">
                  <button
                    type="button"
                    className="py-2 px-3 ti-btn ti-btn-primary  float-end"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default BuyersAdd;
