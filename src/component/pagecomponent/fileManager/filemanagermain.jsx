import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ALLImages from "../../../common/imagesdata";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const Filemanagermain = ({ fileSetter, file, openSetter, modal_id, ratio }) => {
  const AR = ratio
    ? typeof ratio === "number"
      ? ratio
      : ratio.split("/")[0] / ratio.split("/")[1]
    : "";

  //as the name suggestss
  const [selectFile, setSelectedFile] = useState([...file]);
  const [modaler, setModaler] = useState(false);
  const [CropFile, setCropFile] = useState(false);

  //search files sorter
  const [files, setFiles] = useState({ currentPath: "", files: [] });

  //file fetcher from backend
  const fileFetcher = (path = "") =>
    fetch(`${import.meta.env.VITE_CMS_URL}api/get-files/${path}`)
      .then((res) => res.json())
      .then((data) => {
        setAllFileData(data.data);
        setFiles({ currentPath: path, files: data.data });
      });
  useEffect(() => {
    fileFetcher();
  }, []);

  //universal data
  const [allFileData, setAllFileData] = useState();

  //search function
  let allElement2 = [];
  let myfunction = (InputData) => {
    allFileData.forEach((ele) => {
      if (InputData === "") {
        allElement2 = [...allFileData];
      }
      if (ele.name.includes(InputData)) {
        allElement2.push(ele);
      }
    });
    setFiles({ ...files, files: allElement2 });
  };

  //delete files or directory
  const deleteFiles = (idx) => {
    let path = idx.path.slice(7);
    if (confirm(`Are you sure you want to delete ${idx.name}`) === true) {
      fetch(`${import.meta.env.VITE_CMS_URL}api/delete-directory/${path}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            toast.success(idx.name + " File Deleted");
            fileFetcher(path.replace(idx.name, ""));
          } else {
            toast.error("Oops! something wrong happened");
          }
        });
    }
  };

  //create-irectory
  const createDirectory = (path) => {
    let folderName = prompt("Please enter Folder Name...");
    if (folderName != "" && folderName != null) {
      fetch(`${import.meta.env.VITE_CMS_URL}api/create-directory/${path}`, {
        method: "POST",
        body: JSON.stringify({ folderName: folderName }),
        headers: { "Content-type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            fileFetcher(path + "/" + folderName);
          } else {
            toast.error(data.message);
          }
        })
        .catch();
    }
  };

  // as the name suggests
  const handleGoback = () => {
    const n = files.currentPath.lastIndexOf("/");
    let prvPath = "";
    if (n != -1) {
      prvPath = files.currentPath.slice(0, n);
    }
    fileFetcher(prvPath);
  };

  // cancel logic
  const handleCancel = () => {
    openSetter((prv) => (prv = !prv));
  };

  //handle final file select
  const handleFinalFileSelect = () => {
    if (selectFile.length > 0) {
      fileSetter((prv) => (prv = [...selectFile]));
      openSetter((prv) => (prv = !prv));
    }
  };

  const handleSelectFileDelete = (i) => {
    let tempArr = selectFile;
    tempArr.splice(i, 1);
    setSelectedFile((prv) => (prv = [...tempArr]));
  };

  const handleManagerFileSelect = (idx) => {
    let editedFile = idx.path.slice(7);
    if (
      idx.extension === ".mp4" ||
      idx.extension === ".mov" ||
      idx.extension === ".avi" ||
      idx.extension === ".webm" ||
      idx.extension === ".mkv"
    ) {
      // For video files, replace entire array with single video
      setSelectedFile([editedFile]);
      toast.success(idx.name + " Video selected");
    } else if (idx.extension !== ".pdf" && ratio) {
      setCropFile(editedFile);
    } else if (idx.extension === ".pdf") {
      let path = idx.path.slice(7);
      setSelectedFile([path]);
      toast.success(idx.name + " PDF selected");
    } else {
      let path = idx.path.slice(7);
      setSelectedFile([path]);
      toast.success(idx.name + " File selected");
    }
  };

  return (
    files.files && (
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out lg:!max-w-4xl lg:w-full  m-3 lg:!mx-auto">
        {CropFile ? (
          <Modal2
            AspectRatio={AR}
            setSelectedFile={setSelectedFile}
            selectFile={selectFile}
            img={CropFile}
            setImg={setCropFile}
          />
        ) : (
          <div className="ti-modal-content">
            <div className="grid grid-cols-12 gap-6 justify-center">
              <div className="col-span-12 ">
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">File Manager</h5>
                  </div>
                  <div className="box-body">
                    <div className="pb-5">
                      {/* header */}
                      <div className="md:flex justify-between space-y-2 md:space-y-0">
                        {/*  serach  */}
                        <div className="relative max-w-xs">
                          <label htmlFor="hs-table-search" className="sr-only">
                            Search
                          </label>
                          <input
                            type="text"
                            onChange={(ele) => {
                              myfunction(ele.target.value);
                            }}
                            name="hs-table-search"
                            id="hs-table-search"
                            className="p-2 ltr:pr-10 rtl:pl-10 ti-form-input"
                            placeholder="Search for items"
                          />
                          <div className="absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center pointer-events-none ltr:pr-4 rtl:pl-4">
                            <svg
                              className="h-3.5 w-3.5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                            </svg>
                          </div>
                        </div>
                        {/* folder file creator */}
                        <div className="flex gap-x-2">
                          <div className="md:ltr:ml-auto md:rtl:mr-auto">
                            <button
                              onClick={() => {
                                createDirectory(files.currentPath);
                              }}
                              className="ti-btn text-xs m-0 ti-btn-soft-success p-2"
                            >
                              <i className="ri ri-add-circle-line"></i>Create
                              New Folder
                            </button>
                          </div>
                          <div className="md:ltr:ml-auto md:rtl:mr-auto">
                            <button
                              onClick={() => setModaler(!modaler)}
                              className="ti-btn text-xs m-0 ti-btn-soft-success p-2"
                            >
                              <i className="ri ri-add-circle-line"></i>Upload
                              New File
                            </button>
                          </div>
                          {modaler && (
                            <Modal
                              setModaler={setModaler}
                              fileFetcher={fileFetcher}
                              path={files.currentPath}
                            />
                          )}
                        </div>
                      </div>
                      {/* back button */}
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={handleGoback}
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          <i className="ri ri-arrow-left-circle-line "></i> back
                        </button>
                        <div className="flex gap-x-1">
                          {ratio &&
                            selectFile.map((imgPath, i) => (
                              <div className="flex flex-col items-center gap-x-2  ">
                                <img
                                  className="h-10 rounded-md border"
                                  src={`${
                                    import.meta.env.VITE_CMS_URL
                                  }api/transform/${imgPath}`}
                                  alt={imgPath}
                                />
                                <i
                                  onClick={() => handleSelectFileDelete(i)}
                                  className="ri ri-arrow-left-circle-line"
                                ></i>
                              </div>
                            ))}
                        </div>
                      </div>
                      {/* file Manager table */}
                      <div className="overflow-auto">
                        <table className="ti-custom-table  table-bordered ti-custom-table-head">
                          <thead className="bg-gray-50 dark:bg-black/20">
                            <tr>
                              <th scope="col" className="!min-w-[13rem]">
                                Name
                              </th>
                              <th scope="col">Extension</th>
                              <th scope="col">Type</th>
                              <th scope="col" className="!text-end">
                                options
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {files.files.length === 0 ? (
                              <p className="text-center text-xl w-full">
                                Empty Folder
                              </p>
                            ) : (
                              files.files.map((idx, i) => (
                                <tr key={idx.name + " " + i}>
                                  <td className="font-medium">
                                    <button
                                      className="flex items-center space-x-2 rtl:space-x-reverse"
                                      onDoubleClick={() => {
                                        if (idx.type === "file") {
                                          handleManagerFileSelect(idx);
                                        }
                                      }}
                                      onClick={() => {
                                        if (idx.type === "directory") {
                                          let path = idx.path.slice(7);
                                          toast.warn(path);
                                          fileFetcher(path);
                                        }
                                      }}
                                    >
                                      {idx.extension === ".pdf" ? (
                                        <i className="ri-file-pdf-line text-2xl text-red-500"></i>
                                      ) : idx.extension === ".mp4" ||
                                        idx.extension === ".mov" ||
                                        idx.extension === ".avi" ||
                                        idx.extension === ".webm" ||
                                        idx.extension === ".mkv" ? (
                                        <video className="w-10" controls>
                                          <source
                                            src={`${
                                              import.meta.env.VITE_CMS_URL
                                            }${idx.path.slice(7)}`}
                                            type="video/mp4"
                                          />
                                          Your browser does not support the
                                          video tag.
                                        </video>
                                      ) : (
                                        <img
                                          src={`${
                                            idx.type === "directory"
                                              ? ALLImages("png49")
                                              : `${
                                                  import.meta.env.VITE_CMS_URL
                                                }${idx.path.slice(7)}`
                                          }`}
                                          alt="img"
                                          className="w-10"
                                        />
                                      )}
                                      <span>{idx.name}</span>
                                    </button>
                                  </td>
                                  <td>
                                    {idx.extension ? idx.extension : "Folder"}
                                  </td>
                                  <td>{idx.type}</td>
                                  <td className="!text-end">
                                    <div className="hs-dropdown ti-dropdown">
                                      <button
                                        aria-label="button"
                                        id="hs-dropdown-custom-icon-trigger1"
                                        type="button"
                                        className="hs-dropdown-toggle p-3 ti-dropdown-toggle"
                                      >
                                        <svg
                                          className="ti-dropdown-icon"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                                        </svg>
                                      </button>
                                      <div
                                        className="hs-dropdown-menu ti-dropdown-menu hidden"
                                        aria-labelledby="hs-dropdown-custom-icon-trigger1"
                                      >
                                        <button
                                          onClick={() => {
                                            deleteFiles(idx);
                                          }}
                                          className="ti-dropdown-item"
                                          to="#"
                                        >
                                          <i className="ri ri-delete-bin-6-line text-lg" />
                                          Delete
                                        </button>
                                        <button
                                          className="ti-dropdown-item"
                                          to="#"
                                        >
                                          <i className="ri ri-download-2-line text-lg" />
                                          Download
                                        </button>
                                        <button
                                          className="ti-dropdown-item"
                                          to="#"
                                        >
                                          <i className="ri ri-information-line text-lg" />
                                          Info
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      {/* Select or Cancel button */}
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          data-hs-overlay={`#manager${modal_id}`}
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleFinalFileSelect}
                          data-hs-overlay={`#manager${modal_id}`}
                          className="ti-btn rounded-md ti-btn-outline ti-btn-outline-primary"
                        >
                          Ok <i className="ri ri-check-line "></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

const Modal = ({ path, fileFetcher, setModaler }) => {
  const [filePreview, setfilePreview] = useState("");
  const [files, setFiles] = useState(null);

  const handleClose = () => {
    setModaler((prv) => (prv = !prv));
  };

  const handleClickClose = (e) => {
    if ((e.target = e.currentTarget)) {
      handleClose();
    }
  };

  //file uploader
  const handleUploadFile = () => {
    const formData = new FormData();
    formData.append("fileName", files);
    fetch(`${import.meta.env.VITE_CMS_URL}api/upload-file/${path}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          toast.success("File uploaded successfully");
          fileFetcher(path);
          handleClose();
        } else {
          toast.error("Failed to upload file.");
        }
      })
      .catch((error) => {
        toast.error("Error while uploading file.");
      });
  };

  //file handler for preview
  const fileHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(file);

      if (file.type && file.type.startsWith("video/")) {
        setfilePreview(URL.createObjectURL(file));
      } else if (file.type && file.type.startsWith("image/")) {
        setfilePreview(URL.createObjectURL(file));
      } else {
        setfilePreview("");
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-8 max-w-md w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add New File</h3>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="input-label" className="block mb-2">
            File
          </label>
          <input
            type="file"
            id="input-label"
            name="icon"
            onChange={fileHandler}
            className="w-full py-2 px-3 border border-gray-300 rounded-md"
          />
          {files && fileHandler && (
            <div className="mt-4">
              {files.type.startsWith("video/") ? (
                <video controls className="w-full rounded-md">
                  <source src={filePreview} type={files.type} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={filePreview}
                  className="mt-4 w-full rounded-md"
                  alt="Preview"
                />
              )}
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
            onClick={handleClickClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            onClick={handleUploadFile}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

const Modal2 = ({ AspectRatio, img, setImg, setSelectedFile, selectFile }) => {
  const MinDimension = 170;
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState(img);
  const [transformedUrl, setTransformedUrl] = useState("");
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [scaleX, setScaleX] = useState();
  const [scaleY, setScaleY] = useState();

  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [crop, setCrop] = useState();

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MinDimension / width) * 100;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: cropWidthInPercent,
        },
        AspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const isVideo =
    (imageUrl && imageUrl.endsWith(".mp4")) ||
    imageUrl.endsWith(".mov") ||
    imageUrl.endsWith(".avi");

  return (
    <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out ">
      <div className="ti-modal-content">
        <div className="p-5">
          <div className="space-y-5">
            {isVideo ? (
              <video controls style={{ maxHeight: "70vh" }}>
                <source
                  src={`${import.meta.env.VITE_CMS_URL}${imageUrl}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              imageUrl && (
                <ReactCrop
                  crop={crop}
                  keepSelection
                  aspect={AspectRatio}
                  minWidth={MinDimension}
                  onChange={(crop, percentCrop) => setCrop(percentCrop)}
                >
                  <img
                    ref={imageRef}
                    src={`${import.meta.env.VITE_CMS_URL}${imageUrl}`}
                    alt="img-cropper"
                    style={{ maxHeight: "70vh" }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              )
            )}
            {!isVideo && (
              <button
                className="ti-btn ti-btn-primary "
                onClick={() => {
                  if (!previewCanvasRef.current || !imageRef.current) {
                    return;
                  }

                  const canvas = previewCanvasRef.current;
                  const ctx = canvas.getContext("2d");

                  const scaleX =
                    imageRef.current.naturalWidth / imageRef.current.width;
                  const scaleY =
                    imageRef.current.naturalHeight / imageRef.current.height;

                  const pixelCrop = convertToPixelCrop(
                    crop,
                    imageRef.current.width,
                    imageRef.current.height
                  );
                  const scaledCrop = {
                    x: Math.round(pixelCrop.x * scaleX),
                    y: Math.round(pixelCrop.y * scaleY),
                    width: Math.round(pixelCrop.width * scaleX),
                    height: Math.round(pixelCrop.height * scaleY),
                  };

                  canvas.width = scaledCrop.width;
                  canvas.height = scaledCrop.height;

                  ctx.drawImage(
                    imageRef.current,
                    scaledCrop.x,
                    scaledCrop.y,
                    scaledCrop.width,
                    scaledCrop.height,
                    0,
                    0,
                    scaledCrop.width,
                    scaledCrop.height
                  );

                  setWidth(scaledCrop.width);
                  setHeight(scaledCrop.height);
                  setScaleX(scaledCrop.x);
                  setScaleY(scaledCrop.y);
                  const newUrl = `${imageUrl}?width=${scaledCrop.width}&height=${scaledCrop.height}&x=${scaledCrop.x}&y=${scaledCrop.y}`;
                  let tempArray = [...selectFile];
                  tempArray.push(newUrl);
                  setSelectedFile((prv) => (prv = tempArray));
                  setImg();
                }}
              >
                Crop it
              </button>
            )}
            {!isVideo && crop && (
              <canvas
                ref={previewCanvasRef}
                className="m-5"
                style={{
                  display: "none",
                  border: "1px solid black",
                  objectFit: "contain",
                  width: 150,
                  height: 150,
                }}
              />
            )}

            {transformedUrl && (
              <>
                <h2>Transformed Image</h2>
                <img
                  src={transformedUrl}
                  // onChange={() => updateAvatar(transformedUrl)}
                  alt="Transformed"
                  style={{ maxWidth: "100%" }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filemanagermain;
