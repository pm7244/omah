// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { toast } from "react-toastify";
// import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
// import Filemanagermain from "../fileManager/filemanagermain";

// const AddSubCategoryProject = () => {
//   const navigate = useNavigate();
//   const [formValue, setFormValue] = useState({
//     sub_cat_id: "",
//     project_id: "",
//     status: 1,
//   });

//   const SubmitData = () => {

//     // fetch(`${import.meta.env.VITE_CMS_URL}api/createsubcategory`, {
//     //   method: "POST",
//     //   body: JSON.stringify(newData),
//     //   headers: { "Content-type": "application/json" },
//     // })
//     fetch(`${import.meta.env.VITE_CMS_URL}api/createsubcategory`, {
//       method: "POST",
//       body: JSON.stringify(SubmitterData),
//       headers: { "Content-Type": "application/json" },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.status) {
//           toast.success("Added new Data Successfully");
//           navigate(`/cms/pages/sub_categoryid`);
//         }
//       })
//       .catch((err) => {
//         toast.error(err.message);
//         console.log(err.message);
//       });
//   };

//   const handleSubmit = () => {
//     if (
//       !(
//         formValue.project_id &&
//         formValue.sub_cat_id 
//       )
//     ) {
//       toast.error("Please fill all field");
//       return;
//     }
//     try {
//       SubmitData();
//     } catch (error) {
//       console.log(error.message);
//       toast.error(error.message);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     setFormValue((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   return (
//     <div>
//         <>
//           <PageHeader
//             currentpage="Add Sub-Category & Project"
//             activepage="Pages"
//             mainpage="Add Sub-Category & Project"
//           />
//           <div className="grid grid-cols-12 gap-x-6">
//             <div className="col-span-12 xxl:col-span-8">
//               <div className="box">
//                 <div className="box-body space-y-5">
//                   <div>
//                     <label htmlFor="input-label1" className="ti-form-label">
//                     Project-Id
//                     </label>
//                     <input
//                       type="number"
//                       className="ti-form-input"
//                       placeholder="Enter Project Id"
//                       name="project_id"
//                       value={formValue.project_id}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="input-label1" className="ti-form-label">
//                     Sub-Category 
//                     </label>
//                     <input
//                       type="number"
//                       className="ti-form-input"
//                       placeholder="Enter Sub-Category Id"
//                       name="sub_cat_id"
//                       value={formValue.sub_cat_id}
//                       onChange={handleInputChange}
//                     />
//                   </div>
               
//                     <div className="col-span-12 xxl:col-span-9 mt-3">
//                       <label className="ti-form-label">Status</label>
//                       <Select
//                         className="product-searchs"
//                         classNamePrefix="react-select"
//                         name="status"
//                         options={[
//                           { value: 1, label: "Enable" },
//                           { value: 0, label: "Disable" },
//                         ]}
//                         value={[
//                           formValue.status === 1
//                             ? { value: 1, label: "Enable" }
//                             : { value: 0, label: "Disable" },
//                         ]}
//                         onChange={(val) =>
//                           setFormValue((prv) => (prv = { status: val.value }))
//                         }
//                         placeholder="Status"
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="box-footer bg-transparent">
//                   <div className="flex items-center justify-end">
//                     <button
//                       type="button"
//                       className="py-2 px-3 ti-btn ti-btn-primary"
//                       onClick={handleSubmit}
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//         </>
//     </div>
//   );
// };

// export default AddSubCategoryProject;









import React, { useState } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddSubCategoryProject = () => {
  const navigate = useNavigate();
  const SubmitData = () => {
    const SubmitterData = {
      sub_cat_id: sub_cat_id,
          project_id: project_id,
          status: status,
    };
    fetch(`${import.meta.env.VITE_CMS_URL}api/createsubcategory`, {
      method: "POST",
      body: JSON.stringify(SubmitterData),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .then(
        toast.success("Added new data Successfully"),
        navigate(`/cms/pages/sub_categoryid`)
      )
      .catch((err) => toast.error(err.message));
  };

  const handleSubmit = () => {
    if (!(project_id && sub_cat_id)) {
      toast.error("Please enter all field");
      return;
    }
    try {
      SubmitData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [project_id, setProject_id] = useState("");
  const [sub_cat_id, setSub_cat_id] = useState("");
  const [status, setStatus] = useState(1);

  return (
    <div>
      <PageHeader
        currentpage="Add Sub-Category & Project"
        activepage="Pages"
        mainpage="Add Sub-Category & Project"
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
                        <label className="ti-form-label mb-0">project_id</label>
                        <input
                          // type="number"
                          className="my-auto ti-form-input"
                          placeholder="project_id"
                          name="project_id"
                          value={project_id}
                          onChange={(e) => setProject_id(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="ti-form-label mb-0">sub_cat_id</label>
                        <input
                          // type="number"
                          className="my-auto ti-form-input"
                          placeholder="sub_cat_id"
                          name="sub_cat_id"
                          value={sub_cat_id}
                          onChange={(e) => setSub_cat_id(e.target.value)}
                        />
                      </div>
                      {/* <div className="space-y-2">
                        <label className="ti-form-label mb-0">
                        sub_cat_id
                        </label>
                        <textarea
                          rows={4}
                          className="ti-form-input"
                          name="sub_cat_id"
                          value={sub_cat_id}
                          onChange={(e) => setSub_cat_id(e.target.value)}
                        ></textarea>
                      </div> */}
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
                <i className="ri-add-line"></i>Add Career
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
export default AddSubCategoryProject;

