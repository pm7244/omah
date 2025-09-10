import React, { useEffect, useState } from "react";
import Select from "react-select";
import SunEditor from "suneditor-react";
import DatePicker from "react-datepicker";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Filemanagermain from "../fileManager/filemanagermain";

const BlogAdd = () => {
  const [listImage, setListImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [managerOpener, setManagerOpener] = useState();
  const [authorImg, setAuthorImg] = useState("");

  const [startDate, setStartDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  );
  const [selectedValue, setSelectedValue] = useState([]);
  const navigate = useNavigate();

  const [options, setOptions] = useState([]);

  const fetchDataOption = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallblog_category`)
      .then((res) => res.json())
      .then((data) => {
        const formattedOptions = data.data.map((item) => ({
          value: item.category_id,
          label: item.name,
        }));
        setOptions(formattedOptions);
      })
      .catch((err) => console.log(err.message));
  };
  useEffect(() => {
    fetchDataOption();
  }, []);

  const handleSelectChange = (selectedOption) => {
    const val = selectedOption ? selectedOption.map((v) => v.value) : [];
    setSelectedValue(selectedOption);
    setFormInput((prev) => ({
      ...prev,
      category_id: val,
    }));
  };
  const SubmitData = () => {
    const tempDate = startDate.getTime() + 172800000;

    const SubmitterData = {
      ...formInput,
      list_image: JSON.stringify(listImage),
      cover_image: JSON.stringify(coverImage),
      author_photo: JSON.stringify(authorImg),
      display_date: new Date(tempDate).toISOString().split("T")[0],
      category_id: JSON.stringify(formInput.category_id),
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/createblog`, {
      method: "POST",
      body: JSON.stringify(SubmitterData),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("Added new data Successfully"),
            navigate(`/cms/pages/blogs`);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const handleSubmit = () => {
    if (
      !(
        formInput.blog_name &&
        formInput.long_description &&
        formInput.short_description &&
        formInput.blog_slug &&
        formInput.breadcrumb_name &&
        formInput.tag &&
        formInput.author_name &&
        formInput.cover_title &&
        formInput.sort_order
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
    blog_name: "",
    blog_slug: "",
    cover_title: "",
    breadcrumb_name: "",
    short_description: "",
    long_description: "",
    tag: "",
    author_name: "",
    status: "",
    sort_order: "",
    category_id: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormInput((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };

      if (name === "blog_name") {
        newState.blog_slug = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/\?/g, "-");
      }

      return newState;
    });
  };

  return (
    <div>
      {managerOpener == 1 ? (
        <Filemanagermain
          file={listImage}
          ratio={890 / 800}
          fileSetter={setListImage}
          openSetter={setManagerOpener}
        />
      ) : managerOpener == 2 ? (
        <Filemanagermain
          file={coverImage}
          ratio={1920 / 1100}
          fileSetter={setCoverImage}
          openSetter={setManagerOpener}
        />
      ) : managerOpener == 3 ? (
        <Filemanagermain
          file={authorImg}
          ratio={120 / 120}
          fileSetter={setAuthorImg}
          openSetter={setManagerOpener}
        />
      ) : (
        <>
          <PageHeader
            currentpage="Add Blog"
            activepage="Pages"
            mainpage="Add Blog"
          />
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 xxl:col-span-10">
              <div className="box">
                <div className="box-body space-y-5">
                  <div>
                    <label htmlFor="input-label1" className="ti-form-label">
                      Blog Name
                    </label>
                    <input
                      type="text"
                      name="blog_name"
                      className="ti-form-input"
                      placeholder="blogName"
                      value={formInput.blog_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="input-label1" className="ti-form-label">
                      Slug
                    </label>
                    <input
                      type="text"
                      name="blog_slug"
                      className="ti-form-input"
                      placeholder="Slug"
                      value={formInput.blog_slug}
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="input-label1" className="ti-form-label">
                      Cover Title
                    </label>
                    <input
                      type="text"
                      name="cover_title"
                      className="ti-form-input"
                      placeholder="Cover Title"
                      value={formInput.cover_title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="input-label1" className="ti-form-label">
                      Breadcrumb Title
                    </label>
                    <input
                      type="text"
                      name="breadcrumb_name"
                      className="ti-form-input"
                      placeholder="Breadcrumb name"
                      value={formInput.breadcrumb_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="ti-form-select-label">Categories</label>
                    <Select
                      isMulti
                      className="blog-tag2 z-50"
                      name="category_id"
                      value={selectedValue}
                      onChange={handleSelectChange}
                      options={options}
                      placeholder="Select an option"
                    />
                  </div>
                  <div>
                    <label htmlFor="input-label" className="ti-form-label">
                      Short Description
                    </label>
                    <SunEditor
                      className="ht-250"
                      height="150"
                      name="short_description"
                      setContents={formInput.short_description}
                      onChange={(e) =>
                        setFormInput(
                          (prv) => (prv = { ...prv, short_description: e })
                        )
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
                  <div>
                    <label htmlFor="input-label" className="ti-form-label">
                      Long Description
                    </label>
                    <SunEditor
                      className="ht-250"
                      height="225"
                      name="long_description"
                      setContents={formInput.long_description}
                      onChange={(e) =>
                        setFormInput(
                          (prv) => (prv = { ...prv, long_description: e })
                        )
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
                  <div>
                    <div className="box">
                      <div className="box-header flex justify-between">
                        <h5 className="box-title"> List Image</h5>
                        <span className="text-sm font-thin underline text-red-500">
                          1 Image allowed Only
                        </span>
                      </div>
                      <div className="box-body">
                        <div onClick={() => setManagerOpener(1)}>
                          <label className="block">
                            <span className="sr-only">List Image</span>
                            <button
                              type="button"
                              className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                            >
                              Select Image <i className="ti ti-file-plus "></i>
                            </button>
                            <div className="grid grid-cols-12 gap-x-2">
                              {listImage &&
                                listImage.map((pathFile, i) => {
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
                  <div>
                    <div className="box">
                      <div className="box-header flex justify-between">
                        <h5 className="box-title"> Cover Image</h5>
                        <span className="text-sm font-thin underline text-red-500">
                          1 Image allowed Only
                        </span>
                      </div>
                      <div className="box-body">
                        <div onClick={() => setManagerOpener(2)}>
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
                  <div>
                    <label className="ti-form-label">Blog Author Name</label>
                    <input
                      type="text"
                      className="ti-form-input"
                      placeholder="Enter Name"
                      name="author_name"
                      value={formInput.author_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="input-label" className="ti-form-label">
                      Author Image
                    </label>
                    <span className="text-sm font-thin underline text-red-500">
                      1 Image allowed Only
                    </span>
                    <div className="box-body">
                      <div onClick={() => setManagerOpener(3)}>
                        <label className="block">
                          <span className="sr-only">List Image</span>
                          <button
                            type="button"
                            className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                          >
                            Select Image <i className="ti ti-file-plus "></i>
                          </button>
                          <div className="grid grid-cols-12 gap-x-2">
                            {authorImg &&
                              authorImg.map((pathFile, i) => {
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
                    <div className="col-span-12">
                      <label className="ti-form-select-label">Tags</label>
                      <input
                        className="ti-form-input"
                        type="text"
                        name="tag"
                        value={formInput.tag}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-12">
                      <label className="ti-form-label">Sorting</label>
                      <input
                        type="number"
                        className="w-full"
                        name="sort_order"
                        value={formInput.sort_order}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-12 lg:col-span-6 blog-input">
                      <label htmlFor="input-label" className="ti-form-label">
                        Blog Published Date
                      </label>
                      <div className="flex rounded-sm">
                        <div className="px-4 inline-flex items-center min-w-fit ltr:rounded-l-sm rtl:rounded-r-sm border ltr:border-r-0 rtl:border-l-0 border-gray-200 bg-gray-50 dark:bg-black/20 dark:border-white/10">
                          <span className="text-sm text-gray-500 dark:text-white/70">
                            <i className="ri ri-calendar-line"></i>
                          </span>
                        </div>
                        <DatePicker
                          className="ltr:rounded-l-none rtl:rounded-r-none focus:z-10 flatpickr-input w-[320px]"
                          selected={startDate}
                          onChange={(e) => setStartDate(e)}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 lg:col-span-6 blog-input">
                      <label className="ti-form-select-label">
                        Publish Status
                      </label>
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
export default BlogAdd;
