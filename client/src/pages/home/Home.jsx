import { Upload } from "lucide-react";
import { useState } from "react";
import baseURL from "../../../utils/baseURL";
import axios from "axios";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUploadChange = (e) => {
    const eventFile = e.target.files[0];
    if (eventFile) {
      setFiles((prev) => [...prev, eventFile]);
    }
  };

  const handlePublishClick = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/file/create`, formData);

      console.log(res.data);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-12/12 flex flex-col gap-12 justify-center items-center pt-38">
      <div className="p-4 flex justify-center items-center flex-col gap-12 w-12/12">
        <input
          type="file"
          hidden
          id="file"
          name="file"
          multiple
          onChange={handleFileUploadChange}
        />
        <label
          htmlFor="file"
          className="border border-gray-400 rounded-2xl lg:w-2/12 w-full  h-42 flex justify-center items-center active:bg-gray-200 transition-colors duration-100 flex-col"
        >
          <Upload className="text-slate-400" />
          <span className="text-xs text-gray-600 mt-2 font-semibold">
            Tap to Select PDF
          </span>
        </label>
      </div>

      <div className="w-full gap-4 flex flex-col-reverse justify-center items-center">
        {files?.map((file) => {
          const { lastModified, name, size, type } = file;
          return (
            <div
              key={lastModified}
              className="border w-1/2 p-4 flex justify-between items-center rounded-2xl border-gray-300 shadow-xl"
            >
              <div className="flex gap-2 items-center">
                <div className="text-sm text-gray-500"> {type} </div>
                <h1> {name} </h1>
                <h5 className=" text-sm text-gray-500">
                  {Math.floor(size / 1024)} kb
                </h5>
              </div>

              {loading ? (
                <button
                  className="btn btn-ghost"
                  onClick={() => handlePublishClick(file)}
                >
                  <span className="loading loading-bars loading-xs"></span>
                </button>
              ) : (
                <button
                  className="btn btn-ghost"
                  onClick={() => handlePublishClick(file)}
                >
                  Publish
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
