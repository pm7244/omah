import React, { useEffect, useState } from "react";
import Select from "react-select";
import SunEditor from "suneditor-react";
import DatePicker from "react-datepicker";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Filemanagermain from "../fileManager/filemanagermain";

const BlogEdit = () => {
  const navigate = useNavigate();
  const [blogValue, setBlogValue] = useState();
  const [options1, setOptions1] = useState([]);
  const [managerOpener, setManagerOpener] = useState();
  const [list_image, setListImg] = useState("");
  const [cover_image, setCoverImg] = useState("");
  const [author_photo, setAuthorPhoto] = useState("");
  const [startDate, setStartDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  );

  const { id } = useParams();

  const FetchById = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidblog/${id}`)
      .then((res) => res.json())
      .then((data) => {
        let img1 = JSON.parse(data.data[0].list_image);
        let img2 = JSON.parse(data.data[0].cover_image);
        let img3 = JSON.parse(data.data[0].author_photo);
        let category_id = JSON.parse(data.data[0].category_id);
        setBlogValue({
          ...data.data[0],
          list_image: img1,
          cover_image: img2,
          author_photo: img3,
          category_id: category_id,
        });
        setListImg(img1);
        setCoverImg(img2);
        setAuthorPhoto(img3);
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err.message);
      });
  };

  useEffect(() => {
    FetchById();
  }, []);

  const fetchOptions1 = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallblog_category`)
      .then((res) => res.json())
      .then((data) => {
        const formattedOptions = data.data.map((item) => ({
          value: item.category_id,
          label: item.name,
        }));
        setOptions1(formattedOptions);
      })
      .catch((err) => console.log(err.message));
  };
  useEffect(() => {
    fetchOptions1();
  }, []);

  const SubmitData = (id) => {
    const tempDate = startDate.getTime() + 172800000;
    const SubmitterData = {
      ...blogValue,
      cover_image: JSON.stringify(cover_image),
      list_image: JSON.stringify(list_image),
      author_photo: JSON.stringify(author_photo),
      category_id: JSON.stringify(blogValue.category_id),
      display_date: new Date(tempDate).toISOString().split("T")[0],
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidblog/${id}`, {
      method: "PUT",
      body: JSON.stringify(SubmitterData),
      headers: { "Content-Type": "application/json" },
    })
      .then(toast.success("Blog Data Updated Successfully"))
      .then(navigate(`/cms/pages/blogs`))
      .catch((err) => toast.error(err.message));
  };
  const handleSubmit = () => {
    if (
      !(
        blogValue.blog_name &&
        blogValue.long_description &&
        blogValue.short_description &&
        blogValue.blog_slug &&
        blogValue.cover_title &&
        blogValue.tag &&
        blogValue.author_name
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
    setBlogValue((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      if (name === "blog_name") {
        newState.blog_slug = value.toLowerCase().replace(/\s+/g, "-");
      }

      return newState;
    });
  };

  useEffect(() => {
    if (cover_image && list_image && author_photo) {
      setBlogValue(
        (prv) =>
          (prv = {
            ...prv,
            cover_image: [...cover_image],
            list_image: [...list_image],
            author_photo: [...author_photo],
          })
      );
    }
  }, [cover_image, list_image, author_photo]);

  const handleSelectChange = (selectedOption) => {
    const val = selectedOption ? selectedOption.map((v) => v.value) : [];
    setBlogValue((prev) => ({
      ...prev,
      category_id: val,
    }));
  };

  return (
    blogValue && (
      <div>
        {managerOpener == 1 ? (
          <Filemanagermain
            file={list_image}
            fileSetter={setListImg}
            openSetter={setManagerOpener}
            ratio={blogValue.list_dimension}
          />
        ) : managerOpener == 2 ? (
          <Filemanagermain
            file={cover_image}
            fileSetter={setCoverImg}
            openSetter={setManagerOpener}
            ratio={blogValue.cover_dimension}
          />
        ) : managerOpener == 3 ? (
          <Filemanagermain
            file={author_photo}
            fileSetter={setAuthorPhoto}
            openSetter={setManagerOpener}
            ratio={blogValue.author_img_dimension}
          />
        ) : (
          <>
            <div>
              <PageHeader
                currentpage="Edit Blog"
                activepage="Pages"
                mainpage="Edit Blog"
              />
              <div className="grid grid-cols-12 gap-x-6">
                <div className="col-span-12 ">
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
                          value={blogValue.blog_name}
                          onChange={(e) => handleChangeValue(e)}
                        />
                      </div>
                      <div>
                        <label htmlFor="input-label1" className="ti-form-label">
                          Slug
                        </label>
                        <input
                          type="text"
                          name="slug"
                          className="ti-form-input"
                          placeholder="Slug"
                          value={blogValue.blog_slug}
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
                          value={blogValue.cover_title}
                          onChange={(e) => handleChangeValue(e)}
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
                          value={blogValue.breadcrumb_name}
                          onChange={(e) => handleChangeValue(e)}
                        />
                      </div>
                      <div>
                        <label className="ti-form-select-label">
                          Categories
                        </label>
                        <Select
                          name="category_id"
                          isMulti
                          className="z-10"
                          options={options1}
                          value={options1.filter(
                            (option) =>
                              blogValue.category_id &&
                              blogValue.category_id.includes(option.value)
                          )}
                          onChange={handleSelectChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="input-label" className="ti-form-label">
                          Short Description
                        </label>
                        <SunEditor
                          setContents={blogValue.short_description}
                          name="short_description"
                          onChange={(e) =>
                            setBlogValue(
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
                              table:
                                "cellpadding|width|cellspacing|height|style",
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
                          setContents={blogValue.long_description}
                          name="long_description"
                          onChange={(e) =>
                            setBlogValue(
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
                              table:
                                "cellpadding|width|cellspacing|height|style",
                              tr: "valign|style",
                              td: "styleinsert|height|style",
                              img: "title|alt|src|style",
                            },
                          }}
                        />
                      </div>
                      <div className="col-span-12 xxl:col-span-9 mt-3">
                        <div className="box-header flex justify-between">
                          <h5>
                            List Image <span className="text-red-500">*</span>
                          </h5>
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
                                Change Image{" "}
                                <i className="ti ti-file-plus "></i>
                              </button>
                              <div className="grid grid-cols-12 gap-x-2">
                                {list_image &&
                                  list_image.map((pathFile, i) => {
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
                          <div onClick={() => setManagerOpener(2)}>
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
                      <div>
                        <label className="ti-form-label">
                          Blog Author Name
                        </label>
                        <input
                          value={blogValue.author_name}
                          type="text"
                          className="ti-form-input"
                          placeholder="Enter Author Name"
                          onChange={(e) => handleChangeValue(e)}
                        />
                      </div>
                      <div className="col-span-12 xxl:col-span-9 mt-3">
                        <div className="box-header flex justify-between">
                          <h5>
                            Author Image <span className="text-red-500">*</span>
                          </h5>
                          <span className="text-sm font-thin underline text-red-500">
                            1 Image allowed Only
                          </span>
                        </div>
                        <div className="box-body">
                          <div onClick={() => setManagerOpener(3)}>
                            <label className="block">
                              <span className="sr-only">Author Image</span>
                              <button
                                type="button"
                                className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                              >
                                Change Image{" "}
                                <i className="ti ti-file-plus "></i>
                              </button>
                              <div className="grid grid-cols-12 gap-x-2">
                                {author_photo &&
                                  author_photo.map((pathFile, i) => {
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
                            type="text"
                            name="tag"
                            className="ti-form-input"
                            value={blogValue.tag}
                            onChange={(e) => handleChangeValue(e)}
                          />
                        </div>
                        <div className="col-span-12 lg:col-span-6 blog-input">
                          <label
                            htmlFor="input-label"
                            className="ti-form-label"
                          >
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
export default BlogEdit;
