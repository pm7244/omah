import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const ProjectsCatEdits = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState();

  const fetchData = () => {
    if (!id) {
      toast.error("Enter Valid ID");
      return;
    }
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyid-pcat/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setValues({ ...data.data[0] });
      })
      .then(() => {})
      .catch((err) => toast.error(err.message));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prv) => (prv = { ...values, [name]: value }));
  };

  const handleCatSubmit = () => {
    if (
      !(
        values.cat_title &&
        values.cat_meta_title &&
        values.cat_slug &&
        values.cat_meta_description
      )
    ) {
      toast.error("Please Fill all the fields!");
      return;
    }
    fetch(`${import.meta.env.VITE_CMS_URL}api/update-pcat/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("ProjectsEdits updated succesfully");
          navigate("/cms/projects/configs");
        } else {
          toast.error(data.error);
        }
      });
  };

  const [options1, setOptions1] = useState([]);

  const FetchCategory = async () => {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}api/getAllParent`);
    const data = await res.json();
    const result = data.data;
    if (!result) {
      toast.error("result not found");
      return [];
    }
    const formattedOptions = result.map((item) => ({
      value: item.cat_id,
      label: item.cat_title,
    }));
    setOptions1(formattedOptions);
  };

  useEffect(() => {
    fetchData();
    FetchCategory();
  }, []);

  const handleSelectChange = (selectedOption) => {
    setValues((prev) => ({
      ...prev,
      parent_id: selectedOption ? selectedOption.value : null,
    }));
  };
  return (
    values && (
      <>
        <div>
          <PageHeader
            currentpage="ProjectsEdits"
            activepage="Pages"
            mainpage="ProjectsEdits"
          />
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 xxl:col-span-8">
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Category Title</h5>
                </div>
                <div className="box-body space-y-5">
                  <input
                    type="text"
                    name="cat_title"
                    value={values.cat_title}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    id="input-label1"
                    className="ti-form-input"
                    placeholder="Category title"
                  />
                </div>
              </div>
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Meta Description</h5>
                </div>
                <div className="box-body space-y-4">
                  <textarea
                    className="ti-form-input"
                    name="cat_meta_description"
                    value={values.cat_meta_description}
                    onChange={(e) => handleInputChange(e)}
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="col-span-12 xxl:col-span-4">
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title"> Category Slug</h5>
                </div>
                <div className="box-body space-y-5">
                  <input
                    type="text"
                    name="cat_slug"
                    value={values.cat_slug}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    className="ti-form-input"
                    placeholder="Category Slug"
                  ></input>
                </div>
              </div>

              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Meta Title</h5>
                </div>
                <div className="box-body space-y-5">
                  <input
                    type="text"
                    name="cat_meta_title"
                    value={values.cat_meta_title}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    className="ti-form-input"
                    placeholder="Category Meta Title"
                  ></input>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-6">
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Parent Category</h5>
                </div>
                <div className="box-body">
                  <Select
                    name="parent_id"
                    options={options1}
                    value={options1.find(
                      (options1) => options1.value === values.parent_id
                    )}
                    onChange={handleSelectChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-6">
              <div className="box">
                <div className="box-header">
                  <h5 className="box-title">Status</h5>
                </div>
                <div className="box-body">
                  <Select
                    value={[
                      values.cat_status === 1
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
                        (prv) => (prv = { ...values, status: val[0].value })
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
                      onClick={handleCatSubmit}
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
      </>
    )
  );
};
export default ProjectsCatEdits;
