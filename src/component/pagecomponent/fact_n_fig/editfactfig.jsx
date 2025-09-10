import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import Filemanagermain from "../fileManager/filemanagermain";

const EditFactFig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState();
  const [managerOpener, setManagerOpener] = useState(false);
  const [logo, setLogo] = useState("");

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidfnf/${id}`)
      .then((res) => res.json())
      .then((data) => {
        let img = JSON.parse(data.data[0].icon);
        setLogo(img);
        setInput({ ...data.data[0], icon: img });
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
    if (logo) {
      setInput((prv) => (prv = { ...prv, icon: [...logo] }));
    }
  }, [logo]);

  const SubmitChangedData = (id) => {
    const newData = { ...input, icon: JSON.stringify(input.icon) };
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidfnf/${id}`, {
      method: "PUT",
      body: JSON.stringify(newData),
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("Data Updated");
          navigate(`/cms/pages/fact&figure`);
          fetchData();
        }
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err.message);
      });
  };

  const handleSubmit = () => {
    if (!(input.title && input.description && input.symbol)) {
      toast.error("Please fill all field");
      return;
    }
    try {
      SubmitChangedData(input.fact_figure_id);
    } catch (error) {
      console.log(error.message);
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
            ratio={input.icon_dimension}
          />
        ) : (
          <>
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
                              <label className="ti-form-label">Title</label>
                              <input
                                type="text"
                                className="ti-form-input"
                                placeholder="Title"
                                name="title"
                                value={input.title}
                                onChange={(e) => handleChangeInput(e)}
                              />
                            </div>
                          </div>
                          <div className="col-span-12 xxl:col-span-9 mt-3">
                            <div className="box-header flex justify-between">
                              <h5>
                                List Image{" "}
                                <span className="text-red-500">*</span>
                              </h5>
                              <span className="text-sm font-thin underline text-red-500">
                                1 Image allowed Only
                              </span>
                            </div>
                            <div className="box-body">
                              <div onClick={() => setManagerOpener(true)}>
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
                                    {input.icon &&
                                      input.icon.map((pathFile, i) => {
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
                          <div className="">
                            <label className="ti-form-label">Symbol</label>
                            <input
                              type="text"
                              className="ti-form-input"
                              name="symbol"
                              placeholder="Symobol"
                              value={input.symbol}
                              onChange={(e) => handleChangeInput(e)}
                            />
                          </div>
                          <div className="">
                            <label className="ti-form-label">Number</label>
                            <input
                              type="number"
                              className="ti-form-input"
                              name="number"
                              placeholder="Number"
                              value={input.number}
                              onChange={(e) => handleChangeInput(e)}
                            />
                          </div>
                          <div className="">
                            <label className="ti-form-label">Description</label>
                            <textarea
                              className="ti-form-input h-24"
                              rows="2"
                              name="description"
                              value={input.description}
                              onChange={(e) => handleChangeInput(e)}
                            ></textarea>
                          </div>
                          <div>
                            <label className="ti-form-label">
                              Enquiry Status
                            </label>
                            <Select
                              classNamePrefix="react-select"
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
                                setInput({
                                  ...input,
                                  status: val.value,
                                })
                              }
                              menuPlacement="top"
                              placeholder="Open this select menu"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-footer text-end border-t-0 px-0">
                  <button
                    className="ti-btn ti-btn-primary"
                    onClick={handleSubmit}
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
          </>
        )}{" "}
      </div>
    )
  );
};

export default EditFactFig;
