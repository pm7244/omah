import React, { useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import Select from "react-select";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const StoreSetting = () => {
  const [input, setInput] = useState();
  const [logo1, setLogo1] = useState("");
  const [logo2, setLogo2] = useState("");
  const [managerOpener, setManagerOpener] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallstore_setting`)
      .then((res) => res.json())
      .then((data) => {
        let rawLogo1 = JSON.parse(data.data[0].logo1);
        let rawLogo2 = JSON.parse(data.data[0].logo2);
        setLogo1(rawLogo1);
        setLogo2(rawLogo2);
        setInput({ ...data.data[0], logo1: rawLogo1, logo2: rawLogo2 });
      })
      .catch((err) => toast.error(err.message));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const SubmitData = (id) => {
    const newData = {
      ...input,
      logo1: JSON.stringify(input.logo1),
      logo2: JSON.stringify(input.logo2),
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/update-store_setting/${id}`, {
      method: "PUT",
      body: JSON.stringify(newData),
      headers: { "Content-Type": "application/json" },
    })
      .then(toast.success("Store-Setting Data Updated"))
      .catch((err) => toast.message(err.message));
  };

  const handleSubmit = () => {
    if (
      !(
        input.name &&
        input.tagline &&
        input.meta_title &&
        input.meta_desc &&
        input.overview &&
        input.notify_email &&
        input.career_email &&
        input.conf_email &&
        input.conf_host &&
        input.conf_password &&
        input.conf_secure &&
        input.meta_title &&
        input.meta_desc
      )
    ) {
      toast.error("Please enter all field");
      return;
    }
    try {
      SubmitData(input.store_id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (logo1 && logo2) {
      setInput(
        (prv) => (prv = { ...prv, logo1: [...logo1], logo2: [...logo2] })
      );
    }
  }, [logo1, logo2]);

  return (
    input && (
      <div>
        {managerOpener == 1 ? (
          <Filemanagermain
            file={logo1}
            ratio={input.dimension}
            fileSetter={setLogo1}
            openSetter={setManagerOpener}
          />
        ) : managerOpener == 2 ? (
          <Filemanagermain
            file={logo2}
            ratio={input.dimension}
            fileSetter={setLogo2}
            openSetter={setManagerOpener}
          />
        ) : (
          <>
            <PageHeader
              currentpage="Store Setting"
              activepage="Pages"
              mainpage="Store Setting"
            />
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12 ">
                <div className="box">
                  <div className="box-body space-y-5">
                    <div>
                      <label htmlFor="input-label1" className="ti-form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="ti-form-input"
                        placeholder="name"
                        value={input.name}
                        name="name"
                        onChange={(e) => handleChangeValue(e)}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-label1" className="ti-form-label">
                        Tagline
                      </label>
                      <input
                        type="text"
                        className="ti-form-input"
                        placeholder="Tagline"
                        name="tagline"
                        value={input.tagline}
                        onChange={(e) => handleChangeValue(e)}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-label" clas3sName="ti-form-label">
                        Overview
                      </label>
                      <SunEditor
                        className="ht-250"
                        height="260"
                        setContents={input.overview}
                        name="overview"
                        onChange={(e) =>
                          setInput((prv) => (prv = { ...prv, overview: e }))
                        }
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
                            [
                              "table",
                              "horizontalRule",
                              "link",
                              "image",
                              "video",
                            ],
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
                    {/* Logo1*/}
                    <div className="box">
                      <div className="box-header flex justify-between">
                        <h5 className="box-title">Logo 2</h5>
                        <span className="text-sm font-thin underline text-red-500">
                          1 Image allowed Only
                        </span>
                      </div>
                      <div className="box-body">
                        <div onClick={() => setManagerOpener(1)}>
                          <label className="block">
                            <span className="sr-only">Logo1</span>
                            <button
                              type="button"
                              className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                            >
                              Change Image <i className="ti ti-file-plus "></i>
                            </button>
                            <div className="grid grid-cols-12 gap-x-2">
                              {input.logo1 &&
                                input.logo1.map((pathFile, i) => {
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
                        <h5 className="box-title"> Logo 2</h5>
                        <span className="text-sm font-thin underline text-red-500">
                          1 Image allowed Only
                        </span>
                      </div>
                      <div className="box-body">
                        <div onClick={() => setManagerOpener(2)}>
                          <label className="block">
                            <span className="sr-only">Logo 2</span>
                            <button
                              type="button"
                              className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                            >
                              Change Image <i className="ti ti-file-plus "></i>
                            </button>
                            <div className="grid grid-cols-12 gap-x-2">
                              {input.logo2 &&
                                input.logo2.map((pathFile, i) => {
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
                        <label className="ti-form-label">Notify Email</label>
                        <input
                          type="email"
                          className="ti-form-input"
                          placeholder="Enter Email"
                          value={input.notify_email}
                          name="notify_email"
                          onChange={(e) => handleChangeValue(e)}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <label className="ti-form-label">Career Email</label>
                        <input
                          type="email"
                          className="ti-form-input"
                          placeholder="Enter Email"
                          name="career_email"
                          value={input.career_email}
                          onChange={(e) => handleChangeValue(e)}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <label className="ti-form-label">
                          Configuration Email
                        </label>
                        <input
                          type="email"
                          className="ti-form-input"
                          placeholder="Enter Email"
                          name="conf_email"
                          value={input.conf_email}
                          onChange={(e) => handleChangeValue(e)}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <label className="ti-form-label">
                          Configuration Password
                        </label>
                        <input
                          type="password"
                          className="ti-form-input"
                          placeholder="password"
                          name="conf_password"
                          required
                          value={input.conf_password}
                          onChange={(e) => handleChangeValue(e)}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <label className="ti-form-label">
                          Configuration Host
                        </label>
                        <input
                          type="text"
                          className="ti-form-input"
                          placeholder="Enter Configuration Host"
                          name="conf_host"
                          value={input.conf_host}
                          onChange={(e) => handleChangeValue(e)}
                          required
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <label className="ti-form-label">
                          Configuration Port
                        </label>
                        <input
                          type="text"
                          className="ti-form-input"
                          placeholder="Enter Configuration Port"
                          name="conf_port"
                          value={input.conf_port}
                          onChange={(e) => handleChangeValue(e)}
                          required
                        />
                      </div>
                      <div className="col-span-12 xxl:col-span-9">
                        <label className="ti-form-label">
                          Configuration Secure
                        </label>
                        <input
                          type="text"
                          className="ti-form-input"
                          name="conf_secure"
                          placeholder="Enter Configuration Secure"
                          value={input.conf_secure}
                          onChange={(e) => handleChangeValue(e)}
                          required
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
                          value={input.meta_desc}
                          name="meta_desc"
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

export default StoreSetting;
