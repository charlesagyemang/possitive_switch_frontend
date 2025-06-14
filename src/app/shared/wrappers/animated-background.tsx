import React from "react";

function AnimatedBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden animate-gradient-bg bg-gradient-to-tr from-blue-100 via-white to-violet-200">
      {/* Decorative Shapes */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-200 opacity-20 rounded-br-full blur-2xl z-0"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-violet-300 opacity-20 rounded-tl-full blur-2xl z-0"></div>

      <div>{children}</div>
      <style jsx global>{`
        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-bg {
          background: linear-gradient(120deg, #bfdbfe, #fff, #c4b5fd);
          background-size: 200% 200%;
          animation: gradientBG 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default AnimatedBackground;
