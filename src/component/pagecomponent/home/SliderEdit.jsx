import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { Link, useNavigate, useParams } from "react-router-dom";

const SliderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [managerOpener, setManagerOpener] = useState(false);

  const [data, setData] = useState("");
  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getbyidslider/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          let rawCover_url = JSON.parse(data.data[0].slider_image);
          setImage(rawCover_url);
          setData(
            (prv) => (prv = { ...data.data[0], slider_image: rawCover_url })
          );
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const SubmitSlider = () => {
    if (data.title && data.description && data.slider_image) {
      let stringedData = {
        ...data,
        slider_image: JSON.stringify(data.slider_image),
      };

      fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidslider/${id}`, {
        method: "PUT",
        body: JSON.stringify(stringedData),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            toast.success("Slider Updated");
            navigate(`/cms/pages/home`);
          }
        })
        .catch((err) => toast.error(err.message));
    } else {
    }
  };

  const handleSliderInputChange = (e) => {
    const { name, value } = e.target;
    setData((prv) => (prv = { ...prv, [name]: value }));
  };

  useEffect(() => {
    setData((prv) => (prv = { ...prv, slider_image: image }));
  }, [image]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {managerOpener ? (
        <Filemanagermain
          file={image}
          ratio={data.dimension}
          fileSetter={setImage}
          openSetter={setManagerOpener}
        />
      ) : (
        <div>
          <PageHeader
            currentpage="Edit Slider "
            activepage="Pages"
            mainpage="Edit Slider "
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
                            <h5 className="box-title"> Title</h5>

                            <input
                              type="text"
                              name="title"
                              value={data.title}
                              onChange={(e) => handleSliderInputChange(e)}
                              className="my-auto ti-form-input"
                              placeholder="Slider Title"
                            />
                          </div>
                          <div className="space-y-2">
                            <h5 className="box-title"> Description</h5>
                            <textarea
                              name="description"
                              value={data.description}
                              onChange={(e) => handleSliderInputChange(e)}
                              className="ti-form-input"
                              rows="2"
                            ></textarea>
                            <label className="ti-form-label mt-1 text-sm font-normal opacity-70 text-gray-500 dark:text-white/70 mb-0">
                              *Description should not exceed 500 letters
                            </label>
                          </div>
                          <div className="col-span-12 lg:col-span-6">
                            <div className="space-y-2  product-1">
                              <h5 className="box-title"> Status</h5>

                              <Select
                                className="product-search"
                                onChange={(val) =>
                                  setData(
                                    (prv) =>
                                      (prv = { ...data, status: val.value })
                                  )
                                }
                                value={[
                                  data.status
                                    ? { value: 1, label: "Enable" }
                                    : { value: 0, label: "Disable" },
                                ]}
                                classNamePrefix="react-select"
                                options={[
                                  { value: 1, label: "Enable" },
                                  { value: 0, label: "Disable" },
                                ]}
                                placeholder="Visibility"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block">
                              <div className="box-header flex justify-between">
                                <h5 className="box-title"> Slider Image</h5>
                                <span className="text-sm font-thin underline text-red-500">
                                  1 Image allowed Only
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setManagerOpener(1)}
                                className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                              >
                                Change Image
                                <i className="ti ti-file-plus "></i>
                              </button>
                              <img
                                src={`${
                                  import.meta.env.VITE_CMS_URL
                                }api/transform/${data.slider_image}`}
                                className="box-img-top h-72 rounded-t-sm"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-footer text-end border-t-0 px-0">
                  <button
                    onClick={SubmitSlider}
                    className="ti-btn ti-btn-primary"
                  >
                    <i className="ri-add-line"></i>Edit Slider
                  </button>
                  <Link to={`/cms/pages/home`} className="ti-btn ti-btn-danger">
                    <i className="ri-delete-bin-line"></i>Discard Slider
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SliderEdit;
