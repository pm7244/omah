import React, { useEffect, useState } from "react";
import Filemanagermain from "../pagecomponent/fileManager/filemanagermain";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddSpecification = () => {
  const [data, setData] = useState({
    layout_label: "",
    img1: [],
    img2: [],
  });

  const [img1, setImg1] = useState([]);
  const [img2, setImg2] = useState([]);
  const [managerOpener, setManagerOpener] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      img1,
      img2,
    }));
  }, [img1, img2]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // TODO: Replace with your API endpoint or logic to save the specification
    // Example: await fetch('/api/add-specification', { method: 'POST', body: JSON.stringify(data) })
    toast.success("Specification added successfully!");
    navigate("/cms/projects/project-create"); // Redirect back to project create page
  };

  return (
    <div>
      {/* Image Manager Popups */}
      {managerOpener === 1 ? (
        <Filemanagermain
          file={img1}
          ratio={1030 / 1285}
          fileSetter={setImg1}
          openSetter={() => setManagerOpener(null)}
        />
      ) : managerOpener === 2 ? (
        <Filemanagermain
          file={img2}
          ratio={1960 / 600}
          fileSetter={setImg2}
          openSetter={() => setManagerOpener(null)}
        />
      ) : (
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 xxl:col-span-8">
            <div className="box">
              <div className="box-body space-y-5">
                <div className="sm:grid grid-cols-12 sm:gap-6 space-y-5 sm:space-y-0">
                  {/* --- Image 1 --- */}
                  <div className="col-span-12">
                    <div className="box-header flex justify-between">
                      <h5>Image 1 (Logo)</h5>
                      <span className="text-sm font-thin underline text-red-500">
                        1 image allowed only
                      </span>
                    </div>
                    <div className="box-body">
                      <button
                        type="button"
                        className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        onClick={() => setManagerOpener(1)}
                      >
                        Select Image 1
                      </button>
                      <div className="grid grid-cols-12 gap-x-2 mt-2">
                        {img1.length > 0 ? (
                          img1.map((pathFile, i) => (
                            <img
                              key={i}
                              src={`${import.meta.env.VITE_CMS_URL}api/transform/${pathFile}`}
                              className="col-span-4 h-32 rounded-sm"
                            />
                          ))
                        ) : (
                          <span className="text-red-500">Select image</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* --- Image 2 --- */}
                  <div className="col-span-12">
                    <div className="box-header flex justify-between">
                      <h5>Image 2 (Banner / Secondary)</h5>
                      <span className="text-sm font-thin underline text-red-500">
                        1 image allowed only
                      </span>
                    </div>
                    <div className="box-body">
                      <button
                        type="button"
                        className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        onClick={() => setManagerOpener(2)}
                      >
                        Select Image 2
                      </button>
                      <div className="grid grid-cols-12 gap-x-2 mt-2">
                        {img2.length > 0 ? (
                          img2.map((pathFile, i) => (
                            <img
                              key={i}
                              src={`${import.meta.env.VITE_CMS_URL}api/transform/${pathFile}`}
                              className="col-span-4 h-32 rounded-sm"
                            />
                          ))
                        ) : (
                          <span className="text-red-500">Select image</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* --- Title --- */}
                  <div className="col-span-12 lg:col-span-6">
                    <label className="ti-form-label">Title</label>
                    <input
                      type="text"
                      className="ti-form-input"
                      placeholder="Enter title"
                      name="layout_label"
                      value={data.layout_label}
                      onChange={handleInputChange}
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
      )}
    </div>
  );
};

export default AddSpecification;
