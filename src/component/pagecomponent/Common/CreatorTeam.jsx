import React, { useEffect, useState } from "react";
import Select from "react-select";
import SunEditor from "suneditor-react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Filemanagermain from "../fileManager/filemanagermain";

const CreatorTeam = () => {
  const navigate = useNavigate();

  const [managerOpener, setManagerOpener] = useState(false);
  const [image, setImage] = useState([]);
  const [values, setValues] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prv) => (prv = { ...values, [name]: value }));
  };

  const handleCreation = () => {
    if (
      !(values.name && values.designation && values.description && values.image)
    ) {
      toast.error("Please Fill all the fields!");
      return;
    }
    const data = { ...values, image: JSON.stringify(image) };
    fetch(`${import.meta.env.VITE_CMS_URL}api/createmanagement/`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())

      .then((data) => {
        if (data.status) {
          toast.success("Management updated succesfully");
          navigate("/cms/general/team");
        } else {
          toast.error("Failed to update");
        }
      });
  };

  useEffect(() => {
    setValues((prv) => (prv = { ...prv, image: image }));
  }, [image]);

  return (
    values && (
      <>
        {managerOpener ? (
          <Filemanagermain
            ratio={750 / 600}
            file={image}
            fileSetter={setImage}
            openSetter={setManagerOpener}
          />
        ) : (
          <div>
            <PageHeader
              currentpage="Management"
              activepage="Pages"
              mainpage="Management"
            />
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12 xxl:col-span-8">
                <div className="box">
                  <div className="box-header">
                    <div className="box-title">Management Name</div>
                  </div>
                  <div className="box-body space-y-5">
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="Management Name"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-header">
                    <div className="box-title">Management Designation</div>
                  </div>
                  <div className="box-body space-y-5">
                    <input
                      type="text"
                      name="designation"
                      value={values.designation}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      className="ti-form-input"
                      placeholder="Management designation"
                    ></input>
                  </div>
                </div>
              </div>
              <div className="col-span-12 xxl:col-span-4">
                <div className="box">
                  <div className="box-header">
                    <div className="box-title">Image</div>
                  </div>
                  <div
                    className="box-body space-y-4"
                    onClick={() => setManagerOpener(!managerOpener)}
                  >
                    {values.image ? (
                      <>
                        <button
                          type="button"
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        <img
                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${
                            values.image[0]
                          }`}
                          className="box-img-top h-52 rounded-t-sm"
                          alt="management image"
                        />
                      </>
                    ) : (
                      <button
                        type="button"
                        className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                      >
                        Add Image <i className="ti ti-file-plus "></i>
                      </button>
                    )}
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
                      onChange={(val) => {
                        setValues(
                          (prv) => (prv = { ...values, status: val.value })
                        );
                      }}
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
                    <div className="box-title">Management Description</div>
                  </div>
                  <div className="box-body space-y-5">
                    <SunEditor
                      setContents={values.description}
                      onChange={(e) =>
                        setValues((prv) => (prv = { ...prv, description: e }))
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
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12">
                <div className="box">
                  <div className="box-footer bg-transparent">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleCreation}
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
        )}
      </>
    )
  );
};
export default CreatorTeam;
