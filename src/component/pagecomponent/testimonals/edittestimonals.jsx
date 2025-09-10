import React, { useState, useEffect } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import Select from "react-select";
import { registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

const EditTestimonals = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidtestimonial/${id}`)
      .then((res) => res.json())
      .then((dat) => {
        setData((prv) => (prv = dat.data[0]));
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const SubmitData = () => {
    const SubmitterData = { ...data };
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidtestimonial/${id}`, {
      method: "PUT",
      body: JSON.stringify(SubmitterData),
      headers: { "Content-Type": "application/json" },
    })
      .then(toast.success("Testimonal Updated Successfully"))
      .then(navigate(`${import.meta.env.BASE_URL}pages/testimonals`))
      .catch((err) => toast.error(err.message));
  };
  const handleSubmit = () => {
    if (!(data.name && data.description && data.company)) {
      toast.error("Please enter all field");
      return;
    }
    try {
      SubmitData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [data, setData] = useState();
  return (
    data && (
      <div>
        <PageHeader
          currentpage="Edit Testimonal"
          activepage="Pages"
          mainpage="Edit Testimonal"
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
                          <label className="ti-form-label mb-0">Name</label>
                          <input
                            type="text"
                            className="my-auto ti-form-input"
                            value={data.name}
                            name="name"
                            onChange={(e) => handleChangeValue(e)}
                            placeholder="Dolar Leather Handbag For Women"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="ti-form-label">Message</label>
                          <textarea
                            className="ti-form-input h-24"
                            rows="2"
                            value={data.description}
                            name="description"
                            onChange={(e) => handleChangeValue(e)}
                          ></textarea>
                          <label className="ti-form-label mt-1 text-sm font-normal opacity-70 text-gray-500 dark:text-white/70 mb-0">
                            *Description should not exceed 500 letters
                          </label>
                        </div>
                        <div className="space-y-2">
                          <label className="ti-form-label mb-0">Company</label>
                          <input
                            type="text"
                            className="my-auto ti-form-input"
                            placeholder="Enter Company"
                            value={data.company}
                            name="company"
                            onChange={(e) => handleChangeValue(e)}
                          />
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                          <div className="space-y-2  product-1">
                            <label className="ti-form-label mb-0">Status</label>
                            <Select
                              className="task-choice totdolist"
                              value={[
                                data.status === 1
                                  ? { value: 1, label: "Enable" }
                                  : { value: 0, label: "Disable" },
                              ]}
                              classNamePrefix="react-select"
                              options={[
                                { value: 1, label: "Enable" },
                                { value: 0, label: "Disable" },
                              ]}
                              onChange={(val) => {
                                setData(
                                  (prv) =>
                                    (prv = { ...data, status: val.value })
                                );
                              }}
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
                  onClick={handleSubmit}
                  type="button"
                >
                  <i className="ri-add-line"></i>Add Changes
                </button>
                <Link to="#" className="ti-btn ti-btn-danger">
                  <i className="ri-delete-bin-line"></i>Discard Changes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
export default EditTestimonals;
