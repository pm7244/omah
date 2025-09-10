import React, { useEffect, useState } from "react";
import Select from "react-dropdown-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const Footer = () => {
  const [footerLogo, setFooterLogo] = useState([]);
  const [footerDescription, setFooterDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [slug, setSlug] = useState("");
  const [dimension, setDimension] = useState("");
  const [managerOpener, setManagerOpener] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallfooter`)
      .then((res) => res.json())
      .then((data) => {
        const res = data.data[0];
        setFooterLogo(JSON.parse(res.footer_logo || "[]"));
        setFooterDescription(res.footer_description || "");
        setStatus(res.status || 0);
        setSlug(res.slug || "");
        setDimension(res.dimension || "");
      })
      .catch((err) => toast.error(err.message));
  }, []);

  const handleSubmit = () => {
    if ( !footerDescription || footerLogo.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      footer_logo: JSON.stringify(footerLogo),
      footer_description: footerDescription,
      status,
      slug,
      dimension,
    };

    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidfooter/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => toast.success("Footer updated successfully"))
      .catch((err) => toast.error("Update failed"));
  };

  return managerOpener ? (
    <Filemanagermain
      file={footerLogo}
      ratio={50/50}
      fileSetter={setFooterLogo}
      openSetter={setManagerOpener}
    />
  ) : (
    <div>
      <PageHeader currentpage="Footer" activepage="Pages" mainpage="Footer" />

      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 xxl:col-span-12">
          <div className="box">
            <div className="box-body space-y-5">
              <label className="ti-form-label">Footer Description</label>
              <textarea
                className="ti-form-input"
                rows="6"
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
              />

                <div className="col-span-12 xxl:col-span-12">
          <div className="box">
            <div className="box-header">
              <h5 className="box-title">Footer Logo</h5>
            </div>
            <div className="box-body">
              <button
                type="button"
                onClick={() => setManagerOpener(true)}
                className="ti-btn ti-btn-outline ti-btn-outline-primary"
              >
                Change Image <i className="ti ti-file-plus"></i>
              </button>
              {footerLogo.length > 0 && (
                <img
                  src={`${import.meta.env.VITE_CMS_URL}api/transform/${footerLogo[0]}`}
                  className="box-img-top h-44 rounded-t-sm mt-3"
                  alt="Footer Logo"
                />
              )}
            </div>
          </div>
        </div>
      
         
              <label className="ti-form-label">Status</label>
              <Select
                values={[{ value: status, label: status === 1 ? "Enable" : "Disable" }]}
                onChange={(val) => setStatus(val[0]?.value)}
                options={[
                  { value: 1, label: "Enable" },
                  { value: 0, label: "Disable" },
                ]}
                classNamePrefix="react-select"
              />
            </div>
          </div>
        </div>

      
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="py-2 px-4 ti-btn ti-btn-primary"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Footer;
