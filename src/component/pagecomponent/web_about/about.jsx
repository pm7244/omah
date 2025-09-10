import React, { useEffect, useState } from "react";
import Select from "react-select";
import SunEditor from "suneditor-react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const About = () => {
  const [file, setFile] = useState([]);
  const [image, setImage] = useState([]);
  const [mission_img, setMissionImg] = useState([]);
  const [vision_img, setVissionImg] = useState([]);
  const [managerOpener, setManagerOpener] = useState(0);
  const [values, setValues] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallabout`)
      .then((res) => res.json())
      .then((data) => {
        let rawCover_url = JSON.parse(data.data[0].cover_url);
        let rawImage = JSON.parse(data.data[0].image);
        let img1 = JSON.parse(data.data[0].mission_img);
        let img2 = JSON.parse(data.data[0].vision_img);
        setFile([...rawCover_url]);
        setImage([...rawImage]);
        setMissionImg([...img1]);
        setVissionImg([...img2]);
        setValues(
          (prv) =>
            (prv = {
              ...data.data[0],
              image: rawImage,
              mission_img: img1,
              vision_img: img2,
              cover_url: [...rawCover_url],
            })
        );
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setValues((prv) => (prv = { ...prv, cover_url: file }));
  }, [file]);

  useEffect(() => {
    setValues((prv) => (prv = { ...prv, image: image }));
  }, [image]);

  useEffect(() => {
    if (mission_img && vision_img) {
      setValues(
        (prv) =>
          (prv = {
            ...prv,
            mission_img: [...mission_img],
            vision_img: [...vision_img],
          })
      );
    }
  }, [mission_img, vision_img]);

  const submitFetcher = () => {
    const data = {
      ...values,
      image: JSON.stringify(values.image),
      cover_url: JSON.stringify(values.cover_url),
      mission_img: JSON.stringify(values.mission_img),
      vision_img: JSON.stringify(values.vision_img),
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidabout/1`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(toast.success("About Page updated Successfully"))
      .catch((err) => console.error(err.message));
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    let updatedObj = { ...values };
    updatedObj = { ...updatedObj, [name]: value };
    setValues(updatedObj);
  };

  const handleSubmitAbout = () => {
    if (
      !(
        values.title &&
        values.slug &&
        values.vision_title &&
        values.vision_description &&
        values.mission_title &&
        values.mission_description &&
        values.key_success &&
        values.what_we_do &&
        values.meta_title &&
        values.image &&
        values.meta_description &&
        values.cover_url &&
        values.breadcrumb_name &&
        values.description != "<div><br></div>" &&
        values.description != "<p><br></p>"
      )
    ) {
      toast.error("Please enter all field");
      return;
    }
    submitFetcher();
  };

  return (
    values && (
      <>
        {managerOpener === 1 ? (
          <Filemanagermain
            file={image}
            ratio={values.img_dimension}
            fileSetter={setImage}
            openSetter={setManagerOpener}
            modal_id="image"
          />
        ) : managerOpener === 2 ? (
          <Filemanagermain
            file={file}
            ratio={values.dimension}
            fileSetter={setFile}
            openSetter={setManagerOpener}
            modal_id="image"
          />
        ) : managerOpener === 3 ? (
          <Filemanagermain
            file={mission_img}
            ratio={values.mission_dimension}
            fileSetter={setMissionImg}
            openSetter={setManagerOpener}
            modal_id={image}
          />
        ) : managerOpener === 4 ? (
          <Filemanagermain
            file={vision_img}
            ratio={values.dimension}
            fileSetter={setVissionImg}
            openSetter={setManagerOpener}
            modal_id={image}
          />
        ) : (
          <div>
            <PageHeader
              currentpage="About Us"
              activepage="Pages"
              mainpage="About Us"
            />
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12 xxl:col-span-8">
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      About Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={(e) => {
                        handleValueChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="About Title"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title"> Image</h5>
                  </div>
                  <div className="box-body">
                    <div>
                      <span className="sr-only">Image</span>
                      <label className="block">
                        <button
                          onClick={() => setManagerOpener(1)}
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        <div className="grid grid-cols-12 gap-x-2">
                          {values.image &&
                            values.image.map((pathFile) => {
                              return (
                                <img
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
              <div className="col-span-12 xxl:col-span-4">
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
                        handleValueChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="meta title"
                    />
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
                        handleValueChange(e);
                      }}
                      rows={3}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="meta description"
                    />
                  </div>
                </div>
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
                        handleValueChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="breadcrum"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-8">
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
                        handleValueChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="slug"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-4">
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
                      onChange={(val) => {
                        setValues(
                          (prv) => (prv = { ...prv, status: val.value })
                        );
                      }}
                      classNamePrefix="react-select"
                      options={[
                        { value: 1, label: "Enable" },
                        { value: 0, label: "Disable" },
                      ]}
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
                    <h5 className="box-title"> Cover Url </h5>
                  </div>
                  <div className="box-body">
                    <div>
                      <span className="sr-only">Cover Url</span>
                      <label className="block">
                        <button
                          type="button"
                          onClick={() => setManagerOpener(2)}
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        <div className="flex">
                          {values.cover_url.map((img) => {
                            return (
                              <img
                                src={`${
                                  import.meta.env.VITE_CMS_URL
                                }api/transform/${img}`}
                                className="box-img-top h-40 
                            rounded-t-sm"
                              />
                            );
                          })}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-6">
                <div className="box">
                  <div className="box-body space-y-4">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Vision Title
                    </label>
                    <input
                      type="text"
                      name="vision_title"
                      value={values.vision_title}
                      onChange={(e) => {
                        handleValueChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="vision title"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <div className="box">
                  <div className="box-body space-y-4">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Mission Title
                    </label>
                    <input
                      type="text"
                      name="mission_title"
                      value={values.mission_title}
                      onChange={(e) => {
                        handleValueChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="mission title"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-6">
                <div className="box">
                  <div className="box-body space-y-4">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Mission Description
                    </label>
                    <textarea
                      name="mission_description"
                      value={values.mission_description}
                      onChange={(e) => {
                        handleValueChange(e);
                      }}
                      className="ti-form-input"
                      placeholder="mission description"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <div className="box">
                  <div className="box-body space-y-4">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Vision Description
                    </label>
                    <textarea
                      name="vision_description"
                      value={values.vision_description}
                      onChange={(e) => {
                        handleValueChange(e);
                      }}
                      className="ti-form-input"
                      placeholder="vision description"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-6">
                <div className="box">
                  <div className="box-body space-y-4">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Key to Success
                    </label>
                    <textarea
                      name="key_success"
                      value={values.key_success}
                      onChange={(e) => {
                        handleValueChange(e);
                      }}
                      className="ti-form-input"
                      placeholder="Key to Success"
                      rows="5"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <div className="box">
                  <div className="box-body space-y-4">
                    <label htmlFor="input-label1" className="ti-form-label">
                      What we do
                    </label>
                    <textarea
                      name="what_we_do"
                      value={values.what_we_do}
                      onChange={(e) => {
                        handleValueChange(e);
                      }}
                      className="ti-form-input"
                      placeholder="What we do"
                      rows="5"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="box">
              <div className="box-header">
                <h5 className="box-title"> Mission Image</h5>
              </div>
              <div className="box-body">
                <div>
                  <span className="sr-only">Mission Image</span>
                  <label className="block">
                    <button
                      onClick={() => setManagerOpener(3)}
                      className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                    >
                      Change Image <i className="ti ti-file-plus "></i>
                    </button>
                    <div className="grid grid-cols-12 gap-x-2">
                      {values.mission_img &&
                        values.mission_img.map((pathFile) => {
                          return (
                            <img
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
            <div className="box">
              <div className="box-header">
                <h5 className="box-title">Vision Image</h5>
              </div>
              <div className="box-body">
                <div>
                  <span className="sr-only">Image</span>
                  <label className="block">
                    <button
                      onClick={() => setManagerOpener(4)}
                      className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                    >
                      Change Image <i className="ti ti-file-plus "></i>
                    </button>
                    <div className="grid grid-cols-12 gap-x-2">
                      {values.vision_img &&
                        values.vision_img.map((pathFile) => {
                          return (
                            <img
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
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12">
                <div className="box">
                  <div className="box-body space-y-5">
                    <label
                      htmlFor="input-label"
                      className="ti-form-label text-medium"
                    >
                      Description
                    </label>
                    <SunEditor
                      setContents={values.description}
                      onChange={(e) => {
                        setValues((prv) => (prv = { ...prv, description: e }));
                      }}
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
                  <div className="box">
                    <div className="box-footer bg-transparent">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={handleSubmitAbout}
                          type="button"
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
          
        )}
        
      </>
    )
  );
};
export default About;
