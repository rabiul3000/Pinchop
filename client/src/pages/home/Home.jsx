import { Upload } from "lucide-react";
import { useState, useEffect } from "react";
import baseURL from "../../../utils/baseURL";
import axios from "axios";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // State to hold successfully uploaded/active pins
  const [activePins, setActivePins] = useState([]);

  // 1. Load active pins from LocalStorage on page refresh & start dynamic timer
  useEffect(() => {
    const savedPins = JSON.parse(localStorage.getItem("active_prints")) || [];
    // Filter out already expired ones immediately on refresh
    const validPins = savedPins.filter((p) => p.expiresAt > Date.now());
    setActivePins(validPins);
    localStorage.setItem("active_prints", JSON.stringify(validPins));

    // Live update countdown every second
    const interval = setInterval(() => {
      setActivePins((prevPins) => {
        const updated = prevPins.filter((p) => p.expiresAt > Date.now());
        if (updated.length !== prevPins.length) {
          localStorage.setItem("active_prints", JSON.stringify(updated));
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Helper function to calculate remaining mm:ss string dynamically
  const getRemainingTime = (expiresAt) => {
    const diff = expiresAt - Date.now();
    if (diff <= 0) return "Expired";
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds} mins left`;
  };

  const handleFileUploadChange = (e) => {
    const eventFile = e.target.files[0];
    if (eventFile) {
      setFiles((prev) => [...prev, eventFile]);
    }
  };

  const handlePublishClick = async (fileToUpload) => {
    const formData = new FormData();
    formData.append("file", fileToUpload);
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/file/create`, formData);

      if (res.data.success && res.data.pins.length > 0) {
        const newPinData = {
          name: fileToUpload.name,
          pin: res.data.pins[0].pin,
          expiresAt: res.data.pins[0].expiresAt,
        };

        // Update local state and permanently sync to localStorage
        const updatedPins = [...activePins, newPinData];
        setActivePins(updatedPins);
        localStorage.setItem("active_prints", JSON.stringify(updatedPins));

        // Remove from the staging "to-be-published" files list
        setFiles((prev) => prev.filter((f) => f !== fileToUpload));
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-12/12 flex flex-col gap-12 justify-center items-center pt-10">
      {/* --- SECTION 1: Active Generated Codes (Persistent across refresh) --- */}
      {activePins.length > 0 && (
        <div className="w-1/2 flex flex-col gap-4 border border-green-300 p-6 rounded-2xl bg-green-50/50">
          <h2 className="text-md font-bold text-green-800">
            Your Active Print PINs:
          </h2>
          {activePins.map((item) => (
            <div
              key={item.pin}
              className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-green-200"
            >
              <div>
                <p className="text-xs text-gray-500 truncate max-w-xs">
                  {item.name}
                </p>
                <p className="text-2xl font-black tracking-widest text-slate-800">
                  {item.pin}
                </p>
              </div>
              <span className="text-sm font-medium bg-red-100 text-red-600 px-3 py-1 rounded-full animate-pulse">
                {getRemainingTime(item.expiresAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* --- SECTION 2: Standard File Selector UI --- */}
      <div className="p-4 flex justify-center items-center flex-col gap-12 w-12/12">
        <input
          type="file"
          hidden
          id="file"
          name="file"
          onChange={handleFileUploadChange}
        />
        <label
          htmlFor="file"
          className="cursor-pointer border border-gray-400 border-dashed rounded-2xl lg:w-2/12 w-full h-42 flex justify-center items-center active:bg-gray-200 transition-colors duration-100 flex-col p-6"
        >
          <Upload className="text-slate-400" />
          <span className="text-xs text-gray-600 mt-2 font-semibold text-center">
            Tap to Select Document
          </span>
        </label>
      </div>

      {/* --- SECTION 3: Staging Queue (Files chosen but not yet uploaded) --- */}
      <div className="w-full gap-4 flex flex-col-reverse justify-center items-center">
        {files?.map((file) => {
          const { lastModified, name, size } = file;
          return (
            <div
              key={lastModified}
              className="border w-1/2 p-4 flex justify-between items-center rounded-2xl border-gray-300 shadow-xl"
            >
              <div className="flex gap-4 items-center">
                <div>
                  <h1 className="font-semibold text-slate-700"> {name} </h1>
                  <h5 className="text-xs text-gray-400">
                    {Math.floor(size / 1024)} KB
                  </h5>
                </div>
              </div>

              {loading ? (
                <button className="btn btn-ghost disabled">
                  <span className="loading loading-bars loading-xs"></span>
                </button>
              ) : (
                <button
                  className="bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700 font-semibold text-sm transition"
                  onClick={() => handlePublishClick(file)}
                >
                  Publish & Get PIN
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
