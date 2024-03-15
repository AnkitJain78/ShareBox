import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { AiOutlineDelete } from "react-icons/ai";
import RingLoader from "react-spinners/RingLoader";
import axios from "axios";
import toast from "react-hot-toast";
import ConfettiExplosion from "react-confetti-explosion";

const UploadContainer = () => {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [draggedOver, setDraggedOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUpLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const [sendMail, setSendMail] = useState(false);
  const [uploadedID, setUploadedID] = useState();
  const [mailData, setMailData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    uploaded: []
  });

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDraggedOver(false);
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setDraggedOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleFileDelete = (fileIndex) => {
    setFiles((currentFiles) =>
      currentFiles.filter((file, index) => index !== fileIndex)
    );
  };
  const sendEmail = () => {
    setLoading(true);
    setSendMail(true);
    axios
      .post("http://localhost:5000/email", {
        ...mailData,
        uploaded: uploadedID
      })
      .then((res) => {
        toast.success(res.data);
        setLoading(false);
        setSendMail(false);
        setFiles([]);
        setIsExploding(true);
        setSendMail(true);
      })
      .catch((err) => {
        toast.error("Something went wrong!");
        setLoading(false);
        setSendMail(false);
      });
  };
  const uploadFile = () => {
    setLoading(true);
    setIsUpLoading(true);
    let formData = new FormData();
    files.forEach((file) => {
      formData.append(`${file.name}`, file);
    });
    const options = {
      onUploadProgress: (event) => {
        const { loaded, total } = event;
        let percent = Math.floor((loaded * 100) / total);
        setPercentage(percent);
      }
    };
    axios
      .post("http://localhost:5000/upload", formData, options)
      .then((res) => {
        toast.success(res.data.message);
        setUploadedID(res.data.files);
        setLoading(false);
        setIsUpLoading(false);
        setFiles([]);
        setIsExploding(true);
        setSendMail(true);
      })
      .catch((err) => {
        toast.error("Something went wrong!");
        setLoading(false);
        setIsUpLoading(false);
      });
  };
  return (
    <div className="max-w-lg mx-auto bg-white shadow-md w-full rounded-[10px] p-[32px] border">
      <div className="text-center font-semibold text-2xl text-[#454545]">
        Share File
      </div>
      <div
        className={twMerge(
          "mt-[32px] border-spacing-2 rounded-[8px] border-dashed drag w-full h-[202px] py-[20px] px-[10px] relative",
          dragging ? "border-primary/70" : ""
        )}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={twMerge(draggedOver ? "hidden" : "block")}>
          <div className="flex justify-center">
            <img src="/assets/Upload.png" alt="" />
          </div>
          <div className="font-semibold text-lg text-[#454545] text-center my-5">
            Drag & drop files or{" "}
            <label htmlFor="file_drop">
              <span className="text-primary underline cursor-pointer">
                Browse
              </span>
            </label>
          </div>
          <div className="mt-5 text-xs text-center text-[#676767] mx-2">
            Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
          </div>
        </div>
        <div
          id="overlay"
          className={twMerge(
            "w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md",
            draggedOver ? "draggedover" : ""
          )}
        >
          <i>
            <svg
              className="fill-current w-12 h-12 mb-3 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
            </svg>
          </i>
          <p className="text-lg text-[#454545] font-semibold">
            Drop files to upload
          </p>
        </div>
      </div>
      <div>
        <input
          type="file"
          name="file_drop"
          id="file_drop"
          className="hidden"
          multiple
          required
          onChange={handleFileInputChange}
        />
      </div>
      {files.length > 0 && (
        <div>
          <div className="mt-[16px] text-[#676767] font-semibold">
            {isUploading ? "Uploading Files" : "Ready to Share"}
          </div>
          <div className="space-y-3 mt-3">
            {files.map((file, index) => {
              return (
                <div
                  key={index}
                  className="border border-primary p-3 flex justify-between rounded-[4px] items-center"
                >
                  <div>{file.name}</div>
                  {!isUploading && (
                    <div
                      className="rounded-full bg-red-50 p-1 cursor-pointer"
                      onClick={(e) => handleFileDelete(index)}
                    >
                      <AiOutlineDelete color="#D64564" size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isUploading && (
        <div className="w-full h-3 bg-gray-100 my-3">
          <div
            style={{ width: `${percentage}%` }}
            className="bg-primary h-3"
          ></div>
        </div>
      )}
      {sendMail && (
        <div className="mt-5">
          <div>
            <label htmlFor="firstName" className="font-medium text-[#333]">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              required
              className="w-full p-3 outline-none border border-primary rounded-md mt-2"
              onChange={(e) =>
                setMailData({ ...mailData, firstName: e.target.value })
              }
            />
          </div>
          <div className="mt-3">
            <label htmlFor="firstName" className="font-medium text-[#333]">
              Last Name
            </label>
            <input
              type="text"
              id="firstName"
              required
              className="w-full p-3 outline-none border border-primary rounded-md mt-2"
              onChange={(e) =>
                setMailData({ ...mailData, lastName: e.target.value })
              }
            />
          </div>
          <div className="mt-3">
            <label htmlFor="firstName" className="font-medium text-[#333]">
              Email of client
            </label>
            <input
              type="email"
              id="firstName"
              required
              className="w-full p-3 outline-none border border-primary rounded-md mt-2"
              onChange={(e) =>
                setMailData({ ...mailData, email: e.target.value })
              }
            />
          </div>
        </div>
      )}
      <div
        className={twMerge(
          "bg-primary px-[14px] py-[9px] text-center text-white font-medium mt-5 rounded-[4px] cursor-pointer hover:scale-[1.03] hover:bg-primary/80 duration-200 ease-in-out"
        )}
        onClick={sendMail ? sendEmail : uploadFile}
      >
        {loading ? (
          <RingLoader
            loading={loading}
            size={30}
            color="white"
            className="mx-auto"
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : sendMail ? (
          "Send Mail"
        ) : (
          "Upload File"
        )}
      </div>
      {isExploding && <ConfettiExplosion />}
    </div>
  );
};

export default UploadContainer;
