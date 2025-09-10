import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Filemanagermain from "../fileManager/filemanagermain";

const BuyersEdit = () => {
  const navigate = useNavigate();
  const [blogValue, setBlogValue] = useState();
  const [managerOpener, setManagerOpener] = useState();
  const [cover_image, setCoverImg] = useState("");
  const { id } = useParams();

  const FetchById = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidbuyer/${id}`)
      .then((res) => res.json())
      .then((data) => {
        let img = JSON.parse(data.data[0].cover_image);
        setBlogValue({
          ...data.data[0],
          cover_image: img,
        });
        setCoverImg(img);
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err.message);
      });
  };

  useEffect(() => {
    FetchById();
  }, []);

  const SubmitData = (id) => {
    const SubmitterData = {
      ...blogValue,
      cover_image: JSON.stringify(cover_image),
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidbuyer/${id}`, {
      method: "PUT",
      body: JSON.stringify(SubmitterData),
      headers: { "Content-Type": "application/json" },
    })
      .then(toast.success("Data Updated Successfully"))
      .then(navigate(`/cms/pages/buyers-guide`))
      .catch((err) => toast.error(err.message));
  };
  const handleSubmit = () => {
    if (
      !(
        blogValue.title &&
        blogValue.question &&
        blogValue.answer &&
        blogValue.breadcumb_name
      )
    ) {
      toast.error("Please enter all field");
      return;
    }
    try {
      SubmitData(blogValue.blog_id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setBlogValue({ ...blogValue, [name]: value });
  };

  useEffect(() => {
    if (cover_image) {
      setBlogValue(
        (prv) =>
          (prv = {
            ...prv,
            cover_image: [...cover_image],
          })
      );
    }
  }, [cover_image]);

  return (
    blogValue && (
      <div>
        {managerOpener ? (
          <Filemanagermain
            file={cover_image}
            fileSetter={setCoverImg}
            openSetter={setManagerOpener}
            ratio={blogValue.dimension}
          />
        ) : (
          <>
            <div>
              <PageHeader
                currentpage="Edit Buyers Guide"
                activepage="Pages"
                mainpage="Edit Buyers Guide"
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
                          name="title"
                          className="ti-form-input"
                          value={blogValue.title}
                          onChange={(e) => handleChangeValue(e)}
                        />
                      </div>
                      <div>
                        <label htmlFor="input-label1" className="ti-form-label">
                          Breadcrumb Name
                        </label>
                        <input
                          type="text"
                          name="breadcumb_name"
                          className="ti-form-input"
                          value={blogValue.breadcumb_name}
                          onChange={(e) => handleChangeValue(e)}
                        />
                      </div>
                      <div>
                        <label htmlFor="input-label1" className="ti-form-label">
                          Question
                        </label>
                        <textarea
                          className="ti-form-input"
                          name="question"
                          rows={3}
                          value={blogValue.question}
                          onChange={(e) => handleChangeValue(e)}
                        ></textarea>
                      </div>
                      <div>
                        <label htmlFor="input-label1" className="ti-form-label">
                          Answer
                        </label>
                        <textarea
                          className="ti-form-input"
                          name="answer"
                          rows={6}
                          value={blogValue.answer}
                          onChange={(e) => handleChangeValue(e)}
                        ></textarea>
                      </div>
                      <div className="col-span-12 xxl:col-span-9 mt-3">
                        <div className="box-header flex justify-between">
                          <h5>
                            Cover Image <span className="text-red-500">*</span>
                          </h5>
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
                                Change Image{" "}
                                <i className="ti ti-file-plus "></i>
                              </button>
                              <div className="grid grid-cols-12 gap-x-2">
                                {cover_image &&
                                  cover_image.map((pathFile, i) => {
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
                      <div className="col-span-12 lg:col-span-6 blog-input">
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
                            blogValue.status === 1
                              ? { value: 1, label: "Enable" }
                              : { value: 0, label: "Disable" },
                          ]}
                          onChange={(val) =>
                            setBlogValue({
                              ...blogValue,
                              status: val.value,
                            })
                          }
                          placeholder="Status"
                        />
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
            </div>
          </>
        )}
      </div>
    )
  );
};
export default BuyersEdit;
