import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";

/* ═══════════════════════════════════════════════════════════════
   PREMIUM VECTOR SVG ICONS (Replacing Emojis)
═══════════════════════════════════════════════════════════════ */
const Icons = {
  Graduation: () => (
    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Analytics: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
  ),
  Todo: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  AI: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  Teaser: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Streak: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Activity: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
};

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS & MOCK SEEDS
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
   ROOT COMPONENT (LIVE CLOUD INTEGRATION & FALLBACKS)
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Real-time synchronization arrays mapped to custom `edu_` database schemas
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

  // Sync operations from Supabase cloud database
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
      console.warn("Supabase schema not active yet. Using offline local fallback storage.", e);
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

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("apex_active_user");
    setScreen("home");
  };

  // Keep local caches updated for offline stability
  useEffect(() => {
    localStorage.setItem("apex_deadlines", JSON.stringify(deadlines));
    localStorage.setItem("apex_courses", JSON.stringify(courses));
    localStorage.setItem("apex_todos", JSON.stringify(todos));
    localStorage.setItem("apex_streak", streak.toString());
    localStorage.setItem("apex_personal_key", personalKey);
    localStorage.setItem("apex_use_personal_key", usePersonalKey.toString());
  }, [deadlines, courses, todos, streak, personalKey, usePersonalKey]);

  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <EmailJSLoader />
      <GoogleLoader />
      
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
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <nav class="border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size={16} />
          <div class="flex items-center gap-6">
            <button onClick={() => setScreen("login")} class="text-slate-400 hover:text-white font-medium text-sm transition-colors">Sign In</button>
            <button onClick={() => setScreen("signup")} class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-lg shadow-blue-600/20">Get Started</button>
          </div>
        </div>
      </nav>

      <div class="max-w-4xl mx-auto px-6 py-20 text-center relative z-10 my-auto">
        <div class="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-400 mb-8">
          <span>⚡</span> Next-Generation Academic Command Center
        </div>
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight font-display">
          Elevate Your <span class="bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Academic Flow</span>
        </h1>
        <p class="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          The ultimate platform for tracking deadlines, calculating CGPA with active insights, mastering material with AI, and studying together.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => setScreen("signup")} class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full transition-all shadow-xl shadow-blue-600/25">Create Free Account</button>
          <button onClick={() => setScreen("login")} class="w-full sm:w-auto border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white font-bold px-8 py-4 rounded-full transition-all">Sign In to Workspace</button>
        </div>
      </div>

      <footer class="border-t border-slate-900/60 bg-slate-950/20 py-8 px-6 text-center">
        <p class="text-xs text-slate-500">© 2026 ApexEduNexus · Designed for Modern Academic Management</p>
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

  const [friends, setFriends] = useState(INIT_FR);
  const [activity, setActivity] = useState(INIT_ACT);

  const log = (type, msg, color) => {
    setActivity(p => [{ id: uid(), type, msg, time: new Date().toISOString(), color }, ...p.slice(0, 24)]);
  };

  const ctx = {
    deadlines, setDeadlines,
    courses, setCourses,
    todos, setTodos,
    friends, setFriends,
    streak, setStreak,
    personalKey, setPersonalKey,
    usePersonalKey, setUsePersonalKey,
    activity, setActivity, log,
    toast: showToast, setSection,
    user
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Icons.Dashboard /> },
    { id: "deadlines", label: "Deadlines Desk", icon: <Icons.Calendar /> },
    { id: "cgpa", label: "CGPA Analytics", icon: <Icons.Analytics /> },
    { id: "todos", label: "Academic Checklists", icon: <Icons.Todo /> },
    { id: "quiz", label: "AI Flashcards & Quizzes", icon: <Icons.AI /> },
    { id: "teaser", label: "Focus Puzzles", icon: <Icons.Teaser /> },
    { id: "streaks", label: "Peer Collaboration Lobby", icon: <Icons.Streak /> },
    { id: "activity", label: "System Logs", icon: <Icons.Activity /> },
    { id: "notifs", label: "Settings", icon: <Icons.Settings /> }
  ];

  const urgent = deadlines.filter(d => !d.done && daysLeft(d.due) <= 3).length;

  return (
    <div class="min-h-screen flex flex-col md:flex-row">
      <header class="md:hidden border-b border-slate-800 bg-slate-950 px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <Logo size={14} />
        <button onClick={() => setSidebarOpen(!sidebarOpen)} class="p-2 text-slate-400 hover:text-white border border-slate-800 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </header>

      <aside class={`fixed md:sticky top-16 md:top-0 left-0 z-30 w-72 h-[calc(100vh-64px)] md:h-screen border-r border-slate-900 bg-slate-950 p-6 flex flex-col justify-between transform transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div class="flex flex-col gap-6">
          <div class="hidden md:block pb-4 border-b border-slate-900">
            <Logo size={15} />
          </div>

          <div class="flex items-center gap-3 bg-slate-900/40 border border-slate-900 p-3.5 rounded-xl">
            <div class="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm uppercase">
              {user?.name?.slice(0, 2) || "ST"}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-white truncate">{user?.name || "Student"}</p>
              <p class="text-[10px] text-slate-500">🔥 {streak} Day Streak</p>
            </div>
          </div>

          <nav class="flex flex-col gap-1.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                class={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${section === item.id ? "bg-blue-600/10 text-blue-400 border border-blue-500/25" : "text-slate-400 hover:text-slate-200 border border-transparent"}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === "deadlines" && urgent > 0 && <span class="ml-auto bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{indigo}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div class="pt-4 border-t border-slate-900 flex flex-col gap-2">
          <button onClick={onLogout} class="flex items-center justify-center gap-2 w-full border border-slate-900 hover:border-slate-800 hover:bg-slate-900/40 text-slate-400 hover:text-white px-4 py-3 rounded-xl text-xs font-bold transition-all">
            Log Out
          </button>
        </div>
      </aside>

      <main class="flex-1 px-6 py-8 md:p-10 max-w-5xl mx-auto w-full overflow-x-hidden">
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
  const urgentCount = deadlines.filter(d => !d.done && daysLeft(d.due) <= 3).length;

  const cardStats = [
    { label: "Active Deadlines", value: deadlines.filter(d => !d.done).length, sec: "deadlines", bg: "bg-blue-500/5 border-blue-500/10" },
    { label: "Current CGPA", value: gpa, sec: "cgpa", bg: "bg-emerald-500/5 border-emerald-500/10" },
    { label: "Pending Items", value: todos.filter(t => !t.done).length, sec: "todos", bg: "bg-purple-500/5 border-purple-500/10" },
    { label: "Current Day Streak", value: streak, sec: "streaks", bg: "bg-amber-500/5 border-amber-500/10" },
  ];

  const featureCards = [
    {icon:<Icons.Calendar />,bg:"bg-blue-500/10 text-blue-400",title:"Deadline Tracking Console",desc:"Manage, plan, and verify target dates with email warnings",sec:"deadlines"},
    {icon:<Icons.Analytics />,bg:"bg-emerald-500/10 text-emerald-400",title:"CGPA Tracking Hub",desc:"Calculate and record incremental semester marks",sec:"cgpa"},
    {icon:<Icons.Todo />,bg:"bg-purple-500/10 text-purple-400",title:"To-Do Suite",desc:"Arrange learning objectives and high-priority coursework",sec:"todos"},
    {icon:<Icons.AI />,bg:"bg-red-500/10 text-red-400",title:"AI Flashcards & Quizzes",desc:"Convert materials to learning quizzes or interactive cards",sec:"quiz"},
  ];

  return (
    <div class="space-y-6 animate-fade-in">
      <div class="mb-4">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{greetTime()}, {user?.name?.split(" ")[0]}</h1>
        <p class="text-sm text-slate-400">Welcome to your workspace. Here is an overview of your academic records.</p>
      </div>

      {urgentCount > 0 && (
        <div class="flex items-center gap-4 bg-red-950/20 border border-red-500/20 rounded-2xl p-4">
          <Icons.Alert />
          <div class="flex-1">
            <p class="text-sm font-bold text-red-400">{urgentCount} submission targets close within 72 hours!</p>
          </div>
          <button onClick={() => setSection("deadlines")} class="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all">Review Console</button>
        </div>
      )}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cardStats.map(s => (
          <div key={s.label} onClick={() => setSection(s.sec)} class={`p-5 rounded-2xl border cursor-pointer hover:border-slate-800 transition-all ${s.bg}`}>
            <p class="text-xs font-semibold text-slate-400 mb-1">{s.label}</p>
            <p class="text-2xl font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div class="space-y-4">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Workspace Hubs</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featureCards.map(f => (
            <div key={f.title} onClick={() => setSection(f.sec)} class="flex items-center gap-4 bg-slate-950 border border-slate-900 p-5 rounded-2xl cursor-pointer hover:border-slate-800 transition-all">
              <div class={`w-12 h-12 rounded-xl flex items-center justify-center ${f.bg}`}>
                {f.icon}
              </div>
              <div>
                <h4 class="text-sm font-bold text-white">{f.title}</h4>
                <p class="text-xs text-slate-400 mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
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
    <div class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <PageHeader onBack={() => setSection("dashboard")} title="Upcoming Targets & Deadlines" />
        <button onClick={() => setOpen(true)} class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all">+ Add Deadline</button>
      </div>

      <div class="flex gap-2 flex-wrap">
        {[["all", "All Items"], ["pending", "Pending"], ["done", "Completed"], ["week", "7 Days Out"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} class={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${filter === v ? "bg-blue-500/10 text-blue-400 border-blue-500/25" : "text-slate-400 border-slate-900 hover:border-slate-800"}`}>{l}</button>
        ))}
      </div>

      <div class="space-y-3">
        {list.map(d => {
          const dy = daysLeft(d.due);
          const c = dy <= 0 ? "text-red-500" : dy <= 3 ? "text-amber-500" : "text-emerald-500";
          return (
            <div key={d.id} class="flex items-center gap-4 bg-slate-950 border border-slate-900 p-4 rounded-xl">
              <input type="checkbox" checked={d.done} onChange={async () => {
                const toggledDone = !d.done;
                setDeadlines(p => p.map(x => x.id === d.id ? { ...x, done: toggledDone } : x));
                try {
                  await supabase.from("edu_deadlines").update({ done: toggledDone }).eq("id", d.id);
                } catch(e){}
              }} class="w-5 h-5 rounded border-slate-800 bg-slate-900 accent-blue-600 text-blue-600 cursor-pointer" />
              <div class="flex-1 min-w-0">
                <p class={`text-sm font-semibold truncate ${d.done ? "line-through text-slate-500" : "text-white"}`}>{d.title}</p>
                <p class="text-xs text-slate-400 mt-1">{d.course} · {d.type}</p>
              </div>
              <div class="text-right">
                <p class={`text-xs font-extrabold ${c}`}>{d.done ? "Completed ✓" : dy <= 0 ? "Overdue" : `${dy}d left`}</p>
                <p class="text-[10px] text-slate-500 mt-0.5">{fmtDate(d.due)}</p>
              </div>
              <button onClick={() => remove(d.id, d.title)} class="text-slate-500 hover:text-red-400 font-bold px-2 py-1">×</button>
            </div>
          );
        })}
        {list.length === 0 && <p class="text-sm text-slate-500 text-center py-10">No target markers found.</p>}
      </div>

      {open && (
        <Modal title="Schedule Course Deadline" onClose={() => setOpen(false)}>
          <div class="space-y-4">
            <Input label="Task Title" value={form.title} onChange={setVal("title")} placeholder="e.g. Physics Assignment 2" />
            <Input label="Course Name" value={form.course} onChange={setVal("course")} placeholder="e.g. Physics I" />
            <Input label="Due Target" type="date" value={form.due} onChange={setVal("due")} />
            <div class="grid grid-cols-2 gap-3">
              <Sel label="Assessment Category" value={form.type} onChange={setVal("type")}>
                {["Assignment", "Exam", "Project", "Report"].map(t => <option key={t}>{t}</option>)}
              </Sel>
              <Sel label="Priority Rank" value={form.priority} onChange={setVal("priority")}>
                {["Low", "Medium", "High", "Critical"].map(t => <option key={t}>{t}</option>)}
              </Sel>
            </div>
            <button onClick={add} class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all mt-2">Log Deadline</button>
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

  function analyzeAcademicStanding() {
    if (courses.length === 0) return "Add courses to see diagnostic feedback.";
    const weakSubjects = courses.filter(c => GP[c.grade] < 3.0);
    if (weakSubjects.length === 0) {
      return "Excellent! All subjects demonstrate stable standing. Run study checks to maintain grades.";
    }
    const list = weakSubjects.map(s => `${s.name} (${s.grade})`).join(", ");
    return `Diagnostic alert: Current averages are impacted by below-average marks in: [${list}]. We advise generating automated flashcards for these concepts to study.`;
  }

  return (
    <div class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <PageHeader onBack={() => setSection("dashboard")} title="CGPA Analysis Desk" />
        <button onClick={() => setOpen(true)} class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all">+ Add Course</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl text-center flex flex-col justify-center">
          <p class="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Total Average GPA</p>
          <p class="text-5xl font-black text-white leading-none mb-3">{currentGPA}</p>
          <p class="text-xs text-blue-100">{numericGPA >= 3.5 ? "First-Class Honors Track" : "Good Standing Track"}</p>
        </div>

        <div class="md:col-span-2 bg-slate-950 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h4 class="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Diagnostics Engine</h4>
            <p class="text-xs text-slate-400 leading-relaxed">{analyzeAcademicStanding()}</p>
          </div>
          {numericGPA < 3.0 && courses.length > 0 && (
            <button onClick={() => setSection("quiz")} class="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold py-2 px-4 rounded-lg text-white transition-all w-fit mt-4">
              Open AI Flashcard Desk
            </button>
          )}
        </div>
      </div>

      <div class="space-y-3">
        {courses.map(c => (
          <div key={c.id} class="bg-slate-950 border border-slate-900 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-white">{c.name}</p>
              <p class="text-xs text-slate-500 mt-1">{c.code} · {c.credits} Credits</p>
            </div>
            <div class="text-right flex items-center gap-4">
              <div>
                <p class="text-base font-black text-white">{c.grade}</p>
                <p class="text-[10px] text-slate-500 mt-0.5">GP: {GP[c.grade]?.toFixed(1)}</p>
              </div>
              <button onClick={() => deleteCourse(c.id)} class="text-slate-500 hover:text-red-400 font-bold px-2">×</button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <Modal title="Log Evaluated Course" onClose={() => setOpen(false)}>
          <div class="space-y-4">
            <Input label="Course Name" value={form.name} onChange={setVal("name")} placeholder="e.g. Advanced Calculus" />
            <Input label="Code Label" value={form.code} onChange={setVal("code")} placeholder="e.g. MTH-202" />
            <div class="grid grid-cols-3 gap-3">
              <Input label="Credits" type="number" value={form.credits} onChange={setVal("credits")} />
              <Sel label="Letter Grade" value={form.grade} onChange={setVal("grade")}>
                {Object.keys(GP).map(g => <option key={g}>{g}</option>)}
              </Sel>
              <Input label="Score %" type="number" value={form.score} onChange={setVal("score")} />
            </div>
            <button onClick={add} class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all mt-2">Log Metrics</button>
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
    <div class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <PageHeader onBack={() => setSection("dashboard")} title="Checklist Monitor" />
        <p class="text-xs text-slate-400 font-bold">{progressPercent}% complete</p>
      </div>

      <Card class="bg-slate-950/40 border border-slate-900 p-5 rounded-2xl">
        <div class="mb-4">
          <div class="flex justify-between text-xs font-bold mb-1.5">
            <span class="text-slate-400">Task Completion Rate</span>
            <span class="text-blue-400">{progressPercent}%</span>
          </div>
          <Bar pct={progressPercent} color="#3B82F6" />
        </div>
        
        <div class="flex gap-2 flex-wrap">
          <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="e.g. Prepare lab writeup..." class="flex-1 min-w-[180px] bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-slate-700" />
          <select value={pri} onChange={e => setPri(e.target.value)} class="bg-slate-900 border border-slate-800 text-slate-300 text-sm px-4 py-3 rounded-xl outline-none cursor-pointer">
            {["Low", "Medium", "High"].map(p => <option key={p}>{p}</option>)}
          </select>
          <button onClick={add} class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all">Add</button>
        </div>
      </Card>

      <div class="space-y-3">
        {todos.map(t => (
          <div key={t.id} class="flex items-center gap-4 bg-slate-950 border border-slate-900 p-4 rounded-xl">
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id, t.done)} class="w-5 h-5 rounded border-slate-800 bg-slate-900 accent-blue-600 text-blue-600 cursor-pointer" />
            <div class="flex-1">
              <p class={`text-sm font-semibold ${t.done ? "line-through text-slate-500" : "text-white"}`}>{t.text}</p>
            </div>
            <button onClick={() => remove(t.id)} class="text-slate-500 hover:text-red-400 font-bold px-2">×</button>
          </div>
        ))}
        {todos.length === 0 && <p class="text-sm text-slate-500 text-center py-10">No checklist items pending.</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOBBY & SOCIAL LEADERBOARD (WITH PEER INTERACTIONS)
═══════════════════════════════════════════════════════════════ */
function SectionStreaks({ friends, setFriends, streak, log, toast, setSection, users = [], user }) {
  const [open, setOpen] = useState(false);
  const [iName, setIName] = useState("");
  const [iEmail, setIEmail] = useState("");

  function handlePoke(id, name) {
    setFriends(p => p.map(f => {
      if (f.id === id) {
        toast(`Factual poke warning routed to ${name}!`);
        return { ...f, status: "Poked! Retrying workspace tasks" };
      }
      return f;
    }));
  }

  function handleBoost(id, name) {
    setFriends(p => p.map(f => {
      if (f.id === id) {
        toast(`Dynamic Study Boost sent to ${name}!`);
        return { ...f, boosted: true, streak: f.streak + 1, status: "Boosted Academic Tracking" };
      }
      return f;
    }));
  }

  const board = [
    { id: "me", name: "You", streak, initials: "YO", isMe: true, status: "Focus Hub Active", boosted: false },
    ...friends
  ].sort((a, b) => b.streak - a.streak);

  return (
    <div class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <PageHeader onBack={() => setSection("dashboard")} title="Academic Peer Network" />
        <button onClick={() => setOpen(true)} class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all">+ Invite Peer</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {board.map((f, i) => (
          <div key={f.id} class={`p-5 rounded-2xl border flex items-center justify-between ${f.isMe ? "bg-blue-500/5 border-blue-500/10" : "bg-slate-950 border-slate-900"}`}>
            <div class="flex items-center gap-3">
              <div class={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${f.isMe ? "bg-blue-600/20 text-blue-400" : "bg-slate-900 text-slate-400"}`}>{f.initials}</div>
              <div>
                <p class="text-sm font-bold text-white">{f.name} {f.isMe && "(You)"}</p>
                <p class="text-xs text-slate-500 mt-0.5">{f.status}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-extrabold text-amber-500">🔥 {f.streak}</span>
              {!f.isMe && (
                <div class="flex gap-1.5">
                  <button onClick={() => handlePoke(f.id, f.name)} class="bg-slate-900 hover:bg-slate-800 text-[10px] font-bold px-2.5 py-1.5 rounded-lg text-slate-300">Poke</button>
                  <button disabled={f.boosted} onClick={() => handleBoost(f.id, f.name)} class={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${f.boosted ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-600/10 text-blue-400"}`}>Boost</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {open && (
        <Modal title="Invite Academic Partner" onClose={() => setOpen(false)}>
          <div class="space-y-4">
            <Input label="Name" value={iName} onChange={e => setIName(e.target.value)} placeholder="e.g. John Doe" />
            <Input label="Email Address" value={iEmail} onChange={e => setIEmail(e.target.value)} placeholder="e.g. john@uni.edu" />
            <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all">Send Workspace Invite</button>
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
  toast 
}) {
  return (
    <div class="space-y-6 animate-fade-in">
      <PageHeader onBack={() => setSection("dashboard")} title="Platform Configuration" />
      
      <div class="max-w-xl space-y-4">
        <Card class="bg-slate-950 border border-slate-900 p-6 rounded-2xl space-y-4">
          <div>
            <h4 class="text-sm font-bold text-white mb-1">AI Pipeline Credentials</h4>
            <p class="text-xs text-slate-400">Configure whether generation models use platform limits or personal quotas.</p>
          </div>

          <label class="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl cursor-pointer">
            <div>
              <p class="text-xs font-bold text-white">Activate Personal API Token</p>
              <p class="text-[10px] text-slate-500">Enable to completely bypass global daily execution quotas.</p>
            </div>
            <input type="checkbox" checked={usePersonalKey} onChange={e => setUsePersonalKey(e.target.checked)} class="w-10 h-5 bg-slate-900 rounded-full cursor-pointer accent-blue-600" />
          </label>

          {usePersonalKey && (
            <div class="space-y-3 pt-2">
              <Input label="Personal Gemini Token" value={personalKey} onChange={e => setPersonalKey(e.target.value)} placeholder="Paste AI Studio Key (AIzaSy...)" />
              
              <div class="bg-blue-950/20 border border-blue-900/30 p-4 rounded-xl">
                <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Getting your free token</p>
                <ol class="text-[10px] text-slate-400 space-y-1.5 list-decimal pl-4">
                  <li>Visit <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" class="text-blue-400 font-bold hover:underline">Google AI Studio</a>.</li>
                  <li>Click **Get API Key** and generate a free API key.</li>
                  <li>Paste the generated key in the input field above. All flashcard requests will now run on your free personal account.</li>
                </ol>
              </div>
            </div>
          )}
        </Card>

        <Card class="bg-slate-950 border border-slate-900 p-6 rounded-2xl">
          <h4 class="text-sm font-bold text-white mb-3">Workspace Status</h4>
          <p class="text-xs text-slate-400">Local Cache Synchronization: Active</p>
          <p class="text-xs text-slate-400 mt-1">Pending Alerts: {deadlines.filter(d => !d.done).length} active</p>
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
    <div class="space-y-6 animate-fade-in">
      <PageHeader onBack={() => setSection("dashboard")} title="Workspace Logs" />
      <Card class="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-4">
        {activity.map(a => (
          <div key={a.id} class="flex justify-between items-center text-xs py-1.5 border-b border-slate-900 last:border-0">
            <span class="text-slate-300">{a.msg}</span>
            <span class="text-slate-500">{new Date(a.time).toLocaleTimeString()}</span>
          </div>
        ))}
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
    <div class="space-y-6 animate-fade-in">
      <PageHeader onBack={() => setSection("dashboard")} title="Focus Riddle" />
      <Card class="bg-slate-950 border border-slate-900 p-6 rounded-2xl max-w-md mx-auto text-center space-y-4">
        <p class="text-sm font-semibold text-slate-300">{q.q}</p>
        {!revealed ? (
          <div class="flex gap-2">
            <input value={guess} onChange={e => setGuess(e.target.value)} placeholder="Your guess..." class="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none" />
            <button onClick={verify} class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all">Verify</button>
          </div>
        ) : (
          <div class="space-y-3">
            <p class="text-xs text-slate-400">Answer: <span class="text-blue-400 font-bold">{q.a}</span></p>
            <button onClick={() => { setIdx(p => p + 1); setGuess(""); setRevealed(false); }} class="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-lg transition-all mx-auto">Next</button>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIGN IN / SIGN UP COMPONENTS
═══════════════════════════════════════════════════════════════ */
function LoginPage({ setScreen, onLogin, showToast }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function submit() {
    if (!email || !pass) return;
    
    // Auth mapped to your Supabase project credentials
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      
      onLogin({ id: data.user.id, name: data.user.email.split("@")[0], email: data.user.email });
      showToast("Session recovered successfully.");
    } catch (e) {
      console.warn("Dev mode fallback logged directly.", e);
      onLogin({ id: uid(), name: email.split("@")[0], email });
      showToast("Session recovered offline.");
    }
  }

  return (
    <div class="min-h-screen flex flex-col justify-center items-center p-6 bg-radial-glow">
      <Card class="w-full max-w-sm bg-slate-950 border border-slate-900 p-8 rounded-2xl space-y-6">
        <div class="text-center">
          <Logo size={14} />
          <h2 class="text-xl font-bold text-white mt-4 font-display">Sign In</h2>
        </div>
        <div class="space-y-4">
          <Input label="Email address" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" />
          <Input label="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="your password" />
          <button onClick={submit} class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all">Continue to Console</button>
        </div>
        <p class="text-xs text-center text-slate-400">Don't have an account? <span onClick={() => setScreen("signup")} class="text-blue-400 font-bold cursor-pointer hover:underline">Sign up</span></p>
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
      const { data, error } = await supabase.auth.signUp({ email, password: pass });
      if (error) throw error;
      
      const newUserId = data.user.id;
      
      // Setup Profile in database table
      await supabase.from("edu_profiles").insert([{ id: newUserId, name, email, streak: 7 }]);
      
      onLogin({ id: newUserId, name, email });
      showToast("Workspace initialized.");
    } catch (e) {
      console.warn("Dev mode fallback registered locally.", e);
      onLogin({ id: uid(), name, email });
      showToast("Workspace initialized offline.");
    }
  }

  return (
    <div class="min-h-screen flex flex-col justify-center items-center p-6 bg-radial-glow">
      <Card class="w-full max-w-sm bg-slate-950 border border-slate-900 p-8 rounded-2xl space-y-6">
        <div class="text-center">
          <Logo size={14} />
          <h2 class="text-xl font-bold text-white mt-4 font-display">Create Workspace</h2>
        </div>
        <div class="space-y-4">
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
          <Input label="Email address" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" />
          <Input label="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="min. 6 characters" />
          <button onClick={submit} class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all">Initialize Platform</button>
        </div>
        <p class="text-xs text-center text-slate-400">Already registered? <span onClick={() => setScreen("login")} class="text-blue-400 font-bold cursor-pointer hover:underline">Log in</span></p>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-ATOMS
═══════════════════════════════════════════════════════════════ */
const Logo = ({ size = 16 }) => (
  <div class="flex items-center gap-2.5">
    <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">🎓</div>
    <span class="font-display font-extrabold tracking-tight text-white text-base">Apex<span class="text-blue-500">Edu</span>Nexus</span>
  </div>
);

const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} class={`bg-slate-950/40 border border-slate-900/60 p-5 rounded-2xl shadow-xl ${className}`}>
    {children}
  </div>
);

const Input = ({ label, ...rest }) => (
  <div>
    {label && <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>}
    <input class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-slate-700" {...rest} />
  </div>
);

const Sel = ({ label, children, ...rest }) => (
  <div>
    {label && <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>}
    <select class="w-full bg-slate-900 border border-slate-800 text-slate-300 text-sm px-4 py-3 rounded-xl outline-none cursor-pointer" {...rest}>{children}</select>
  </div>
);

const Bar = ({ pct, color }) => (
  <div class="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
    <div style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} class="h-full rounded-full transition-all duration-300" />
  </div>
);

const PageHeader = ({ title, onBack }) => (
  <div class="flex items-center gap-4">
    <button onClick={onBack} class="p-2 border border-slate-900 bg-slate-950/40 text-slate-400 hover:text-white rounded-xl transition-all">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <h2 class="text-xl font-extrabold text-white tracking-tight">{title}</h2>
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-slate-950 border border-slate-900 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-sm font-bold text-white">{title}</h3>
        <button onClick={onClose} class="text-slate-500 hover:text-slate-300 text-lg font-bold">×</button>
      </div>
      {children}
    </div>
  </div>
);

const Toast = ({ msg }) => (
  <div class="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 px-5 py-3 rounded-xl shadow-xl">
    <p class="text-xs font-bold text-white">{msg}</p>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   INITIAL DATA STRUCTS
═══════════════════════════════════════════════════════════════ */
const INIT_FR = [
  { id: uid(), name: "Alex Johnson", email: "alex@uni.edu", streak: 14, initials: "AJ", status: "Studying Calculus", boosted: false },
  { id: uid(), name: "Maria Chen", email: "mchen@uni.edu", streak: 12, initials: "MC", status: "Taking an AI Quiz", boosted: false }
];

const INIT_ACT = [
  { id: uid(), type: "deadline", msg: "Added 'Midterm Exam' deadline", time: new Date().toISOString(), color: "#EF4444" }
];