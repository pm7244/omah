import React, { useEffect, useState } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Blogs = () => {
  const [allData, setAllData] = useState();

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallblog`)
      .then((res) => res.json())
      .then((data) => setAllData(data.data))
      .catch((err) => {
        toast.error(err.message);
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = (id) => {
    const confirm = window.confirm("Are you sure want to delete");
    if (confirm) {
      fetch(`${import.meta.env.VITE_CMS_URL}api/deletebyidblog/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          toast.success("Deleted Data successfully");
          fetchData();
        })
        .catch((err) => console.log(err.message));
    }
  };

  return (
    allData && (
      <div>
        <PageHeader
          currentpage="Blogs List"
          activepage="Pages"
          mainpage="Blogs List"
        />
        <div className="box">
          <div className="box-header lg:flex lg:justify-between">
            <h5 className="box-title my-auto">Blogs List</h5>
            <Link
              to={`/cms/pages/blogs/addblog`}
              className="ti-btn ti-btn-primary m-0 py-2"
            >
              <i className="ri ri-add-line"></i>Add Blog
            </Link>
          </div>
          <div className="box-body">
            <div className="table-bordered whitespace-nowrap rounded-sm overflow-auto">
              <table className="ti-custom-table ti-custom-table-head edit-table">
                <thead className="bg-gray-100 dark:bg-black/20">
                  <tr className="">
                    <th scope="col" className="dark:text-white/70">
                      #
                    </th>
                    <th scope="col" className="dark:text-white/70">
                      Name
                    </th>
                    <th scope="col" className=" dark:text-white/70">
                      Image or Video
                    </th>
                    <th scope="col" className="!text-end dark:text-white/70">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allData?.map((idx) => (
                    <tr className="product-list" key={Math.random()}>
                      <td className="font-semibold ">{idx.blog_id}</td>
                      <td className="w-3/5">{idx.blog_name}</td>
                      <td className="w-1/2">
                        <div className="flex  justify-center">
                          <img
                            src={`${
                              import.meta.env.VITE_CMS_URL
                            }api/transform/${JSON.parse(idx.list_image)[0]}`}
                            className="w-56 h-auto bg-gray-100 dark:bg-black/20 p-1"
                            alt="Blog_Image"
                          />
                        </div>
                      </td>
                      <td className="w-3 font-medium">
                        <Link
                          aria-label="anchor"
                          to={`/cms/pages/blogs/editblog/${idx.blog_id}`}
                          className="w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-secondary"
                        >
                          <i className="ti ti-pencil"></i>
                        </Link>
                        <button
                          aria-label="anchor"
                          className="product-btn w-8 h-8 ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-danger"
                          onClick={() => handleDeleteClick(idx.blog_id)}
                        >
                          <i className="ti ti-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Blogs;
