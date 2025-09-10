import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import Filemanagermain from "../fileManager/filemanagermain";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const EditFactFig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState();
  const [managerOpener, setManagerOpener] = useState(false);
  const [logo, setLogo] = useState([]);

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyid-about/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const item = data.data[0];
        let img = [];

        try {
          img = JSON.parse(item.b_image || "[]");
        } catch (e) {
          img = [];
        }

        setLogo(img);
        setInput({ ...item, b_image: img });
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (logo) {
      setInput((prev) => ({ ...prev, b_image: [...logo] }));
    }
  }, [logo]);

  const SubmitChangedData = (id) => {
    const newData = {
      ...input,
      b_image: JSON.stringify(input.b_image),
    };

    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyid-about/${id}`, {
      method: "PUT",
      body: JSON.stringify(newData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("Data Updated");
          navigate(`/cms/general/about/`);
          fetchData();
        } else {
          toast.error("Update failed");
        }
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err.message);
      });
  };

  const handleSubmit = () => {
    if (!(input.b_title && input.b_des)) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      SubmitChangedData(input.a_id);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  return (
    input && (
      <div>
        {managerOpener ? (
          <Filemanagermain
            file={logo}
            fileSetter={setLogo}
            openSetter={setManagerOpener}
            ratio={input.icon_dimension || 1}
          />
        ) : (
          <>
            <PageHeader
              currentpage="Edit About"
              activepage="General"
              mainpage="Edit About"
            />

            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12">
                <div className="box !bg-transparent border-0 shadow-none">
                  <div className="box-body p-0">
                    <div className="col-span-12">
                      <div className="box">
                        <div className="box-body">
                          <div className="space-y-4">
                            {/* Title */}
                            <div>
                              <label className="ti-form-label">Title</label>
                              <input
                                type="text"
                                className="ti-form-input"
                                placeholder="Title"
                                name="b_title"
                                value={input.b_title}
                                onChange={handleChangeInput}
                              />
                            </div>

                            {/* Cover Image */}
                            <div className="mt-3">
                              <div className="box-header flex justify-between">
                                <h5>
                                  Cover Image{" "}
                                  <span className="text-red-500">*</span>
                                </h5>
                                <span className="text-sm font-thin underline text-red-500">
                                  1 Image allowed Only
                                </span>
                              </div>
                              <div className="box-body">
                                <div onClick={() => setManagerOpener(true)}>
                                  <button
                                    type="button"
                                    className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                                  >
                                    Change Image{" "}
                                    <i className="ti ti-file-plus "></i>
                                  </button>
                                  <div className="grid grid-cols-12 gap-x-2 mt-2">
                                    {input.b_image &&
                                      input.b_image.map((pathFile, i) => (
                                        <img
                                          key={i}
                                          src={`${
                                            import.meta.env.VITE_CMS_URL
                                          }api/transform/${pathFile}`}
                                          className="col-span-4 h-32 rounded-t-sm"
                                          alt="Preview"
                                        />
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Description with SunEditor */}
                            <div className="mt-3">
                              <label className="ti-form-label">Description</label>
                              <SunEditor
                                height="300px"
                                setContents={input.b_des}
                                onChange={(content) =>
                                  setInput((prev) => ({
                                    ...prev,
                                    b_des: content,
                                  }))
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
                                }}
                              />
                            </div>

                            {/* Status */}
                            <div className="mt-3">
                              <label className="ti-form-label">Status</label>
                              <Select
                                classNamePrefix="react-select"
                                options={[
                                  { value: 1, label: "Enable" },
                                  { value: 0, label: "Disable" },
                                ]}
                                value={
                                  input.status === 1
                                    ? { value: 1, label: "Enable" }
                                    : { value: 0, label: "Disable" }
                                }
                                onChange={(val) =>
                                  setInput({
                                    ...input,
                                    status: val.value,
                                  })
                                }
                                menuPlacement="top"
                                placeholder="Select status"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="box-footer text-end border-t-0 px-0 mt-4">
                    <button
                      className="ti-btn ti-btn-primary"
                      onClick={handleSubmit}
                      type="button"
                    >
                      <i className="ri-add-line"></i> Update
                    </button>
                    <Link to="#" className="ti-btn ti-btn-danger ml-2">
                      <i className="ri-delete-bin-line"></i> Discard
                    </Link>
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

export default EditFactFig;
