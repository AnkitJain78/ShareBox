import React from "react";
import UploadContainer from "../components/UploadContainer";
import { Toaster } from "react-hot-toast";

const Landing = () => {
  return (
    <>
      <Toaster />
      <main className="bg-gray-50 h-screen w-screen pt-20">
        <UploadContainer />
      </main>
    </>
  );
};

export default Landing;
