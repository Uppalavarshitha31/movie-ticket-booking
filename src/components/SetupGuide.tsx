import React, { useState } from "react";
import { Copy, Check, Terminal, ExternalLink, HelpCircle, Server, Database, Code } from "lucide-react";

export default function SetupGuide() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const steps = [
    {
      title: "1. Prepare Development Environment",
      icon: Terminal,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            You need a Java SE Development Kit (JDK) and an Integrated Development Environment (IDE) like Eclipse, IntelliJ IDEA, or NetBeans.
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-indigo-400"># Verify local JDK version</span>
              <button
                onClick={() => handleCopy("java -version\njavac -version", "jdk_verify")}
                className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition"
              >
                {copiedText === "jdk_verify" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-300">
              $ java -version{"\n"}
              $ javac -version
            </pre>
          </div>
          <p className="text-slate-400 text-xs">
            💡 <strong className="text-white">Tip:</strong> Ensure you are running JDK 11 or higher. Set your <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-400">JAVA_HOME</code> environment variable to your JDK path.
          </p>
        </div>
      )
    },
    {
      title: "2. Set up MySQL Database",
      icon: Database,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            Import the SQL schema with all the structure and mock seed data into your local MySQL server.
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-indigo-400"># Import MySQL schema shell command</span>
              <button
                onClick={() => handleCopy("mysql -u root -p < schema.sql", "mysql_import")}
                className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition"
              >
                {copiedText === "mysql_import" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-300">
              $ mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS movie_booking_db;"{"\n"}
              $ mysql -u root -p movie_booking_db &lt; db/schema.sql
            </pre>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
            <strong>⚠️ Credentials Notice:</strong> Change database credentials in <code className="text-white font-mono">DBConnection.java</code> if your local database username is not <code className="text-white">root</code> or if you have a custom password.
          </div>
        </div>
      )
    },
    {
      title: "3. Configure Tomcat and Build",
      icon: Server,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            Deploy the dynamic web app onto Apache Tomcat. Use Tomcat 9.x or later for full JSP 4.0 compatibility.
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
            <li>Copy the <code className="bg-slate-950 px-1 rounded text-pink-400">mysql-connector-j-8.x.jar</code> JDBC driver file inside <code className="bg-slate-950 px-1 rounded text-slate-300">src/main/webapp/WEB-INF/lib/</code>.</li>
            <li>In Eclipse: Right-click Project → <strong className="text-white">Run As → Run on Server</strong>.</li>
            <li>In IntelliJ IDEA: Add Tomcat Configuration, map deployment Artifact to Root, and click Start.</li>
          </ul>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-400">
            Tomcat Context Path: <span className="text-white">/moviebooking</span>{"\n"}
            Local Server URL: <span className="text-indigo-400 underline cursor-pointer">http://localhost:8080/moviebooking/movies</span>
          </div>
        </div>
      )
    },
    {
      title: "4. Troubleshooting FAQ",
      icon: HelpCircle,
      content: (
        <div className="space-y-3">
          <div className="border-l-2 border-indigo-500 pl-4 space-y-1">
            <h4 className="text-sm font-bold text-white">Exception: ClassNotFoundException: com.mysql.cj.jdbc.Driver</h4>
            <p className="text-xs text-slate-400">
              <strong>Fix:</strong> The JDBC connector JAR is missing in the runtime class loader. Copy the MySQL connector jar file directly to <code className="text-indigo-400">WEB-INF/lib/</code> and restart Tomcat.
            </p>
          </div>
          <div className="border-l-2 border-indigo-500 pl-4 space-y-1">
            <h4 className="text-sm font-bold text-white">Exception: Access denied for user 'root'@'localhost'</h4>
            <p className="text-xs text-slate-400">
              <strong>Fix:</strong> The MySQL username or password specified in <code className="text-indigo-400">DBConnection.java</code> is incorrect. Verify your local MySQL root credentials and compile again.
            </p>
          </div>
          <div className="border-l-2 border-indigo-500 pl-4 space-y-1">
            <h4 className="text-sm font-bold text-white">Why are CSS / Tailwind styles not loading locally?</h4>
            <p className="text-xs text-slate-400">
              <strong>Fix:</strong> In JSP files, context paths must be dynamically resolved using <code className="text-indigo-400">{"${pageContext.request.contextPath}"}</code>. Ensure you are connected to the internet, as the CSS loads Tailwind from CDN.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div id="setup-guide-container" className="space-y-8 max-w-4xl mx-auto py-4">
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
          <span>📖</span> Dynamic setup guide & checklists
        </h2>
        <p className="text-slate-400 text-sm">
          Everything you need to successfully compile, launch, and debug this Java MVC Web App locally on your system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              id={`setup-step-${idx}`}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition duration-300 flex flex-col space-y-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
              </div>
              <div className="flex-grow pt-2">
                {step.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
