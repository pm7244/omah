import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Filemanagermain from "../fileManager/filemanagermain";
// registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

const Associates = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [managerOpener, setManagerOpener] = useState(false);
  const [image, setImage] = useState();

  const [values, setValues] = useState();
  const fetchData = () => {
    if (!id) {
      toast.error("Enter Valid ID");
      return;
    }
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidassociate/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const rawUrl = JSON.parse(data.data[0].logo);
        setImage(rawUrl);
        setValues({ ...data.data[0], logo: rawUrl });
      })
      .catch((err) => toast.error(err.message));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prv) => (prv = { ...values, [name]: value }));
  };

  const handleAssocSubmit = () => {
    if (!(values.name && values.link && values.logo)) {
      toast.error("Please Fill all the fields!");
      return;
    }
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidassociate/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ ...values, logo: JSON.stringify(image) }),
    })
      .then((res) => res.json())

      .then((data) => {
        if (data.status) {
          toast.success("Associates updated succesfully");
          navigate("/cms/general/assoc");
        } else {
          toast.error("Failed to update");
        }
      });
  };

  useEffect(() => {
    setValues({ ...values, logo: image });
  }, [image]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    values && (
      <>
        {managerOpener ? (
          <Filemanagermain
            file={image}
            ratio={values.dimension}
            fileSetter={setImage}
            openSetter={setManagerOpener}
          />
        ) : (
          <div>
            <PageHeader
              currentpage="Associates"
              activepage="Pages"
              mainpage="Associates"
            />
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12 xxl:col-span-8">
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Associate Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      id="input-label1"
                      className="ti-form-input"
                      placeholder="Associate Name"
                    />
                  </div>
                </div>
                <div className="box">
                  <div className="box-body space-y-5">
                    <label htmlFor="input-label1" className="ti-form-label">
                      Associate Link
                    </label>
                    <input
                      type="text"
                      name="link"
                      value={values.link}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      className="ti-form-input"
                      placeholder="Associate Link"
                    ></input>
                  </div>
                </div>
              </div>
              <div className="col-span-12 xxl:col-span-4">
                <div className="box">
                  <div
                    className="box-body space-y-4"
                    onClick={() => setManagerOpener(!managerOpener)}
                  >
                    <label htmlFor="input-label1" className="ti-form-label">
                      Logo
                    </label>
                    {values.logo ? (
                      <>
                        <button
                          type="button"
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Change Image <i className="ti ti-file-plus "></i>
                        </button>
                        <img
                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${
                            values.logo
                          }`}
                          className="box-img-top h-52 rounded-t-sm"
                          alt="cover image"
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
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-6">
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
              <div className="col-span-6">
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Sort</h5>
                  </div>
                  <div className="box-body">
                    <Select
                      value={[
                        values.sort_order === 1
                          ? { value: 1, label: "1" }
                          : { value: 0, label: 0 },
                      ]}
                      classNamePrefix="react-select"
                      options={[
                        { value: 1, label: "1" },
                        { value: 0, label: "0" },
                      ]}
                      onChange={(val) => {
                        setValues(
                          (prv) => (prv = { ...values, sort_order: val.value })
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
                  <div className="box-footer bg-transparent">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleAssocSubmit}
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
export default Associates;
