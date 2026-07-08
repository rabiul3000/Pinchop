import { Upload, Trash2 } from "lucide-react";
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
        // Track the current upload time formatted as local clock string (e.g., "05:24 PM")
        const uploadTimeString = new Date().toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit" 
        });

        const newPinData = {
          name: fileToUpload.name,
          pin: res.data.pins[0].pin,
          expiresAt: res.data.pins[0].expiresAt,
          uploadedAt: uploadTimeString // Store print time locally
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

  // 2. Delete File Handler (Deletes from backend DB/Cloudinary & removes from frontend view)
  const handleDeletePin = async (pinToDelete) => {
    try {
      await axios.delete(`${baseURL}/file/${pinToDelete}`);
      
      // Filter out deleted entry from state and update localStorage
      const updatedPins = activePins.filter((p) => p.pin !== pinToDelete);
      setActivePins(updatedPins);
      localStorage.setItem("active_prints", JSON.stringify(updatedPins));
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("Error deleting file from server.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 justify-center items-center pt-6 pb-12 px-4 sm:px-6">
      {/* --- SECTION 1: Active Generated Codes (With Print Time & Delete) --- */}
      {activePins.length > 0 && (
        <div className="w-full max-w-xl sm:max-w-2xl flex flex-col gap-4 border border-green-300 p-4 sm:p-6 rounded-2xl bg-green-50/50">
          <h2 className="text-sm sm:text-md font-bold text-green-800">
            Your Active Print PINs:
          </h2>
          {activePins.map((item) => (
            <div
              key={item.pin}
              className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-green-200"
            >
              <div className="min-w-0 w-full sm:w-auto">
                <p className="text-xs text-gray-500 truncate max-w-xs sm:max-w-sm">
                  {item.name}
                </p>
                <div className="flex flex-wrap items-baseline gap-2 mt-1">
                  <p className="text-xl sm:text-2xl font-black tracking-widest text-slate-800">
                    {item.pin}
                  </p>
                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    Uploaded at {item.uploadedAt || "Just Now"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <span className="text-xs sm:text-sm font-medium bg-red-100 text-red-600 px-3 py-1 rounded-full animate-pulse">
                  {getRemainingTime(item.expiresAt)}
                </span>
                
                <button
                  onClick={() => handleDeletePin(item.pin)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-150"
                  title="Delete File Permanently"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- SECTION 2: Standard File Selector UI --- */}
      <div className="flex justify-center items-center flex-col w-full max-w-xl sm:max-w-2xl">
        <input
          type="file"
          hidden
          id="file"
          name="file"
          onChange={handleFileUploadChange}
        />
        <label
          htmlFor="file"
          className="cursor-pointer border border-gray-400 border-dashed rounded-2xl w-full sm:w-80 h-36 flex justify-center items-center active:bg-gray-200 transition-colors duration-100 flex-col p-6"
        >
          <Upload className="text-slate-400" />
          <span className="text-xs text-gray-600 mt-2 font-semibold text-center">
            Tap to Select Document
          </span>
        </label>
      </div>

      {/* --- SECTION 3: Staging Queue --- */}
      <div className="w-full max-w-xl sm:max-w-2xl gap-4 flex flex-col-reverse justify-center items-center">
        {files?.map((file) => {
          const { lastModified, name, size } = file;
          return (
            <div
              key={lastModified}
              className="border w-full p-4 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center rounded-2xl border-gray-300 shadow-lg"
            >
              <div className="flex gap-4 items-center min-w-0 w-full sm:w-auto">
                <div className="truncate">
                  <h1 className="font-semibold text-slate-700 text-sm sm:text-base truncate">
                    {name}
                  </h1>
                  <h5 className="text-xs text-gray-400">
                    {Math.floor(size / 1024)} KB
                  </h5>
                </div>
              </div>

              {loading ? (
                <button className="btn btn-ghost disabled self-end sm:self-auto">
                  <span className="loading loading-bars loading-xs"></span>
                </button>
              ) : (
                <button
                  className="w-full sm:w-auto bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700 font-semibold text-sm transition text-center"
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