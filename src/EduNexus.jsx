import { useState, useRef, useEffect } from "react";
import { supabase } from "./SupabaseClient";

/* ═══════════════════════════════════════════════════════════════
   PREMIUM VECTOR SVG ICONS (Replacing Emojis)
═══════════════════════════════════════════════════════════════ */
const Icons = {
  Graduation: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  Dashboard: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Calendar: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Analytics: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
  ),
  Todo: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  AI: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  Teaser: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Streak: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Activity: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Settings: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Alert: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Sparkle: ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l1.8 5.6L19.4 9.4 13.8 11.2 12 17l-1.8-5.8L4.6 9.4l5.6-1.8L12 2z" />
    </svg>
  ),
  Star: ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 20.1l1.4-6.3-4.8-4.3 6.4-.6L12 3z" />
    </svg>
  ),
  Shield: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
    </svg>
  ),
  Bolt: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  ),
  Clock: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  ),
  Trophy: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4zM7 5H4a1 1 0 00-1 1v1a4 4 0 004 4M17 5h3a1 1 0 011 1v1a4 4 0 01-4 4" />
    </svg>
  ),
  Upload: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V3m0 0L7 8m5-5l5 5" />
    </svg>
  ),
  Document: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
    </svg>
  ),
  Trash: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v13a1 1 0 01-1 1H8a1 1 0 01-1-1V7h10z" />
    </svg>
  ),
  Pencil: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Sprout: ({ className = "w-8 h-8" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V13m0 0c0-4 -3-6-7-6 0 4 3 7 7 7zm0-7c0-4 3-6 7-6 0 4-3 7-7 7z" />
    </svg>
  ),
  Users: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Book: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z" />
    </svg>
  ),
  X: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS & UTILS
═══════════════════════════════════════════════════════════════ */
const GP = {"A+":4,"A":4,"A-":3.7,"B+":3.3,"B":3,"B-":2.7,"C+":2.3,"C":2,"C-":1.7,"D":1,"F":0};
const uid = () => Math.random().toString(36).slice(2, 9);
const daysLeft = d => Math.ceil((new Date(d) - new Date()) / 86400000);
const fmtDate = d => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const calcGPA = cs => { 
  const tc = cs.reduce((a, c) => a + c.credits, 0);
  const tp = cs.reduce((a, c) => a + (GP[c.grade] || 0) * c.credits, 0); 
  return tc ? (tp / tc).toFixed(2) : "--"; 
};
const gradeCol = g => g.startsWith("A") ? "#10B981" : g.startsWith("B") ? "#3B82F6" : g.startsWith("C") ? "#F59E0B" : "#EF4444";
const greetTime = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

const RIDDLES = [
  { q: "I speak without a mouth, hear without ears. I come alive with wind. What am I?", a: "Echo" },
  { q: "The more you take, the more you leave behind. What am I?", a: "Footsteps" },
  { q: "What has hands but cannot clap?", a: "A clock" }
];

/* ═══════════════════════════════════════════════════════════════
   ROOT COMPONENT (WITH AUTOMATIC SYNC TO PREFIXED TABLES)
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [deadlines, setDeadlines] = useState([]);
  const [courses, setCourses] = useState([]);
  const [todos, setTodos] = useState([]);
  const [streak, setStreak] = useState(7);

  const [personalKey, setPersonalKey] = useState(() => localStorage.getItem("apex_personal_key") || "");
  const [usePersonalKey, setUsePersonalKey] = useState(() => localStorage.getItem("apex_use_personal_key") === "true");

  const showToast = (msg, color) => { 
    setToast({ msg, color }); 
    setTimeout(() => setToast(null), 3200); 
  };

  const fetchCloudData = async (userId) => {
    try {
      const { data: dlData } = await supabase.from("edu_deadlines").select("*").eq("user_id", userId);
      if (dlData) setDeadlines(dlData);

      const { data: cData } = await supabase.from("edu_courses").select("*").eq("user_id", userId);
      if (cData) setCourses(cData);

      const { data: tData } = await supabase.from("edu_todos").select("*").eq("user_id", userId);
      if (tData) setTodos(tData);

      const { data: profile } = await supabase.from("edu_profiles").select("streak").eq("id", userId).single();
      if (profile) setStreak(profile.streak);
    } catch (e) {
      console.warn("Supabase integration offline. Falling back to local device memory.", e);
      loadLocalCache();
    }
  };

  const loadLocalCache = () => {
    const d = localStorage.getItem("apex_deadlines");
    const c = localStorage.getItem("apex_courses");
    const t = localStorage.getItem("apex_todos");
    const s = localStorage.getItem("apex_streak");

    if (d) setDeadlines(JSON.parse(d));
    if (c) setCourses(JSON.parse(c));
    if (t) setTodos(JSON.parse(t));
    if (s) setStreak(parseInt(s, 10));
  };

  const handleLogin = (sessionData) => {
    setUser(sessionData);
    localStorage.setItem("apex_active_user", JSON.stringify(sessionData));
    setScreen("app");
    if (sessionData?.id) {
      fetchCloudData(sessionData.id);
    } else {
      loadLocalCache();
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setUser(null);
    localStorage.removeItem("apex_active_user");
    setScreen("home");
  };

  useEffect(() => {
    localStorage.setItem("apex_deadlines", JSON.stringify(deadlines));
    localStorage.setItem("apex_courses", JSON.stringify(courses));
    localStorage.setItem("apex_todos", JSON.stringify(todos));
    localStorage.setItem("apex_streak", streak.toString());
    localStorage.setItem("apex_personal_key", personalKey);
    localStorage.setItem("apex_use_personal_key", usePersonalKey.toString());
  }, [deadlines, courses, todos, streak, personalKey, usePersonalKey]);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const u = { id: session.user.id, name: session.user.user_metadata.name || session.user.email.split("@")[0], email: session.user.email };
        setUser(u);
        localStorage.setItem("apex_active_user", JSON.stringify(u));
        setScreen("app");
        fetchCloudData(session.user.id);
      } else {
        const activeSession = localStorage.getItem("apex_active_user");
        if (activeSession) {
          const parsed = JSON.parse(activeSession);
          setUser(parsed);
          setScreen("app");
          if (parsed?.id) {
            fetchCloudData(parsed.id);
          } else {
            loadLocalCache();
          }
        }
      }
    };
    checkUserSession();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-purple-200 selection:text-purple-900">
      
      {screen === "home" && <HomePage setScreen={setScreen} />}
      {screen === "login" && <LoginPage setScreen={setScreen} onLogin={handleLogin} showToast={showToast} />}
      {screen === "signup" && <SignupPage setScreen={setScreen} onLogin={handleLogin} showToast={showToast} />}
      
      {screen === "app" && (
        <AppPage 
          user={user} 
          onLogout={handleLogout}
          deadlines={deadlines} setDeadlines={setDeadlines}
          courses={courses} setCourses={setCourses}
          todos={todos} setTodos={setTodos}
          streak={streak} setStreak={setStreak}
          personalKey={personalKey} setPersonalKey={setPersonalKey}
          usePersonalKey={usePersonalKey} setUsePersonalKey={setUsePersonalKey}
          showToast={showToast}
        />
      )}
      
      {toast && <Toast msg={toast.msg} color={toast.color} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE (HOMEPAGE)
═══════════════════════════════════════════════════════════════ */
function HomePage({ setScreen }) {
  const features = [
    { icon: <Icons.Calendar />, bg: "bg-blue-500", title: "Deadline Tracker", desc: "Never miss an assignment, exam, or event. Get smart reminders and stay organized." },
    { icon: <Icons.Analytics />, bg: "bg-emerald-500", title: "CGPA Calculator", desc: "Track your courses and calculate your cumulative GPA in real time." },
    { icon: <Icons.Todo />, bg: "bg-purple-500", title: "Task Manager", desc: "Stay on top of daily tasks with a powerful to-do list. Prioritize and accomplish more." },
    { icon: <Icons.Teaser />, bg: "bg-orange-500", title: "Brain Teasers", desc: "Keep your mind sharp with fun puzzles. Challenge yourself and climb the leaderboard." },
    { icon: <Icons.AI />, bg: "bg-pink-500", title: "PDF Quiz Generator", desc: "Upload study materials and generate quizzes automatically. Test your knowledge." },
    { icon: <Icons.Streak />, bg: "bg-red-500", title: "Study Streaks", desc: "Build consistency with daily streaks. Connect with friends and stay motivated." },
  ];

  const steps = [
    { n: 1, title: "Create Your Account", desc: "Sign up in seconds and set up your academic profile with your courses and goals." },
    { n: 2, title: "Add Your Data", desc: "Input your deadlines, courses, and tasks. Upload PDFs to generate custom quizzes." },
    { n: 3, title: "Track & Achieve", desc: "Monitor your progress, maintain your streak, and watch your performance soar." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size={16} />
          <div className="flex items-center gap-6">
            <button onClick={() => setScreen("login")} className="text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors">Sign In</button>
            <button onClick={() => setScreen("signup")} className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all inline-flex items-center gap-1.5">
              Get Started
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 text-xs font-semibold text-purple-600 mb-8">
          <Icons.Sparkle /> Your Academic Success Platform <Icons.Star />
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight font-display">
          Master Your <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Academic</span> Journey
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Track deadlines, calculate your CGPA, manage tasks, challenge your mind, and stay motivated with streaks. All in one powerful platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button onClick={() => setScreen("signup")} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-full transition-all inline-flex items-center justify-center gap-2">
            Get Started Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={() => setScreen("login")} className="w-full sm:w-auto border border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:text-gray-900 font-bold px-8 py-4 rounded-full transition-all">Sign In</button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-gray-500">
          <span className="inline-flex items-center gap-1.5"><Icons.Shield className="text-emerald-500" /> Secure &amp; Private</span>
          <span className="inline-flex items-center gap-1.5"><Icons.Bolt className="text-amber-500" /> Lightning Fast</span>
          <span className="inline-flex items-center gap-1.5"><Icons.Clock className="text-blue-500" /> Real-time Sync</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <span className="inline-block bg-gray-100 text-gray-500 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4">Features</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Everything You Need to Excel</h2>
          <p className="text-gray-500 max-w-xl mx-auto">A comprehensive suite of tools designed specifically for students who want to stay organized and achieve their academic goals.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className={`w-11 h-11 rounded-xl ${f.bg} text-white flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 w-full text-center">
        <span className="inline-block bg-gray-100 text-gray-500 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4">How It Works</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Get Started in 3 Simple Steps</h2>
        <p className="text-gray-500 mb-12">Begin your journey to academic success today</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {steps.map(s => (
            <div key={s.n}>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl font-black mb-4">{s.n}</div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16 w-full">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl px-8 py-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/15 flex items-center justify-center mb-6">
            <Icons.Graduation className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Ready to Transform Your Academic Life?</h2>
          <p className="text-purple-100 max-w-lg mx-auto mb-8">Join students who are already using our platform to stay organized, focused, and successful.</p>
          <button onClick={() => setScreen("signup")} className="bg-white hover:bg-gray-100 text-purple-700 font-bold px-7 py-3.5 rounded-full transition-all inline-flex items-center gap-2">
            Start Your Journey
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <footer className="border-t border-gray-100 bg-white py-10 px-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <Logo size={16} />
          <p className="text-xs text-gray-400 mt-1">Your Partner in Academic Excellence</p>
          <p className="text-[11px] text-gray-300 mt-3">Built for students, by students</p>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WORKSPACE CONSOLE (APP SHELL)
═══════════════════════════════════════════════════════════════ */
function AppPage({
  user, onLogout,
  deadlines, setDeadlines,
  courses, setCourses,
  todos, setTodos,
  streak, setStreak,
  personalKey, setPersonalKey,
  usePersonalKey, setUsePersonalKey,
  showToast
}) {
  const [section, setSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activity, setActivity] = useState([]);

  const log = (type, msg, color) => {
    setActivity(p => [{ id: uid(), type, msg, time: new Date().toISOString(), color }, ...p.slice(0, 24)]);
  };

  const ctx = {
    deadlines, setDeadlines,
    courses, setCourses,
    todos, setTodos,
    streak, setStreak,
    personalKey, setPersonalKey,
    usePersonalKey, setUsePersonalKey,
    activity, setActivity, log,
    toast: showToast, setSection,
    user
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Icons.Dashboard /> },
    { id: "deadlines", label: "Deadlines", icon: <Icons.Calendar /> },
    { id: "cgpa", label: "CGPA Analytics", icon: <Icons.Analytics /> },
    { id: "todos", label: "Academic Checklists", icon: <Icons.Todo /> },
    { id: "quiz", label: "AI Flashcards & Quizzes", icon: <Icons.AI /> },
    { id: "teaser", label: "Focus Puzzles", icon: <Icons.Teaser /> },
    { id: "streaks", label: "Workspace Lobby", icon: <Icons.Streak /> },
    { id: "activity", label: "System Logs", icon: <Icons.Activity /> },
    { id: "notifs", label: "Settings", icon: <Icons.Settings /> }
  ];

  const urgent = deadlines.filter(d => !d.done && daysLeft(d.due) <= 3).length;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <header className="md:hidden border-b border-gray-200 bg-white px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Logo size={14} />
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </header>

      <aside className={`fixed md:sticky top-16 md:top-0 left-0 z-30 w-72 h-[calc(100vh-64px)] md:h-screen border-r border-gray-100 bg-white p-6 flex flex-col justify-between transform transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col gap-6">
          <div className="hidden md:block pb-4 border-b border-gray-100">
            <Logo size={15} />
          </div>

          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-3.5 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm uppercase">
              {user?.name?.slice(0, 2).toUpperCase() || "ST"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{user?.name || "Student"}</p>
              <p className="text-[10px] text-gray-400 inline-flex items-center gap-1"><Icons.Streak className="w-3 h-3 text-orange-500" /> {streak} Day Streak</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${section === item.id ? "bg-purple-50 text-purple-700" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border border-transparent"}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === "deadlines" && urgent > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{urgent}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
          <button onClick={onLogout} className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-500 hover:text-gray-900 px-4 py-3 rounded-xl text-xs font-bold transition-all">
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8 md:p-10 max-w-5xl mx-auto w-full overflow-x-hidden">
        {section === "dashboard" && <SectionDashboard user={user} {...ctx} />}
        {section === "deadlines" && <SectionDeadlines {...ctx} />}
        {section === "cgpa"      && <SectionCGPA {...ctx} />}
        {section === "todos"     && <SectionTodos {...ctx} />}
        {section === "quiz"      && <SectionQuiz {...ctx} />}
        {section === "teaser"    && <SectionTeaser {...ctx} />}
        {section === "streaks"   && <SectionStreaks user={user} {...ctx} />}
        {section === "activity"  && <SectionActivity {...ctx} />}
        {section === "notifs"    && <SectionNotifs {...ctx} />}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD SUB-SECTION
═══════════════════════════════════════════════════════════════ */
function SectionDashboard({ user, deadlines, courses, todos, streak, setSection }) {
  const gpa = calcGPA(courses);
  const numericGPA = parseFloat(gpa) || 0;
  const urgentCount = deadlines.filter(d => !d.done && daysLeft(d.due) <= 3).length;
  const activeDeadlines = deadlines.filter(d => !d.done).length;
  const pendingTasks = todos.filter(t => !t.done).length;
  const completedTasks = todos.filter(t => t.done).length;
  const upcoming = deadlines.filter(d => !d.done).sort((a, b) => new Date(a.due) - new Date(b.due)).slice(0, 3);

  const statCards = [
    { label: "Deadlines", value: activeDeadlines, sec: "deadlines", bg: "bg-blue-500", icon: <Icons.Calendar className="w-5 h-5" /> },
    { label: "Pending Tasks", value: pendingTasks, sec: "todos", bg: "bg-purple-500", icon: <Icons.Todo className="w-5 h-5" /> },
    { label: "Completed", value: completedTasks, sec: "todos", bg: "bg-emerald-500", icon: <Icons.Analytics className="w-5 h-5" /> },
    { label: "CGPA", value: gpa, sec: "cgpa", bg: "bg-orange-500", icon: <Icons.Book className="w-5 h-5" /> },
  ];

  const quickActions = [
    { icon: <Icons.Calendar className="w-5 h-5" />, bg: "bg-blue-500", title: "Deadlines", sub: "Track assignments", sec: "deadlines" },
    { icon: <Icons.Analytics className="w-5 h-5" />, bg: "bg-emerald-500", title: "CGPA", sub: "Calculate GPA", sec: "cgpa" },
    { icon: <Icons.Todo className="w-5 h-5" />, bg: "bg-purple-500", title: "Tasks", sub: "Manage to-dos", sec: "todos" },
    { icon: <Icons.Teaser className="w-5 h-5" />, bg: "bg-orange-500", title: "Brain Teasers", sub: "Challenge yourself", sec: "teaser" },
    { icon: <Icons.Document className="w-5 h-5" />, bg: "bg-pink-500", title: "Study", sub: "PDF quizzes", sec: "quiz" },
    { icon: <Icons.Streak className="w-5 h-5" />, bg: "bg-red-500", title: "Streaks", sub: "Track activity", sec: "streaks" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-2">
        <p className="text-xs font-semibold text-purple-500 mb-1">{greetTime()}</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back, {user?.name?.split(" ")[0] || "Student"}!</h1>
        <p className="text-sm text-gray-500 mt-1">Here's your academic overview for today.</p>
      </div>

      {urgentCount > 0 && (
        <div className="flex items-center gap-4 bg-red-50 border border-red-100 rounded-2xl p-4">
          <Icons.Alert className="w-5 h-5 text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-600">{urgentCount} deadline{urgentCount > 1 ? "s" : ""} due within 72 hours</p>
          </div>
          <button onClick={() => setSection("deadlines")} className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shrink-0">Review</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {statCards.map(s => (
          <div key={s.label} onClick={() => setSection(s.sec)} className="bg-white border border-gray-100 shadow-sm p-5 rounded-2xl cursor-pointer hover:border-gray-200 transition-all">
            <div className={`w-10 h-10 rounded-xl ${s.bg} text-white flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Icons.Clock className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="text-sm font-bold text-gray-900">Upcoming Deadlines</h3>
              <p className="text-[11px] text-gray-400">Your next due dates</p>
            </div>
          </div>
          <button onClick={() => setSection("deadlines")} className="text-xs font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1">
            View All
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-300 flex items-center justify-center mb-3">
              <Icons.Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No upcoming deadlines</p>
            <p className="text-xs text-gray-400 mt-0.5 mb-4">Add one to get started!</p>
            <button onClick={() => setSection("deadlines")} className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all">Add Deadline</button>
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map(d => {
              const dy = daysLeft(d.due);
              const c = dy <= 0 ? "text-red-500" : dy <= 3 ? "text-amber-500" : "text-emerald-500";
              return (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{d.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{fmtDate(d.due)}</p>
                  </div>
                  <span className={`text-xs font-bold ${c} shrink-0 ml-3`}>{dy <= 0 ? "Overdue" : `${dy}d left`}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider inline-flex items-center gap-1.5">
          <Icons.Bolt className="w-3.5 h-3.5 text-amber-400" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map(a => (
            <div key={a.title} onClick={() => setSection(a.sec)} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 cursor-pointer hover:border-gray-200 transition-all">
              <div className={`w-10 h-10 rounded-xl ${a.bg} text-white flex items-center justify-center mb-2.5`}>{a.icon}</div>
              <h4 className="text-sm font-bold text-gray-900">{a.title}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{a.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center"><Icons.Analytics className="w-5 h-5" /></div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Academic Progress</h3>
            <p className="text-[11px] text-gray-400">Your current standing</p>
          </div>
        </div>
        <p className="text-3xl font-black text-emerald-500">{gpa}</p>
        <p className="text-xs text-gray-400 mb-2">Current CGPA</p>
        <Bar pct={(numericGPA / 4) * 100} color="#10B981" />
        <p className="text-[11px] text-gray-400 mt-2 mb-4">out of 4.00 maximum</p>
        <button onClick={() => setSection("cgpa")} className="w-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold py-2.5 rounded-xl transition-all">Manage Courses</button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center"><Icons.Todo className="w-5 h-5" /></div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Task Progress</h3>
            <p className="text-[11px] text-gray-400">Your productivity</p>
          </div>
        </div>
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
          <span>Completed Tasks</span>
          <span className="text-gray-900 font-bold">{completedTasks} / {todos.length}</span>
        </div>
        <Bar pct={todos.length ? (completedTasks / todos.length) * 100 : 0} color="#7C3AED" />
        <button onClick={() => setSection("todos")} className="w-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold py-2.5 rounded-xl transition-all mt-4">View Tasks</button>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2.5 mb-1">
          <Icons.Streak className="w-6 h-6" />
          <span className="text-2xl font-black">{streak}</span>
          <span className="text-sm font-bold opacity-90">Day Streak</span>
        </div>
        <p className="text-xs text-white/80 mb-4">Keep going! You're on fire!</p>
        <button onClick={() => setSection("streaks")} className="w-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold py-2.5 rounded-xl transition-all">View Leaderboard</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEADLINES DESK (SYNCED WITH `edu_deadlines`)
═══════════════════════════════════════════════════════════════ */
function SectionDeadlines({ user, deadlines, setDeadlines, log, toast, setSection }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ title: "", course: "", due: "", type: "Assignment", priority: "Medium", notify: true });

  const setVal = k => e => setForm(p => ({ ...p, [k]: typeof e === "boolean" ? e : e.target.value }));

  async function add() {
    if (!form.title || !form.due) { toast("Identify title and due target.", "#EF4444"); return; }
    
    const newDeadline = {
      id: uid(),
      user_id: user?.id,
      title: form.title,
      course: form.course,
      due: form.due,
      type: form.type,
      priority: form.priority,
      notify: form.notify,
      done: false
    };

    setDeadlines(p => [...p, newDeadline]);
    log("deadline", `Added target: '${form.title}'`, "#3B82F6");
    toast("Course deadline logged.");
    setOpen(false);

    try {
      await supabase.from("edu_deadlines").insert([newDeadline]);
    } catch (e) {
      console.warn("Cached locally.", e);
    }
  }

  async function remove(id, title) {
    setDeadlines(p => p.filter(item => item.id !== id));
    log("deadline", `Purged: '${title}'`, "#EF4444");
    toast("Deadline removed permanently.");

    try {
      await supabase.from("edu_deadlines").delete().eq("id", id);
    } catch (e) {
      console.warn("Cached locally.", e);
    }
  }

  const list = deadlines
    .filter(d => filter === "all" ? true : filter === "pending" ? !d.done : filter === "done" ? d.done : daysLeft(d.due) <= 7 && !d.done)
    .sort((a, b) => new Date(a.due) - new Date(b.due));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <PageHeader onBack={() => setSection("dashboard")} title="Deadline Tracker" />
        <button onClick={() => setOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all shrink-0">+ Add Deadline</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[["all", "All Items"], ["pending", "Pending"], ["done", "Completed"], ["week", "7 Days Out"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${filter === v ? "bg-purple-50 text-purple-700 border-purple-100" : "text-gray-500 border-gray-200 hover:border-gray-300"}`}>{l}</button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map(d => {
          const dy = daysLeft(d.due);
          const c = dy <= 0 ? "text-red-500" : dy <= 3 ? "text-amber-500" : "text-emerald-500";
          return (
            <div key={d.id} className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm p-4 rounded-xl">
              <input type="checkbox" checked={d.done} onChange={async () => {
                const toggledDone = !d.done;
                setDeadlines(p => p.map(x => x.id === d.id ? { ...x, done: !x.done } : x));
                try {
                  await supabase.from("edu_deadlines").update({ done: toggledDone }).eq("id", d.id);
                } catch(e){}
              }} className="w-5 h-5 rounded border-gray-300 bg-gray-50 accent-purple-600 text-purple-600 cursor-pointer" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${d.done ? "line-through text-gray-400" : "text-gray-900"}`}>{d.title}</p>
                <p className="text-xs text-gray-500 mt-1">{d.course} · {d.type}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-xs font-extrabold ${c}`}>{d.done ? "Completed" : dy <= 0 ? "Overdue" : `${dy}d left`}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{fmtDate(d.due)}</p>
              </div>
              <button onClick={() => remove(d.id, d.title)} className="text-gray-400 hover:text-red-500 p-1 shrink-0">
                <Icons.Trash className="w-4 h-4" />
              </button>
            </div>
          );
        })}
        {list.length === 0 && <p className="text-sm text-gray-400 text-center py-10">No deadlines found.</p>}
      </div>

      {open && (
        <Modal title="Schedule Course Deadline" onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <Input label="Task Title" value={form.title} onChange={setVal("title")} placeholder="e.g. Physics Assignment 2" />
            <Input label="Course Name" value={form.course} onChange={setVal("course")} placeholder="e.g. Physics I" />
            <Input label="Due Target" type="date" value={form.due} onChange={setVal("due")} />
            <div className="grid grid-cols-2 gap-3">
              <Sel label="Assessment Category" value={form.type} onChange={setVal("type")}>
                {["Assignment", "Exam", "Project", "Report"].map(t => <option key={t}>{t}</option>)}
              </Sel>
              <Sel label="Priority Rank" value={form.priority} onChange={setVal("priority")}>
                {["Low", "Medium", "High", "Critical"].map(t => <option key={t}>{t}</option>)}
              </Sel>
            </div>
            <button onClick={add} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all mt-2">Log Deadline</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CGPA ANALYTICS (SYNCED WITH `edu_courses`)
═══════════════════════════════════════════════════════════════ */
function SectionCGPA({ user, courses, setCourses, log, toast, setSection }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", credits: 3, grade: "A", score: 90 });
  const setVal = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const currentGPA = calcGPA(courses);
  const numericGPA = parseFloat(currentGPA) || 0.0;

  async function add() {
    if (!form.name) { toast("Add course title.", "#EF4444"); return; }
    
    const newCourse = {
      id: uid(),
      user_id: user?.id,
      name: form.name,
      code: form.code,
      credits: +form.credits,
      grade: form.grade,
      score: +form.score
    };

    setCourses(p => [...p, newCourse]);
    log("cgpa", `Logged subject: ${form.name}`, "#10B981");
    toast("Subject logged.");
    setOpen(false);

    try {
      await supabase.from("edu_courses").insert([newCourse]);
    } catch(e){}
  }

  async function deleteCourse(id) {
    setCourses(p => p.filter(x => x.id !== id));
    toast("Subject removed.");
    try {
      await supabase.from("edu_courses").delete().eq("id", id);
    } catch(e){}
  }

  const totalCredits = courses.reduce((a, c) => a + (c.credits || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icons.Book className="w-6 h-6 text-gray-900" />
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">CGPA Calculator</h2>
            <p className="text-xs text-gray-400 mt-0.5">Track your courses and calculate your cumulative GPA.</p>
          </div>
        </div>
        <button onClick={() => setOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all shrink-0 inline-flex items-center gap-1.5">
          <span className="text-base leading-none">+</span> Add Course
        </button>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between mb-1">
          <p className="text-xs font-bold text-emerald-50 uppercase tracking-wider">Current CGPA</p>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Icons.Analytics className="w-5 h-5" />
          </div>
        </div>
        <p className="text-5xl font-black leading-none mb-4">{currentGPA}</p>
        <Bar pct={(numericGPA / 4) * 100} color="rgba(255,255,255,0.9)" />
        <p className="text-xs text-emerald-50 mt-2">out of 4.00</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
            <Icons.Book className="w-5 h-5" />
          </div>
          <p className="text-xs text-gray-400 font-semibold">Total Courses</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{courses.length}</p>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mb-3">
            <Icons.Graduation className="w-5 h-5" />
          </div>
          <p className="text-xs text-gray-400 font-semibold">Total Credits</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{totalCredits}</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-300 flex items-center justify-center mb-3">
            <Icons.Graduation className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-gray-500">No courses added yet. Add your first course to start tracking your CGPA!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map(c => (
            <div key={c.id} className="bg-white border border-gray-100 shadow-sm p-4 rounded-xl flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
                <p className="text-xs text-gray-400 mt-1">{c.code} · {c.credits} Credits</p>
              </div>
              <div className="text-right flex items-center gap-4 shrink-0">
                <div>
                  <p className="text-base font-black text-gray-900">{c.grade}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">GP: {GP[c.grade]?.toFixed(1)}</p>
                </div>
                <button onClick={() => deleteCourse(c.id)} className="text-gray-400 hover:text-red-500 p-1">
                  <Icons.Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <Modal title="Log Evaluated Course" onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <Input label="Course Name" value={form.name} onChange={setVal("name")} placeholder="e.g. Advanced Calculus" />
            <Input label="Code Label" value={form.code} onChange={setVal("code")} placeholder="e.g. MTH-202" />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Credits" type="number" value={form.credits} onChange={setVal("credits")} />
              <Sel label="Letter Grade" value={form.grade} onChange={setVal("grade")}>
                {Object.keys(GP).map(g => <option key={g}>{g}</option>)}
              </Sel>
              <Input label="Score %" type="number" value={form.score} onChange={setVal("score")} />
            </div>
            <button onClick={add} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all mt-2">Log Metrics</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TO-DO LIST DESK (SYNCED WITH `edu_todos`)
═══════════════════════════════════════════════════════════════ */
function SectionTodos({ user, todos, setTodos, log, toast, setSection }) {
  const [inp, setInp] = useState("");
  const [pri, setPri] = useState("Medium");
  
  const doneCount = todos.filter(t => t.done).length;
  const progressPercent = todos.length ? Math.round((doneCount / todos.length) * 100) : 0;

  async function add() {
    if (!inp.trim()) return;
    
    const newTodo = {
      id: uid(),
      user_id: user?.id,
      text: inp.trim(),
      done: false,
      priority: pri
    };

    setTodos(p => [newTodo, ...p]);
    log("todo", `Created task: '${inp}'`, "#10B981");
    setInp("");

    try {
      await supabase.from("edu_todos").insert([newTodo]);
    } catch(e){}
  }

  async function toggle(id, currentDone) {
    const nextDone = !currentDone;
    setTodos(p => p.map(t => t.id === id ? { ...t, done: nextDone } : t));
    try {
      await supabase.from("edu_todos").update({ done: nextDone }).eq("id", id);
    } catch(e){}
  }

  async function remove(id) {
    setTodos(p => p.filter(t => t.id !== id));
    toast("Task deleted permanently.");
    try {
      await supabase.from("edu_todos").delete().eq("id", id);
    } catch(e){}
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <PageHeader onBack={() => setSection("dashboard")} title="Task Manager" />
        <p className="text-xs text-gray-500 font-bold">{progressPercent}% complete</p>
      </div>

      <Card className="p-5">
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-gray-500">Task Completion Rate</span>
            <span className="text-purple-600">{progressPercent}%</span>
          </div>
          <Bar pct={progressPercent} color="#7C3AED" />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="e.g. Prepare lab writeup..." className="flex-1 min-w-[180px] bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-300" />
          <select value={pri} onChange={e => setPri(e.target.value)} className="bg-gray-100 border border-gray-200 text-gray-600 text-sm px-4 py-3 rounded-xl outline-none cursor-pointer">
            {["Low", "Medium", "High"].map(p => <option key={p}>{p}</option>)}
          </select>
          <button onClick={add} className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all">Add</button>
        </div>
      </Card>

      <div className="space-y-3">
        {todos.map(t => (
          <div key={t.id} className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm p-4 rounded-xl">
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id, t.done)} className="w-5 h-5 rounded border-gray-300 bg-gray-50 accent-purple-600 text-purple-600 cursor-pointer" />
            <div className="flex-1">
              <p className={`text-sm font-semibold ${t.done ? "line-through text-gray-400" : "text-gray-900"}`}>{t.text}</p>
            </div>
            <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-red-500 p-1">
              <Icons.Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
        {todos.length === 0 && <p className="text-sm text-gray-400 text-center py-10">No checklist items pending.</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AI DESK: FLASHCARDS & QUIZ GENERATOR (LIVE DUAL-KEY PIPELINE)
═══════════════════════════════════════════════════════════════ */
function SectionQuiz({ log, toast, setSection, setStreak, personalKey, usePersonalKey }) {
  const [step, setStep] = useState("upload");
  const [mode, setMode] = useState("flashcards");
  const [fileName, setFileName] = useState("");
  const [payload, setPayload] = useState(null);
  const [numQ, setNumQ] = useState(5);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);

  const [cards, setCards] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState({});

  const fileRef = useRef();

  async function handleFile(e) {
    const file = e.target.files[0]; if (!file) return;
    
    // Strict PDF Only check
    if (file.type !== "application/pdf") {
      toast("Invalid file type. Only PDF documents are supported.", "#EF4444");
      return;
    }
    
    // Strict 4MB Free tier safety boundary
    if (file.size > 4 * 1024 * 1024) {
      toast("File size boundary restriction exceeded (Max 4MB PDF).", "#EF4444");
      return;
    }
    
    setFileName(file.name);
    try {
      const b64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      setPayload({ type: "pdf", b64 });
      toast("Document processed into workspace.", "#10B981");
    } catch {
      toast("Unable to parse input payload.", "#EF4444");
    }
  }

  function getLocalFallback() {
    const topic = fileName ? fileName.replace(/\.[^/.]+$/, "") : "Document Data";
    if (mode === "quiz") {
      return Array.from({ length: numQ }, (_, i) => ({
        question: `Explain core variable dynamics inside "${topic}" during Module ${i + 1}?`,
        options: [
          `A) System Optimization Module ${i + 1}`,
          `B) Redundant Latency Loop`,
          `C) Systematic Validation Protocols`,
          `D) Passive Matrix Interlocking`
        ],
        answer: `A) System Optimization Module ${i + 1}`
      }));
    } else {
      return Array.from({ length: numQ }, (_, i) => ({
        front: `Factual Concept Segment ${i + 1} (${topic})`,
        back: `This represents a primary parameters rule inside ${topic}. It defines scalable performance benchmarks during baseline analysis loops.`
      }));
    }
  }

  async function generate() {
    if (!payload) { toast("Please upload a file first.", "#EF4444"); return; }
    setStep("loading");

    const promptText = mode === "quiz"
      ? `Generate exactly ${numQ} highly randomized, unique multiple-choice questions based on the structural facts of this document. Do not focus on only one section; scan the entire document. Return ONLY a valid raw JSON array containing objects matching this format exactly: {"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"answer":"A) ..."} (The answer string must match one option exactly). No markdown wrapper, no extra explanations.`
      : `Generate exactly ${numQ} highly randomized study flashcards scanning the key concepts, terms, and theories of this document. Ensure deep coverage of different sections. Return ONLY a valid raw JSON array matching this format exactly: [{"front":"Concept, question or term","back":"Detailed, clear active recall answer or explanation"}]. No markdown wrapper, no extra text.`;

    const headers = { "Content-Type": "application/json" };
    if (usePersonalKey && personalKey.trim()) {
      headers["X-Gemini-Key"] = personalKey.trim();
    }

    try {
      const messages = [{
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: payload.b64 } },
          { type: "text", text: promptText }
        ]
      }];

      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          model: "gemini-2.0-flash",
          max_tokens: 3000,
          messages: messages
        })
      });

      if (!response.ok) throw new Error("API responded with code " + response.status);
      const data = await response.json();
      
      const fullText = (data.content?.map(c => c.type === "text" ? c.text : "").join("") || "").trim();
      const jsonMatch = fullText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (!jsonMatch) throw new Error("Output did not contain a valid JSON array.");
      const parsed = JSON.parse(jsonMatch[0]);

      if (mode === "quiz") {
        setQuestions(parsed);
        setAnswers({});
        setRevealed(false);
        setStep("quiz");
        log("quiz", `AI generated Quiz deck from ${fileName}`, "#3B82F6");
      } else {
        setCards(parsed);
        setCurrentIdx(0);
        setFlipped(false);
        setMastered({});
        setStep("cards");
        log("quiz", `AI generated Flashcard deck from ${fileName}`, "#7C3AED");
      }
      toast("AI Materials synthesized successfully!", "#10B981");

    } catch (err) {
      console.error("AI Generation failed. Returning fallback.", err);
      toast("Proxy link issue. Utilizing mock analyzer fallback.", "#F59E0B");
      
      const fallback = getLocalFallback();
      if (mode === "quiz") {
        setQuestions(fallback);
        setAnswers({});
        setRevealed(false);
        setStep("quiz");
      } else {
        setCards(fallback);
        setCurrentIdx(0);
        setFlipped(false);
        setMastered({});
        setStep("cards");
      }
    }
  }

  function submitQuiz() {
    setRevealed(true);
    const corrected = questions.filter((q, i) => answers[i] === q.answer).length;
    log("quiz", `Completed Quiz Evaluation: ${corrected}/${questions.length}`, "#3B82F6");
    if (corrected === questions.length) {
      setStreak(p => p + 1);
      toast("Perfect evaluation! Streak score updated.", "#10B981");
    }
  }

  function toggleMastered(idx) {
    setMastered(p => {
      const up = { ...p, [idx]: !p[idx] };
      const completed = Object.values(up).filter(Boolean).length;
      if (completed === cards.length) {
        setStreak(p => p + 1);
        toast("Streak updated! All flashcards mastered.", "#10B981");
      }
      return up;
    });
  }

  const masteredCount = Object.values(mastered).filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <PageHeader onBack={() => setSection("dashboard")} title="Study Materials" />
        {step !== "upload" && (
          <button onClick={() => setStep("upload")} className="border border-gray-200 hover:border-gray-300 text-gray-600 text-xs font-bold px-4 py-2.5 rounded-full transition-all shrink-0">
            Upload Another
          </button>
        )}
      </div>

      {step === "upload" && (
        <div className="max-w-xl mx-auto space-y-4">
          <div onClick={() => fileRef.current.click()} className="border-2 border-dashed border-gray-200 hover:border-purple-200 bg-white p-10 rounded-2xl text-center cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mx-auto mb-3">
              <Icons.Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Upload Study Document</p>
            <p className="text-xs text-gray-400 mb-4">Accepts PDF files (Max 4MB)</p>
            <input type="file" ref={fileRef} accept=".pdf" onChange={handleFile} className="hidden" />
            <button className="bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-100 text-xs font-bold px-5 py-2.5 rounded-xl transition-all">Choose PDF File</button>
            {fileName && <p className="text-xs text-emerald-600 font-bold mt-4 font-display">Loaded: {fileName}</p>}
          </div>

          {payload && (
            <Card className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setMode("flashcards")} className={`py-3 rounded-xl text-xs font-bold border transition-all inline-flex items-center justify-center gap-1.5 ${mode === "flashcards" ? "bg-purple-50 border-purple-100 text-purple-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
                  <Icons.AI className="w-4 h-4" /> Flashcards
                </button>
                <button onClick={() => setMode("quiz")} className={`py-3 rounded-xl text-xs font-bold border transition-all inline-flex items-center justify-center gap-1.5 ${mode === "quiz" ? "bg-purple-50 border-purple-100 text-purple-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
                  <Icons.Document className="w-4 h-4" /> Quiz
                </button>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">Target Volume</p>
                <div className="flex gap-2">
                  {[3, 5, 8, 10].map(n => (
                    <button key={n} onClick={() => setNumQ(n)} className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${numQ === n ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}>{n}</button>
                  ))}
                </div>
              </div>

              <button onClick={generate} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all font-display">Generate Workspace Deck</button>
            </Card>
          )}
        </div>
      )}

      {step === "loading" && (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-gray-900">Synthesizing study records...</p>
        </div>
      )}

      {/* RENDER ACTIVE FLASHCARDS MODULE */}
      {step === "cards" && cards.length > 0 && (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Card {currentIdx + 1} of {cards.length}</span>
            <span>Mastered: {masteredCount}/{cards.length}</span>
          </div>

          <div className="flashcard-perspective" onClick={() => setFlipped(!flipped)}>
            <div className={`flashcard-inner ${flipped ? "is-flipped" : ""}`}>
              <div className="flashcard-front bg-white border border-gray-100 rounded-2xl flex flex-col justify-between p-6">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Question Segment</span>
                <p className="text-sm text-gray-700 leading-relaxed font-semibold">{cards[currentIdx].front}</p>
                <span className="text-[10px] text-purple-500 font-bold">Flip Card</span>
              </div>
              <div className="flashcard-back bg-purple-50 border border-purple-100 rounded-2xl flex flex-col justify-between p-6">
                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Factual Answer</span>
                <p className="text-xs text-gray-700 leading-relaxed font-semibold">{cards[currentIdx].back}</p>
                <span className="text-[10px] text-gray-500 font-bold">Return Front</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <button disabled={currentIdx === 0} onClick={() => { setCurrentIdx(p => p - 1); setFlipped(false); }} className="flex-1 bg-gray-50 border border-gray-200 text-gray-600 py-3 rounded-xl disabled:opacity-50 text-xs font-bold">Previous</button>
            <button onClick={() => toggleMastered(currentIdx)} className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all inline-flex items-center justify-center gap-1.5 ${mastered[currentIdx] ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "border-gray-200 text-gray-600"}`}>
              {mastered[currentIdx] && <Icons.Check className="w-3.5 h-3.5" />} {mastered[currentIdx] ? "Mastered" : "Mark Mastered"}
            </button>
            <button disabled={currentIdx === cards.length - 1} onClick={() => { setCurrentIdx(p => p + 1); setFlipped(false); }} className="flex-1 bg-gray-50 border border-gray-200 text-gray-600 py-3 rounded-xl disabled:opacity-50 text-xs font-bold">Next</button>
          </div>
        </div>
      )}

      {/* RENDER MCQS MODULE */}
      {step === "quiz" && (
        <div className="max-w-xl mx-auto space-y-4">
          {revealed && (
            <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-2xl text-center">
              <p className="text-3xl font-black text-gray-900">{questions.filter((q, i) => answers[i] === q.answer).length} / {questions.length}</p>
              <p className="text-xs text-gray-500 mt-2">Evaluation accuracy calculated.</p>
            </div>
          )}

          {questions.map((q, i) => (
            <Card key={i} className="space-y-3">
              <p className="text-sm font-bold text-gray-900"><span className="text-purple-500">Q{i + 1}.</span> {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, j) => {
                  const sel = answers[i] === opt;
                  return (
                    <div key={j} onClick={() => !revealed && setAnswers(p => ({ ...p, [i]: opt }))} className={`p-3 rounded-xl text-xs font-medium cursor-pointer border transition-all ${sel ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
                      {opt}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
          {!revealed && <button onClick={submitQuiz} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all">Submit Answers</button>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOBBY & SOCIAL LEADERBOARD (REAL SUPABASE PROFILES FETCH)
═══════════════════════════════════════════════════════════════ */
function SectionStreaks({ streak, setStreak, log, toast, setSection, user }) {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [iName, setIName] = useState("");
  const [iEmail, setIEmail] = useState("");

  const fetchRealLeaderboard = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("edu_profiles")
        .select("id, name, email, streak")
        .order("streak", { ascending: false });

      if (data) {
        setBoard(data);
      }
    } catch (e) {
      console.error("Failed fetching live leaderboard profiles.", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealLeaderboard();
  }, [streak]);

  async function handlePoke(id, name) {
    try {
      toast(`Poke warning routed securely to ${name}!`);
      log("streak", `Sent dynamic poke warning to ${name}`, "#7C3AED");
      await fetchRealLeaderboard();
    } catch (e){}
  }

  async function handleBoost(peerId, name) {
    try {
      toast(`Sent Study Boost! ${name}'s streak increased by 1.`);
      log("streak", `Boosted ${name}'s learning motivation`, "#10B981");

      await supabase.rpc("boost_streak", { peer_id: peerId });

      fetchRealLeaderboard();
    } catch (e){}
  }

  async function sendInvite() {
    if (!iName || !iEmail) return;
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "invite",
          toEmail: iEmail,
          toName: iName,
          fromName: user?.name,
          appLink: window.location.origin,
        }),
      });
      toast(`Invite sent to ${iEmail}!`);
    } catch (e) {
      toast("Couldn't send invite — try again.", "#EF4444");
    }
    setOpen(false);
    setIName("");
    setIEmail("");
  }

  const medalBg = ["bg-amber-100 text-amber-600", "bg-gray-200 text-gray-600", "bg-orange-100 text-orange-600"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icons.Streak className="w-6 h-6 text-orange-500" />
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Study Streaks</h2>
            <p className="text-xs text-gray-400 mt-0.5">Build consistency and stay motivated with daily activity tracking.</p>
          </div>
        </div>
        <button onClick={() => setOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all shrink-0">+ Invite</button>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-6 text-white text-center">
        <Icons.Sprout className="w-9 h-9 mx-auto mb-2" />
        <p className="text-4xl font-black leading-none">{streak}</p>
        <p className="text-sm font-bold mt-1">Day Streak</p>
        <p className="text-xs text-white/80 mt-1">{streak > 0 ? "Great start! Keep it up!" : "Start your streak today!"}</p>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-white/15 rounded-xl p-3">
            <Icons.Trophy className="w-5 h-5 mx-auto mb-1" />
            <p className="text-lg font-black">{streak}</p>
            <p className="text-[10px] text-white/80">Longest Streak</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3">
            <Icons.Calendar className="w-5 h-5 mx-auto mb-1" />
            <p className="text-lg font-black">{streak}</p>
            <p className="text-[10px] text-white/80">Total Active Days</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider inline-flex items-center gap-1.5">
          <Icons.Trophy className="w-3.5 h-3.5 text-amber-400" /> Live Leaderboard
        </h3>

        {loading ? (
          <p className="text-xs text-gray-400 text-center py-6">Connecting to database...</p>
        ) : (
          <div className="space-y-2">
            {board.map((f, i) => {
              const isMe = f.id === user?.id;
              return (
                <div key={f.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${isMe ? "bg-purple-50 border-purple-100" : "bg-white border-gray-100 shadow-sm"}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${medalBg[i] || "bg-gray-100 text-gray-500"}`}>{i + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">
                      {f.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{f.name} {isMe && "(You)"}</p>
                      <p className="text-[10px] text-gray-400">{f.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-orange-500 inline-flex items-center gap-1"><Icons.Streak className="w-3.5 h-3.5" /> {isMe ? streak : f.streak}</span>
                    {!isMe && (
                      <div className="flex gap-2">
                        <button onClick={() => handlePoke(f.id, f.name)} className="bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-900 px-2.5 py-1.5 rounded-lg text-[10px] font-bold">
                          Poke
                        </button>
                        <button onClick={() => handleBoost(f.id, f.name)} className="bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-100 px-2.5 py-1.5 rounded-lg text-[10px] font-bold">
                          Boost
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {board.length === 0 && <p className="text-xs text-gray-400 text-center">No other classmates are currently active.</p>}
          </div>
        )}
      </div>

      {open && (
        <Modal title="Invite Academic Partner" onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <Input label="Name" value={iName} onChange={e => setIName(e.target.value)} placeholder="e.g. Samuel Patterson" />
            <Input label="Email Address" value={iEmail} onChange={e => setIEmail(e.target.value)} placeholder="e.g. sam@uni.edu" />
            <button onClick={sendInvite} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all font-display">Send Workspace Invite</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS PANEL (DUAL-KEY CONFIGURATOR INCLUDED)
═══════════════════════════════════════════════════════════════ */
function SectionNotifs({ 
  deadlines, 
  personalKey, setPersonalKey, 
  usePersonalKey, setUsePersonalKey, 
  toast, setSection 
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader onBack={() => setSection("dashboard")} title="Platform Configuration" />
      
      <div className="max-w-xl space-y-4">
        <Card className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">AI Pipeline Credentials</h4>
            <p className="text-xs text-gray-500">Configure whether generation models use platform limits or personal quotas.</p>
          </div>

          <label className="flex items-center justify-between p-3 bg-gray-100/40 rounded-xl cursor-pointer">
            <div>
              <p className="text-xs font-bold text-gray-900">Activate Personal API Token</p>
              <p className="text-[10px] text-gray-400">Enable to completely bypass global daily execution quotas.</p>
            </div>
            <input type="checkbox" checked={usePersonalKey} onChange={e => setUsePersonalKey(e.target.checked)} className="w-10 h-5 bg-gray-100 rounded-full cursor-pointer accent-purple-600" />
          </label>

          {usePersonalKey && (
            <div className="space-y-3 pt-2">
              <Input label="Personal Gemini Token" value={personalKey} onChange={e => setPersonalKey(e.target.value)} placeholder="Paste AI Studio Key (AIzaSy...)" />
              
              <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-2">Getting your free token</p>
                <ol className="text-[10px] text-gray-500 space-y-1.5 list-decimal pl-4">
                  <li>Visit <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-purple-600 font-bold hover:underline">Google AI Studio</a>.</li>
                  <li>Click **Get API Key** and generate a free API key.</li>
                  <li>Paste the generated key in the input field above. All flashcard requests will now run on your free personal account.</li>
                </ol>
              </div>
            </div>
          )}
        </Card>

        <Card className="bg-white border border-gray-100 p-6 rounded-2xl">
          <h4 className="text-sm font-bold text-gray-900 mb-3">Workspace Status</h4>
          <p className="text-xs text-gray-500">Local Cache Synchronization: Active</p>
          <p className="text-xs text-gray-500 mt-1">Pending Alerts: {deadlines.filter(d => !d.done).length} active</p>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REMAINING COMPACT MODULES (Spaced & Cleaned)
═══════════════════════════════════════════════════════════════ */
function SectionActivity({ activity, setSection }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader onBack={() => setSection("dashboard")} title="Workspace Logs" />
      <Card className="bg-white border border-gray-100 p-5 rounded-2xl space-y-4">
        {activity.map(a => (
          <div key={a.id} className="flex justify-between items-center text-xs py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-gray-600">{a.msg}</span>
            <span className="text-gray-400">{new Date(a.time).toLocaleTimeString()}</span>
          </div>
        ))}
        {activity.length === 0 && <p className="text-xs text-gray-400 text-center">No logs generated this session.</p>}
      </Card>
    </div>
  );
}

function SectionTeaser({ log, toast, streak, setStreak, setSection }) {
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const q = RIDDLES[idx % RIDDLES.length];

  function verify() {
    if (!guess.trim()) return;
    setRevealed(true);
    if (guess.trim().toLowerCase() === q.a.toLowerCase()) {
      setStreak(p => p + 1);
      toast("Correct! Streak updated.", "#10B981");
    } else {
      toast("Incorrect guess.", "#EF4444");
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Icons.Teaser className="w-6 h-6 text-orange-500" />
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Brain Teasers</h2>
          <p className="text-xs text-gray-400 mt-0.5">Challenge your mind and compete with others!</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
          <Icons.Teaser className="w-7 h-7" />
        </div>
        {!revealed ? (
          <>
            <p className="text-base font-bold mb-6">{q.q}</p>
            <div className="flex gap-2">
              <input value={guess} onChange={e => setGuess(e.target.value)} placeholder="Your guess..." className="flex-1 bg-white/15 border border-white/20 placeholder-white/60 rounded-xl px-4 py-2.5 text-xs text-white outline-none" />
              <button onClick={verify} className="bg-white hover:bg-gray-100 text-orange-600 text-xs font-bold px-5 py-2.5 rounded-xl transition-all shrink-0">Verify</button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-white/90">Answer: <span className="font-bold">{q.a}</span></p>
            <button onClick={() => { setIdx(p => p + 1); setGuess(""); setRevealed(false); }} className="bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all">Next Teaser</button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoginPage({ setScreen, onLogin, showToast }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function submit() {
    if (!email || !pass) return;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      
      const { data: profile } = await supabase.from("edu_profiles").select("name").eq("id", data.user.id).single();
      onLogin({ id: data.user.id, name: profile?.name || data.user.email.split("@")[0], email: data.user.email });
      showToast("Session recovered successfully.", "#10B981");
    } catch (e) {
      console.warn("Auth error fallback.", e);
      showToast("Check password or verify internet connection.", "#EF4444");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gray-50">
      <Card className="w-full max-w-sm p-8 rounded-2xl space-y-6">
        <div className="text-center">
          <Logo size={14} />
          <h2 className="text-xl font-bold text-gray-900 mt-4 font-display">Sign In</h2>
        </div>
        <div className="space-y-4">
          <Input label="Email address" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" />
          <Input label="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="your password" />
          <button onClick={submit} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all font-display">Continue to Console</button>
        </div>
        <p className="text-xs text-center text-gray-500">Don't have an account? <span onClick={() => setScreen("signup")} className="text-purple-600 font-bold cursor-pointer hover:underline">Sign up</span></p>
      </Card>
    </div>
  );
}

function SignupPage({ setScreen, onLogin, showToast }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function submit() {
    if (!name || !email || !pass) return;
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password: pass,
        options: { data: { name } }
      });
      if (error) throw error;
      
      const newUserId = data.user.id;
      await supabase.from("edu_profiles").insert([{ id: newUserId, name, email, streak: 7 }]);
      
      onLogin({ id: newUserId, name, email });
      showToast("Workspace initialized.", "#10B981");

      fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "welcome", toEmail: email, toName: name, appLink: window.location.origin }),
      }).catch(() => {});
    } catch (e) {
      console.warn("Auth signup error.", e);
      showToast("Verify credentials or internet connection.", "#EF4444");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gray-50">
      <Card className="w-full max-w-sm p-8 rounded-2xl space-y-6">
        <div className="text-center">
          <Logo size={14} />
          <h2 className="text-xl font-bold text-gray-900 mt-4 font-display">Create Workspace</h2>
        </div>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
          <Input label="Email address" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" />
          <Input label="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="min. 6 characters" />
          <button onClick={submit} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all font-display">Initialize Platform</button>
        </div>
        <p className="text-xs text-center text-gray-500">Already registered? <span onClick={() => setScreen("login")} className="text-purple-600 font-bold cursor-pointer hover:underline">Log in</span></p>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-ATOMS
═══════════════════════════════════════════════════════════════ */
const Logo = ({ size = 16 }) => (
  <div className="flex items-center gap-2.5">
    <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white">
      <Icons.Graduation className="w-5 h-5" />
    </div>
    <span className="font-display font-extrabold tracking-tight text-gray-900 text-base">Apex<span className="text-purple-600">Edu</span>Nexus</span>
  </div>
);

const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white border border-gray-100 p-5 rounded-2xl shadow-sm ${className}`}>
    {children}
  </div>
);

const Input = ({ label, ...rest }) => (
  <div>
    {label && <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>}
    <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-300" {...rest} />
  </div>
);

const Sel = ({ label, children, ...rest }) => (
  <div>
    {label && <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>}
    <select className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm px-4 py-3 rounded-xl outline-none cursor-pointer" {...rest}>{children}</select>
  </div>
);

const Bar = ({ pct, color }) => (
  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
    <div style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} className="h-full rounded-full transition-all duration-300" />
  </div>
);

const PageHeader = ({ title, onBack }) => (
  <div className="flex items-center gap-4">
    <button onClick={onBack} className="p-2 border border-gray-200 bg-white text-gray-500 hover:text-gray-900 rounded-xl transition-all shadow-sm">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white border border-gray-100 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <Icons.X className="w-5 h-5" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Toast = ({ msg }) => (
  <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl">
    <p className="text-xs font-bold">{msg}</p>
  </div>
);
