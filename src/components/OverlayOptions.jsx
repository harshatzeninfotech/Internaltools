import { useNavigate } from "react-router-dom";

const Button = ({ title, onClick }) => (
  <button
    onClick={onClick}
    className="w-full max-w-xs md:max-w-xl py-8 px-6 bg-gradient-to-br from-blue-600 to-blue-500 
                hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl
                transition-all duration-300 transform hover:scale-105 active:scale-95
                flex items-center justify-center relative overflow-hidden group"
    style={{ minHeight: "150px" }}
    aria-label={`Open ${title} menu`}
  >
    {/* Animated Background */}
    <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300 rounded-2xl"></div>

    {/* Button Text */}
    <span
      className="text-4xl md:text-6xl font-bold tracking-wider drop-shadow-md
                     transform group-hover:scale-110 transition-transform duration-300"
    >
      {title}
    </span>

    {/* Subtle Icon */}
    <svg
      className="absolute bottom-2 right-4 w-8 h-8 text-white/30 group-hover:text-white/50 transition-all"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 5l7 7-7 7M5 5l7 7-7 7"
      />
    </svg>
  </button>
);

const OverlayOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 w-full">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Tools Button */}
            <Button
              title="Overlay with Normal"
              onClick={() => navigate("/overlay")}
            />

            {/* AI Overlay Button */}
            <Button
              title="Overlay with ABC"
              onClick={() => navigate("/ModifiedOverlay")}
            />

            {/* Optional Subtext */}
            <p className="mt-6 text-gray-600 text-lg md:text-xl font-medium text-center">
              Explore our collection of powerful utilities
            </p>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="py-8 bg-white/30 mt-auto text-center text-gray-600">
        <p className="text-sm font-medium tracking-wide">
          © Zennovation Solutions : The Poster Boys
        </p>
      </footer>
    </div>
  );
};

// const Home = () => {
//   return <div>Hello</div>;
// };
export default OverlayOptions;
