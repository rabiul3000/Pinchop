import { Upload } from "lucide-react";

const Home = () => {
  return (
    <div className="w-12/12 h-100 flex justify-center items-center pt-38">
      <div className="p-4 flex justify-center items-center flex-col gap-12 w-12/12">
        <div className="flex justify-center items-center flex-col gap-2">
          <h1 className="font-bold text-5xl text-gray-800">PINCHOP</h1>
          <h4>Secure Document | <span className="bg-yellow-200"> Print </span> instantly </h4>
        </div>
        <div className="border border-gray-400 rounded-2xl lg:w-2/12 w-full  h-42 flex justify-center items-center active:bg-gray-200 transition-colors duration-100">
          <Upload size={96} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default Home;
