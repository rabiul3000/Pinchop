import { Upload } from "lucide-react";
import { useState } from "react";

const Home = () => {
  const [files, setFiles] = useState([]);

  const handleFileUploadChange = (e) => {
    if (e.target.files[0]) {
      setFiles((prev) => [...prev, ...e.target.files]);
    }
  };

  const handlePublishClick = () => {
    console.log("first")
  }

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

      <div className="w-full p-2 pb-24 gap-4 flex justify-center items-start">
        {files?.map((file, index) => {
          return (
            <div
              key={index}
              className="w-1/2 border rounded-xl p-12 flex flex-col gap-12 "
            >
              <div className="w-full h-full object-fill">
                <img src={URL.createObjectURL(file)} alt={index} />
              </div>
              <div>
                <button className="btn btn-neutral btn-soft" 
                  onClick={handlePublishClick}
                >Publish</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
