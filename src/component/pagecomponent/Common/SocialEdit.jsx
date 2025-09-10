import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const SocialEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState();

  const fetchData = () => {
    if (!id) {
      toast.error("Enter Valid ID");
      return;
    }
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidsocial/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setValues(data.message[0]);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prv) => (prv = { ...values, [name]: value }));
  };

  const handleAssocSubmit = () => {
    if (!(values.name && values.link && values.icon)) {
      toast.error("Please Fill all the fields!");
      return;
    }
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidsocial/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(values),
    })
      .then(navigate("/cms/general/social"))

      .then(toast.success("Socials updated succesfully"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const icons = [
    {
      value: "ti ti-brand-facebook-filled",
      label: (
        <>
          <i className="ti ti-brand-facebook-filled "></i>Facebook
        </>
      ),
    },
    {
      value: "ti ti-brand-facebook",
      label: (
        <>
          <i className="ti ti-brand-facebook"></i> Facebook
        </>
      ),
    },
    {
      value: "ti ti-brand-instagram",
      label: (
        <>
          <i className="ti ti-brand-instagram"></i> Instagram
        </>
      ),
    },
    {
      value: "ti ti-brand-twitter-filled",
      label: (
        <>
          <i className="ti ti-brand-twitter-filled"></i> Twitter
        </>
      ),
    },
    {
      value: "ti ti-brand-twitter",
      label: (
        <>
          <i className="ti ti-brand-twitter"></i> Twitter
        </>
      ),
    },
    {
      value: "ti ti-mail",
      label: (
        <>
          <i className="ti ti-mail"></i> Mail
        </>
      ),
    },
    {
      value: "ti ti-brand-whatsapp",
      label: (
        <>
          <i className="ti ti-brand-whatsapp"></i> Whatsapp
        </>
      ),
    },
    {
      value: "ti ti-brand-yahoo",
      label: (
        <>
          <i className="ti ti-brand-yahoo"></i> Yahoo
        </>
      ),
    },
    {
      value: "ti ti-phone-calling",
      label: (
        <>
          <i className="ti ti-phone-calling"></i> Phone
        </>
      ),
    },
    {
      value: "ti ti-phone-call",
      label: (
        <>
          <i className="ti ti-phone-call"></i> Phone
        </>
      ),
    },
    {
      value: "ti ti-brand-google",
      label: (
        <>
          <i className="ti ti-brand-google"></i> Google
        </>
      ),
    },
    {
      value: "ti ti-brand-reddit",
      label: (
        <>
          <i className="ti ti-brand-reddit"></i> Reddit
        </>
      ),
    },
    {
      value: "ti ti-brand-yahoo",
      label: (
        <>
          <i className="ti ti-brand-yahoo"></i> Yahoo
        </>
      ),
    },
    {
      value: "ti ti-download",
      label: (
        <>
          <i className="ti ti-download"></i> Download
        </>
      ),
    },
  ];

  // const [selectedIcon, setSelectedIcon] = useState(null);

  const handleChange = (selectedIcon) => {
    // setSelectedIcon(selectedIcon);
    setValues((prev) => ({
      ...prev,
      icon: selectedIcon ? selectedIcon.value : null,
    }));
  };

  return (
    values && (
      <div>
        <PageHeader
          currentpage="Socials"
          activepage="Pages"
          mainpage="Socials"
        />
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 xxl:col-span-6">
            {/* //name */}
            <div className="box">
              <div className="box-body space-y-5">
                <label htmlFor="input-label1" className="ti-form-label">
                  Social Name
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
                  placeholder="Social Name"
                />
              </div>
            </div>
          </div>
          <div className="col-span-12 xxl:col-span-6">
            {/* //status */}
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
          <div className="col-span-6">
            {/* //link */}
            <div className="box">
              <div className="box-body space-y-5">
                <label htmlFor="input-label1" className="ti-form-label">
                  Social Link
                </label>
                <input
                  type="text"
                  name="link"
                  value={values.link}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className="ti-form-input"
                  placeholder="Social Link"
                ></input>
              </div>
            </div>
          </div>
          <div className="col-span-6">
            {/* //icon */}
            <div className="box">
              <div
                // onClick={() => setManagerOpener((prv) => (prv = !prv))}
                className="box-body space-y-4"
              >
                <label htmlFor="input-label1" className="ti-form-label">
                  Icon
                </label>
                <Select
                  value={icons.find((icon) => icon.value === values.icon)}
                  // value={selectedIcon}
                  onChange={handleChange}
                  options={icons}
                  placeholder="Select an icon"
                  isClearable
                />
                {/* <i className={values.icon}></i> */}
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
    )
  );
};

export default SocialEdit;
