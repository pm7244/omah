import React, { useEffect, useState } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const Contact = () => {
  const [image, setImage] = useState([]);
  const [video, setVideo] = useState([]);
  const [managerOpener, setManagerOpener] = useState(false);

  const [values, setValues] = useState({
    title: "",
    slug: "",
    meta_title: "",
    meta_des: "",
    form_title: "",
    video_tag: "",
    status: 1,
    images: [],
    description: ""
  });

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallcontact`)
      .then((res) => res.json())
      .then((data) => {
        const resData = data.data[0] || {};
        const parsedImage = JSON.parse(resData.images || "[]");
        const parsedVideo = JSON.parse(resData.video || "[]");

        setImage(parsedImage);
        setVideo(parsedVideo);
        setValues({
          ...resData,
          images: parsedImage,
        });
      })
      .catch((err) => toast.error(err.message));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setValues((prev) => ({ ...prev, images: image }));
  }, [image]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const {
      video_tag,
      form_title,
      meta_title,
      meta_des,
      status,
      images,
      title,
      slug,
      description,
    } = values;

    if ( !form_title || !meta_title || !meta_des) {
      toast.error("Please fill all the required fields");
      return;
    }

    const updatedData = {
      title,
      slug,
      meta_title,
      meta_des,
      form_title,
      video_tag,
      status,
      description,
      images: JSON.stringify(images),
      video: JSON.stringify(video),
    };

    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidcontact/1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) toast.success("Contact page updated");
        else toast.error("Update failed");
      })
      .catch((err) => toast.error(err.message));
  };

  // File Manager conditional rendering
  if (managerOpener === 4) {
    return (
      <Filemanagermain
        file={video}
        fileSetter={setVideo}
        openSetter={setManagerOpener}
      />
    );
  }

  return (
    <div>
      <PageHeader currentpage="Contact Us" activepage="Pages" mainpage="Contact Us" />

      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 xxl:col-span-8">
          {/* Video Upload Section */}
          <div className="box">
            <div className="box-header">
              <h5 className="box-title">Video Upload</h5>
            </div>
            <div className="box-body space-y-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setManagerOpener(4)}
                  className="ti-btn ti-btn-outline ti-btn-outline-primary"
                >
                  {video.length > 0 ? "Change Video" : "Select Video"}{" "}
                  <i className="ti ti-video-plus"></i>
                </button>
                {video.length > 0 && (
                  <button
                    type="button"
                    className="ti-btn ti-btn-outline ti-btn-outline-danger"
                    onClick={() => {
                      setVideo([]);
                      toast.success("Video removed");
                    }}
                  >
                    Remove Video <i className="ti ti-trash"></i>
                  </button>
                )}
              </div>

              {video.length > 0 && (
                <video
                  controls
                  className="box-img-top h-52 rounded-md mt-3"
                  src={`${import.meta.env.VITE_CMS_URL}api/transform/${video[0]}`}
                />
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="box mt-5">
            <div className="box-body space-y-4">
              <label className="ti-form-label">Form Title</label>
              <input
                type="text"
                name="form_title"
                value={values.form_title}
                onChange={handleInputChange}
                className="ti-form-input"
              />

              <label className="ti-form-label">Video Tag</label>
              <input
                type="text"
                name="video_tag"
                value={values.video_tag}
                onChange={handleInputChange}
                className="ti-form-input"
              />

              <label className="ti-form-label">Meta Title</label>
              <input
                type="text"
                name="meta_title"
                value={values.meta_title}
                onChange={handleInputChange}
                className="ti-form-input"
              />

              <label className="ti-form-label">Meta Description</label>
              <textarea
                name="meta_des"
                value={values.meta_des}
                onChange={handleInputChange}
                className="ti-form-input"
              />

            
            </div>

            <div className="box-footer text-end bg-transparent mt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="ti-btn ti-btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
