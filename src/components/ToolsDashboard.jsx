import { useNavigate } from "react-router-dom";

const ToolsDashboard = () => {
  const navigate = useNavigate();
  const tools = [
    {
      id: 1,
      title: "Heat Map Tools",
      type: "HeatmapComponent",
      bgColor: "border-blue-400 hover:border-blue-600",
      textColor: "text-blue-800",
    },
    {
      id: 2,
      title: "Video Tools",
      type: "video",
      bgColor: "border-purple-400 hover:border-purple-600",
      textColor: "text-purple-800",
    },
    {
      id: 3,
      title: "Overlay Tools",
      type: "OverlayOptions",
      bgColor: "border-green-400 hover:border-green-600",
      textColor: "text-green-800",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 md:mb-12 text-center">
        Select Tool Category
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-6xl">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => navigate(`/${tool.type}`)}
            className={`bg-white p-6 rounded-xl border-2 ${tool.bgColor} transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95 flex flex-col min-h-[200px] md:min-h-[240px]`}
          >
            <h3
              className={`text-xl md:text-2xl font-bold ${tool.textColor} mb-4`}
            >
              {tool.title}
            </h3>

            <div className="flex flex-col space-y-2 md:space-y-3 flex-grow">
              <div className="flex items-center text-gray-600 text-sm md:text-base">
                <span className="mr-2 text-lg">✨</span>
                Advanced Features
              </div>
              <div className="flex items-center text-gray-600 text-sm md:text-base">
                <span className="mr-2 text-lg">⚡</span>
                Fast Processing
              </div>
              <div className="flex items-center text-gray-600 text-sm md:text-base">
                <span className="mr-2 text-lg">🔒</span>
                Secure & Reliable
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsDashboard;
