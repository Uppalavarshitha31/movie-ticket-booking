import React from "react";
import LiveSimulator from "./components/LiveSimulator";

export default function App() {
  return (
    <div id="app-root-wrapper" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-grow">
        <LiveSimulator />
      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <p>© {new Date().getFullYear()} Grand Cinema Hall. All rights reserved.</p>
          <p className="text-[10px] text-slate-600">
            Dynamic Movie Booking System — Java Servlet MVC Architecture & JSP Technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
