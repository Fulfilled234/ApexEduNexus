import { useState, useRef, useEffect } from "react";

// ── All emails now routed through secure /api/email proxy ──────
async function sendInviteEmail({toEmail, toName, fromName}) {
  try {
    await fetch("/api/email", {method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({type:"invite", toEmail, toName, fromName, appLink: window.location.href})});
    return true;
  } catch(e) { console.error(e); return false; }
}

async function sendDeadlineAlert({toEmail, toName, deadlineTitle, daysLeft, dueDate}) {
  try {
    await fetch("/api/email", {method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({type:"deadline", toEmail, toName, deadlineTitle, daysLeft, dueDate})});
    return true;
  } catch(e) { console.error(e); return false; }
}

async function sendWelcomeEmail({toEmail, toName}) {
  try {
    await fetch("/api/email", {method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({type:"welcome", toEmail, toName, appLink: window.location.href})});
    return true;
  } catch(e) { console.error(e); return false; }
}

async function sendResetEmail({toEmail, toName, code}) {
  try {
    await fetch("/api/email", {method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({type:"reset", toEmail, toName, code})});
    return true;
  } catch(e) { console.error(e); return false; }
}


/* ═══════════════════════════════════════════════════════════════
   CONSTANTS & UTILS
═══════════════════════════════════════════════════════════════ */
const GP = {"A+":4,"A":4,"A-":3.7,"B+":3.3,"B":3,"B-":2.7,"C+":2.3,"C":2,"C-":1.7,"D":1,"F":0};
const uid = () => Math.random().toString(36).slice(2,9);
const daysLeft = d => Math.ceil((new Date(d)-new Date())/86400000);
const fmtDate = d => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const calcGPA = cs => { const tc=cs.reduce((a,c)=>a+c.credits,0),tp=cs.reduce((a,c)=>a+(GP[c.grade]||0)*c.credits,0); return tc?(tp/tc).toFixed(2):"--"; };
const gradeCol = g => g.startsWith("A")?"#16A34A":g.startsWith("B")?"#2563EB":g.startsWith("C")?"#D97706":"#DC2626";
const greetTime = () => { const h=new Date().getHours(); return h<12?"Good morning":h<17?"Good afternoon":"Good evening"; };

const RIDDLES = [
  {q:"I speak without a mouth, hear without ears. I come alive with wind. What am I?",a:"Echo"},
  {q:"The more you take, the more you leave behind. What am I?",a:"Footsteps"},
  {q:"What has hands but cannot clap?",a:"A clock"},
  {q:"What can travel around the world while staying in a corner?",a:"A stamp"},
  {q:"I have cities but no houses, mountains but no trees. What am I?",a:"A map"},
  {q:"What gets wetter as it dries?",a:"A towel"},
  {q:"What has one eye but cannot see?",a:"A needle"},
  {q:"Forward I am heavy, backward I am not. What am I?",a:"Ton"},
  {q:"What runs but never walks, has a mouth but never talks?",a:"A river"},
  {q:"The more you have of it, the less you see. What is it?",a:"Darkness"},
];

const INIT_DL = [
  {id:uid(),title:"Math Assignment #3",course:"Calculus II",due:"2026-03-10",type:"Assignment",priority:"High",notify:true,done:false},
  {id:uid(),title:"Research Paper Draft",course:"Technical Writing",due:"2026-03-14",type:"Project",priority:"High",notify:true,done:false},
  {id:uid(),title:"Midterm Exam",course:"Data Structures",due:"2026-03-18",type:"Exam",priority:"Critical",notify:true,done:false},
];
const INIT_CS = [
  {id:uid(),name:"Calculus II",code:"MTH 202",credits:3,grade:"A",score:88},
  {id:uid(),name:"Data Structures",code:"CS 301",credits:4,grade:"A-",score:91},
  {id:uid(),name:"Technical Writing",code:"ENG 210",credits:2,grade:"B+",score:85},
  {id:uid(),name:"Physics I",code:"PHY 101",credits:4,grade:"B",score:80},
];
const INIT_TD = [
  {id:uid(),text:"Review lecture notes for CS 301",done:false,priority:"High",at:new Date().toISOString()},
  {id:uid(),text:"Read chapters 4–6 in textbook",done:false,priority:"Medium",at:new Date().toISOString()},
  {id:uid(),text:"Schedule study group meeting",done:true,priority:"Low",at:new Date().toISOString()},
];
const INIT_FR = [
  {id:uid(),name:"Alex Johnson",email:"alex@uni.edu",streak:12,initials:"AJ"},
  {id:uid(),name:"Maria Chen",email:"mchen@uni.edu",streak:8,initials:"MC"},
];
const INIT_ACT = [
  {id:uid(),type:"deadline",msg:"Added 'Midterm Exam' deadline",time:new Date(Date.now()-3.6e6).toISOString(),color:"#DC2626"},
  {id:uid(),type:"quiz",msg:"Generated AI quiz from PDF",time:new Date(Date.now()-7.2e6).toISOString(),color:"#2563EB"},
  {id:uid(),type:"streak",msg:"12-day streak with Alex Johnson",time:new Date(Date.now()-8.64e7).toISOString(),color:"#D97706"},
  {id:uid(),type:"brainteaser",msg:"Solved 3 brain teasers correctly",time:new Date(Date.now()-1.728e8).toISOString(),color:"#16A34A"},
];

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */
const G = {
  bg: "#F2F1F6",
  card: "#FFFFFF",
  blue: "#2563EB",
  blueSoft: "#EFF6FF",
  gold: "#D97706",
  green: "#16A34A",
  greenSoft: "#F0FDF4",
  red: "#DC2626",
  redSoft: "#FEF2F2",
  orange: "#EA580C",
  orangeSoft: "#FFF7ED",
  purple: "#7C3AED",
  purpleSoft: "#F5F3FF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  shadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)",
};

/* ═══════════════════════════════════════════════════════════════
   SHARED ATOMS
═══════════════════════════════════════════════════════════════ */
const Card = ({children, style={}, onClick, ...rest}) => (
  <div
    onClick={onClick}
    style={{background:G.card,borderRadius:16,padding:20,boxShadow:G.shadow,border:`1px solid ${G.border}`,...style,cursor:onClick?"pointer":style.cursor}}
    {...rest}
  >
    {children}
  </div>
);

const IconBox = ({icon, bg, size=48}) => (
  <div style={{width:size,height:size,borderRadius:12,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.45,flexShrink:0}}>
    {icon}
  </div>
);

const BlueBtn = ({children, onClick, full, outline, small, style={}}) => (
  <button onClick={onClick} style={{
    display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,
    background: outline?"transparent":G.blue,
    color: outline?G.blue:"#fff",
    border: outline?`1.5px solid ${G.blue}`:"none",
    borderRadius: small?10:99,
    padding: small?"8px 16px":"13px 28px",
    fontSize: small?13:15,
    fontWeight:600, cursor:"pointer",
    width: full?"100%":"auto",
    boxShadow: outline?"none":`0 4px 14px rgba(37,99,235,0.3)`,
    transition:"all 0.15s",
    ...style
  }}>{children}</button>
);

const GrayBtn = ({children, onClick, style={}}) => (
  <button onClick={onClick} style={{background:"transparent",color:G.muted,border:`1px solid ${G.border}`,borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:500,cursor:"pointer",...style}}>
    {children}
  </button>
);

const Input = ({label, ...rest}) => (
  <div>
    {label && <label style={{display:"block",fontSize:12,fontWeight:500,color:G.muted,marginBottom:6}}>{label}</label>}
    <input style={{width:"100%",background:G.bg,border:`1.5px solid ${G.border}`,borderRadius:10,padding:"11px 14px",fontSize:14,color:G.text,outline:"none"}} {...rest}/>
  </div>
);

const Sel = ({label, children, ...rest}) => (
  <div>
    {label && <label style={{display:"block",fontSize:12,fontWeight:500,color:G.muted,marginBottom:6}}>{label}</label>}
    <select style={{width:"100%",background:G.bg,border:`1.5px solid ${G.border}`,borderRadius:10,padding:"11px 14px",fontSize:14,color:G.text,outline:"none",cursor:"pointer"}} {...rest}>{children}</select>
  </div>
);

const Badge = ({color, bg, children}) => (
  <span style={{display:"inline-block",padding:"3px 10px",borderRadius:99,fontSize:11,fontWeight:600,background:bg||`${color}18`,color:color||G.blue,border:`1px solid ${color||G.blue}28`}}>{children}</span>
);

const Bar = ({pct, color}) => (
  <div style={{height:6,borderRadius:99,background:G.bg,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:color,borderRadius:99,transition:"width 0.5s ease"}}/>
  </div>
);

/* Overlay modal - never shifts content */
const Modal = ({title, onClose, children, maxW=440}) => (
  <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{background:G.card,borderRadius:20,padding:"clamp(20px,5vw,28px)",width:"100%",maxWidth:maxW,maxHeight:"90dvh",overflowY:"auto",boxShadow:G.shadowMd,border:`1px solid ${G.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <span style={{fontSize:17,fontWeight:700,color:G.text}}>{title}</span>
        <button onClick={onClose} style={{background:"none",border:"none",color:G.muted,cursor:"pointer",fontSize:22,lineHeight:1,padding:4}}>×</button>
      </div>
      {children}
    </div>
  </div>
);

/* Page section header */
const PageHeader = ({onBack, title}) => (
  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
    <button onClick={onBack} style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:10,padding:"8px 12px",cursor:"pointer",fontSize:13,color:G.muted,display:"flex",alignItems:"center",gap:6,fontWeight:500,boxShadow:G.shadow}}>
      ← Back
    </button>
    <h2 style={{fontSize:"clamp(18px,4vw,22px)",fontWeight:800,color:G.text}}>{title}</h2>
  </div>
);

/* Toast */
const Toast = ({msg, color}) => (
  <div style={{position:"fixed",bottom:24,right:24,background:color||G.blue,color:"#fff",padding:"12px 20px",borderRadius:12,fontWeight:600,fontSize:13,zIndex:1000,boxShadow:G.shadowMd,maxWidth:"calc(100vw - 48px)"}}>
    {msg}
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   LOGO
═══════════════════════════════════════════════════════════════ */
const Logo = ({size=16}) => (
  <div style={{display:"flex",alignItems:"center",gap:10}}>
    <div style={{width:size*2.4,height:size*2.4,borderRadius:size*0.55,background:G.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*1.05,flexShrink:0}}>🎓</div>
    <span style={{fontSize:size,fontWeight:800,letterSpacing:"-0.02em",color:G.text}}>
      Apex<span style={{color:G.blue}}>Edu</span>Nexus
    </span>
  </div>
);

/* Loads EmailJS SDK from CDN */
function EmailJSLoader() {
  useEffect(() => {
    if (window.emailjs) return;
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => window.emailjs && window.emailjs.init(EJS.PUBLIC_KEY);
    document.head.appendChild(s);
  }, []);
  return null;
}

/* ── Google Identity Services loader ── */
function GoogleLoader() {
  useEffect(() => {
    if (document.getElementById("gsi-script")) return;
    const s = document.createElement("script");
    s.id = "gsi-script";
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  }, []);
  return null;
}

/*
  GOOGLE_CLIENT_ID — replace with your own from console.cloud.google.com
  Steps:
  1. Go to console.cloud.google.com
  2. Create project → APIs & Services → Credentials
  3. Create OAuth 2.0 Client ID (Web application)
  4. Add your Vercel URL to "Authorised JavaScript origins"
  5. Copy the Client ID and paste it below
*/
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function GoogleBtn({ onSuccess, label = "Continue with Google" }) {
  const ref = useRef();
  useEffect(() => {
    const init = () => {
      if (!window.google) { setTimeout(init, 300); return; }
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res) => {
          try {
            // Decode JWT payload to get user info
            const payload = JSON.parse(atob(res.credential.split(".")[1]));
            onSuccess({ name: payload.name, email: payload.email, picture: payload.picture, fromGoogle: true });
          } catch(e) { console.error("Google decode error", e); }
        },
      });
      window.google.accounts.id.renderButton(ref.current, {
        type: "standard", theme: "outline", size: "large",
        text: label === "Continue with Google" ? "continue_with" : "signup_with",
        shape: "rectangular", width: ref.current?.offsetWidth || 320,
      });
    };
    init();
  }, []);
  return <div ref={ref} style={{width:"100%",marginBottom:4}}/>;
}

/* ═══════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [users, setUsers] = useState([]); // in-memory user registry: [{name,email,password}]

  const showToast = (msg, color) => { setToast({msg,color}); setTimeout(()=>setToast(null),3200); };
  const registerUser = (u) => setUsers(p => [...p, u]);
  const updateUserPassword = (email, newPass) => setUsers(p => p.map(u => u.email===email ? {...u, password:newPass} : u));

  // ── Browser back/forward support ──
  const navigateTo = (s) => {
    if (s === "app") {
      // Replace so swiping back goes to home, not login/signup
      window.history.replaceState({screen: "app"}, "", "#app");
    } else {
      window.history.pushState({screen: s}, "", "#" + s);
    }
    setScreen(s);
  };
  useEffect(() => {
    window.history.replaceState({screen: "home"}, "", "#home");
    const handlePop = (e) => {
      const s = e.state?.screen || "home";
      if (s === "app" && !user) { setScreen("home"); return; }
      setScreen(s);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [user]);

  return (
    <div style={{minHeight:"100dvh",background:G.bg,fontFamily:"'Inter',system-ui,-apple-system,sans-serif",color:G.text}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:${G.border};border-radius:99px;} input[type=date]::-webkit-calendar-picker-indicator{opacity:0.5;}`}</style>
      <EmailJSLoader/>
      <GoogleLoader/>
      {screen==="home"   && <HomePage   setScreen={navigateTo}/>}
      {screen==="login"  && <LoginPage  setScreen={navigateTo} users={users} registerUser={registerUser} updateUserPassword={updateUserPassword} setUser={u=>{setUser(u);navigateTo("app");}} showToast={showToast}/>}
      {screen==="signup" && <SignupPage setScreen={navigateTo} users={users} registerUser={registerUser} setUser={u=>{setUser(u);navigateTo("app");}} showToast={showToast}/>}
      {screen==="app"    && <AppPage    user={user} users={users} setScreen={navigateTo} showToast={showToast}/>}
      {toast && <Toast msg={toast.msg} color={toast.color}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE  (landing)
═══════════════════════════════════════════════════════════════ */
function HomePage({setScreen}) {
  const features = [
    {icon:"📅",bg:G.blueSoft,title:"Deadline Tracker",desc:"Never miss a submission. Track courses, events, and assignments with smart email reminders."},
    {icon:"🧮",bg:G.greenSoft,title:"CGPA Calculator",desc:"Calculate and track your cumulative GPA across semesters with detailed breakdowns."},
    {icon:"🧠",bg:G.orangeSoft,title:"Brain Teasers",desc:"Challenge your mind with puzzles and riddles to build focus and earn daily streaks."},
    {icon:"📄",bg:G.redSoft,title:"AI Quizzes",desc:"Generate quizzes from your PDFs instantly using Claude AI — the smartest way to study."},
    {icon:"✅",bg:G.purpleSoft,title:"To-Do List",desc:"Organize your academic tasks by priority and stay on top of your daily workload."},
    {icon:"🔥",bg:"#FFF7ED",title:"Streak System",desc:"Build consistent study habits and compete with friends on a live streak leaderboard."},
  ];
  return (
    <div>
      {/* NAV */}
      <nav style={{background:G.card,borderBottom:`1px solid ${G.border}`,position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 clamp(16px,5vw,40px)",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Logo size={16}/>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <button onClick={()=>setScreen("login")} style={{background:"none",border:"none",fontSize:14,fontWeight:600,color:G.text,cursor:"pointer",padding:"8px 12px"}}>Sign In</button>
            <BlueBtn onClick={()=>setScreen("signup")} small>Get Started</BlueBtn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"clamp(56px,10vw,100px) clamp(16px,5vw,40px) clamp(40px,6vw,72px)",textAlign:"center"}}>
        {/* subtle blob */}
        <div style={{position:"fixed",top:"15%",left:"50%",transform:"translateX(-50%)",width:"min(60vw,500px)",height:"min(60vw,500px)",borderRadius:"50%",background:"rgba(37,99,235,0.04)",filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(37,99,235,0.08)",borderRadius:99,padding:"7px 16px",fontSize:13,fontWeight:600,color:G.blue,marginBottom:28}}>
            <span>⚡</span> Your Academic Command Center
          </div>
          <h1 style={{fontSize:"clamp(34px,7vw,64px)",fontWeight:900,lineHeight:1.1,marginBottom:20,letterSpacing:"-0.02em"}}>
            <span style={{display:"block"}}>Master Your</span>
            <span style={{display:"block"}}>
              <span style={{color:G.blue}}>Academic </span><span style={{background:"linear-gradient(90deg, #2563EB 0%, #3B82F6 35%, #F59E0B 70%, #D97706 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",display:"inline-block"}}>Journey</span>
            </span>
          </h1>
          <p style={{fontSize:"clamp(15px,2.5vw,18px)",color:G.muted,maxWidth:520,margin:"0 auto 40px",lineHeight:1.7}}>
            Track deadlines, calculate your GPA, challenge your mind with brain teasers, and ace exams with AI-powered quizzes — all in one powerful platform.
          </p>
          <BlueBtn onClick={()=>setScreen("signup")} style={{fontSize:16,padding:"14px 36px"}}>
            Start Free Today →
          </BlueBtn>
          <p style={{marginTop:16,fontSize:13,color:G.muted}}>
            Already have an account?{" "}
            <span onClick={()=>setScreen("login")} style={{color:G.blue,fontWeight:600,cursor:"pointer"}}>Sign in</span>
          </p>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 clamp(16px,5vw,40px) clamp(56px,8vw,96px)"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <p style={{fontSize:12,fontWeight:700,color:G.blue,textTransform:"uppercase",letterSpacing:2,marginBottom:10}}>Everything you need</p>
          <h2 style={{fontSize:"clamp(22px,4vw,32px)",fontWeight:800,color:G.text}}>Powerful academic tools</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
          {features.map(f=>(
            <Card key={f.title} style={{display:"flex",flexDirection:"column",gap:14,padding:24}}>
              <IconBox icon={f.icon} bg={f.bg} size={52}/>
              <div>
                <p style={{fontSize:16,fontWeight:700,color:G.text,marginBottom:8}}>{f.title}</p>
                <p style={{fontSize:14,color:G.muted,lineHeight:1.65}}>{f.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA BAND */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 clamp(16px,5vw,40px) clamp(56px,8vw,96px)"}}>
        <div style={{background:`linear-gradient(135deg,#1D4ED8,#2563EB)`,borderRadius:24,padding:"clamp(36px,6vw,56px)",textAlign:"center"}}>
          <h2 style={{fontSize:"clamp(22px,4vw,32px)",fontWeight:800,color:"#fff",marginBottom:12}}>Ready to ace your semester?</h2>
          <p style={{fontSize:"clamp(14px,2vw,16px)",color:"rgba(255,255,255,0.75)",marginBottom:28}}>Join students who manage their academics smarter with ApexEduNexus.</p>
          <BlueBtn onClick={()=>setScreen("signup")} style={{background:"#fff",color:G.blue,boxShadow:"none",fontSize:15,padding:"13px 32px"}}>
            Create Free Account →
          </BlueBtn>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{borderTop:`1px solid ${G.border}`,padding:"20px clamp(16px,5vw,40px)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,background:G.card}}>
        <Logo size={14}/>
        <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
          <a href="https://portfolio-seven-orpin-47.vercel.app/" target="_blank" rel="noopener noreferrer" style={{fontSize:13,fontWeight:600,color:G.blue,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>
            👤 Meet the Developer — Olajide Michael →
          </a>
          <span style={{fontSize:12,color:G.muted}}>© 2026 ApexEduNexus · Academic Excellence</span>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOGIN PAGE  (with Forgot Password flow)
═══════════════════════════════════════════════════════════════ */
function LoginPage({setScreen, users, registerUser, updateUserPassword, setUser, showToast}) {
  // step: "login" | "forgot_email" | "forgot_code" | "forgot_newpass"
  const [step, setStep]         = useState("login");
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [err, setErr]           = useState("");
  const [info, setInfo]         = useState("");
  // forgot password state
  const [fEmail, setFEmail]     = useState("");
  const [fCode, setFCode]       = useState("");
  const [fCodeSent, setFCodeSent] = useState("");
  const [fName, setFName]       = useState("");
  const [fNewPass, setFNewPass] = useState("");
  const [fConfirm, setFConfirm] = useState("");
  const [sending, setSending]   = useState(false);

  function signIn() {
    setErr("");
    if (!email||!pass) { setErr("Please fill in all fields."); return; }
    const found = users.find(u => u.email.toLowerCase()===email.trim().toLowerCase());
    if (!found) { setErr("No account found with this email. Please sign up first."); return; }
    if (found.password !== pass) { setErr("Incorrect password. Please try again."); return; }
    setUser({name:found.name, email:found.email});
    showToast("Welcome back, "+found.name.split(" ")[0]+"! 🎓");
  }

  function handleGoogle(gUser) {
    const exists = users.find(u => u.email.toLowerCase()===gUser.email.toLowerCase());
    if (!exists) registerUser({name:gUser.name, email:gUser.email, password:"__google__", fromGoogle:true});
    setUser({name:gUser.name, email:gUser.email, picture:gUser.picture, fromGoogle:true});
    showToast("Welcome back, "+gUser.name.split(" ")[0]+"! 🎓");
  }

  // ── FORGOT: Step 1 — verify email exists and send code ──
  async function sendCode() {
    setErr(""); setInfo("");
    if (!fEmail.trim()) { setErr("Please enter your email address."); return; }
    const found = users.find(u => u.email.toLowerCase()===fEmail.trim().toLowerCase());
    if (!found) { setErr("No account found with this email."); return; }
    if (found.fromGoogle) { setErr("This account uses Google Sign-In — no password to reset."); return; }
    setSending(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const ok = await sendResetEmail({toEmail:found.email, toName:found.name, code});
    setSending(false);
    setFCodeSent(code);
    setFName(found.name);
    setStep("forgot_code");
    if (ok) setInfo("A 6-digit reset code has been sent to "+found.email);
    else setInfo("Could not send email — check EmailJS setup. For now, use code: "+code);
  }

  // ── FORGOT: Step 2 — verify code ──
  function verifyCode() {
    setErr("");
    if (!fCode.trim()) { setErr("Please enter the reset code."); return; }
    if (fCode.trim() !== fCodeSent) { setErr("Incorrect code. Please check your email."); return; }
    setStep("forgot_newpass");
    setInfo("");
  }

  // ── FORGOT: Step 3 — set new password ──
  function saveNewPass() {
    setErr("");
    if (!fNewPass) { setErr("Please enter a new password."); return; }
    if (fNewPass.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (fNewPass !== fConfirm) { setErr("Passwords do not match."); return; }
    updateUserPassword(fEmail.trim().toLowerCase(), fNewPass);
    showToast("Password updated! Please sign in. 🎓", G.green);
    setStep("login"); setFEmail(""); setFCode(""); setFNewPass(""); setFConfirm(""); setErr(""); setInfo("");
  }

  const Err = ({msg}) => msg ? <div style={{background:G.redSoft,border:`1px solid ${G.red}28`,borderRadius:10,padding:"10px 14px",fontSize:13,color:G.red,marginBottom:14}}>{msg}</div> : null;
  const Info = ({msg}) => msg ? <div style={{background:G.blueSoft,border:`1px solid rgba(37,99,235,0.2)`,borderRadius:10,padding:"10px 14px",fontSize:13,color:G.blue,marginBottom:14}}>{msg}</div> : null;

  return (
    <div style={{minHeight:"100dvh",background:`linear-gradient(135deg,#F2F1F6 0%,#E8E6F0 100%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>

      {/* ── NORMAL SIGN IN ── */}
      {step==="login" && <>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:64,height:64,borderRadius:18,background:G.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 20px"}}>🎓</div>
          <h1 style={{fontSize:26,fontWeight:800,color:G.text,marginBottom:8}}>Welcome back</h1>
          <p style={{fontSize:15,color:G.muted}}>Sign in to continue to your dashboard</p>
        </div>
        <Card style={{width:"100%",maxWidth:400,padding:"clamp(20px,5vw,28px)"}}>
          <Err msg={err}/>
          <GoogleBtn onSuccess={handleGoogle} label="Continue with Google"/>
          <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0"}}>
            <div style={{flex:1,height:1,background:G.border}}/>
            <span style={{fontSize:12,color:G.muted,fontWeight:500}}>or sign in with email</span>
            <div style={{flex:1,height:1,background:G.border}}/>
          </div>
          <div style={{display:"grid",gap:14}}>
            <Input label="Email address" type="email" placeholder="you@university.edu" value={email} onChange={e=>setEmail(e.target.value)}/>
            <div>
              <Input label="Password" type="password" placeholder="Your password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&signIn()}/>
              <p style={{textAlign:"right",marginTop:6}}>
                <span onClick={()=>{setStep("forgot_email");setErr("");}} style={{fontSize:12,color:G.blue,fontWeight:600,cursor:"pointer"}}>Forgot password?</span>
              </p>
            </div>
          </div>
          <BlueBtn full onClick={signIn} style={{marginTop:12,fontSize:15,padding:"13px"}}>Sign In →</BlueBtn>
          <p style={{textAlign:"center",fontSize:13,color:G.muted,marginTop:16}}>
            Don't have an account?{" "}
            <span onClick={()=>setScreen("signup")} style={{color:G.blue,fontWeight:600,cursor:"pointer"}}>Sign up</span>
          </p>
        </Card>
        <button onClick={()=>setScreen("home")} style={{marginTop:24,background:"none",border:"none",color:G.muted,cursor:"pointer",fontSize:14}}>← Back to home</button>
      </>}

      {/* ── FORGOT: Step 1 — enter email ── */}
      {step==="forgot_email" && <>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:64,height:64,borderRadius:18,background:G.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 20px"}}>🔑</div>
          <h1 style={{fontSize:24,fontWeight:800,color:G.text,marginBottom:8}}>Reset your password</h1>
          <p style={{fontSize:14,color:G.muted}}>Enter your email and we'll send a reset code</p>
        </div>
        <Card style={{width:"100%",maxWidth:400,padding:"clamp(20px,5vw,28px)"}}>
          <Err msg={err}/>
          <Input label="Your registered email" type="email" placeholder="you@university.edu" value={fEmail} onChange={e=>setFEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendCode()}/>
          <BlueBtn full onClick={sendCode} style={{marginTop:16,padding:"13px"}} disabled={sending}>
            {sending ? "Sending..." : "Send Reset Code →"}
          </BlueBtn>
          <p style={{textAlign:"center",marginTop:14,fontSize:13}}>
            <span onClick={()=>{setStep("login");setErr("");}} style={{color:G.blue,fontWeight:600,cursor:"pointer"}}>← Back to sign in</span>
          </p>
        </Card>
      </>}

      {/* ── FORGOT: Step 2 — enter code ── */}
      {step==="forgot_code" && <>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:64,height:64,borderRadius:18,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 20px"}}>📬</div>
          <h1 style={{fontSize:24,fontWeight:800,color:G.text,marginBottom:8}}>Check your email</h1>
          <p style={{fontSize:14,color:G.muted}}>Enter the 6-digit code we sent you</p>
        </div>
        <Card style={{width:"100%",maxWidth:400,padding:"clamp(20px,5vw,28px)"}}>
          <Err msg={err}/>
          <Info msg={info}/>
          <Input label="6-digit reset code" placeholder="e.g. 482910" value={fCode} onChange={e=>setFCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&verifyCode()}/>
          <BlueBtn full onClick={verifyCode} style={{marginTop:16,padding:"13px"}}>Verify Code →</BlueBtn>
          <p style={{textAlign:"center",marginTop:14,fontSize:13}}>
            <span onClick={()=>{setStep("forgot_email");setErr("");setInfo("");}} style={{color:G.blue,fontWeight:600,cursor:"pointer"}}>← Resend code</span>
          </p>
        </Card>
      </>}

      {/* ── FORGOT: Step 3 — new password ── */}
      {step==="forgot_newpass" && <>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:64,height:64,borderRadius:18,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 20px"}}>🔒</div>
          <h1 style={{fontSize:24,fontWeight:800,color:G.text,marginBottom:8}}>Set new password</h1>
          <p style={{fontSize:14,color:G.muted}}>Hi {fName.split(" ")[0]}, choose a new password</p>
        </div>
        <Card style={{width:"100%",maxWidth:400,padding:"clamp(20px,5vw,28px)"}}>
          <Err msg={err}/>
          <div style={{display:"grid",gap:14}}>
            <Input label="New password (min. 6 characters)" type="password" placeholder="New password" value={fNewPass} onChange={e=>setFNewPass(e.target.value)}/>
            <Input label="Confirm new password" type="password" placeholder="Repeat new password" value={fConfirm} onChange={e=>setFConfirm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveNewPass()}/>
          </div>
          <BlueBtn full onClick={saveNewPass} style={{marginTop:16,padding:"13px",background:G.green,boxShadow:"none"}}>Save New Password ✓</BlueBtn>
        </Card>
      </>}

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIGNUP PAGE
═══════════════════════════════════════════════════════════════ */
function SignupPage({setScreen, users, registerUser, setUser, showToast}) {
  const [form, setForm] = useState({name:"",email:"",pass:"",confirmPass:""});
  const [err, setErr] = useState("");
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));

  function submit() {
    if (!form.name.trim()) { setErr("Please enter your full name."); return; }
    if (!form.email.trim()) { setErr("Please enter your email address."); return; }
    if (!form.email.includes("@")) { setErr("Please enter a valid email address."); return; }
    if (!form.pass) { setErr("Please choose a password."); return; }
    if (form.pass.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (form.pass !== form.confirmPass) { setErr("Passwords do not match."); return; }
    const exists = users.find(u => u.email.toLowerCase()===form.email.trim().toLowerCase());
    if (exists) { setErr("An account with this email already exists. Please sign in."); return; }
    const newUser = {name:form.name.trim(), email:form.email.trim().toLowerCase(), password:form.pass};
    registerUser(newUser);
    setUser({name:newUser.name, email:newUser.email});
    showToast("Account created! Welcome, "+newUser.name.split(" ")[0]+"! 🎓");
    // Send welcome email in background
    sendWelcomeEmail({toEmail:newUser.email, toName:newUser.name});
  }

  function handleGoogle(gUser) {
    const exists = users.find(u => u.email.toLowerCase()===gUser.email.toLowerCase());
    if (exists) { setErr("An account with this email already exists. Please sign in instead."); return; }
    const newUser = {name:gUser.name, email:gUser.email, password:"__google__", fromGoogle:true};
    registerUser(newUser);
    setUser({name:gUser.name, email:gUser.email, picture:gUser.picture, fromGoogle:true});
    showToast("Account created! Welcome, "+gUser.name.split(" ")[0]+"! 🎓");
    sendWelcomeEmail({toEmail:gUser.email, toName:gUser.name});
  }

  return (
    <div style={{minHeight:"100dvh",background:`linear-gradient(135deg,#F2F1F6 0%,#E8E6F0 100%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{width:64,height:64,borderRadius:18,background:G.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 20px"}}>🎓</div>
        <h1 style={{fontSize:26,fontWeight:800,color:G.text,marginBottom:8}}>Create your account</h1>
        <p style={{fontSize:15,color:G.muted}}>Start managing your academics today</p>
      </div>
      <Card style={{width:"100%",maxWidth:400,padding:"clamp(20px,5vw,28px)"}}>
        {err&&<div style={{background:G.redSoft,border:`1px solid ${G.red}28`,borderRadius:10,padding:"10px 14px",fontSize:13,color:G.red,marginBottom:14}}>{err}</div>}

        {/* Google Sign-Up */}
        <GoogleBtn onSuccess={handleGoogle} label="Sign up with Google"/>

        {/* Divider */}
        <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0"}}>
          <div style={{flex:1,height:1,background:G.border}}/>
          <span style={{fontSize:12,color:G.muted,fontWeight:500}}>or sign up with email</span>
          <div style={{flex:1,height:1,background:G.border}}/>
        </div>

        <div style={{display:"grid",gap:12}}>
          <Input label="Full name" placeholder="Your full name" value={form.name} onChange={set("name")}/>
          <Input label="Email address" type="email" placeholder="you@university.edu" value={form.email} onChange={set("email")}/>
          <Input label="Password (min. 6 characters)" type="password" placeholder="Choose a password" value={form.pass} onChange={set("pass")}/>
          <Input label="Confirm Password" type="password" placeholder="Re-enter your password" value={form.confirmPass} onChange={set("confirmPass")} onKeyDown={e=>e.key==="Enter"&&submit()}/>
        </div>
        <BlueBtn full onClick={submit} style={{marginTop:16,fontSize:15,padding:"13px"}}>
          Create Account →
        </BlueBtn>
        <p style={{textAlign:"center",fontSize:13,color:G.muted,marginTop:16}}>
          Already have an account?{" "}
          <span onClick={()=>setScreen("login")} style={{color:G.blue,fontWeight:600,cursor:"pointer"}}>Sign in</span>
        </p>
      </Card>
      <button onClick={()=>setScreen("home")} style={{marginTop:24,background:"none",border:"none",color:G.muted,cursor:"pointer",fontSize:14,marginBottom:20}}>← Back to home</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP — top nav + full-width content, no sidebar
═══════════════════════════════════════════════════════════════ */
function AppPage({user, users=[], setScreen, showToast}) {
  const [section, setSection] = useState("dashboard"); // dashboard | deadlines | cgpa | todos | quiz | teaser | streaks | activity | notifs
  const [menuOpen, setMenuOpen] = useState(false);

  const [deadlines, setDeadlines] = useState(INIT_DL);
  const [courses, setCourses] = useState(INIT_CS);
  const [todos, setTodos] = useState(INIT_TD);
  const [friends, setFriends] = useState(INIT_FR);
  const [streak, setStreak] = useState(7);
  const [email, setEmail] = useState(user?.email||"student@apex.edu");
  const [notif, setNotif] = useState({enabled:true,days:3});
  const [activity, setActivity] = useState(INIT_ACT);

  const log = (type,msg,color) => setActivity(p=>[{id:uid(),type,msg,time:new Date().toISOString(),color},...p.slice(0,49)]);
  const toast_ = (msg,color) => showToast(msg,color);
  const ctx = {deadlines,setDeadlines,courses,setCourses,todos,setTodos,friends,setFriends,streak,setStreak,email,setEmail,notif,setNotif,activity,log,toast:toast_,setSection,users};

  const navItems = [
    {id:"dashboard",label:"Dashboard",icon:"⚡"},
    {id:"deadlines",label:"Deadlines",icon:"📅"},
    {id:"cgpa",label:"CGPA",icon:"📊"},
    {id:"todos",label:"To-Do",icon:"✅"},
    {id:"quiz",label:"AI Quiz",icon:"🤖"},
    {id:"teaser",label:"Brain Teasers",icon:"🧠"},
    {id:"streaks",label:"Streaks",icon:"🔥"},
    {id:"activity",label:"Activity",icon:"📈"},
    {id:"notifs",label:"Notifications",icon:"🔔"},
  ];

  const urgent = deadlines.filter(d=>!d.done&&daysLeft(d.due)<=3).length;

  return (
    <div style={{minHeight:"100dvh",background:G.bg}}>
      {/* ── TOP NAV ── */}
      <nav style={{background:G.card,borderBottom:`1px solid ${G.border}`,position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 clamp(12px,4vw,24px)",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Logo size={15}/>
          <button onClick={()=>setMenuOpen(o=>!o)} style={{background:"none",border:`1px solid ${G.border}`,borderRadius:10,padding:"8px 12px",cursor:"pointer",color:G.muted,fontSize:18,lineHeight:1}}>☰</button>
        </div>
      </nav>

      {/* ── DRAWER OVERLAY ── */}
      {menuOpen && (
        <>
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:200}} onClick={()=>setMenuOpen(false)}/>
          <div style={{position:"fixed",top:0,right:0,bottom:0,width:260,background:G.card,zIndex:201,padding:20,overflowY:"auto",boxShadow:"-4px 0 20px rgba(0,0,0,0.1)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${G.border}`}}>
              <Logo size={14}/>
              <button onClick={()=>setMenuOpen(false)} style={{background:"none",border:"none",fontSize:22,color:G.muted,cursor:"pointer"}}>×</button>
            </div>
            {/* User */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:G.bg,borderRadius:12,marginBottom:16}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:G.blue,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700}}>
                {user?.name?.slice(0,2).toUpperCase()||"S"}
              </div>
              <div>
                <p style={{fontSize:13,fontWeight:600,color:G.text}}>{user?.name}</p>
                <p style={{fontSize:11,color:G.muted}}>🔥 {streak} day streak</p>
              </div>
            </div>
            {navItems.map(n=>(
              <button key={n.id} onClick={()=>{setSection(n.id);setMenuOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",background:section===n.id?G.blueSoft:"transparent",color:section===n.id?G.blue:G.muted,border:section===n.id?`1px solid rgba(37,99,235,0.2)`:"1px solid transparent",borderRadius:10,padding:"10px 12px",fontSize:14,fontWeight:500,cursor:"pointer",marginBottom:4,position:"relative"}}>
                <span>{n.icon}</span><span>{n.label}</span>
                {n.id==="deadlines"&&urgent>0&&<span style={{marginLeft:"auto",background:G.red,borderRadius:99,fontSize:10,padding:"1px 7px",color:"#fff",fontWeight:700}}>{urgent}</span>}
              </button>
            ))}
            <div style={{borderTop:`1px solid ${G.border}`,marginTop:16,paddingTop:16,display:"grid",gap:8}}>
              <a href="https://portfolio-seven-orpin-47.vercel.app/" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,background:G.blueSoft,border:`1px solid rgba(37,99,235,0.15)`,borderRadius:10,padding:"10px 12px",fontSize:13,color:G.blue,fontWeight:600,textDecoration:"none"}}>
                👤 Olajide Michael — Portfolio
              </a>
              <button onClick={()=>{setMenuOpen(false);setScreen("home");}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",background:"none",border:`1px solid ${G.border}`,borderRadius:10,padding:"10px 12px",fontSize:13,color:G.muted,cursor:"pointer",fontWeight:500}}>
                🚪 Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── CONTENT ── */}
      <main style={{maxWidth:1100,margin:"0 auto",padding:"clamp(16px,4vw,28px) clamp(12px,4vw,24px)"}}>
        {section==="dashboard" && <SectionDashboard user={user} {...ctx}/>}
        {section==="deadlines" && <SectionDeadlines {...ctx}/>}
        {section==="cgpa"      && <SectionCGPA      {...ctx}/>}
        {section==="todos"     && <SectionTodos     {...ctx}/>}
        {section==="quiz"      && <SectionQuiz      {...ctx}/>}
        {section==="teaser"    && <SectionTeaser    {...ctx}/>}
        {section==="streaks"   && <SectionStreaks   {...ctx} user={user}/>}
        {section==="activity"  && <SectionActivity  {...ctx}/>}
        {section==="notifs"    && <SectionNotifs    {...ctx}/>}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD  — matches screenshot exactly
═══════════════════════════════════════════════════════════════ */
function SectionDashboard({user, deadlines, courses, todos, streak, setSection}) {
  const gpaVal = calcGPA(courses);
  const urgent = deadlines.filter(d=>!d.done&&daysLeft(d.due)<=3).length;

  const stats = [
    {icon:"🕐",bg:G.blueSoft,val:deadlines.filter(d=>!d.done).length,label:"Upcoming Deadlines",sec:"deadlines",iconColor:G.blue},
    {icon:"📈",bg:G.greenSoft,val:gpaVal,label:"Current CGPA",sec:"cgpa",iconColor:G.green},
    {icon:"☑️",bg:G.purpleSoft,val:todos.filter(t=>!t.done).length,label:"Tasks Pending",sec:"todos",iconColor:G.purple},
    {icon:"🔥",bg:"#FFF7ED",val:streak,label:"Day Streak",sec:"streaks",iconColor:G.orange},
  ];

  const featureCards = [
    {icon:"📅",bg:G.blueSoft,title:"Deadline Tracker",desc:"Manage and track all your academic deadlines",sec:"deadlines"},
    {icon:"📊",bg:G.greenSoft,title:"CGPA Calculator",desc:"Monitor your GPA across all courses",sec:"cgpa"},
    {icon:"✅",bg:G.purpleSoft,title:"To-Do List",desc:"Organize your academic tasks",sec:"todos"},
    {icon:"🤖",bg:G.redSoft,title:"AI Quizzes",desc:"Generate quizzes from your PDFs",sec:"quiz"},
    {icon:"🧠",bg:G.orangeSoft,title:"Brain Teasers",desc:"Challenge your mind with puzzles",sec:"teaser"},
    {icon:"🔥",bg:"#FFF7ED",title:"Streak System",desc:"Build habits and invite friends",sec:"streaks"},
    {icon:"📈",bg:G.blueSoft,title:"Activity Log",desc:"View your full history",sec:"activity"},
    {icon:"🔔",bg:G.purpleSoft,title:"Notifications",desc:"Manage your email alerts",sec:"notifs"},
  ];

  return (
    <div>
      {/* Greeting */}
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:"clamp(22px,5vw,30px)",fontWeight:800,color:G.text,marginBottom:6}}>
          {greetTime()}, {user?.name?.split(" ")[0]}!
        </h1>
        <p style={{fontSize:15,color:G.muted,lineHeight:1.6}}>Here's an overview of your academic journey. What would you like to work on today?</p>
      </div>

      {urgent>0&&(
        <div style={{background:"rgba(220,38,38,0.06)",border:`1px solid rgba(220,38,38,0.2)`,borderRadius:12,padding:"14px 18px",marginBottom:24,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:18}}>⚠️</span>
          <div style={{flex:1}}><strong style={{color:G.red,fontSize:14}}>{urgent} deadline{urgent>1?"s":""} due within 3 days!</strong><p style={{fontSize:12,color:G.muted,marginTop:2}}>Stay on top of your schedule.</p></div>
          <BlueBtn small onClick={()=>setSection("deadlines")} style={{background:G.red,boxShadow:"none"}}>View →</BlueBtn>
        </div>
      )}

      {/* STATS — 2×2 grid matching screenshot */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:32}}>
        {stats.map(s=>(
          <Card key={s.label} style={{cursor:"pointer",padding:"clamp(16px,4vw,22px)"}} onClick={()=>setSection(s.sec)}>
            <IconBox icon={s.icon} bg={s.bg} size={48}/>
            <div style={{fontSize:"clamp(22px,5vw,32px)",fontWeight:900,color:G.text,marginTop:14,marginBottom:4}}>{s.val}</div>
            <div style={{fontSize:"clamp(11px,2.5vw,13px)",color:G.muted,lineHeight:1.4}}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* FEATURE CARDS — vertical list with Open → */}
      <div style={{display:"grid",gap:14}}>
        {featureCards.map(f=>(
          <Card key={f.title} style={{display:"flex",alignItems:"center",gap:16,cursor:"pointer",padding:"clamp(16px,4vw,20px)"}} onClick={()=>setSection(f.sec)}>
            <IconBox icon={f.icon} bg={f.bg} size={52}/>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:16,fontWeight:700,color:G.text,marginBottom:4}}>{f.title}</p>
              <p style={{fontSize:13,color:G.muted}}>{f.desc}</p>
            </div>
            <span style={{color:G.blue,fontWeight:600,fontSize:14,flexShrink:0}}>Open →</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEADLINES
═══════════════════════════════════════════════════════════════ */
function SectionDeadlines({deadlines,setDeadlines,log,toast,setSection}) {
  const [open,setOpen] = useState(false);
  const [filter,setFilter] = useState("all");
  const [form,setForm] = useState({title:"",course:"",due:"",type:"Assignment",priority:"Medium",notify:true});
  const set = k=>e=>setForm(p=>({...p,[k]:typeof e==="boolean"?e:e.target.value}));
  const pC={Critical:G.red,High:G.orange,Medium:G.gold,Low:G.green};
  const tC={Exam:G.red,Assignment:G.blue,Project:G.gold,Report:G.green,Presentation:G.purple};

  function add(){
    if(!form.title||!form.due){toast("Fill in title and due date",G.red);return;}
    setDeadlines(p=>[...p,{id:uid(),...form,done:false}]);
    log("deadline",`Added: '${form.title}'`,G.blue);
    toast("Deadline added! 📅");
    setForm({title:"",course:"",due:"",type:"Assignment",priority:"Medium",notify:true});
    setOpen(false);
  }

  const list = deadlines
    .filter(d=>filter==="all"?true:filter==="pending"?!d.done:filter==="done"?d.done:daysLeft(d.due)<=7&&!d.done)
    .sort((a,b)=>new Date(a.due)-new Date(b.due));

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <PageHeader onBack={()=>setSection("dashboard")} title="📅 Deadline Tracker"/>
        </div>
        <BlueBtn small onClick={()=>setOpen(true)}>+ Add Deadline</BlueBtn>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {[["all","All"],["pending","Pending"],["done","Done"],["week","This Week"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{background:filter===v?G.blueSoft:"transparent",color:filter===v?G.blue:G.muted,border:filter===v?`1.5px solid rgba(37,99,235,0.25)`:`1px solid ${G.border}`,borderRadius:99,padding:"6px 16px",fontSize:13,fontWeight:600,cursor:"pointer"}}>{l}</button>
        ))}
      </div>

      <div style={{display:"grid",gap:10}}>
        {list.map(d=>{
          const dy=daysLeft(d.due),c=dy<=0?G.red:dy<=3?G.orange:dy<=7?G.gold:G.green;
          return(
            <Card key={d.id} style={{display:"flex",alignItems:"center",gap:12,padding:"16px 18px",opacity:d.done?0.6:1,flexWrap:"wrap"}}>
              <input type="checkbox" checked={d.done} onChange={()=>setDeadlines(p=>p.map(x=>x.id===d.id?{...x,done:!x.done}:x))} style={{width:18,height:18,accentColor:G.blue,cursor:"pointer",flexShrink:0}}/>
              <div style={{flex:1,minWidth:160}}>
                <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:5}}>
                  <span style={{fontSize:14,fontWeight:600,color:d.done?G.muted:G.text,textDecoration:d.done?"line-through":"none"}}>{d.title}</span>
                  <Badge color={tC[d.type]||G.blue}>{d.type}</Badge>
                  <Badge color={pC[d.priority]||G.blue}>{d.priority}</Badge>
                  {d.notify&&<Badge color={G.blue}>📧</Badge>}
                </div>
                <span style={{fontSize:12,color:G.muted}}>{d.course}</span>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:13,fontWeight:700,color:d.done?G.muted:c}}>{d.done?"Done ✓":dy<=0?"Overdue!":dy===1?"Tomorrow":`${dy} days`}</div>
                <div style={{fontSize:11,color:G.muted}}>{fmtDate(d.due)}</div>
              </div>
              <button onClick={()=>setDeadlines(p=>p.filter(x=>x.id!==d.id))} style={{background:"none",border:"none",color:G.muted,cursor:"pointer",fontSize:18,padding:4}}>×</button>
            </Card>
          );
        })}
        {list.length===0&&<p style={{textAlign:"center",color:G.muted,padding:"48px 0"}}>No deadlines here ✨</p>}
      </div>

      {open&&(
        <Modal title="Add New Deadline" onClose={()=>setOpen(false)}>
          <div style={{display:"grid",gap:14}}>
            <Input label="Title *" placeholder="e.g. Math Assignment #3" value={form.title} onChange={set("title")}/>
            <Input label="Course" placeholder="e.g. Calculus II" value={form.course} onChange={set("course")}/>
            <Input label="Due Date *" type="date" value={form.due} onChange={set("due")}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Sel label="Type" value={form.type} onChange={set("type")}>{["Assignment","Exam","Project","Report","Presentation"].map(t=><option key={t}>{t}</option>)}</Sel>
              <Sel label="Priority" value={form.priority} onChange={set("priority")}>{["Low","Medium","High","Critical"].map(t=><option key={t}>{t}</option>)}</Sel>
            </div>
            <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
              <input type="checkbox" checked={form.notify} onChange={e=>setForm(p=>({...p,notify:e.target.checked}))} style={{accentColor:G.blue,width:16,height:16}}/>
              <span style={{fontSize:13,color:G.muted}}>Send email notification</span>
            </label>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,marginTop:20}}>
            <BlueBtn full onClick={add} style={{padding:"12px"}}>Add Deadline</BlueBtn>
            <GrayBtn onClick={()=>setOpen(false)}>Cancel</GrayBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CGPA
═══════════════════════════════════════════════════════════════ */
function SectionCGPA({courses,setCourses,log,toast,setSection}) {
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({name:"",code:"",credits:3,grade:"A",score:90});
  const set=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const gpa_=calcGPA(courses),gn=parseFloat(gpa_);

  function add(){
    if(!form.name){toast("Enter course name",G.red);return;}
    setCourses(p=>[...p,{id:uid(),...form,credits:+form.credits,score:+form.score}]);
    log("cgpa",`Added course: ${form.name}`,G.green);
    toast("Course added! 📊");
    setForm({name:"",code:"",credits:3,grade:"A",score:90});
    setOpen(false);
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <PageHeader onBack={()=>setSection("dashboard")} title="📊 CGPA Calculator"/>
        <BlueBtn small onClick={()=>setOpen(true)}>+ Add Course</BlueBtn>
      </div>

      {/* GPA Banner */}
      <Card style={{background:`linear-gradient(135deg,#1D4ED8,#2563EB)`,marginBottom:20,padding:"clamp(20px,4vw,28px)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div>
            <p style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Cumulative GPA</p>
            <div style={{fontSize:"clamp(40px,8vw,56px)",fontWeight:900,color:"#fff",lineHeight:1}}>{gpa_}</div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.75)",marginTop:8}}>{gn>=3.7?"🏆 Dean's List!":gn>=3.0?"✅ Good Standing":"📚 Keep Studying"}</p>
          </div>
          <div style={{display:"grid",gap:10}}>
            <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"12px 20px",textAlign:"center"}}>
              <p style={{fontSize:22,fontWeight:800,color:"#fff"}}>{courses.reduce((a,c)=>a+c.credits,0)}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>Total Credits</p>
            </div>
            <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"12px 20px",textAlign:"center"}}>
              <p style={{fontSize:22,fontWeight:800,color:"#fff"}}>{courses.length}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>Courses</p>
            </div>
          </div>
        </div>
      </Card>

      <div style={{display:"grid",gap:12}}>
        {courses.map(c=>(
          <Card key={c.id} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px"}}>
            <div style={{width:46,height:46,borderRadius:12,background:`${gradeCol(c.grade)}15`,border:`1px solid ${gradeCol(c.grade)}30`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,color:gradeCol(c.grade),flexShrink:0}}>{c.grade}</div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:14,fontWeight:700,color:G.text}}>{c.name}</p>
              <p style={{fontSize:12,color:G.muted,marginBottom:8}}>{c.code} · {c.credits} credits</p>
              <Bar pct={c.score} color={gradeCol(c.grade)}/>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <p style={{fontSize:20,fontWeight:800,color:G.text}}>{c.score}%</p>
              <p style={{fontSize:11,color:G.muted}}>GP: {GP[c.grade]?.toFixed(1)}</p>
            </div>
            <button onClick={()=>setCourses(p=>p.filter(x=>x.id!==c.id))} style={{background:"none",border:"none",color:G.muted,cursor:"pointer",fontSize:18}}>×</button>
          </Card>
        ))}
      </div>

      {open&&(
        <Modal title="Add Course" onClose={()=>setOpen(false)}>
          <div style={{display:"grid",gap:14}}>
            <Input label="Course Name *" placeholder="e.g. Calculus II" value={form.name} onChange={set("name")}/>
            <Input label="Course Code" placeholder="e.g. MTH 202" value={form.code} onChange={set("code")}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <Input label="Credits" type="number" value={form.credits} min={1} max={6} onChange={set("credits")}/>
              <Sel label="Grade" value={form.grade} onChange={set("grade")}>{Object.keys(GP).map(g=><option key={g}>{g}</option>)}</Sel>
              <Input label="Score %" type="number" value={form.score} min={0} max={100} onChange={set("score")}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,marginTop:20}}>
            <BlueBtn full onClick={add} style={{padding:"12px"}}>Add Course</BlueBtn>
            <GrayBtn onClick={()=>setOpen(false)}>Cancel</GrayBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TODOS
═══════════════════════════════════════════════════════════════ */
function SectionTodos({todos,setTodos,log,toast,setSection}) {
  const [inp,setInp]=useState("");
  const [pri,setPri]=useState("Medium");
  const [filter,setFilter]=useState("all");
  const prC={High:G.red,Medium:G.gold,Low:G.green};
  const done=todos.filter(t=>t.done).length;
  const pct=todos.length?Math.round((done/todos.length)*100):0;
  const list=todos.filter(t=>filter==="all"?true:filter==="pending"?!t.done:t.done);

  function add(){
    if(!inp.trim())return;
    setTodos(p=>[{id:uid(),text:inp.trim(),done:false,priority:pri,at:new Date().toISOString()},...p]);
    log("todo",`Added: '${inp}'`,G.green);
    toast("Task added! ✅");
    setInp("");
  }

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <PageHeader onBack={()=>setSection("dashboard")} title="✅ To-Do List"/>
        <p style={{fontSize:13,color:G.muted}}>{pct}% complete</p>
      </div>

      <Card style={{marginBottom:16}}>
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,fontWeight:600,color:G.muted}}>Progress</span>
            <span style={{fontSize:12,fontWeight:700,color:G.green}}>{pct}%</span>
          </div>
          <Bar pct={pct} color={G.green}/>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <input style={{flex:1,minWidth:140,background:G.bg,border:`1.5px solid ${G.border}`,borderRadius:10,padding:"10px 14px",fontSize:14,color:G.text,outline:"none"}} placeholder="Add a new task..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/>
          <select style={{background:G.bg,border:`1.5px solid ${G.border}`,borderRadius:10,padding:"10px 14px",fontSize:13,color:G.text,outline:"none",cursor:"pointer"}} value={pri} onChange={e=>setPri(e.target.value)}>
            {["Low","Medium","High"].map(p=><option key={p}>{p}</option>)}
          </select>
          <BlueBtn small onClick={add}>Add</BlueBtn>
        </div>
      </Card>

      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        {[["all","All"],["pending","Pending"],["done","Done"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{background:filter===v?G.blueSoft:"transparent",color:filter===v?G.blue:G.muted,border:filter===v?`1.5px solid rgba(37,99,235,0.25)`:`1px solid ${G.border}`,borderRadius:99,padding:"6px 16px",fontSize:13,fontWeight:600,cursor:"pointer"}}>{l}</button>
        ))}
      </div>

      <div style={{display:"grid",gap:10}}>
        {list.map(t=>(
          <Card key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",opacity:t.done?0.6:1}}>
            <input type="checkbox" checked={t.done} onChange={()=>setTodos(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))} style={{width:18,height:18,accentColor:G.blue,cursor:"pointer",flexShrink:0}}/>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:500,color:t.done?G.muted:G.text,textDecoration:t.done?"line-through":"none"}}>{t.text}</p>
              <p style={{fontSize:11,color:G.muted,marginTop:2}}>{new Date(t.at).toLocaleDateString()}</p>
            </div>
            <Badge color={prC[t.priority]||G.blue}>{t.priority}</Badge>
            <button onClick={()=>setTodos(p=>p.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",color:G.muted,cursor:"pointer",fontSize:18}}>×</button>
          </Card>
        ))}
        {list.length===0&&<p style={{textAlign:"center",color:G.muted,padding:"40px 0"}}>All clear! ✨</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AI QUIZ — fully working PDF upload
═══════════════════════════════════════════════════════════════ */
function SectionQuiz({log,toast,setSection}) {
  const [step,setStep]=useState("upload");
  const [fileName,setFileName]=useState("");
  const [payload,setPayload]=useState(null);
  const [numQ,setNumQ]=useState(5);
  const [questions,setQuestions]=useState([]);
  const [answers,setAnswers]=useState({});
  const [revealed,setRevealed]=useState(false);
  const fileRef=useRef();

  async function handleFile(e){
    const file=e.target.files[0]; if(!file)return;
    // Size limit: 4MB for PDFs, 1MB for text
    const maxSize = file.type==="application/pdf" ? 4*1024*1024 : 1*1024*1024;
    if(file.size > maxSize){
      toast(file.type==="application/pdf"
        ? "PDF too large — please upload max 10 pages (4MB limit)"
        : "File too large — please keep text under 1MB",
        G.red);
      return;
    }
    setFileName(file.name);
    try{
      if(file.type==="application/pdf"){
        const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(file);});
        setPayload({type:"pdf",b64});
      } else {
        const text=await file.text();
        setPayload({type:"text",text});
      }
      toast("Loaded: "+file.name,G.green);
    }catch{toast("Failed to read file",G.red);}
  }

  async function generate(){
    if(!payload){toast("Please upload a file first",G.red);return;}
    setStep("loading");
    const prompt="Generate exactly "+numQ+' multiple-choice quiz questions from this content. Return ONLY a valid JSON array — no markdown, no extra text. Each item must be: {"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"answer":"A) ..."} The answer must exactly match one option string.';
    try{
      const messages=payload.type==="pdf"
        ?[{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:payload.b64}},{type:"text",text:prompt}]}]
        :[{role:"user",content:prompt+"\n\nContent:\n"+payload.text.slice(0,8000)}];
      const res=await fetch("/api/quiz",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"gemini-2.0-flash",max_tokens:2000,messages})});
      if(!res.ok) throw new Error(res.status+"");
      const data=await res.json();
      // Robust parsing — extract JSON array from anywhere in the response
      const fullText=(data.content?.map(c=>c.type==="text"?c.text:"").join("")||"").trim();
      const jsonMatch = fullText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if(!jsonMatch) throw new Error("No JSON array found in response");
      const parsed=JSON.parse(jsonMatch[0]);
      if(!Array.isArray(parsed)||!parsed.length) throw new Error("empty");
      setQuestions(parsed);setAnswers({});setRevealed(false);setStep("quiz");
      log("quiz","Generated "+parsed.length+" questions from '"+fileName+"'",G.blue);
      toast(parsed.length+" questions ready! 🤖",G.blue);
    }catch(err){
      toast("Generation failed — try again.",G.red);
      console.error("Quiz error:",err);setStep("upload");
    }
  }

  function submit(){
    setRevealed(true);
    const sc=questions.filter((q,i)=>answers[i]===q.answer).length;
    log("quiz",`Quiz completed: ${sc}/${questions.length}`,G.blue);
  }

  const score=questions.filter((q,i)=>answers[i]===q.answer).length;

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <PageHeader onBack={()=>setSection("dashboard")} title="🤖 AI Quiz Generator"/>
        {step!=="upload"&&<BlueBtn small outline onClick={()=>{setStep("upload");setQuestions([]);setPayload(null);setFileName("");}}>New Quiz</BlueBtn>}
      </div>

      {step==="upload"&&(
        <div style={{maxWidth:520,margin:"0 auto"}}>

          <Card style={{textAlign:"center",padding:"clamp(32px,6vw,52px)",border:`2px dashed ${G.border}`,cursor:"pointer",boxShadow:"none"}} onClick={()=>fileRef.current.click()}>
            <div style={{fontSize:56,marginBottom:16}}>📄</div>
            <h3 style={{fontSize:18,fontWeight:700,color:G.text,marginBottom:8}}>Upload your study material</h3>
            <p style={{fontSize:14,color:G.muted,marginBottom:24}}>PDF (max 10 pages) or text file — AI will generate quiz questions from it</p>
            <input ref={fileRef} type="file" accept=".pdf,.txt,.md" style={{display:"none"}} onChange={handleFile}/>
            <BlueBtn onClick={e=>{e.stopPropagation();fileRef.current.click();}}>Choose File</BlueBtn>
            {fileName&&<div style={{marginTop:18,display:"inline-block",padding:"4px 14px",borderRadius:99,fontSize:12,fontWeight:600,background:G.greenSoft,color:G.green,border:`1px solid ${G.green}28`}}>✅ {fileName}</div>}
          </Card>
          {payload&&(
            <Card style={{marginTop:14}}>
              <p style={{fontSize:13,color:G.muted,marginBottom:12,fontWeight:500}}>How many questions?</p>
              <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
                {[3,5,8,10].map(n=><button key={n} onClick={()=>setNumQ(n)} style={{background:numQ===n?G.blueSoft:"transparent",color:numQ===n?G.blue:G.muted,border:numQ===n?`1.5px solid rgba(37,99,235,0.25)`:`1px solid ${G.border}`,borderRadius:99,padding:"7px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>{n}</button>)}
              </div>
              <BlueBtn full onClick={generate} style={{padding:"12px"}}>Generate Quiz with AI →</BlueBtn>
            </Card>
          )}
        </div>
      )}

      {step==="loading"&&(
        <div style={{textAlign:"center",padding:"80px 20px"}}>
          <div style={{fontSize:60,marginBottom:18}}>🤖</div>
          <h3 style={{fontSize:20,fontWeight:700,color:G.text,marginBottom:8}}>Analyzing your document...</h3>
          <p style={{fontSize:14,color:G.muted}}>Claude AI is crafting {numQ} questions from your material</p>
        </div>
      )}

      {step==="quiz"&&(
        <div style={{maxWidth:680,margin:"0 auto"}}>
          {revealed&&(
            <Card style={{textAlign:"center",marginBottom:20,background:score/questions.length>=0.7?G.greenSoft:G.redSoft,border:`1px solid ${score/questions.length>=0.7?`${G.green}28`:`${G.red}28`}`}}>
              <div style={{fontSize:"clamp(36px,7vw,48px)",fontWeight:900,color:score/questions.length>=0.7?G.green:G.red}}>{score}/{questions.length}</div>
              <p style={{fontSize:16,fontWeight:600,color:G.text,marginTop:6}}>{score/questions.length>=0.8?"Excellent! 🏆":score/questions.length>=0.6?"Good work! ✅":"Keep studying! 📚"}</p>
              <p style={{fontSize:13,color:G.muted,marginTop:4}}>{Math.round((score/questions.length)*100)}% correct</p>
            </Card>
          )}
          {!revealed&&(
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
              <p style={{fontSize:13,color:G.muted}}>{questions.length} questions · {fileName}</p>
              <BlueBtn small onClick={submit}>Submit Quiz →</BlueBtn>
            </div>
          )}
          {questions.map((q,i)=>(
            <Card key={i} style={{marginBottom:14}}>
              <p style={{fontSize:14,fontWeight:600,color:G.text,marginBottom:14}}><span style={{color:G.blue,marginRight:8}}>Q{i+1}.</span>{q.question}</p>
              {q.options.map((opt,j)=>{
                const sel=answers[i]===opt,cor=opt===q.answer;
                const bg=revealed?(cor?G.greenSoft:sel?G.redSoft:G.bg):(sel?G.blueSoft:G.bg);
                const border=revealed?(cor?`1.5px solid ${G.green}40`:sel?`1.5px solid ${G.red}40`:`1px solid ${G.border}`):(sel?`1.5px solid rgba(37,99,235,0.4)`:`1px solid ${G.border}`);
                return(
                  <div key={j} onClick={()=>!revealed&&setAnswers(a=>({...a,[i]:opt}))} style={{padding:"11px 16px",borderRadius:10,marginBottom:8,cursor:revealed?"default":"pointer",background:bg,border,fontSize:13,color:G.text,display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.15s"}}>
                    <span>{opt}</span>
                    {revealed&&cor&&<span style={{color:G.green,fontWeight:700}}>✓</span>}
                    {revealed&&sel&&!cor&&<span style={{color:G.red,fontWeight:700}}>✗</span>}
                  </div>
                );
              })}
            </Card>
          ))}
          {!revealed&&<BlueBtn full onClick={submit} style={{padding:"13px"}}>Submit Quiz</BlueBtn>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BRAIN TEASER
═══════════════════════════════════════════════════════════════ */
function SectionTeaser({log,toast,streak,setStreak,setSection}) {
  const [idx,setIdx]=useState(0);
  const [guess,setGuess]=useState("");
  const [revealed,setRevealed]=useState(false);
  const [hint,setHint]=useState(false);
  const [score,setScore]=useState(0);
  const [total,setTotal]=useState(0);
  const q=RIDDLES[idx%RIDDLES.length];
  const correct=guess.trim().toLowerCase()===q.a.toLowerCase();

  function check(){
    if(!guess.trim())return;
    setRevealed(true);setTotal(t=>t+1);
    if(correct){setScore(s=>s+1);setStreak(s=>s+1);toast("🎉 Correct! Streak +1!",G.green);log("brainteaser","Solved a brain teaser correctly",G.green);}
    else{toast("Wrong! Try the next one.",G.orange);log("brainteaser","Attempted a brain teaser",G.gold);}
  }
  function next(){setIdx(i=>i+1);setGuess("");setRevealed(false);setHint(false);}

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <PageHeader onBack={()=>setSection("dashboard")} title="🧠 Brain Teasers"/>
        <div style={{display:"flex",gap:8}}>
          <Badge color={G.green}>✅ {score}/{total}</Badge>
          <Badge color={G.orange}>🔥 {streak}</Badge>
        </div>
      </div>

      <div style={{maxWidth:580,margin:"0 auto"}}>
        <Card style={{textAlign:"center",padding:"clamp(28px,6vw,48px) clamp(20px,5vw,40px)"}}>
          <div style={{fontSize:48,marginBottom:16}}>🧩</div>
          <p style={{fontSize:"clamp(15px,3vw,17px)",fontWeight:600,color:G.text,lineHeight:1.7,marginBottom:28}}>{q.q}</p>
          {hint&&<div style={{background:G.blueSoft,border:`1px solid rgba(37,99,235,0.2)`,borderRadius:10,padding:"10px 16px",marginBottom:18,color:G.blue,fontSize:13}}>💡 Starts with "{q.a[0]}", {q.a.length} letters</div>}
          {!revealed?(
            <>
              <div style={{display:"flex",gap:10,maxWidth:380,margin:"0 auto 14px",flexWrap:"wrap"}}>
                <input style={{flex:1,background:G.bg,border:`1.5px solid ${G.border}`,borderRadius:10,padding:"11px 14px",fontSize:14,color:G.text,outline:"none",textAlign:"center"}} placeholder="Your answer..." value={guess} onChange={e=>setGuess(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()}/>
                <BlueBtn onClick={check} style={{padding:"11px 24px"}}>Submit</BlueBtn>
              </div>
              <GrayBtn onClick={()=>setHint(true)} style={{fontSize:13}}>💡 Show Hint</GrayBtn>
            </>
          ):(
            <>
              <div style={{padding:"16px 24px",borderRadius:12,background:correct?G.greenSoft:G.redSoft,border:`1px solid ${correct?G.green+40:G.red+40}`,marginBottom:20}}>
                <p style={{fontSize:15,fontWeight:700,color:correct?G.green:G.red}}>{correct?"🎉 Correct!":"❌ Wrong!"}</p>
                <p style={{fontSize:16,color:G.text,marginTop:5}}>Answer: <strong style={{color:G.blue}}>{q.a}</strong></p>
              </div>
              <BlueBtn onClick={next} style={{padding:"11px 28px"}}>Next Riddle →</BlueBtn>
            </>
          )}
        </Card>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginTop:16}}>
          {[{l:"Solved",v:score,c:G.green,i:"✅"},{l:"Attempted",v:total,c:G.blue,i:"🎯"},{l:"Accuracy",v:total?`${Math.round((score/total)*100)}%`:"—",c:G.gold,i:"📊"}].map(s=>(
            <Card key={s.l} style={{textAlign:"center",padding:"16px 10px",background:`${s.c}0A`,border:`1px solid ${s.c}22`}}>
              <div style={{fontSize:22,marginBottom:8}}>{s.i}</div>
              <div style={{fontSize:22,fontWeight:900,color:G.text}}>{s.v}</div>
              <div style={{fontSize:11,color:G.muted,marginTop:4,textTransform:"uppercase",letterSpacing:0.8}}>{s.l}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STREAKS
═══════════════════════════════════════════════════════════════ */
function SectionStreaks({friends,setFriends,streak,log,toast,setSection,users=[],user}) {
  const [open,setOpen]=useState(false);
  const [iName,setIName]=useState("");
  const [iEmail,setIEmail]=useState("");
  const [sent,setSent]=useState([]);

  async function send(){
    if(!iEmail||!iName){toast("Enter name and email",G.red);return;}
    setSent(p=>[...p,{id:uid(),name:iName,email:iEmail,status:"sending"}]);
    setIName("");setIEmail("");setOpen(false);
    const ok = await sendInviteEmail({toEmail:iEmail, toName:iName, fromName:"A friend on ApexEduNexus"});
    setSent(p=>p.map(s=>s.email===iEmail?{...s,status:ok?"sent":"failed"}:s));
    log("streak",`Invited ${iName} to ApexEduNexus`,G.orange);
    toast(ok?`Invite sent to ${iEmail}! 📧`:`Saved invite — configure EmailJS to send real emails`,ok?G.orange:G.gold);
  }

  // Build leaderboard: current user + all other registered users in session
  const registeredEntries = users
    .filter(u => u.email !== (user?.email || ""))
    .map(u => ({
      id: u.email,
      name: u.name,
      streak: Math.floor(Math.random() * 15) + 1,
      initials: u.name.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(),
    }));
  const board = [
    {id:"me", name:"You", streak, initials: (user?.name||"You").split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase()||"YO", isMe:true},
    ...registeredEntries,
    ...friends.filter(f => !registeredEntries.find(r=>r.id===f.email))
  ].sort((a,b)=>b.streak-a.streak);
  const medals=["🥇","🥈","🥉"];

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <PageHeader onBack={()=>setSection("dashboard")} title="🔥 Streak System"/>
        <BlueBtn small onClick={()=>setOpen(true)} style={{background:G.orange,boxShadow:"none"}}>✉️ Invite Friend</BlueBtn>
      </div>

      <Card style={{background:"linear-gradient(135deg,#FFF7ED,#FFFBF5)",border:`1px solid ${G.orange}28`,marginBottom:16,display:"flex",alignItems:"center",gap:20,padding:"clamp(20px,4vw,28px)",flexWrap:"wrap"}}>
        <div style={{fontSize:56}}>🔥</div>
        <div>
          <div style={{fontSize:"clamp(38px,7vw,48px)",fontWeight:900,color:G.orange}}>{streak}</div>
          <p style={{fontSize:15,fontWeight:600,color:G.text}}>Your Current Streak</p>
          <p style={{fontSize:13,color:G.muted,marginTop:3}}>Keep solving teasers and quizzes daily!</p>
        </div>
      </Card>

      <Card style={{marginBottom:16}}>
        <p style={{fontSize:12,fontWeight:700,color:G.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>🏆 Leaderboard</p>
        {board.map((f,i)=>(
          <div key={f.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:i===0?"rgba(245,158,11,0.05)":G.bg,borderRadius:10,marginBottom:8,border:`1px solid ${i===0?"rgba(245,158,11,0.2)":G.border}`}}>
            <span style={{fontSize:20,width:26,flexShrink:0}}>{medals[i]||`#${i+1}`}</span>
            <div style={{width:36,height:36,borderRadius:"50%",background:f.isMe?G.green:G.blue,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700,flexShrink:0}}>{f.initials}</div>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:600,color:G.text}}>{f.name}{f.isMe?" (You)":""}</p>
              {!f.isMe&&<p style={{fontSize:12,color:G.muted}}>{f.email}</p>}
            </div>
            <span style={{fontSize:16,fontWeight:800,color:G.orange}}>🔥 {f.streak}</span>
          </div>
        ))}
      </Card>

      {sent.length>0&&(
        <Card>
          <p style={{fontSize:12,fontWeight:700,color:G.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>📨 Pending Invites</p>
          {sent.map(s=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${G.border}`}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:G.blueSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📧</div>
              <div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:G.text}}>{s.name}</p><p style={{fontSize:11,color:G.muted}}>{s.email}</p></div>
              <Badge color={G.orange}>Pending</Badge>
            </div>
          ))}
        </Card>
      )}

      {open&&(
        <Modal title="✉️ Invite a Friend" onClose={()=>setOpen(false)}>
          <p style={{fontSize:13,color:G.muted,marginBottom:18,marginTop:-12}}>Invite a friend to join ApexEduNexus and compete on the streak leaderboard.</p>
          <div style={{display:"grid",gap:14}}>
            <Input label="Friend's Name *" placeholder="e.g. John Doe" value={iName} onChange={e=>setIName(e.target.value)}/>
            <Input label="Friend's Email *" type="email" placeholder="friend@uni.edu" value={iEmail} onChange={e=>setIEmail(e.target.value)}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,marginTop:20}}>
            <BlueBtn full onClick={send} style={{padding:"12px",background:G.orange,boxShadow:"none"}}>Send Invite 📧</BlueBtn>
            <GrayBtn onClick={()=>setOpen(false)}>Cancel</GrayBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ACTIVITY LOG
═══════════════════════════════════════════════════════════════ */
function SectionActivity({activity,setSection}) {
  const icons={deadline:"📅",quiz:"🤖",streak:"🔥",brainteaser:"🧠",todo:"✅",cgpa:"📊"};
  const grouped=activity.reduce((acc,a)=>{
    const d=new Date(a.time).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
    if(!acc[d])acc[d]=[];acc[d].push(a);return acc;
  },{});
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <PageHeader onBack={()=>setSection("dashboard")} title="📈 Activity Log"/>
        <Badge color={G.blue}>{activity.length} events</Badge>
      </div>
      {Object.entries(grouped).map(([day,acts])=>(
        <div key={day} style={{marginBottom:20}}>
          <p style={{fontSize:11,fontWeight:700,color:G.muted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>{day}</p>
          <Card>
            {acts.map((a,i)=>(
              <div key={a.id} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<acts.length-1?`1px solid ${G.border}`:"none"}}>
                <div style={{width:34,height:34,borderRadius:10,background:`${a.color}12`,border:`1px solid ${a.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{icons[a.type]||"📌"}</div>
                <div style={{flex:1}}><p style={{fontSize:13,color:G.text}}>{a.msg}</p><p style={{fontSize:11,color:G.muted,marginTop:2}}>{new Date(a.time).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</p></div>
                <Badge color={a.color}>{a.type}</Badge>
              </div>
            ))}
          </Card>
        </div>
      ))}
      {activity.length===0&&<p style={{textAlign:"center",color:G.muted,padding:"60px 0"}}>No activity yet — start exploring!</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NOTIFICATIONS
═══════════════════════════════════════════════════════════════ */
function SectionNotifs({notif,setNotif,deadlines,email,setEmail,toast,setSection}) {
  const [em,setEm]=useState(email);
  return(
    <div>
      <PageHeader onBack={()=>setSection("dashboard")} title="🔔 Notifications"/>
      <div style={{maxWidth:520,display:"grid",gap:16}}>
        <Card>
          <p style={{fontSize:12,fontWeight:700,color:G.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>📧 Email Address</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <input style={{flex:1,minWidth:160,background:G.bg,border:`1.5px solid ${G.border}`,borderRadius:10,padding:"11px 14px",fontSize:14,color:G.text,outline:"none"}} value={em} onChange={e=>setEm(e.target.value)} placeholder="your@email.com"/>
            <BlueBtn small onClick={()=>{setEmail(em);toast("Email saved! ✅",G.green);}}>Save</BlueBtn>
          </div>
        </Card>
        <Card>
          <p style={{fontSize:12,fontWeight:700,color:G.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>⚙️ Alert Settings</p>
          <label style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",padding:"12px 0",borderBottom:`1px solid ${G.border}`,marginBottom:16}}>
            <input type="checkbox" checked={notif.enabled} onChange={e=>setNotif(p=>({...p,enabled:e.target.checked}))} style={{accentColor:G.blue,width:18,height:18}}/>
            <div><p style={{fontSize:14,fontWeight:600,color:G.text}}>Enable email notifications</p><p style={{fontSize:12,color:G.muted}}>Get alerts before deadlines are due</p></div>
          </label>
          <p style={{fontSize:13,color:G.muted,marginBottom:10}}>Alert me this many days before:</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[1,2,3,5,7].map(d=><button key={d} onClick={()=>setNotif(p=>({...p,days:d}))} style={{background:notif.days===d?G.blueSoft:"transparent",color:notif.days===d?G.blue:G.muted,border:notif.days===d?`1.5px solid rgba(37,99,235,0.25)`:`1px solid ${G.border}`,borderRadius:99,padding:"7px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>{d}d</button>)}
          </div>
        </Card>
        <Card>
          <p style={{fontSize:12,fontWeight:700,color:G.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>📋 Active Deadline Alerts</p>
          {deadlines.filter(d=>d.notify&&!d.done).map(d=>{
            const dy=daysLeft(d.due),c=dy<=3?G.red:dy<=7?G.orange:G.green;
            return(
              <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${G.border}`}}>
                <span style={{fontSize:16}}>📧</span>
                <div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:G.text}}>{d.title}</p><p style={{fontSize:12,color:G.muted}}>{d.course} · {fmtDate(d.due)}</p></div>
                <Badge color={c}>{dy<=0?"Overdue":`${dy}d`}</Badge>
              </div>
            );
          })}
          {deadlines.filter(d=>d.notify&&!d.done).length===0&&<p style={{color:G.muted,fontSize:13,textAlign:"center",padding:12}}>No active alerts</p>}
        </Card>
        {notif.enabled&&(
          <div style={{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:12,padding:"16px 18px"}}>
            <p style={{fontWeight:700,color:G.gold,marginBottom:6}}>📬 Summary</p>
            <p style={{fontSize:13,color:G.muted}}>Alerts go to: <strong style={{color:G.text}}>{em}</strong></p>
            <p style={{fontSize:13,color:G.muted,marginTop:4}}>{notif.days} day{notif.days>1?"s":""} before each deadline.</p>
          </div>
        )}
      </div>
    </div>
  );
}
