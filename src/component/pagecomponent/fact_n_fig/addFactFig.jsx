import React, { useState } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const AddFactAndFigure = () => {
  const navigate = useNavigate();
  const SubmitData = () => {
    const SubmitterData = {
      title: title,
      description: description,
      icon: JSON.stringify(icon),
      symbol: symbol,
      status: status,
      number: number,
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/createfnf`, {
      method: "POST",
      body: JSON.stringify(SubmitterData),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {  
          toast.success("Added new data Successfully"),
            navigate(`/cms/pages/fact&figure`);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const handleSubmit = () => {
    if (!(title && description && status && symbol && number)) {
      toast.error("Please enter all field");
      return;
    }
    try {
      SubmitData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [managerOpener, setManagerOpener] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [status, setStatus] = useState(1);
  const [number, setNumber] = useState(1);
  return managerOpener == 1 ? (
    <Filemanagermain
      file={icon}
      ratio={120 / 100}
      fileSetter={setIcon}
      openSetter={setManagerOpener}
    />
  ) : (
    <div>
      <PageHeader
        currentpage="Add Fact & Figure"
        activepage="Pages"
        mainpage="Add Fact & Figure"
      />
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12">
          <div className="box !bg-transparent border-0 shadow-none">
            <div className="box-body p-0">
              <div className="col-span-12 xl:col-span-6">
                <div className="box ">
                  <div className="box-body">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="ti-form-label mb-0">Title</label>
                        <input
                          type="text"
                          className="my-auto ti-form-input"
                          placeholder="Title"
                          name="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="ti-form-label">Message</label>
                        <textarea
                          className="ti-form-input h-24"
                          rows="2"
                          placeholder="Message"
                          name="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="ti-form-label">Symbol</label>
                        <input
                          type="text"
                          className="my-auto ti-form-input"
                          placeholder="Symbol"
                          name="symbol"
                          value={symbol}
                          onChange={(e) => setSymbol(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="ti-form-label">Number</label>
                        <input
                          type="text"
                          className="my-auto ti-form-input"
                          placeholder="Number"
                          name="number"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                        />
                      </div>
                      <div className="box-body">
                        <label className="ti-form-label">Select Image</label>
                        <div onClick={() => setManagerOpener(1)}>
                          <label className="block">
                            <span className="sr-only">icon</span>
                            <button
                              type="button"
                              className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                            >
                              Change Image <i className="ti ti-file-plus "></i>
                            </button>
                            <div className="grid grid-cols-12 gap-x-2">
                              {icon &&
                                icon.map((pathFile, i) => {
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
                      <div className="col-span-12 lg:col-span-6">
                        <div className="space-y-2  product-1">
                          <label className="ti-form-label mb-0">Status</label>
                          <Select
                            className="product-search"
                            value={[
                              status === 1
                                ? { value: 1, label: "Enable" }
                                : { value: 0, label: "Disable" },
                            ]}
                            classNamePrefix="react-select"
                            options={[
                              { value: 1, label: "Enable" },
                              { value: 0, label: "Disable" },
                            ]}
                            onChange={(val) =>
                              setStatus((prv) => (prv = { status: val.value }))
                            }
                            placeholder="Status"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="box-footer text-end border-t-0 px-0">
              <button
                className="ti-btn ti-btn-primary"
                onClick={(e) => handleSubmit(e)}
                type="button"
              >
                <i className="ri-add-line"></i>Add Product
              </button>
              <Link to="#" className="ti-btn ti-btn-danger">
                <i className="ri-delete-bin-line"></i>Discard Product
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddFactAndFigure;
