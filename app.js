const FIREBASE_CONFIG = window.FIREBASE_CONFIG || null;
const STORE_KEY = "toan-mach-data-v1";
const SESSION_KEY = "toan-mach-session-v1";
const errors = [
  ["KT", "Lỗi kiến thức", "Chưa nắm đúng khái niệm, định nghĩa, tính chất, công thức hoặc điều kiện áp dụng định lý; ví dụ nhầm điểm cực trị của hàm số với điểm cực trị của đồ thị."],
  ["TT", "Lỗi tính toán, biến đổi", "Đã chọn được hướng giải nhưng tính chưa chính xác: sai đạo hàm, sai dấu, sai phép biến đổi hoặc tính sai giới hạn."],
  ["PP", "Lỗi lựa chọn và vận dụng phương pháp", "Chưa chọn được phương pháp phù hợp với yêu cầu hoặc vận dụng phương pháp sai, thường gặp trong bài toán thực tế."],
  ["DG", "Lỗi đọc hiểu và xác định dữ liệu", "Đọc chưa kỹ đề, nhầm dữ kiện, chưa xác định đúng đại lượng cần tìm hoặc chuyển thông tin thực tế sang toán học chưa đúng."],
  ["SU", "Lỗi suy luận và lập luận", "Suy luận thiếu căn cứ, kết luận khi chưa đủ điều kiện hoặc bỏ sót trường hợp, nhất là ở bài vận dụng."],
  ["QT", "Lỗi quy trình giải toán", "Thiếu bước trong trình tự giải như xác định điều kiện, kiểm tra nghiệm, xét trường hợp đặc biệt hoặc kiểm tra kết quả."],
  ["MH", "Lỗi mô hình hóa toán học", "Chuyển tình huống thực tế sang biến, điều kiện, phương trình hoặc bất phương trình chưa đúng."]
];
const icons = {
  home:'<rect x="3" y="3" width="7" height="8" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="15" width="7" height="6" rx="1.5"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 7h8M8 11h7"/>',
  chart:'<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/><path d="M15 9h4v4"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
  calendar:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  spark:'<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z"/><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  close:'<path d="m18 6-12 12M6 6l12 12"/>'
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.file}</svg>`;
const sample = {
  users: [
    {id:"s1",name:"Minh Anh",email:"minhanh@example.com",role:"student",scores:[6.5,7.1,7.8,8.2,8.6],mistakes:[2,3,1,4,2,1,1]},
    {id:"s2",name:"Quang Huy",email:"quanghuy@example.com",role:"student",scores:[5.8,6.2,6.1,7.0],mistakes:[3,2,4,2,1,3,1]},
    {id:"s3",name:"Thu Hà",email:"thuha@example.com",role:"student",scores:[7.5,7.4,8.1,8.8],mistakes:[1,2,1,1,2,1,0]},
    {id:"s4",name:"Gia Bảo",email:"giabao@example.com",role:"student",scores:[4.8,5.6,6.4],mistakes:[4,2,5,3,3,2,2]}
  ],
  sets: [],
  assignments: [
    {id:"a1",title:"Ôn tập hàm số — Chuyên đề 1",questions:20,students:18,due:"12/10/2026",state:"Đang mở",sections:["Trắc nghiệm","Đúng / Sai","Trả lời ngắn"]},
    {id:"a2",title:"Nguyên hàm và tích phân",questions:10,students:24,due:"15/10/2026",state:"Đang mở",sections:["Trắc nghiệm","Đúng / Sai","Trả lời ngắn"]},
    {id:"a3",title:"Hình học không gian — Bài 2",questions:30,students:12,due:"09/10/2026",state:"Đã đóng",sections:["Trắc nghiệm","Đúng / Sai","Trả lời ngắn"]}
  ],
  questions: [],
  attempts: []
};
let data = loadData();
let session = loadSession();
let currentPage = "home";
let currentPractice = null;
let practiceReturnPage = "home";
let questionStart = Date.now();
let selectedStudent = null;
let pendingUpload = null;
let firebaseAuth = null;
let firebaseSdk = null;
let firebaseFirestoreSdk = null;
let firebaseFunctionsSdk = null;
let firebaseDb = null;
let firebaseFunctions = null;
let questionSetUnsubscribe = null;
let questionSetSyncGeneration = 0;
let attemptUnsubscribe = null;
let attemptSyncGeneration = 0;
let registeringFirebaseAccount = false;
let loginRole = "student";
let currentQuestionIndex = 0;
let mathRendererPromise = null;
let loginNotice = "";
let loginNoticeKind = "info";
let sessionNotice = "";
let loginInProgress = false;
let loginAttemptSequence = 0;
let pendingGoogleCredential = null;
let passwordResetUntil = 0;
let passwordResetTimer = null;

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (saved) return {...sample,...saved,users: saved.users?.length ? saved.users : sample.users};
  } catch (error) { console.warn("Không đọc được dữ liệu đã lưu.", error); }
  return structuredClone(sample);
}
function saveData() {
  const persisted=session?.source==="firebase"
    ?{...data,users:[],sets:[],questions:[],assignments:[]}
    :data;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(persisted)); }
  catch(error) {
    console.error("Không thể lưu dữ liệu trên trình duyệt.", error);
    toast("Không đủ dung lượng lưu trên trình duyệt. Hãy giảm dung lượng dữ liệu hoặc ảnh.");
    return false;
  }
  return true;
}
function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
}
function setSession(user) {
  if(attemptUnsubscribe&&(!user||session?.id!==user.id||session?.source!==user.source)) {
    attemptUnsubscribe();
    attemptUnsubscribe=null;
    attemptSyncGeneration++;
  }
  session = user;
  if(user)loginNotice="";
  if(user?.source==="firebase"&&user.role==="student") {
    data.sets=[];
    data.questions=[];
  }
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user)); else localStorage.removeItem(SESSION_KEY);
  if(!user&&questionSetUnsubscribe) {
    questionSetUnsubscribe();
    questionSetUnsubscribe=null;
    questionSetSyncGeneration++;
  }
  render();
  if(user?.source==="firebase") {
    void loadFirebaseAssignments();
    void loadFirebaseQuestionSets();
    void loadFirebaseAttempts();
  }
}
async function configureFirebaseAuth() {
  if (firebaseAuth) return firebaseAuth;
  const [appSdk, authSdk] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
  ]);
  firebaseSdk = authSdk;
  firebaseAuth = authSdk.getAuth(appSdk.initializeApp(FIREBASE_CONFIG));
  await authSdk.setPersistence(firebaseAuth, authSdk.browserLocalPersistence);
  return firebaseAuth;
}
async function configureFirestore() {
  await configureFirebaseAuth();
  if(firebaseDb)return firebaseDb;
  firebaseFirestoreSdk=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
  firebaseSdk={...firebaseSdk,...firebaseFirestoreSdk};
  firebaseDb=firebaseFirestoreSdk.initializeFirestore(firebaseAuth.app,{
    experimentalAutoDetectLongPolling:true
  });
  return firebaseDb;
}
async function configureFirebaseFunctions() {
  await configureFirebaseAuth();
  if(firebaseFunctions)return firebaseFunctions;
  firebaseFunctionsSdk=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js");
  firebaseSdk={...firebaseSdk,...firebaseFunctionsSdk};
  firebaseFunctions=firebaseFunctionsSdk.getFunctions(firebaseAuth.app);
  return firebaseFunctions;
}
async function firebaseProfile(user,{createStudentProfile=false}={}) {
  await configureFirestore();
  const profileRef=firebaseSdk.doc(firebaseDb,"users",user.uid);
  let profile;
  try { profile=await firebaseRequest(firebaseSdk.getDoc(profileRef)); }
  catch(error) { throw firebaseProfileError(error); }
  if(!profile.exists()&&createStudentProfile&&user.email) {
    try {
      await firebaseRequest(firebaseSdk.setDoc(profileRef,{
        displayName:user.displayName||user.email.split("@")[0],
        email:user.email,
        role:"student",
        createdAt:new Date().toISOString()
      }));
      profile=await firebaseRequest(firebaseSdk.getDoc(profileRef));
    } catch(error) {
      console.error("Could not create the Firebase student profile.",error);
      throw firebaseProfileError(error);
    }
  }
  if(!profile.exists())throw new Error("Tài khoản Firebase đã tồn tại nhưng chưa có hồ sơ Firestore. Nếu đây là tài khoản học sinh, hãy kiểm tra Firestore Database và rules rồi đăng nhập lại; tài khoản giáo viên cần được quản trị viên tạo hồ sơ.");
  const info=profile.data();
  if(user.email&&info.email!==user.email) {
    try { await firebaseRequest(firebaseSdk.updateDoc(profileRef,{email:user.email})); }
    catch(error) { throw firebaseProfileError(error); }
  }
  if(info.accountStatus==="pendingDeletion")throw new Error("Tài khoản này đang chờ xóa. Hãy nhờ giáo viên khôi phục trước thời hạn 24 giờ.");
  if(info.accountStatus==="deleting")throw new Error("Đã hết hạn khôi phục; hệ thống đang tiến hành xóa tài khoản này.");
  if(info.role!=="student"&&info.role!=="teacher"&&info.role!=="owner")throw new Error("Hồ sơ Firebase có vai trò không hợp lệ.");
  return {id:user.uid,email:user.email,name:info.displayName||user.displayName||user.email?.split("@")[0],role:info.role,source:"firebase"};
}
function firebaseRequest(request) {
  return new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>{
      const error=new Error("Firestore không phản hồi trong 6 giây. Tạo Firestore Database và thử lại.");
      error.code="unavailable";
      reject(error);
    },6000);
    request.then(value=>{clearTimeout(timeout);resolve(value);},error=>{clearTimeout(timeout);reject(error);});
  });
}
function firebaseProfileError(error) {
  const wrapped=new Error(firebaseFirestoreError(error));
  wrapped.code=error.code;
  return wrapped;
}
function userName() { return session?.name || session?.email?.split("@")[0] || "Bạn"; }
function initial(name) { return (name || "?").split(/\s+/).map(x=>x[0]).slice(-2).join("").toUpperCase(); }
function isTeacher() { return session?.role === "teacher"||session?.role==="owner"; }
function toast(message) {
  document.querySelector(".toast")?.remove();
  const el=document.createElement("div");el.className="toast";el.textContent=message;document.body.append(el);
  setTimeout(()=>el.remove(),3000);
}
function avg(values) { return values?.length ? (values.reduce((a,b)=>a+b,0)/values.length).toFixed(1) : "—"; }
function safe(text) { return String(text ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function userStats(user) {
  const attempts = data.attempts.filter(a=>a.userId===user.id);
  const scores = attempts.length ? attempts.map(a=>a.score).filter(Number.isFinite) : user.scores || [];
  const counts = [...(user.mistakes||[0,0,0,0,0,0,0])];
  for(const a of attempts) for(const [i,n] of (a.mistakes||[]).entries()) counts[i]=(counts[i]||0)+n;
  return {attempts,scores,counts,average:avg(scores),latest:scores.at(-1)||0};
}
async function loadFirebaseAssignments() {
  if(!session?.id||session.source!=="firebase")return false;
  const userId=session.id;
  try {
    await configureFirestore();
    const assignments=firebaseSdk.collection(firebaseDb,"assignments");
    const query=isTeacher()
      ?firebaseSdk.query(assignments,firebaseSdk.where("teacherId","==",userId))
      :firebaseSdk.query(assignments,firebaseSdk.where("studentIds","array-contains",userId));
    const snapshot=await firebaseRequest(firebaseSdk.getDocs(query));
    if(session?.id!==userId)return false;
    const remote=snapshot.docs.map(document=>({id:document.id,...document.data()}));
    const remoteIds=new Set(remote.map(assignment=>assignment.id));
    const localOnly=(data.assignments||[]).filter(assignment=>!remoteIds.has(assignment.id)&&(
      isTeacher()?(!assignment.teacherId||assignment.teacherId===userId)
        :(assignment.studentIds||[]).includes(userId)
    ));
    data.assignments=[...remote,...localOnly];
    saveData();
    render();
    return true;
  } catch(error) {
    console.error("Could not load Firebase assignments.",error);
    toast(`Không tải được đề đã giao: ${firebaseFirestoreError(error)}`);
    return false;
  }
}
function firebaseAttemptPayload(attempt,userId) {
  const id=String(attempt?.id||"");
  if(!/^attempt-[A-Za-z0-9_-]{1,120}$/.test(id))throw new Error("Mã lượt làm bài không hợp lệ.");
  const payload={
    id,
    userId,
    title:String(attempt.title||"Bài ôn tập").slice(0,500),
    source:attempt.source==="personal"?"personal":"teacher",
    score:Number.isFinite(attempt.score)?attempt.score:null,
    correct:Math.max(0,Math.floor(Number(attempt.correct)||0)),
    total:Math.max(0,Math.floor(Number(attempt.total)||0)),
    graded:Math.max(0,Math.floor(Number(attempt.graded)||0)),
    duration:Math.max(0,Math.floor(Number(attempt.duration)||0)),
    createdAt:typeof attempt.createdAt==="string"?attempt.createdAt:new Date().toISOString(),
    mistakes:errors.map((_,index)=>Math.max(0,Math.floor(Number(attempt.mistakes?.[index])||0))),
    questionTimes:Object.fromEntries(Object.entries(attempt.questionTimes||{}).filter(([,seconds])=>Number.isFinite(seconds)&&seconds>=0))
  };
  if(payload.graded>payload.total||payload.correct>payload.graded)throw new Error("Kết quả lượt làm bài không hợp lệ.");
  if(new Blob([JSON.stringify(payload)]).size>850*1024)throw new Error("Kết quả bài làm vượt giới hạn lưu an toàn.");
  return payload;
}
async function saveFirebaseAttempt(attempt,userId=session?.id) {
  if(session?.source!=="firebase"||!userId||attempt?.userId!==userId)return false;
  await configureFirestore();
  const payload=firebaseAttemptPayload(attempt,userId);
  const ref=firebaseSdk.doc(firebaseDb,"attempts",payload.id);
  const existing=await firebaseRequest(firebaseSdk.getDoc(ref));
  if(!existing.exists())await firebaseRequest(firebaseSdk.setDoc(ref,payload));
  return true;
}
function sortAttempts(attempts) {
  return attempts.slice().sort((a,b)=>Date.parse(a.createdAt||"")-Date.parse(b.createdAt||"")||String(a.id).localeCompare(String(b.id)));
}
async function loadFirebaseAttempts() {
  if(!session?.id||session.source!=="firebase")return false;
  const userId=session.id,staffView=isTeacher(),generation=++attemptSyncGeneration;
  attemptUnsubscribe?.();
  attemptUnsubscribe=null;
  const localAttempts=data.attempts.filter(attempt=>attempt.userId===userId);
  data.attempts=sortAttempts(localAttempts);
  saveData();
  if(!currentPractice&&!document.querySelector(".modal-backdrop"))render();
  try {
    await configureFirestore();
    if(generation!==attemptSyncGeneration||session?.id!==userId)return false;
    for(const attempt of localAttempts) {
      try { await saveFirebaseAttempt(attempt,userId); }
      catch(error) { console.warn("A locally saved attempt will be retried later.",error); }
    }
    if(generation!==attemptSyncGeneration||session?.id!==userId)return false;
    const attempts=firebaseSdk.collection(firebaseDb,"attempts");
    const query=staffView?attempts:firebaseSdk.query(attempts,firebaseSdk.where("userId","==",userId));
    attemptUnsubscribe=firebaseSdk.onSnapshot(query,snapshot=>{
      if(generation!==attemptSyncGeneration||session?.id!==userId)return;
      const remote=snapshot.docs.map(document=>({...document.data()}));
      const remoteIds=new Set(remote.map(attempt=>attempt.id));
      const localFallback=data.attempts.filter(attempt=>attempt.userId===userId&&!remoteIds.has(attempt.id));
      data.attempts=sortAttempts([...remote,...localFallback]);
      saveData();
      if(!currentPractice&&!document.querySelector(".modal-backdrop"))render();
    },error=>{
      console.error("Firebase attempt listener failed.",error);
      toast(`Không đồng bộ được lịch sử làm bài: ${firebaseFirestoreError(error)}`);
    });
    return true;
  } catch(error) {
    console.error("Could not sync Firebase attempts.",error);
    toast(`Lịch sử vẫn được giữ trên thiết bị nhưng chưa đồng bộ: ${firebaseFirestoreError(error)}`);
    return false;
  }
}
async function loadFirebaseQuestionSets() {
  if(!session?.id||session.source!=="firebase")return false;
  const userId=session.id;
  const generation=++questionSetSyncGeneration;
  questionSetUnsubscribe?.();
  questionSetUnsubscribe=null;
  try {
    await configureFirestore();
    const sets=firebaseSdk.collection(firebaseDb,"questionSets");
    const query=isTeacher()
      ?firebaseSdk.query(sets,firebaseSdk.where("status","==","published"))
      :firebaseSdk.query(sets,firebaseSdk.where("status","==","published"),firebaseSdk.where("hiddenFromStudents","==",false));
    if(isTeacher()) {
      const legacySets=data.sets.filter(set=>!set.teacherId&&Array.isArray(set.questions)&&set.questions.length);
      for(const legacySet of legacySets) {
        try {
          const migrated=await saveQuestionSet(legacySet);
          const localSet=data.sets.find(set=>set.id===migrated.id);
          if(localSet)Object.assign(localSet,migrated);
        } catch(error) {
          console.error("Could not migrate a legacy local question set.",error);
          toast(`Chưa đồng bộ được bộ đề cũ “${legacySet.title}”: ${firebaseFirestoreError(error)}`);
          break;
        }
      }
    }
    const publishSnapshot=async snapshot=>{
      const published=snapshot.docs.filter(document=>document.data().status==="published");
      const remote=await Promise.all(published.map(async document=>{
        const setRef=firebaseSdk.collection(document.ref,"questions");
        const questions=await firebaseSdk.getDocs(setRef);
        return {...document.data(),id:document.id,questions:questions.docs.map(question=>({...question.data(),id:question.id}))};
      }));
      if(generation!==questionSetSyncGeneration||session?.id!==userId)return;
      // A Firebase account must use the shared Firestore bank as its source of truth.
      // Local-only sets are device-specific and made the library look different across devices.
      data.sets=isTeacher()?remote:remote.filter(set=>!set.hiddenFromStudents);
      data.questions=data.sets.flatMap(set=>(set.questions||[]).map(question=>({...question,setId:set.id})));
      if(!currentPractice&&!document.querySelector(".modal-backdrop"))render();
    };
    const snapshot=await firebaseRequest(firebaseSdk.getDocs(query));
    if(isTeacher()) {
      const legacyVisibility=snapshot.docs.filter(document=>document.data().hiddenFromStudents===undefined);
      await Promise.all(legacyVisibility.map(document=>firebaseRequest(firebaseSdk.updateDoc(document.ref,{hiddenFromStudents:false}))));
    }
    const currentSnapshot=isTeacher()&&snapshot.docs.some(document=>document.data().hiddenFromStudents===undefined)
      ?await firebaseRequest(firebaseSdk.getDocs(query)):snapshot;
    await publishSnapshot(currentSnapshot);
    if(generation!==questionSetSyncGeneration||session?.id!==userId)return false;
    questionSetUnsubscribe=firebaseSdk.onSnapshot(query,snapshot=>{
      void publishSnapshot(snapshot).catch(error=>{
        console.error("Could not sync Firebase question bank.",error);
        toast(`Không đồng bộ được kho câu hỏi: ${firebaseFirestoreError(error)}`);
      });
    },error=>{
      console.error("Firebase question bank listener failed.",error);
      toast(`Không đồng bộ được kho câu hỏi: ${firebaseFirestoreError(error)}`);
    });
    return true;
  } catch(error) {
    console.error("Could not load Firebase question bank.",error);
    toast(`Không tải được kho câu hỏi: ${firebaseFirestoreError(error)}`);
    return false;
  }
}
function render() {
  const root=document.querySelector("#app");
  if(!session) { root.innerHTML=loginView(); bindLogin(); showLoginNotice(); return; }
  if(!isTeacher() && ["students","errors","teacher-exams"].includes(currentPage)) currentPage="home";
  root.innerHTML=`
    <div class="shell">
      ${sidebar()}
      <main class="main">
        <header class="topbar">
          <div class="breadcrumb"><button class="icon-button mobile-menu" data-action="menu">${icon("menu")}</button> Không gian học tập <span> / </span> <b>${pageTitle()}</b></div>
          <div class="top-actions"><div class="search">${icon("search")}<input id="global-search" placeholder="Tìm kiếm..." /></div><button class="icon-button" title="Thông báo">${icon("bell")}<i class="notification-dot"></i></button></div>
        </header>
        ${pageView()}
        ${sessionNotice?`<div class="notice session-notice" role="status">${safe(sessionNotice)}</div>`:""}
      </main>
      ${mobileNav()}
    </div>`;
  bindApp();
  void typesetMath(root);
}
function typesetMath(root) {
  if(!root||(!root.querySelector("math")&&!/(?:\$|\\\(|\\\[|\\begin\{)/.test(root.textContent)))return;
  if(!mathRendererPromise) {
    window.MathJax=window.MathJax||{
      tex:{inlineMath:[["$","$"],["\\(","\\)"]],displayMath:[["$$","$$"],["\\[","\\]"]],packages:{"[+]":["ams"]}},
      options:{skipHtmlTags:["script","noscript","style","textarea","pre","code"]},
      startup:{typeset:false}
    };
    mathRendererPromise=new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      script.src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
      script.async=true;
      script.onload=()=>resolve(window.MathJax);
      script.onerror=()=>reject(new Error("Không tải được bộ hiển thị công thức toán."));
      document.head.append(script);
    });
  }
  void mathRendererPromise.then(async mathJax=>{
    await mathJax.startup.promise;
    await mathJax.typesetPromise([root]);
  }).catch(error=>{
    console.error("Math typesetting failed.",error);
    toast(error.message);
  });
}
function loginView() {
  return `<div class="login-screen">
    <section class="login-art">
      <div class="login-logo"><span class="brand-mark">${icon("spark")}</span> Toán học</div>
      <div class="login-message"><div class="eyebrow">HỌC ĐÚNG CHỖ, TIẾN BỘ MỖI NGÀY</div><h1>Mỗi bài toán,<br/>một bước tiến.</h1><p>Luyện tập thông minh, hiểu rõ điểm mạnh và tìm đúng phần kiến thức cần cải thiện.</p><div class="login-math">∫ f(x)dx &nbsp; △ ABC &nbsp; x² + y²</div></div>
      <div class="login-quote">Không gian luyện tập Toán dành riêng cho bạn · 2026</div>
    </section>
    <section class="login-panel"><form class="login-form" id="login-form">
      <div class="eyebrow">CHÀO MỪNG BẠN TRỞ LẠI</div><h2>Đăng nhập</h2><p>Chọn vai trò để vào không gian học tập phù hợp.</p>
      <div class="role-switch"><button type="button" data-role="student" class="${loginRole==="student"?"active":""}">Học sinh</button><button type="button" data-role="teacher" class="${loginRole==="teacher"?"active":""}">Giáo viên</button></div>
      <div class="login-status" id="login-status" role="status" aria-live="polite" ${loginNotice?"":"hidden"}>${safe(loginNotice)}</div>
      <div class="field"><label for="email">Email</label><input id="email" type="email" placeholder="ten@email.com" required autocomplete="username" /></div>
      <div class="field"><label for="password">Mật khẩu</label><input id="password" type="password" placeholder="Nhập mật khẩu" required autocomplete="current-password" /></div>
      <button class="text-button password-reset" type="button" id="reset-password">Quên mật khẩu?</button>
      <button class="btn login-submit" type="submit">Đăng nhập <span aria-hidden="true">→</span></button>
      <div class="login-divider"><span>hoặc</span></div>
      <button class="google-login" type="button" id="google-login"><span class="google-mark" aria-hidden="true">G</span> Đăng nhập bằng Google</button>
      ${FIREBASE_CONFIG&&loginRole==="student"?`<button class="text-button register-link" type="button" id="register">Tạo tài khoản học sinh</button>`:""}
      <div class="firebase-note">${FIREBASE_CONFIG?"Dùng Google hoặc email cùng mật khẩu riêng của Toán học. Tài khoản giáo viên chỉ đăng nhập; quản trị viên cấp quyền.":"Firebase chưa được cấu hình nên hiện không thể đăng nhập."}</div>
      <div class="login-foot">Bằng cách tiếp tục, bạn đồng ý với điều khoản sử dụng<br/>và chính sách bảo mật của Toán học.</div>
    </form></section></div>`;
}
function showLoginNotice() {
  const status=document.querySelector("#login-status");
  if(!status)return;
  status.textContent=loginNotice;
  status.dataset.kind=loginNoticeKind;
  status.hidden=!loginNotice;
  document.querySelector("#login-form")?.classList.toggle("is-busy",loginNoticeKind==="loading");
  status.classList.remove("feedback-shake");
  if(loginNoticeKind==="error")requestAnimationFrame(()=>status.classList.add("feedback-shake"));
}
function setLoginFeedback(message,kind="info") {
  loginNotice=message;
  loginNoticeKind=kind;
  showLoginNotice();
}
async function completeFirebaseLogin(user) {
  setLoginFeedback("Đã xác thực tài khoản. Đang kiểm tra hồ sơ và quyền truy cập…","loading");
  let profile;
  try {
    profile=await firebaseProfile(user,{createStudentProfile:loginRole==="student"});
  } catch(error) {
    if(firebaseAuth.currentUser?.uid===user.uid)await firebaseSdk.signOut(firebaseAuth);
    throw error;
  }
  if(profile.role==="owner"?loginRole!=="teacher":profile.role!==loginRole) {
    await firebaseSdk.signOut(firebaseAuth);
    setLoginFeedback(`Tài khoản này được cấu hình là ${profile.role==="owner"?"chủ sở hữu":profile.role==="teacher"?"giáo viên":"học sinh"}. Hãy chọn đúng vai trò đăng nhập.`,"error");
    return false;
  }
  setSession(profile);
  if(profile.role==="teacher"||profile.role==="owner")void loadFirebaseStudents();
  sessionNotice="Đăng nhập thành công.";
  render();
  setTimeout(()=>{sessionNotice="";if(session)render();},3500);
  return true;
}
function bindLogin() {
  document.querySelectorAll("[data-role]").forEach(b=>b.onclick=()=>{
    const email=document.querySelector("#email").value,password=document.querySelector("#password").value;
    loginRole=b.dataset.role;loginNotice="";loginNoticeKind="info";render();
    document.querySelector("#email").value=email;
    document.querySelector("#password").value=password;
  });
  document.querySelector("#reset-password")?.addEventListener("click",async()=>{
    const email=document.querySelector("#email").value.trim();
    if(!email){setLoginFeedback("Nhập email để nhận liên kết khôi phục mật khẩu.","error");document.querySelector("#email").focus();return;}
    const button=document.querySelector("#reset-password");
    const remaining=Math.ceil((passwordResetUntil-Date.now())/1000);
    if(remaining>0) {
      setLoginFeedback(`Bạn vừa yêu cầu gửi thư. Vui lòng đợi ${remaining} giây rồi mới gửi lại; kiểm tra cả Spam/Thư rác, Quảng cáo và Tất cả thư.`,"info");
      return;
    }
    button.disabled=true;
    button.textContent="Đang gửi…";
    setLoginFeedback(`Đang yêu cầu Firebase gửi liên kết đến ${email}…`,"loading");
    try {
      if(!FIREBASE_CONFIG)throw new Error("Firebase chưa được cấu hình cho website này.");
      const auth=await configureFirebaseAuth();
      await firebaseSdk.sendPasswordResetEmail(auth,email);
      passwordResetUntil=Date.now()+60000;
      setLoginFeedback(`Firebase đã nhận yêu cầu gửi liên kết đến ${email}, nhưng không thể xác nhận thư đã được Gmail chuyển phát. Đợi vài phút rồi kiểm tra Inbox, Spam/Thư rác, Quảng cáo và Tất cả thư. Có thể gửi lại sau 60 giây.`,"success");
      if(passwordResetTimer)clearInterval(passwordResetTimer);
      passwordResetTimer=setInterval(()=>{
        const currentButton=document.querySelector("#reset-password");
        const seconds=Math.ceil((passwordResetUntil-Date.now())/1000);
        if(!currentButton)return;
        if(seconds>0) {
          currentButton.disabled=true;
          currentButton.textContent=`Gửi lại sau ${seconds}s`;
        } else {
          currentButton.disabled=false;
          currentButton.textContent="Gửi lại liên kết";
          clearInterval(passwordResetTimer);
          passwordResetTimer=null;
        }
      },1000);
      button.textContent="Gửi lại sau 60s";
    } catch(error) {
      setLoginFeedback(firebaseError(error),"error");
      button.disabled=false;
      button.textContent="Gửi lại liên kết";
    }
  });
  document.querySelector("#google-login")?.addEventListener("click",async()=>{
    if(!FIREBASE_CONFIG){loginNotice="Firebase chưa được cấu hình cho website này.";showLoginNotice();return;}
    const button=document.querySelector("#google-login");
    const loginButton=document.querySelector(".login-submit");
    button.disabled=true;button.innerHTML='<span class="login-spinner" aria-hidden="true"></span> Đang kết nối Google…';
    if(loginButton)loginButton.disabled=true;
    loginInProgress=true;loginAttemptSequence++;
    setLoginFeedback("Đang mở cửa sổ xác thực Google…","loading");
    try {
      const auth=await configureFirebaseAuth();
      const provider=new firebaseSdk.GoogleAuthProvider();
      provider.setCustomParameters({prompt:"select_account"});
      const result=await firebaseSdk.signInWithPopup(auth,provider);
      pendingGoogleCredential=null;
      await completeFirebaseLogin(result.user);
    } catch(error) {
      if(error.code==="auth/account-exists-with-different-credential") {
        pendingGoogleCredential=firebaseSdk.GoogleAuthProvider.credentialFromError(error);
        if(pendingGoogleCredential) {
          const email=error.customData?.email;
          if(email)document.querySelector("#email").value=email;
          setLoginFeedback("Email Google này đã có tài khoản mật khẩu. Nhập mật khẩu Toán học vào ô trên rồi bấm Đăng nhập để liên kết hai cách.","error");
        } else setLoginFeedback("Email Google đã có tài khoản đăng nhập khác. Hãy đăng nhập bằng phương thức cũ trước.","error");
      } else setLoginFeedback(firebaseError(error),"error");
    } finally {
      loginInProgress=false;
      const currentButton=document.querySelector("#google-login");
      if(currentButton){currentButton.disabled=false;currentButton.innerHTML='<span class="google-mark" aria-hidden="true">G</span> Đăng nhập bằng Google';}
      if(loginButton)loginButton.disabled=false;
      if(!session&&loginNoticeKind==="loading")setLoginFeedback("Không hoàn tất đăng nhập Google. Hãy thử lại.","error");
    }
  });
  document.querySelector("#login-form").onsubmit=async e=>{
    e.preventDefault();
    if(loginInProgress)return;
    loginInProgress=true;
    loginAttemptSequence++;
    const loginSubmit=document.querySelector(".login-submit");
    if(loginSubmit) {
      loginSubmit.disabled=true;
      loginSubmit.innerHTML='<span class="login-spinner" aria-hidden="true"></span> Đang xác thực…';
    }
    setLoginFeedback("Đang xác thực tài khoản với Firebase…","loading");
    e.preventDefault();const email=document.querySelector("#email").value.trim();const password=document.querySelector("#password").value;
    if(FIREBASE_CONFIG) {
      try {
        const auth=await configureFirebaseAuth();
        const credential=await firebaseSdk.signInWithEmailAndPassword(auth,email,password);
        if(pendingGoogleCredential) {
          await firebaseSdk.linkWithCredential(credential.user,pendingGoogleCredential);
          pendingGoogleCredential=null;
        }
        await completeFirebaseLogin(credential.user);
      } catch(error) {
        const message=error.code==="auth/invalid-credential"&&pendingGoogleCredential
          ?"Mật khẩu chưa đúng. Nhập đúng mật khẩu Toán học để liên kết Google với tài khoản này."
          :firebaseError(error);
        setLoginFeedback(message,"error");
      } finally {
        loginInProgress=false;
        const submit=document.querySelector(".login-submit");
        if(submit) {
          submit.disabled=false;
          submit.innerHTML='Đăng nhập <span aria-hidden="true">→</span>';
        }
        if(!session&&loginNoticeKind==="loading")setLoginFeedback("Đăng nhập chưa hoàn tất. Hãy thử lại.","error");
      }
      return;
    }
    loginInProgress=false;
    setLoginFeedback("Firebase chưa được cấu hình nên không thể xác thực email/mật khẩu.","error");
  };
  document.querySelector("#register")?.addEventListener("click",async()=>{
    const email=document.querySelector("#email").value.trim(),password=document.querySelector("#password").value;
    if(loginRole!=="student"){setLoginFeedback("Tài khoản giáo viên chỉ được đăng nhập; không thể tự đăng ký.","error");return;}
    if(!email||!password){setLoginFeedback("Nhập email và mật khẩu để tạo tài khoản.","error");return;}
    let createdUser=null;
    registeringFirebaseAccount=true;
    const registerButton=document.querySelector("#register");
    if(registerButton){registerButton.disabled=true;registerButton.textContent="Đang tạo tài khoản…";}
    setLoginFeedback("Đang tạo tài khoản học sinh trên Firebase…","loading");
    try {const auth=await configureFirebaseAuth();
      await configureFirestore();
      const credential=await firebaseSdk.createUserWithEmailAndPassword(auth,email,password);
      createdUser=credential.user;
      await firebaseSdk.setDoc(firebaseSdk.doc(firebaseDb,"users",credential.user.uid),{displayName:email.split("@")[0],email:credential.user.email,role:"student",createdAt:new Date().toISOString()});
      setSession({id:credential.user.uid,email:credential.user.email,name:email.split("@")[0],role:"student",source:"firebase"});
    } catch(error) {
      if(createdUser)await firebaseSdk.signOut(firebaseAuth).catch(signOutError=>console.error("Could not sign out after profile creation failed.",signOutError));
      setLoginFeedback(error.code==="auth/email-already-in-use"?"Email này đã có tài khoản Firebase. Hãy đăng nhập thay vì tạo lại.":firebaseError(error),"error");
    } finally {
      registeringFirebaseAccount=false;
      if(registerButton){registerButton.disabled=false;registerButton.textContent="Tạo tài khoản học sinh";}
      if(!session&&loginNoticeKind==="loading")setLoginFeedback("Chưa thể tạo tài khoản. Hãy thử lại.","error");
    }
  });
}
function firebaseError(error) {
  const messages={
    "auth/invalid-credential":"Email hoặc mật khẩu chưa chính xác.",
    "auth/email-already-in-use":"Email này đã được đăng ký.",
    "auth/user-not-found":"Không tìm thấy tài khoản email/mật khẩu. Nếu tài khoản chỉ dùng Google, hãy đăng nhập bằng Google.",
    "auth/weak-password":"Mật khẩu cần ít nhất 6 ký tự.",
    "auth/invalid-email":"Địa chỉ email không hợp lệ.",
    "auth/operation-not-allowed":"Firebase project chưa bật phương thức đăng nhập đang chọn trong Authentication → Sign-in method.",
    "auth/network-request-failed":"Không kết nối được Firebase. Kiểm tra Internet và thử lại.",
    "auth/too-many-requests":"Firebase tạm giới hạn yêu cầu. Hãy chờ vài phút rồi thử lại.",
    "auth/quota-exceeded":"Dự án Firebase đã vượt hạn mức gửi email hiện tại. Kiểm tra trạng thái và hạn mức trong Firebase Console.",
    "auth/popup-blocked":"Trình duyệt đã chặn cửa sổ đăng nhập Google. Cho phép pop-up cho website rồi thử lại.",
    "auth/popup-closed-by-user":"Cửa sổ Google đã đóng trước khi đăng nhập hoàn tất.",
    "auth/unauthorized-domain":"Tên miền hiện tại chưa được thêm vào Firebase Authentication → Settings → Authorized domains.",
    "auth/account-exists-with-different-credential":"Email này đã dùng một cách đăng nhập khác. Đăng nhập bằng phương thức cũ để liên kết Google.",
    "auth/credential-already-in-use":"Tài khoản Google này đã được liên kết với một tài khoản Toán học khác.",
    "permission-denied":"Firebase Authentication đã nhận tài khoản nhưng Firestore từ chối hồ sơ. Hãy tạo Firestore Database, Publish firestore.rules rồi đăng nhập lại.",
    "failed-precondition":"Firestore chưa được khởi tạo. Tạo Firestore Database trong Firebase Console rồi thử lại.",
    "not-found":"Không tìm thấy Firestore Database của project. Tạo database trong Firebase Console rồi thử lại.",
    "unavailable":"Firebase đã xác thực tài khoản nhưng dịch vụ Firestore không phản hồi (unavailable). Đây không nhất thiết là lỗi Internet: trong Firebase Console hãy kiểm tra đúng project toan-199ee, Firestore Database đã được tạo, Firestore API đang bật và trạng thái dịch vụ. Nếu đang dùng VPN, proxy hoặc tiện ích chặn mạng, hãy thử tắt tạm hoặc đổi mạng. Sau đó thử lại."
  };
  return messages[error.code]||`Không thể đăng nhập Firebase: ${error.message}`;
}
function firebaseFirestoreError(error) {
  const messages={
    "permission-denied":"Firestore từ chối thao tác. Kiểm tra vai trò tài khoản và triển khai firestore.rules mới nhất.",
    "unavailable":"Firestore không phản hồi (unavailable). Kiểm tra Firestore Database và Firestore API trong đúng project toan-199ee; mạng/VPN/proxy có thể chặn riêng kết nối Firestore dù các dịch vụ Internet khác vẫn hoạt động.",
    "failed-precondition":"Firestore chưa được khởi tạo. Tạo Firestore Database trong Firebase Console rồi đăng nhập lại.",
    "not-found":"Không tìm thấy Firestore Database của project. Tạo database trong Firebase Console rồi đăng nhập lại.",
    "client-offline":"Firestore đang ngoại tuyến. Kiểm tra kết nối Internet rồi đăng nhập lại."
  };
  if(messages[error.code])return `${messages[error.code]}${error.message?` (${error.message})`:""}`;
  return `Không thể truy cập Firestore: ${error.message}`;
}
function sidebar() {
  const navs=isTeacher()
    ? [["home","home","Tổng quan"],["teacher-exams","book","Đề ôn tập"],["students","users","Học sinh"],["compare","chart","So sánh tiến bộ"],["errors","target","7 nhóm lỗi"],["library","upload","Kho câu hỏi"]]
    : [["home","home","Đề ôn tập"],["progress","chart","Lộ trình cá nhân"],["compare","users","So sánh tiến bộ"],["personal","target","Ôn tập cá nhân hóa"],["library","upload","Kho câu hỏi"]];
  return `<aside class="sidebar"><div class="brand"><span class="brand-mark">${icon("spark")}</span> Toán học</div><div class="nav-label">KHÔNG GIAN HỌC</div><nav class="nav">${navs.map(([key,ico,label])=>`<button data-page="${key}" class="${currentPage===key?"active":""}">${icon(ico)}<span>${label}</span>${key==="errors"&&isTeacher()?'<span class="nav-badge">7</span>':""}</button>`).join("")}</nav><div class="sidebar-bottom"><div class="help-card"><strong>Cần hỗ trợ?</strong><p>Khám phá mẹo học tập và hướng dẫn sử dụng nền tảng.</p><button data-action="help">Xem hướng dẫn →</button></div><div class="profile"><div class="avatar">${initial(userName())}</div><div class="profile-copy"><strong>${safe(userName())}</strong><span>${session?.role==="owner"?"Chủ sở hữu":isTeacher()?"Giáo viên":"Học sinh"}</span></div><button class="logout" data-action="logout" title="Đăng xuất">${icon("logout")}</button></div></div></aside>`;
}
function mobileNav() {
  const entries=isTeacher()?[["home","home","Trang chủ"],["teacher-exams","book","Đề thi"],["students","users","Học sinh"],["compare","chart","Tiến bộ"]]:[["home","book","Đề ôn tập"],["progress","chart","Lộ trình"],["personal","target","Tự luyện"],["library","upload","Kho đề"]];
  return `<nav class="mobile-bottom">${entries.map(([key,ico,label])=>`<button data-page="${key}" class="${currentPage===key?"active":""}">${icon(ico)}${label}</button>`).join("")}</nav>`;
}
function pageTitle() {
  return ({home:isTeacher()?"Tổng quan":"Đề ôn tập",progress:"Lộ trình cá nhân",compare:"So sánh tiến bộ",personal:"Ôn tập cá nhân hóa",students:"Danh sách học sinh",errors:"7 nhóm lỗi thường gặp",library:"Kho câu hỏi", "teacher-exams":"Quản lý đề ôn tập"})[currentPage]||"Tổng quan";
}
function pageView() {
  if(currentPage==="home") return isTeacher()?teacherHome():studentHome();
  if(currentPage==="progress") return progressPage(session);
  if(currentPage==="compare") return comparePage();
  if(currentPage==="personal") return personalPage();
  if(currentPage==="students") return studentsPage();
  if(currentPage==="errors") return errorsPage();
  if(currentPage==="library") return libraryPage();
  if(currentPage==="teacher-exams") return teacherExamsPage();
  return studentHome();
}
function welcome(title,subtitle,action="") {
  return `<div class="welcome-row"><div><div class="eyebrow">${isTeacher()?"KHÔNG GIAN GIÁO VIÊN":"KHÔNG GIAN HỌC TẬP"}</div><h1>${title}</h1><p class="subhead">${subtitle}</p></div><div class="toolbar">${action}</div></div>`;
}
function statCard(label,value,change,iconName,color,note) {
  return `<div class="card stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon ${color}">${icon(iconName)}</span></div><div class="stat-number"><strong>${value}</strong>${change?`<span>${change}</span>`:""}</div><div class="stat-note">${note}</div></div>`;
}
function scoreChart(scores) {
  const values=scores.length?scores:[0];const max=Math.max(10,...values);const width=480,height=165,pad=10;
  const pts=values.map((v,i)=>`${pad+i*(width-2*pad)/Math.max(1,values.length-1)},${height-10-(v/max)*(height-25)}`).join(" ");
  const area=`${pad},${height-10} ${pts} ${width-pad},${height-10}`;
  return `<div class="chart"><div class="chart-y-labels"><span>10</span><span>7,5</span><span>5</span><span>2,5</span><span>0</span></div><svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7668ef" stop-opacity=".2"/><stop offset="1" stop-color="#7668ef" stop-opacity="0"/></linearGradient></defs>${[0,.25,.5,.75,1].map(y=>`<line x1="0" x2="${width}" y1="${height-10-y*(height-25)}" y2="${height-10-y*(height-25)}" stroke="#f0f1f6" stroke-dasharray="4 5"/>`).join("")}<polygon points="${area}" fill="url(#fill)"/><polyline points="${pts}" fill="none" stroke="#7061eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${values.map((v,i)=>{let x=pad+i*(width-2*pad)/Math.max(1,values.length-1),y=height-10-(v/max)*(height-25);return `<circle cx="${x}" cy="${y}" r="4" fill="white" stroke="#7061eb" stroke-width="2"/>`}).join("")}</svg><div class="chart-labels">${scores.length?values.map((_,i)=>`<span>Lần ${i+1}</span>`).join(""):"<span>Chưa có dữ liệu</span>"}</div></div>`;
}
function donut(counts) {
  const total=counts.reduce((a,b)=>a+b,0);const colors=["#7061eb","#32be91","#ffb25e","#4f9de5","#ed7d89","#54c7cf","#a485e8"];
  let offset=0;const parts=total?counts.map((v,i)=>{const n=v/total*100;const part=`${colors[i]} ${offset}% ${offset+n}%`;offset+=n;return part;}):["#edf0f5 0% 100%"];
  return `<div style="display:flex;align-items:center;gap:17px"><div style="width:124px;height:124px;border-radius:50%;background:conic-gradient(${parts.join(",")});position:relative;flex:none"><div style="position:absolute;inset:23px;background:white;border-radius:50%;display:grid;place-content:center;text-align:center"><b style="font-size:19px">${total}</b><span style="font-size:8px;color:#9aa3b3">lượt sai</span></div></div><div style="display:grid;gap:5px">${errors.map((e,i)=>`<span style="font-size:8px;color:#7f899b"><i style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${colors[i]};margin-right:5px"></i>${e[0]} ${e[1]} <b style="color:#47536a">${counts[i]||0}</b></span>`).join("")}</div></div>`;
}
function teacherHome() {
  const students=data.users.filter(u=>u.role==="student"),allAttempts=sortAttempts(data.attempts),scored=allAttempts.filter(attempt=>Number.isFinite(attempt.score)),average=avg(scored.map(attempt=>attempt.score)),recent=data.assignments.slice(0,3),activities=allAttempts.slice(-3).reverse();
  const dateLabel=new Date().toLocaleDateString("vi-VN",{day:"2-digit",month:"long",year:"numeric"});
  const timesAgo=value=>{const seconds=Math.max(0,Math.floor((Date.now()-Date.parse(value||""))/1000));if(!Number.isFinite(seconds))return "Vừa cập nhật";if(seconds<60)return "Vừa xong";if(seconds<3600)return `${Math.floor(seconds/60)} phút trước`;if(seconds<86400)return `${Math.floor(seconds/3600)} giờ trước`;return new Date(value).toLocaleDateString("vi-VN")};
  return `${welcome(`Chào ${safe(userName())} 👋`,"Cùng xem tình hình học tập và giúp học sinh tiến bộ hơn nhé.",`<button class="date-chip">${icon("calendar")} ${dateLabel}</button>`)}
  <div class="grid stats">${statCard("Tổng số học sinh",students.length,"","users","purple","Tài khoản học sinh trên hệ thống")}${statCard("Đề ôn tập",data.assignments.length,"","book","green","Đề bạn đã tạo hoặc giao")}${statCard("Điểm trung bình",average,"","chart","orange","Trên các lượt đã chấm")}${statCard("Bài đã hoàn thành",allAttempts.length,"","target","blue","Lịch sử đã đồng bộ")}</div>
  <div class="grid content-grid"><section class="card section-card"><div class="section-heading"><div><h2>Tiến bộ của lớp</h2><p>Điểm các lượt luyện tập đã chấm</p></div><div class="chart-legend"><span><i class="legend-dot"></i>Điểm số</span></div></div>${scoreChart(scored.slice(-6).map(attempt=>attempt.score))}</section>
  <section class="card section-card"><div class="section-heading"><div><h2>Hoạt động gần đây</h2><p>Cập nhật từ các lượt làm bài đã đồng bộ</p></div><button class="text-button" data-page="compare">Xem tất cả</button></div><div class="activity-list">${activities.length?activities.map(attempt=>{const student=students.find(user=>user.id===attempt.userId);return `<div class="activity"><div class="avatar">${initial(student?.name||"HS")}</div><div class="activity-main"><strong>${safe(student?.name||"Học sinh")} đã hoàn thành ${safe(attempt.title)}</strong><span>${timesAgo(attempt.createdAt)}</span></div><span class="activity-score">${Number.isFinite(attempt.score)?`${attempt.score}/10`:"Chưa chấm"}</span></div>`}).join(""):`<div class="empty">Chưa có lượt làm bài được đồng bộ.</div>`}</div></section></div>
  <div class="grid bottom-grid"><section class="card section-card"><div class="section-heading"><div><h2>Đề ôn tập gần đây</h2><p>Theo dõi những đề bạn đã giao</p></div><button class="text-button" data-page="teacher-exams">Quản lý đề →</button></div>${assignmentList(recent)}</section><section class="card section-card"><div class="section-heading"><div><h2>Nhóm lỗi cần lưu ý</h2><p>Lỗi phổ biến qua các lượt làm gần nhất</p></div><button class="text-button" data-page="errors">Chi tiết</button></div>${donut(aggregateMistakes(students))}</section></div>`;
}
function aggregateMistakes(users) { return errors.map((_,i)=>users.reduce((n,u)=>n+(userStats(u).counts[i]||0),0)); }
function studentHome() {
  const stats=userStats(session), avgscore=stats.average;
  const completed=stats.attempts.length||stats.scores.length;
  const timeHours=(stats.attempts.reduce((n,a)=>n+a.duration,0)/3600).toFixed(1);
  const days=new Set(stats.attempts.map(a=>new Date(a.createdAt).toLocaleDateString("en-CA"))),streak=days.size;
  const latest=data.assignments.filter(a=>a.state!=="Đã đóng"&&(!a.studentIds||a.studentIds.includes(session.id)));
  return `${welcome(`Chào ${safe(userName())} 👋`,"Hôm nay là một ngày tốt để học thêm điều mới!",`<button class="date-chip">${icon("calendar")} Thứ Hai, 05/10</button>`)}
  <div class="grid stats">${statCard("Điểm trung bình",avgscore,"", "chart","purple","Qua các đề đã chấm")}${statCard("Đề đã hoàn thành",completed,"","book","green","Số lượt làm bài đã ghi nhận")}${statCard("Thời gian học",`${timeHours}h`,"","clock","orange","Tổng thời gian đã làm bài")}${statCard("Ngày có hoạt động",`${streak} ngày`,"","target","blue","Dựa trên lịch sử làm đề")}</div>
  <div class="grid content-grid"><section class="card section-card"><div class="section-heading"><div><h2>Hành trình tiến bộ</h2><p>Điểm số của bạn qua từng đề ôn tập</p></div><div class="chart-legend"><span><i class="legend-dot"></i>Điểm số</span></div></div>${scoreChart(stats.scores)}</section>
  <section class="card section-card"><div class="section-heading"><div><h2>Nhóm lỗi thường gặp</h2><p>Chọn đúng chỗ để luyện tập tốt hơn</p></div></div>${donut(stats.counts)}</section></div>
  <div class="grid bottom-grid"><section class="card section-card"><div class="section-heading"><div><h2>Đề được giao cho bạn</h2><p>Hoàn thành trước hạn để không bỏ lỡ nhé</p></div><button class="text-button" data-page="home">Xem tất cả →</button></div>${assignmentList(latest)}</section><section class="card section-card"><div class="section-heading"><div><h2>Gợi ý dành cho bạn</h2></div></div><div style="padding:9px 2px"><div class="activity"><div class="activity-icon lilac">${icon("spark")}</div><div class="activity-main"><strong>Ưu tiên ôn: ${topError(stats.counts)[1]}</strong><span>Đây là nhóm lỗi bạn gặp nhiều nhất gần đây.</span></div></div><button class="btn" data-page="personal" style="margin:17px 0 0 40px">Tạo đề cá nhân hóa</button></div></section></div>`;
}
function topError(counts) { let idx=counts.indexOf(Math.max(...counts));return errors[idx]||errors[0];}
function assignmentList(assignments) {
  if(!assignments.length)return `<div class="empty">Chưa có đề ôn tập nào được giao cho bạn.</div>`;
  return `<div class="assignment-list">${assignments.map(a=>`<div class="assignment"><div class="assignment-mark">${icon("file")}</div><div class="assignment-details"><strong>${safe(a.title)}</strong><span>${a.questions} câu · Hạn ${a.due||"Chưa đặt hạn"}</span></div><span class="tag ${a.state==="Đã đóng"?"amber":""}">${a.state==="Đã đóng"?"Đã làm":"Bắt đầu"}</span>${a.state!=="Đã đóng"?`<button class="btn" data-action="start-assignment" data-id="${a.id}">Làm bài</button>`:""}</div>`).join("")}</div>`;
}
function progressPage(user) {
  const stats=userStats(user);
  return `${welcome("Lộ trình cá nhân","Theo dõi điểm số, thời gian và những phần kiến thức bạn đã cải thiện.")}
  <div class="grid stats">${statCard("Điểm trung bình",stats.average,"","chart","purple","Qua các bài đã chấm")}${statCard("Đề đã hoàn thành",stats.attempts.length||stats.scores.length,"","book","green","Tiến độ học tập")}${statCard("Thời gian trung bình",stats.attempts.length?`${Math.round(stats.attempts.reduce((n,a)=>n+a.duration,0)/stats.attempts.length/60)} phút`:"—","", "clock","orange","Mỗi đề đã làm")}${statCard("Nhóm lỗi cần chú ý",topError(stats.counts)[1],"Ưu tiên","target","blue","Luyện thêm để tiến bộ")}</div>
  <div class="grid content-grid"><section class="card section-card"><div class="section-heading"><div><h2>Biểu đồ điểm số</h2><p>Điểm theo thứ tự từng lần làm đề</p></div></div>${scoreChart(stats.scores)}</section><section class="card section-card"><div class="section-heading"><div><h2>Phân tích 7 nhóm lỗi</h2><p>Tỷ lệ lỗi được ghi nhận</p></div></div>${donut(stats.counts)}</section></div>
  <div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Lịch sử luyện tập</h2><p>Thời gian trả lời được ghi nhận trong từng lần làm bài</p></div></div>${attemptTable(stats.attempts)}</div>`;
}
function attemptTable(attempts) {
  if(!attempts.length)return `<div class="empty">Các bài luyện tập hoàn thành sẽ xuất hiện tại đây.<br/><br/><button class="btn" data-page="home">Chọn đề ôn tập</button></div>`;
  return `<div class="table-wrap"><table><thead><tr><th>BÀI ÔN TẬP</th><th>LOẠI ĐỀ</th><th>ĐIỂM</th><th>SỐ CÂU ĐÚNG</th><th>THỜI GIAN</th><th>NGÀY LÀM</th></tr></thead><tbody>${attempts.slice().reverse().map(a=>`<tr><td><strong>${safe(a.title)}</strong></td><td>${a.source==="teacher"?"Giáo viên giao":"Tự luyện"}</td><td><b>${Number.isFinite(a.score)?`${a.score}/10`:"Chưa chấm"}</b></td><td>${a.correct}/${a.graded??a.total}</td><td>${formatDuration(a.duration)}</td><td>${new Date(a.createdAt).toLocaleDateString("vi-VN")}</td></tr>`).join("")}</tbody></table></div>`;
}
function formatDuration(seconds) { return `${Math.floor(seconds/60)} phút ${seconds%60} giây`; }
function comparePage() {
  if(isTeacher()&&selectedStudent) {
    const u=data.users.find(x=>x.id===selectedStudent);if(u)return `${welcome(`Lộ trình của ${safe(u.name)}`,"Phân tích tiến bộ và gợi ý hỗ trợ theo từng nhóm lỗi.",`<button class="btn secondary" data-action="back-students">← Danh sách học sinh</button><button class="btn" data-action="assign-priority" data-id="${u.id}">${icon("plus")} Giao đề ưu tiên</button>`)}${progressPage(u)}`;
  }
  const users=isTeacher()?data.users.filter(u=>u.role==="student"):[session];
  if(!isTeacher()) {
    const attempts=userStats(session).attempts.filter(attempt=>attempt.source==="personal");
    const scores=attempts.map(attempt=>attempt.score).filter(Number.isFinite);
    const counts=errors.map((error,index)=>attempts.reduce((total,attempt)=>total+(attempt.mistakes?.[index]||0),0));
    return `${welcome("Tiến bộ qua đề tự luyện","Chỉ thống kê các đề bạn tự tạo; bài giáo viên giao không được tính ở đây.")}<div class="grid stats">${statCard("Đề tự luyện",attempts.length,"","book","purple","Số lượt đã hoàn thành")}${statCard("Điểm gần nhất",scores.length?scores[scores.length-1]:"—","", "chart","green","Trên thang điểm 10")}${statCard("Điểm trung bình",scores.length?avg(scores):"—","","target","orange","Chỉ tính đề tự luyện")}${statCard("Nhóm cần ôn",topError(counts)[0],"","target","blue","Theo số câu sai")}</div><div class="grid content-grid"><section class="card section-card"><div class="section-heading"><div><h2>Điểm số theo lượt tự luyện</h2><p>Trục ngang là số lần bạn làm đề</p></div></div>${scoreChart(scores)}</section><section class="card section-card"><div class="section-heading"><div><h2>Phân bố 7 nhóm lỗi</h2><p>Tổng lỗi trong các đề tự luyện</p></div></div>${donut(counts)}</section></div><div class="card section-card"><div class="section-heading"><div><h2>Lịch sử đề tự luyện</h2><p>${attempts.length} lượt hoàn thành</p></div></div>${attemptTable(attempts)}</div>`;
  }
  return `${welcome("So sánh tiến bộ học sinh","Xem sự thay đổi kết quả và xác định phần kiến thức cần ưu tiên.")}<div class="card section-card"><div class="section-heading"><div><h2>Danh sách học sinh</h2><p>Chọn một học sinh để xem lộ trình chi tiết.</p></div></div>${studentsTable(users,true)}</div>`;
}
function studentsPage() {
  const students=data.users.filter(user=>user.role==="student");
  const teachers=data.users.filter(user=>user.role==="teacher");
  const pending=students.filter(user=>user.accountStatus==="pendingDeletion");
  const active=students.filter(user=>user.accountStatus!=="pendingDeletion");
  return `${welcome("Học sinh của bạn","Theo dõi học tập, cấp quyền giáo viên và quản lý yêu cầu xóa có thời gian khôi phục.",`<button class="btn" data-action="add-student">${icon("plus")} Hướng dẫn đăng ký</button>`)}
  <div class="card section-card"><div class="section-heading"><div><h2>Danh sách học sinh</h2><p>${active.length} học sinh đang hoạt động</p></div><div class="toolbar"><input placeholder="Tìm học sinh..." id="student-filter"/></div></div>${studentManagementTable(active)}</div>
  <div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Đang chờ xóa</h2><p>Tài khoản được giữ 24 giờ; giáo viên có thể khôi phục trong thời gian này.</p></div><span class="tag amber">${pending.length} tài khoản</span></div>${studentManagementTable(pending,true)}</div>
  <div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Danh sách giáo viên</h2><p>${teachers.length} giáo viên trên hệ thống</p></div></div>${teacherDirectoryTable(teachers)}</div>
  ${session?.role==="owner"?`<div class="notice">Quản trị viên: bạn có thể cấp hoặc thu hồi quyền giáo viên cho học sinh. Cấp quyền chỉ khả dụng cho tài khoản đã đăng ký Firebase.</div>`:""}`;
}
function teacherDirectoryTable(users) {
  if(!users.length)return `<div class="empty">Chưa có tài khoản giáo viên. Chủ sở hữu có thể cấp quyền giáo viên cho học sinh đã đăng ký.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>GIÁO VIÊN</th><th>VAI TRÒ</th></tr></thead><tbody>${users.map(user=>`<tr><td><div class="student-cell"><div class="avatar">${initial(user.name)}</div><div><strong>${safe(user.name)}</strong><div style="font-size:8px;color:#9aa3b3;margin-top:3px">${safe(user.email)}</div></div></div></td><td><span class="tag">Giáo viên</span></td></tr>`).join("")}</tbody></table></div>`;
}
function studentManagementTable(users,pending=false) {
  if(!users.length)return `<div class="empty">${pending?"Không có tài khoản đang chờ xóa.":"Chưa có tài khoản học sinh trong Firebase."}</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>HỌC SINH</th><th>TRẠNG THÁI</th><th>${pending?"XÓA SAU":"QUẢN LÝ"}</th></tr></thead><tbody>${users.map(user=>{
    const deleteAt=Date.parse(user.deleteAfter||"");
    const deleteLabel=Number.isFinite(deleteAt)?new Date(deleteAt).toLocaleString("vi-VN"):"Đang chờ";
    return `<tr><td><div class="student-cell"><div class="avatar">${initial(user.name)}</div><div><strong>${safe(user.name)}</strong><div style="font-size:8px;color:#9aa3b3;margin-top:3px">${safe(user.email)}</div></div></div></td><td>${pending?'<span class="tag amber">Đang chờ xóa</span>':`<span class="tag">${user.role==="teacher"?"Giáo viên":"Học sinh"}</span>`}</td><td>${pending?`<div class="student-actions"><span class="subhead">${safe(deleteLabel)}</span><button class="btn secondary" data-action="restore-student" data-id="${safe(user.id)}">Giữ tài khoản</button></div>`:`<div class="student-actions">${session?.role==="owner"&&user.role==="student"?`<button class="text-button" data-action="grant-teacher" data-id="${safe(user.id)}">Cấp giáo viên</button>`:""}<button class="text-button danger-text" data-action="schedule-delete-student" data-id="${safe(user.id)}">Xóa sau 24 giờ</button></div>`}</td></tr>`;
  }).join("")}</tbody></table></div>`;
}
function studentsTable(users,clickable) {
  if(!users.length)return `<div class="empty">Chưa có dữ liệu học sinh.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>HỌC SINH</th><th>ĐỀ ĐÃ LÀM</th><th>ĐIỂM TRUNG BÌNH</th><th>NHÓM CẦN ƯU TIÊN</th><th>TIẾN BỘ</th><th></th></tr></thead><tbody>${users.map(u=>{const s=userStats(u),worst=topError(s.counts),completed=s.attempts.length||s.scores.length;return `<tr ${clickable?`data-action="select-student" data-id="${u.id}" style="cursor:pointer"`:""}><td><div class="student-cell"><div class="avatar">${initial(u.name)}</div><div><strong>${safe(u.name)}</strong><div style="font-size:8px;color:#9aa3b3;margin-top:3px">${safe(u.email)}</div></div></div></td><td>${completed} đề</td><td><strong>${s.average}</strong>/10</td><td><span class="priority">${worst[0]} · ${worst[1]}</span></td><td><span class="progress-track"><i style="width:${Math.min(100,(Number(s.latest)||0)*10)}%"></i></span>${s.latest||"—"}/10</td><td><span style="color:#9aa3b3">→</span></td></tr>`}).join("")}</tbody></table></div>`;
}
function errorsPage() {
  return `${welcome("7 nhóm lỗi thường gặp","Tải tài liệu phân loại lỗi để xây dựng kho mã lỗi cho lớp học.",`<button class="btn" data-action="upload-errors">${icon("upload")} Tải file mã lỗi</button>`)}
  <div class="grid stats">${statCard("Nhóm lỗi","07","","target","purple","Các nhóm đang áp dụng")}${statCard("Tài liệu phân tích",data.errorDocs?.length||0,"","file","green","Tài liệu giáo viên đã tải")}${statCard("Mã lỗi đang dùng",errors.length,"","book","orange","Phân loại câu hỏi")}${statCard("Câu hỏi đã gắn mã",data.questions.filter(q=>q.errorId).length,"","chart","blue","Trong kho câu hỏi")}</div>
  <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">${errors.map((e,i)=>`<div class="card section-card"><div class="error-head"><div><div class="eyebrow">MÃ LỖI ${e[0]}</div><h2 style="font-size:13px;margin:0">${e[1]}</h2></div><span class="error-count">${aggregateMistakes(data.users.filter(u=>u.role==="student"))[i]} lần</span></div><p style="font-size:9px;color:#919bad;line-height:1.7;margin:10px 0 0">${e[2]}</p></div>`).join("")}</div>
  <div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Tài liệu mã lỗi đã tải lên</h2><p>Phân tích nội dung văn bản và lưu tóm tắt tại đây</p></div></div>${data.errorDocs?.length?`<div class="assignment-list">${data.errorDocs.map(d=>`<div class="assignment"><div class="assignment-mark">${icon("file")}</div><div class="assignment-details"><strong>${safe(d.name)}</strong><span>${safe(d.summary)}</span></div><span class="tag">Đã phân tích</span></div>`).join("")}</div>`:`<div class="empty">Chưa có tài liệu mã lỗi. Tải file .docx hoặc .txt để thêm nội dung phân loại.</div>`}</div>`;
}
function libraryPage() {
  const sets=data.sets||[];
  const canManage=isTeacher();
  const uploadAction=canManage?`<button class="btn" data-action="upload-doc">${icon("upload")} Tải đề Word</button>`:"";
  const subtitle=canManage
    ?"Kho đề đã công bố dùng chung; giáo viên có thể tải, ẩn/hiện hoặc xóa bộ đề trong kho."
    :"Xem kho đề giáo viên đã công bố và chọn bộ đề để tự luyện.";
  return `${welcome("Kho câu hỏi",subtitle,uploadAction)}
  <div class="grid stats">${statCard("Bộ đề đã công bố",sets.length,"","file","purple","Kho đề dùng chung")}${statCard("Câu hỏi",data.questions.length,"","book","green","Trong các đề đã công bố")}${statCard("Có hình ảnh",data.questions.filter(q=>q.hasImages).length,"","target","orange","Ảnh và hình vẽ được giữ lại")}${statCard("Đề đã giao",data.assignments.length,"","chart","blue","Đề ôn tập đang quản lý")}</div>
  ${sets.length?`<div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">${sets.map(s=>`<div class="card section-card"><div class="section-heading"><div><div class="eyebrow">${safe(s.type||"ĐỀ ÔN TẬP")}</div><h2>${safe(s.title)}</h2><p>${s.questionCount} câu · ${safe(s.filename)}${canManage&&s.hiddenFromStudents?" · Đang ẩn với học sinh":""}</p></div><div class="toolbar"><button class="text-button" data-action="view-set" data-id="${safe(s.id)}">Xem trước</button>${canManage?`<button class="text-button" data-action="toggle-set-visibility" data-id="${safe(s.id)}">${s.hiddenFromStudents?"Hiện với học sinh":"Ẩn với học sinh"}</button><button class="text-button danger-text" data-action="delete-set" data-id="${safe(s.id)}">Xóa bộ câu hỏi</button>`:`<button class="text-button" data-action="choose-set" data-id="${safe(s.id)}">Chọn đề</button>`}</div></div><div>${(s.sections||[]).map(x=>`<span class="tag" style="margin-right:5px">${safe(x)}</span>`).join("")}</div></div>`).join("")}</div>`:`<div class="card section-card"><div class="empty"><div class="empty-icon">${icon("book")}</div><strong>Kho đề dùng chung đang trống</strong><p>${canManage?"Tải đề lên để công bố bộ câu hỏi cho học sinh và giáo viên khác.":"Giáo viên chưa công bố bộ đề nào."}</p>${canManage?`<button class="btn" data-action="upload-doc">${icon("upload")} Chọn file Word</button>`:""}</div></div>`}`;
}
function teacherExamsPage() {
  return `${welcome("Quản lý đề ôn tập","Chọn nguồn câu hỏi từ kho, trộn đề và giao cho học sinh.",`<button class="btn secondary" data-action="upload-doc">${icon("upload")} Tải đề Word</button><button class="btn" data-action="create-exam">${icon("plus")} Tạo đề mới</button>`)}
  <div class="card section-card"><div class="section-heading"><div><h2>Đề ôn tập đã tạo</h2><p>Đề được giao và tiến độ hoàn thành</p></div></div>${data.assignments.length?`<div class="assignment-list">${data.assignments.map(a=>`<div class="assignment"><div class="assignment-mark">${icon("file")}</div><div class="assignment-details"><strong>${safe(a.title)}</strong><span>${a.questions} câu · ${a.students||0} học sinh · Hạn ${a.due||"Chưa đặt hạn"}</span></div><span class="tag ${a.state==="Đã đóng"?"amber":""}">${a.state}</span><button class="text-button" data-action="assignment-detail" data-id="${a.id}">Chi tiết</button><button class="text-button danger-text" data-action="delete-assignment" data-id="${a.id}">Xóa</button></div>`).join("")}</div>`:`<div class="empty">Tạo đề ôn tập đầu tiên từ các bộ đề bạn đã tải lên.</div>`}</div>
  <div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Nguồn câu hỏi</h2><p>Chọn nhiều bộ đề để trộn câu hỏi ngẫu nhiên</p></div><button class="text-button" data-page="library">Mở kho câu hỏi →</button></div>${data.sets.length?`<div class="assignment-list">${data.sets.map(s=>`<div class="assignment"><div class="assignment-mark">${icon("book")}</div><div class="assignment-details"><strong>${safe(s.title)}</strong><span>${s.questionCount} câu · ${safe(s.filename)}</span></div><span class="tag">${safe(s.type||"Toán")}</span></div>`).join("")}</div>`:`<div class="empty">Hãy tải file Word lên kho câu hỏi trước.</div>`}</div>`;
}
function personalPage() {
  const counts=userStats(session).counts, priorities=errors.map((e,i)=>({e,i,n:counts[i]||0})).sort((a,b)=>b.n-a.n);
  return `${welcome("Ôn tập cá nhân hóa","Chọn bộ đề và những nhóm lỗi bạn muốn tập trung cải thiện.",`<button class="btn" data-action="create-personal">${icon("spark")} Tạo đề cho mình</button>`)}
  <div class="grid content-grid"><section class="card section-card"><div class="section-heading"><div><h2>Chọn nguồn câu hỏi</h2><p>Luyện từ đề giáo viên đã tải lên</p></div></div>${data.sets.length?`<div class="assignment-list">${data.sets.map(s=>`<label class="assignment" style="cursor:pointer"><input class="set-check" type="checkbox" value="${s.id}"/><div class="assignment-mark">${icon("book")}</div><div class="assignment-details"><strong>${safe(s.title)}</strong><span>${s.questionCount} câu · ${safe(s.filename)}</span></div></label>`).join("")}</div>`:`<div class="empty">Chưa có bộ đề trong kho. Giáo viên cần tải đề Word lên trước.</div>`}</section>
  <section class="card section-card"><div class="section-heading"><div><h2>Chọn nhóm lỗi cần luyện</h2><p>Các nhóm cần ưu tiên được gợi ý từ kết quả gần đây</p></div></div><div class="assignment-list">${priorities.map((x,i)=>`<label class="assignment" style="cursor:pointer"><input class="error-check" type="checkbox" value="${x.i}" ${i<3?"checked":""}/><div class="activity-icon ${i===0?"peach":"lilac"}">${icon("target")}</div><div class="assignment-details"><strong>${x.e[0]} · ${x.e[1]}</strong><span>${x.e[2]}</span></div>${i<3?'<span class="priority">Ưu tiên</span>':""}</label>`).join("")}</div></section></div>
  <div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Lịch sử tự luyện</h2><p>Kết quả đề cá nhân không gộp với bài giáo viên giao</p></div></div>${attemptTable(userStats(session).attempts.filter(a=>a.source==="personal"))}</div>`;
}
function bindApp() {
  document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{
    currentPage=b.dataset.page;selectedStudent=null;render();
    if(["students","compare"].includes(currentPage)&&isTeacher())void loadFirebaseStudents();
  });
  document.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",event=>{event.stopPropagation();void handleAction(b);}));
  document.querySelector("#global-search")?.addEventListener("input",e=>{
    const filter=e.target.value.toLocaleLowerCase("vi");
    document.querySelectorAll("tbody tr,.assignment").forEach(row=>row.hidden=!row.textContent.toLocaleLowerCase("vi").includes(filter));
  });
  document.querySelector("#student-filter")?.addEventListener("input",e=>{
    const filter=e.target.value.toLocaleLowerCase("vi");
    document.querySelectorAll("tbody tr").forEach(row=>row.hidden=!row.textContent.toLocaleLowerCase("vi").includes(filter));
  });
}
async function handleAction(button) {
  const action=button.dataset.action,id=button.dataset.id;
  if(action==="logout") {
    if(firebaseAuth) try {await firebaseSdk.signOut(firebaseAuth);}catch(e){toast(firebaseError(e));return;}
    sessionNotice="";
    setSession(null);currentPage="home";return;
  }
  if(action==="help"){toast("Tải đề Word vào Kho câu hỏi, rồi chọn câu để tạo đề ôn tập.");return;}
  if(action==="upload-doc"){
    if(!isTeacher()){toast("Chỉ giáo viên mới được tải đề lên kho dùng chung.");return;}
    showUploadModal("questions");return;
  }
  if(action==="upload-errors"){
    if(!isTeacher()){toast("Chỉ giáo viên mới được tải tài liệu mã lỗi lên.");return;}
    showUploadModal("errors");return;
  }
  if(action==="add-student"){showStudentModal();return;}
  if(action==="schedule-delete-student"){
    if(!confirm("Đưa tài khoản này vào danh sách chờ xóa? Tài khoản chỉ bị xóa vĩnh viễn sau 24 giờ."))return;
    await runStudentFunction("scheduleStudentDeletion",{studentId:id},"Đã đưa tài khoản vào danh sách chờ xóa 24 giờ.");
    return;
  }
  if(action==="restore-student"){
    await runStudentFunction("cancelStudentDeletion",{studentId:id},"Đã khôi phục tài khoản học sinh.");
    return;
  }
  if(action==="grant-teacher"){
    if(!confirm("Cấp quyền giáo viên cho tài khoản này?"))return;
    await setStudentTeacherRole(id);
    return;
  }
  if(action==="delete-assignment"){
    if(!isTeacher())return;
    const assignment=data.assignments.find(item=>item.id===id);
    if(!assignment)return;
    if(!confirm(`Xóa đề "${assignment.title}" khỏi danh sách đề ôn tập? Lịch sử bài làm đã ghi nhận sẽ được giữ nguyên.`))return;
    if(assignment.teacherId) {
      try {
        await configureFirestore();
        await firebaseRequest(firebaseSdk.deleteDoc(firebaseSdk.doc(firebaseDb,"assignments",id)));
      } catch(error) {
        console.error("Could not delete Firebase assignment.",error);
        toast(`Không thể xóa đề đã đồng bộ: ${firebaseFirestoreError(error)}`);
        return;
      }
    }
    data.assignments=data.assignments.filter(item=>item.id!==id);
    if(!saveData())return;
    render();
    toast("Đã xóa đề ôn tập.");
    return;
  }
  async function setStudentTeacherRole(studentId) {
    if(session?.role!=="owner") {
      toast("Chỉ chủ sở hữu website mới được cấp quyền giáo viên.");
      return;
    }
    try {
      await configureFirestore();
      await firebaseRequest(firebaseSdk.updateDoc(
        firebaseSdk.doc(firebaseDb,"users",studentId),
        {role:"teacher"}
      ));
      if(!await loadFirebaseStudents())return;
      toast("Đã cấp quyền giáo viên.");
    } catch(error) {
      console.error("Could not promote Firebase student profile.",error);
      toast(error.code==="permission-denied"
        ?"Firestore từ chối đổi vai trò. Hãy đăng nhập bằng tài khoản owner, kiểm tra users/{UID}.role rồi thử lại."
        :`Không thể cấp quyền giáo viên: ${firebaseFirestoreError(error)}`);
    }
  }
  if(action==="delete-set"){
    if(!isTeacher()){toast("Chỉ giáo viên mới được xóa bộ đề.");return;}
    const set=data.sets.find(item=>item.id===id);
    if(!set)return;
    if(!confirm(`Xóa bộ câu hỏi "${set.title}" và ${set.questionCount} câu khỏi kho? Đề đã giao sẽ giữ bản sao câu hỏi.`))return;
    if(session?.source==="firebase"&&set.teacherId) {
      try {
        await deleteFirebaseQuestionSet(set);
      } catch(error) {
        console.error("Could not delete Firebase question set.",error);
        toast(`Không thể xóa bộ đề trên Firebase: ${firebaseFirestoreError(error)}`);
        return;
      }
    }
    data.sets=data.sets.filter(item=>item.id!==id);
    data.questions=data.questions.filter(question=>question.setId!==id);
    if(!saveData())return;
    render();
    toast("Đã xóa bộ câu hỏi khỏi kho.");
    return;
  }
  if(action==="toggle-set-visibility"){
    if(!isTeacher()){toast("Chỉ giáo viên mới được thay đổi trạng thái bộ đề.");return;}
    const set=data.sets.find(item=>item.id===id);
    if(!set||session?.source!=="firebase"){toast("Không tìm thấy bộ đề trong kho dùng chung.");return;}
    try {
      await configureFirestore();
      await firebaseRequest(firebaseSdk.updateDoc(firebaseSdk.doc(firebaseDb,"questionSets",set.id),{hiddenFromStudents:!set.hiddenFromStudents}));
      set.hiddenFromStudents=!set.hiddenFromStudents;
      render();
      toast(set.hiddenFromStudents?"Đã ẩn bộ đề với học sinh.":"Đã hiện bộ đề với học sinh.");
    } catch(error) {
      console.error("Could not change shared question-set visibility.",error);
      toast(`Không thể cập nhật trạng thái bộ đề: ${firebaseFirestoreError(error)}`);
    }
    return;
  }
  if(action==="create-exam"){
    if(await loadFirebaseStudents())showExamModal(false);
    return;
  }
  if(action==="create-personal"){
    const setIds=[...document.querySelectorAll(".set-check:checked")].map(el=>el.value);
    const errorIds=[...document.querySelectorAll(".error-check:checked")].map(el=>errors[Number(el.value)]?.[0]).filter(Boolean);
    showExamModal(true,null,setIds,errorIds);return;
  }
  if(action==="select-student"){selectedStudent=id;currentPage="compare";render();return;}
  if(action==="back-students"){selectedStudent=null;currentPage="students";render();return;}
  if(action==="assign-priority"){
    if(await loadFirebaseStudents())showExamModal(false,id);
    return;
  }
  if(action==="start-assignment"){startAssignment(data.assignments.find(a=>a.id===id));return;}
  if(action==="view-set"){showSetModal(data.sets.find(s=>s.id===id));return;}
  if(action==="choose-set"){document.querySelector(".modal-backdrop")?.remove();currentPage="personal";render();const check=[...document.querySelectorAll(".set-check")].find(input=>input.value===id);if(check)check.checked=true;return;}
  if(action==="assignment-detail"){toast("Bài tập đang mở cho học sinh. Kết quả sẽ cập nhật sau khi các em hoàn thành.");return;}
  if(action==="next-question"){nextQuestion();return;}
  if(action==="submit-practice"){submitPractice();return;}
  if(action==="close-modal"){document.querySelector(".modal-backdrop")?.remove();return;}
  if(action==="menu"){document.querySelector(".sidebar")?.classList.toggle("show-mobile");return;}
  if(action==="finish-exam"){
    if(Object.keys(currentPractice?.answers||{}).length&&!window.confirm("Thoát bài sẽ xóa câu trả lời chưa nộp. Bạn có muốn quay lại không?"))return;
    currentPractice=null;currentPage=practiceReturnPage;render();return;
  }
}
async function runStudentFunction(name,payload,successMessage) {
  try {
    await configureFirebaseFunctions();
    const callable=firebaseSdk.httpsCallable(firebaseFunctions,name);
    await callable(payload);
    if(!await loadFirebaseStudents())return;
    toast(successMessage);
  } catch(error) {
    console.error(`Firebase action ${name} failed.`,error);
    const message=error.code==="functions/not-found"
      ?"Chưa có Cloud Function quản lý tài khoản trên Firebase; học sinh chưa bị đưa vào danh sách chờ xóa."
      :error.code==="functions/failed-precondition"
        ?"Firebase chưa đáp ứng điều kiện để quản lý tài khoản; dữ liệu chưa thay đổi."
        :error.message||firebaseError(error);
    toast(message);
  }
}
async function loadFirebaseStudents() {
  if(!isTeacher())return false;
  try {
    await configureFirestore();
    const snapshot=await firebaseSdk.getDocs(firebaseSdk.collection(firebaseDb,"users"));
    const localById=new Map(data.users.map(user=>[user.id,user]));
    data.users=snapshot.docs.map(doc=>{
      const profile=doc.data(),local=localById.get(doc.id);
      return {
        ...local,id:doc.id,email:profile.email||local?.email||"",
        name:profile.displayName||profile.name||local?.name||profile.email||"Học sinh",
        role:profile.role,accountStatus:profile.accountStatus||"active",
        deleteAfter:profile.deleteAfter?.toDate?.().toISOString?.()||profile.deleteAfter||null
      };
    }).filter(user=>user.role==="student"||user.role==="teacher");
    render();
    return true;
  } catch(error) {
    console.error("Could not load Firebase student profiles.",error);
    data.users=data.users.filter(user=>user.id===session?.id&&user.role==="student");
    render();
    toast(firebaseFirestoreError(error));
    return false;
  }
}
function showModal(title,body,actions="") {
  document.querySelector(".modal-backdrop")?.remove();
  document.body.insertAdjacentHTML("beforeend",`<div class="modal-backdrop"><section class="modal"><div class="modal-head"><h2>${title}</h2><button class="close" data-action="close-modal">×</button></div>${body}${actions?`<div class="modal-actions">${actions}</div>`:""}</section></div>`);
  document.querySelectorAll('.modal-backdrop [data-action="close-modal"]').forEach(button=>{
    button.onclick=()=>document.querySelector(".modal-backdrop")?.remove();
  });
  void typesetMath(document.querySelector(".modal"));
}
function showUploadModal(kind) {
  const errorsOnly=kind==="errors";
  let parseSequence=0;
  showModal(errorsOnly?"Tải tài liệu nhóm lỗi":"Tải đề Toán từ Word hoặc PDF",
    `<p class="subhead" style="margin:0 0 14px">${errorsOnly?"Tải tài liệu mô tả các nhóm lỗi để lưu trữ và tóm tắt.":"Hệ thống giữ ảnh, hình vẽ và công thức Word; PDF được tách theo nội dung văn bản và lưu ảnh chụp từng câu để đối chiếu."}</p>
    <label class="upload-zone" for="doc-file" tabindex="0">${icon("upload")}<strong>Chọn hoặc kéo thả file vào đây</strong><span>Định dạng hỗ trợ .docx, .pdf${errorsOnly?" hoặc .txt":""} · Tối đa 15 MB</span><input id="doc-file" type="file" accept=".docx,.pdf,.txt"/></label>
    <div class="field" style="margin-top:13px"><label for="doc-title">Tên bộ đề / tài liệu</label><input id="doc-title" placeholder="Ví dụ: Hàm số — Chuyên đề 1"/></div>
    <div class="field" style="margin-top:10px"><label for="doc-topic">Chủ đề / phần thi</label><select id="doc-topic"><option>Trắc nghiệm</option><option>Đúng / Sai</option><option>Trả lời ngắn</option><option>Toán tổng hợp</option><option>Mã lỗi thường gặp</option></select></div>
    ${errorsOnly?"":'<label class="ai-opt-in"><input id="ai-boundaries" type="checkbox" checked/> Dùng Gemini AI để bóc tách câu và công thức. Gửi văn bản trích xuất; PDF scan sẽ gửi ảnh trang. Ảnh trong đề vẫn được giữ nguyên.</label>'}
    <div id="doc-preview"></div><p class="notice">Tệp được xử lý trong trình duyệt. Word hỗ trợ công thức Equation/MathType và LaTeX; PDF scan không có lớp văn bản cần OCR trước khi tải lên.</p>`,
    `<button class="btn secondary" data-action="close-modal">Hủy</button><button class="btn" id="save-upload" disabled>Lưu vào kho</button>`);
  const input=document.querySelector("#doc-file");
  const zone=document.querySelector(".upload-zone");
  const processFile=async file=>{
    if(!file)return;
    if(file.size>15*1024*1024){toast("File vượt quá giới hạn 15 MB.");return;}
    if(!/\.(?:docx|pdf|txt)$/i.test(file.name)){toast("Chỉ hỗ trợ file .docx, .pdf hoặc .txt.");return;}
    const sequence=++parseSequence;
    const uploadModal=document.querySelector(".modal-backdrop");
    const preview=uploadModal?.querySelector("#doc-preview");
    if(!uploadModal||!preview)return;
    const title=uploadModal.querySelector("#doc-title");if(!title.value)title.value=file.name.replace(/\.[^.]+$/,"");
    const saveButton=uploadModal.querySelector("#save-upload");
    pendingUpload=null;
    saveButton.disabled=true;
    try {
      const analyzeQuestions=!errorsOnly&&Boolean(uploadModal.querySelector("#ai-boundaries")?.checked);
      preview.innerHTML=`<p class="notice">${analyzeQuestions?"Đang trích xuất nội dung và gửi văn bản tới Gemini để bóc tách câu hỏi…":"Đang trích xuất nội dung và nhận diện câu hỏi trong trình duyệt…"}</p>`;
      const parsed=await parseDocument(file,{analyzeQuestions});
      if(!parsed.questions.length)throw new Error("Không nhận diện được câu hỏi. Kiểm tra tệp hoặc thử tải bản rõ hơn.");
      if(!uploadModal.isConnected||sequence!==parseSequence)return;
      pendingUpload={kind,file,parsed,title:title.value};
      if(!errorsOnly) {
        const modalPanel=uploadModal.querySelector(".modal");
        modalPanel?.classList.add("modal-review");
        const previewNode=modalPanel.querySelector("#doc-preview");
        let workspace=modalPanel.querySelector(".review-workspace");
        if(!workspace) {
          workspace=document.createElement("div");
          workspace.className="review-workspace";
          const sidebar=document.createElement("aside"),main=document.createElement("section");
          sidebar.className="review-sidebar";main.className="review-main";
          const description=modalPanel.querySelector(":scope > .subhead");
          const uploadZone=modalPanel.querySelector(".upload-zone");
          const titleField=modalPanel.querySelector("#doc-title")?.closest(".field");
          const topicField=modalPanel.querySelector("#doc-topic")?.closest(".field");
          const aiOption=modalPanel.querySelector(".ai-opt-in");
          const help=modalPanel.querySelector(":scope > .notice");
          modalPanel.insertBefore(workspace,previewNode);
          sidebar.append(description,uploadZone,titleField,topicField,aiOption,help);
          main.append(previewNode);
          workspace.append(sidebar,main);
        }
        const zoneLabel=modalPanel.querySelector(".upload-zone");
        if(zoneLabel){
          zoneLabel.querySelector("strong").textContent="Chọn tệp đề khác";
          zoneLabel.querySelector("span").textContent=file.name;
        }
        modalPanel.querySelector(".modal-head h2").textContent="Rà soát và chỉnh sửa đề";
      }
      preview.innerHTML=importReviewMarkup(parsed);
      bindImportReview();
      void typesetMath(preview);
      saveButton.disabled=false;
    } catch(error){
      if(!uploadModal.isConnected||sequence!==parseSequence)return;
      pendingUpload=null;console.error("Document import failed.",error);toast(`Không thể đọc file: ${error.message}`);
    }
  };
  input.onchange=()=>processFile(input.files[0]);
  zone.addEventListener("dragover",event=>{event.preventDefault();zone.classList.add("is-dragover");});
  zone.addEventListener("dragleave",event=>{if(!zone.contains(event.relatedTarget))zone.classList.remove("is-dragover");});
  zone.addEventListener("drop",event=>{event.preventDefault();zone.classList.remove("is-dragover");processFile(event.dataTransfer.files[0]);});
  document.querySelector("#save-upload").onclick=async event=>{
    const button=event.currentTarget;
    const label=button.textContent;
    button.disabled=true;
    button.textContent="Đang lưu câu hỏi…";
    try { await saveUploadedDoc(errorsOnly); }
    catch(error) {
      console.error("Could not save uploaded document.",error);
      const details=error.code==="app/teacher-role-required"?error.message:firebaseFirestoreError(error);
      toast(`Không thể đồng bộ tài liệu lên Firebase: ${details}${error.code?` [${error.code}]`:""}`);
    } finally {
      if(button.isConnected){button.disabled=false;button.textContent=label;}
    }
  };
}
function importReviewMarkup(parsed) {
  const sections=["Trắc nghiệm","Đúng / Sai","Trả lời ngắn"];
  const sectionCounts=Object.fromEntries(sections.map(section=>[section,parsed.questions.filter(q=>q.section===section).length]));
  const hasPdfSource=parsed.questions.some(question=>question.html?.includes("pdf-source-image"));
  const aiNotice=parsed.aiUsed
    ?"Gemini AI hỗ trợ nhận diện câu hỏi; ảnh câu hỏi gốc được giữ để giáo viên rà soát. Hãy xác nhận đáp án đúng trước khi lưu."
    :`${parsed.aiMessage?`AI không sử dụng được: ${safe(parsed.aiMessage)}.`:"AI đã tắt cho tệp này."} Hệ thống dùng nhận diện cục bộ.`;
  const flagged=parsed.questions.filter(q=>q.classificationConfidence==="review"||!q.errorId||!q.answerKey||(q.sourceImageOnly&&q.sourceImageRects?.some((rect,index)=>!q.sourceImageCrops?.[index]))).length;
  return `<div class="review-summary"><b>${parsed.questions.length} câu</b><span>${parsed.imageCount} hình</span><span data-review-flag-count>Cần rà soát kỹ: <b>${flagged}</b></span>${sections.map(section=>`<span>${section}: <b>${sectionCounts[section]}</b></span>`).join("")}</div><div class="question-preview review-list">${parsed.questions.map((q,i)=>{
    const issues=[q.classificationConfidence==="review"?"Phân loại cần kiểm tra":"",!q.errorId?"Thiếu mã lỗi":"",!q.answerKey?"Chưa có đáp án đúng":"",q.sourceImageOnly&&q.sourceImageRects?.some((rect,index)=>!q.sourceImageCrops?.[index])?"Ảnh câu chưa cắt":""].filter(Boolean);
    return `<article class="review-row ${issues.length?"has-review-issue":""}" data-question-id="${safe(q.id)}"><div class="review-info"><strong>Câu ${i+1}${issues.length?`<span class="review-issue">${issues.join(" · ")}</span>`:'<span class="review-ok">Đã nhận diện</span>'}</strong><span>${q.sourceImageOnly?"Xem và căn chỉnh ảnh trọn câu, gồm nội dung và các phương án.":`${safe(q.content.slice(0,180))}${q.content.length>180?"…":""}`}</span><small>${q.choices?.length?`${q.choices.length} nhãn phương án`:"Trả lời bằng số / ký hiệu"} · ${q.errorId||"chưa gắn mã"}</small></div><select aria-label="Phần đề câu ${i+1}" class="import-section compact-select" data-question-id="${safe(q.id)}">${sections.map(section=>`<option ${q.section===section?"selected":""}>${section}</option>`).join("")}</select><select aria-label="Mã lỗi câu ${i+1}" class="import-error compact-select" data-question-id="${safe(q.id)}"><option value="">Mã lỗi…</option>${errors.map(error=>`<option value="${error[0]}" ${q.errorId===error[0]?"selected":""}>${error[0]}</option>`).join("")}</select><details class="review-detail"><summary>${q.sourceImageRects?.length?"Xem và căn chỉnh ảnh câu hỏi":"Xem nội dung, đáp án, hình vẽ"}</summary><div class="doc-html">${q.sourceImageRects?.length?renderQuestionImageReview(q,parsed.sourcePages):`${q.html||safe(q.content)}${renderImportChoices(q)}`}</div>${!q.sourceImageOnly?`<label class="answer-key-label">Đáp án đúng <input class="import-key" data-question-id="${safe(q.id)}" value="${safe(q.answerKey||"")}" placeholder="${q.section==="Trả lời ngắn"?"Ví dụ: 2, 3/4":"A/B/C/D hoặc chuỗi Đ/S"}"/></label>`:`<label class="answer-key-label">Đáp án đúng <input class="import-key" data-question-id="${safe(q.id)}" value="${safe(q.answerKey||"")}" placeholder="Giáo viên nhập A/B/C/D"/></label>`}</details></article>`;
  }).join("")}</div><p class="notice">${aiNotice} ${hasPdfSource?"Ảnh PDF được cắt theo câu làm gợi ý; mở từng câu để căn lại khung từ ảnh trang gốc. Đáp án lựa chọn sẽ nằm trong ảnh, không chép lại nội dung phương án.":"Ảnh và công thức Word được giữ nguyên; kiểm tra phần thi, mã lỗi và đáp án trước khi lưu."} Các câu có điểm cần rà soát được đánh dấu nổi bật.</p>`;
}
function questionSourceImageHtml(question) {
  return (question.sourceImageCrops||[]).filter(Boolean).map((src,index)=>`<img class="pdf-source-image" src="${safe(src)}" alt="Ảnh câu hỏi${index?` phần ${index+1}`:""}"/>`).join("");
}
function renderQuestionImageReview(question,sourcePages={}) {
  return `<div class="question-source-review">${(question.sourceImageRects||[]).map((rect,index)=>{
    const crop=question.sourceImageCrops?.[index];
    const source=sourcePages[rect.page];
    return `<section class="question-image-part"><div class="question-image-preview">${crop?`<img class="pdf-source-image" src="${safe(crop)}" alt="Ảnh câu hỏi đã cắt"/>`:'<div class="question-image-empty">Ảnh trang nguồn chưa được cắt thành câu hỏi.</div>'}</div><button type="button" class="btn secondary question-crop-open" data-question-id="${safe(question.id)}" data-part-index="${index}" ${source?"": "disabled"}>${crop?"Căn chỉnh khung ảnh câu hỏi":"Cắt ảnh câu hỏi"}</button><div class="question-crop-editor" data-question-id="${safe(question.id)}" data-part-index="${index}" data-source-page="${rect.page}" hidden><p class="subhead">Kéo để vẽ lại khung quanh trọn câu và mọi phương án. Kéo bên trong khung hiện có để dịch chuyển, hoặc bấm “Vẽ khung mới” rồi kéo vùng khác.</p><div class="question-crop-stage"><img class="question-crop-source" alt="Trang PDF gốc"/><div class="question-crop-selection" hidden></div></div><div><button type="button" class="btn question-crop-save">Dùng khung này</button><button type="button" class="text-button question-crop-redraw">Vẽ khung mới</button><button type="button" class="text-button question-crop-cancel">Hủy</button></div></div></section>`;
  }).join("")}</div>`;
}
function renderImportChoices(question) {
  if(question.sourceImageOnly||!question.choices?.length)return "";
  return `<ol class="choice-preview">${question.choices.map(choice=>`<li><b>${safe(choice.label)}.</b> ${choice.html}</li>`).join("")}</ol>`;
}
function renderQuestionChoices(question) {
  if(question.sourceImageOnly||!question.choices?.length)return "";
  return `<ol class="choice-preview">${question.choices.map(choice=>`<li><b>${safe(choice.label)}.</b> ${choice.html}</li>`).join("")}</ol>`;
}
function bindImportReview() {
  const getQuestion=id=>pendingUpload?.parsed.questions.find(question=>question.id===id);
  document.querySelectorAll(".import-section").forEach(select=>select.onchange=()=>{const q=getQuestion(select.dataset.questionId);if(q){q.section=select.value;q.answerKey=normalizeQuestionKey(q.answerKey,q.section);refreshImportReviewState(q);}});
  document.querySelectorAll(".import-error").forEach(select=>select.onchange=()=>{const q=getQuestion(select.dataset.questionId);if(q){q.errorId=select.value||null;refreshImportReviewState(q);}});
  document.querySelectorAll(".import-key").forEach(input=>input.onchange=()=>{const q=getQuestion(input.dataset.questionId);if(q){q.answerKey=normalizeQuestionKey(input.value,q.section);refreshImportReviewState(q);}});
  document.querySelectorAll(".question-crop-open").forEach(button=>button.onclick=()=>{
    const editor=button.parentElement.querySelector(".question-crop-editor");
    const question=getQuestion(button.dataset.questionId),partIndex=Number(button.dataset.partIndex);
    const rect=question?.sourceImageRects?.[partIndex];
    if(!question||!rect||!editor)return;
    const selection=editor.querySelector(".question-crop-selection");
    const sourcePage=pendingUpload?.parsed.sourcePages?.[rect.page];
    if(!sourcePage)return;
    editor.querySelector(".question-crop-source").src=sourcePage;
    const hasCrop=Boolean(question.sourceImageCrops?.[partIndex]);
    editor.dataset.cropRect=hasCrop?JSON.stringify(rect):"null";
    if(hasCrop)drawQuestionCropSelection(selection,rect);else selection.hidden=true;
    editor.hidden=false;
    bindQuestionCropEditor(editor);
  });
  document.querySelectorAll(".question-crop-cancel").forEach(button=>button.onclick=()=>{button.closest(".question-crop-editor").hidden=true;});
  document.querySelectorAll(".question-crop-redraw").forEach(button=>button.onclick=()=>{
    const editor=button.closest(".question-crop-editor");editor.dataset.cropRect="null";
    editor.querySelector(".question-crop-selection").hidden=true;
  });
  document.querySelectorAll(".question-crop-save").forEach(button=>button.onclick=()=>{
    const editor=button.closest(".question-crop-editor"),question=getQuestion(editor.dataset.questionId);
    const partIndex=Number(editor.dataset.partIndex),rect=JSON.parse(editor.dataset.cropRect||"null");
    const image=editor.querySelector(".question-crop-source");
    if(!question||!rect||rect.width<.01||rect.height<.01||!image.naturalWidth){toast("Kéo để khoanh trọn câu hỏi và các phương án.");return;}
    const sx=Math.max(0,Math.floor(rect.x*image.naturalWidth)),sy=Math.max(0,Math.floor(rect.y*image.naturalHeight));
    const sw=Math.min(image.naturalWidth-sx,Math.max(1,Math.ceil(rect.width*image.naturalWidth)));
    const sh=Math.min(image.naturalHeight-sy,Math.max(1,Math.ceil(rect.height*image.naturalHeight)));
    const canvas=document.createElement("canvas");canvas.width=sw;canvas.height=sh;
    canvas.getContext("2d").drawImage(image,sx,sy,sw,sh,0,0,sw,sh);
    const crop=canvas.toDataURL("image/webp",.92);
    question.sourceImageRects[partIndex]={...rect};
    question.sourceImageCrops[partIndex]=crop;
    question.html=questionSourceImageHtml(question);
    question.hasImages=true;question.sourceImageOnly=true;
    const part=button.closest(".question-image-part");
    part.querySelector(".question-image-preview").innerHTML=`<img class="pdf-source-image" src="${safe(crop)}" alt="Ảnh câu hỏi đã cắt"/>`;
    button.closest(".question-image-part").querySelector(".question-crop-open").textContent="Căn chỉnh khung ảnh câu hỏi";
    refreshImportReviewState(question);
    editor.hidden=true;
  });
}
function refreshImportReviewState(question) {
  const row=document.querySelector(`[data-question-id="${CSS.escape(question.id)}"].review-row`);
  if(!row)return;
  const issues=[question.classificationConfidence==="review"?"Phân loại cần kiểm tra":"",!question.errorId?"Thiếu mã lỗi":"",!question.answerKey?"Chưa có đáp án đúng":"",question.sourceImageOnly&&question.sourceImageRects?.some((rect,index)=>!question.sourceImageCrops?.[index])?"Ảnh câu chưa cắt":""].filter(Boolean);
  row.classList.toggle("has-review-issue",Boolean(issues.length));
  const title=row.querySelector(".review-info strong");
  let badge=title.querySelector(".review-issue,.review-ok");
  if(!badge){badge=document.createElement("span");title.append(badge);}
  badge.className=issues.length?"review-issue":"review-ok";
  badge.textContent=issues.join(" · ")||"Đã nhận diện";
  const count=pendingUpload.parsed.questions.filter(item=>item.classificationConfidence==="review"||!item.errorId||!item.answerKey||(item.sourceImageOnly&&item.sourceImageRects?.some((rect,index)=>!item.sourceImageCrops?.[index]))).length;
  const counter=document.querySelector("[data-review-flag-count] b");if(counter)counter.textContent=count;
}
function drawQuestionCropSelection(selection,rect) {
  selection.hidden=false;
  selection.style.left=`${rect.x*100}%`;selection.style.top=`${rect.y*100}%`;
  selection.style.width=`${rect.width*100}%`;selection.style.height=`${rect.height*100}%`;
}
function bindQuestionCropEditor(editor) {
  if(editor.dataset.bound==="true")return;
  editor.dataset.bound="true";
  const stage=editor.querySelector(".question-crop-stage"),image=editor.querySelector(".question-crop-source"),selection=editor.querySelector(".question-crop-selection");
  let start=null,origin=null,moveExisting=false;
  const point=event=>{
    const bounds=image.getBoundingClientRect();
    return {x:Math.max(0,Math.min(1,(event.clientX-bounds.left)/bounds.width)),y:Math.max(0,Math.min(1,(event.clientY-bounds.top)/bounds.height))};
  };
  stage.onpointerdown=event=>{
    if(!image.complete||!image.naturalWidth)return;
    event.preventDefault();stage.setPointerCapture(event.pointerId);start=point(event);
    try { origin=JSON.parse(editor.dataset.cropRect||"null"); } catch { origin=null; }
    moveExisting=Boolean(origin&&start.x>=origin.x&&start.x<=origin.x+origin.width&&start.y>=origin.y&&start.y<=origin.y+origin.height);
    if(!moveExisting)origin=null;
    if(!origin)drawQuestionCropSelection(selection,{x:start.x,y:start.y,width:0,height:0});
  };
  stage.onpointermove=event=>{
    if(!start)return;
    const end=point(event);
    let rect;
    if(moveExisting&&origin)rect={...origin,x:Math.max(0,Math.min(1-origin.width,origin.x+end.x-start.x)),y:Math.max(0,Math.min(1-origin.height,origin.y+end.y-start.y))};
    else rect={x:Math.min(start.x,end.x),y:Math.min(start.y,end.y),width:Math.abs(end.x-start.x),height:Math.abs(end.y-start.y)};
    editor.dataset.cropRect=JSON.stringify(rect);
    drawQuestionCropSelection(selection,rect);
  };
  stage.onpointerup=event=>{if(start){stage.releasePointerCapture(event.pointerId);start=null;}};
}
function normalizeQuestionKey(value,section) {
  const text=String(value||"").trim();
  if(!text)return null;
  if(section==="Đúng / Sai") {
    const labeled=[...text.matchAll(/(?:^|[\s,;])([a-d])\s*[).:= -]?\s*(đúng|sai|đ|s)\b/gi)];
    if(labeled.length)return labeled.map(match=>`${match[1].toUpperCase()}:${/^(đúng|đ)$/i.test(match[2])?"Đ":"S"}`).join("|");
    const sequence=text.match(/^(?:(?:đúng|sai|đ|s)(?:[\s,;/|-]+(?:đúng|sai|đ|s))+)$/i)?.[0];
    if(sequence)return sequence.split(/[\s,;/|-]+/).map((answer,index)=>`${String.fromCharCode(65+index)}:${/^(đúng|đ)$/i.test(answer)?"Đ":"S"}`).join("|");
  }
  const option=text.match(/^\s*([A-D])(?:\b|[).])/i)?.[1];
  if(section==="Trắc nghiệm"&&option)return option.toUpperCase();
  const numeric=text.match(/[-+]?\d+(?:[.,]\d+)?(?:\s*\/\s*[-+]?\d+(?:[.,]\d+)?)?/);
  return numeric?.[0].replace(/\s/g,"").replace(",",".")||text;
}
async function parseDocument(file,{analyzeQuestions=true}={}) {
  const extension=file.name.split(".").pop().toLowerCase();
  if(extension==="pdf") {
    const pdf=await parsePdfDocument(file,{analyzeQuestions});
    if(pdf.aiQuestions)return buildAiPdfResult(pdf.aiQuestions);
    return parseQuestionHtml(pdf.html,pdf.pages,{analyzeQuestions});
  }
  let html="",mathMarkup=new Map();
  if(extension==="txt") {
    html=(await file.text()).split(/\r?\n/).map(line=>line.trim()?`<p>${safe(line)}</p>`:"").join("");
  } else if(extension==="docx") {
    let mammoth=window.mammoth;
    if(!mammoth?.convertToHtml) {
      await import("https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js");
      mammoth=window.mammoth;
    }
    if(!mammoth?.convertToHtml||!mammoth.images?.imgElement)throw new Error("Không tải được bộ đọc Word từ CDN. Kiểm tra kết nối Internet rồi thử lại.");
    const prepared=await prepareWordFile(file);
    mathMarkup=prepared.mathMarkup;
    const result=await mammoth.convertToHtml({arrayBuffer:prepared.arrayBuffer},{convertImage:mammoth.images.imgElement(image=>image.read("base64").then(data=>({src:`data:${image.contentType};base64,${data}`})))});
    html=replaceMathPlaceholders(result.value,mathMarkup);
  } else throw new Error("Định dạng không được hỗ trợ. Chọn file .docx, .pdf hoặc .txt.");
  return parseQuestionHtml(html,null,{analyzeQuestions});
}
async function prepareWordFile(file) {
  const {unzipSync,zipSync}=await import("https://cdn.jsdelivr.net/npm/fflate@0.8.2/esm/browser.js");
  const files=unzipSync(new Uint8Array(await file.arrayBuffer()));
  const documentFile=files["word/document.xml"];
  if(!documentFile)throw new Error("Tệp Word không có cấu trúc DOCX hợp lệ.");
  const xmlText=new TextDecoder().decode(documentFile);
  const xml=new DOMParser().parseFromString(xmlText,"application/xml");
  if(xml.querySelector("parsererror"))throw new Error("Không đọc được cấu trúc XML trong tệp Word.");
  const mathNamespace="http://schemas.openxmlformats.org/officeDocument/2006/math";
  const wordNamespace="http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const paragraphs=[...xml.getElementsByTagNameNS(mathNamespace,"oMathPara")];
  const standalone=[...xml.getElementsByTagNameNS(mathNamespace,"oMath")].filter(node=>{
    for(let parent=node.parentElement;parent;parent=parent.parentElement)if(parent.namespaceURI===mathNamespace&&parent.localName==="oMathPara")return false;
    return true;
  });
  const equations=[...paragraphs,...standalone];
  if(!equations.length)return {arrayBuffer:await file.arrayBuffer(),mathMarkup:new Map()};
  const {default:convertOmml}=await import("https://cdn.jsdelivr.net/npm/omml2mathml@1.3.0/+esm");
  if(typeof convertOmml!=="function")throw new Error("Không tải được bộ chuyển công thức Equation/MathType của Word.");
  const mathMarkup=new Map();
  equations.forEach((equation,index)=>{
    let converted;
    try { converted=convertOmml(equation); }
    catch(error) { throw new Error(`Không chuyển được công thức Word số ${index+1}: ${error.message}`); }
    if(!converted)throw new Error(`Không chuyển được công thức Word số ${index+1}.`);
    const token=`TOANMATH${index}END`;
    mathMarkup.set(token,new XMLSerializer().serializeToString(converted));
    const placeholder=xml.createElementNS(wordNamespace,"w:t");
    placeholder.textContent=token;
    const parent=equation.parentNode;
    if(parent.namespaceURI===wordNamespace&&parent.localName==="r")parent.replaceChild(placeholder,equation);
    else {
      const run=xml.createElementNS(wordNamespace,"w:r");
      run.appendChild(placeholder);
      parent.replaceChild(run,equation);
    }
  });
  files["word/document.xml"]=new TextEncoder().encode(new XMLSerializer().serializeToString(xml));
  const zipped=zipSync(files,{level:6});
  return {arrayBuffer:zipped.buffer.slice(zipped.byteOffset,zipped.byteOffset+zipped.byteLength),mathMarkup};
}
function replaceMathPlaceholders(html,mathMarkup) {
  if(!mathMarkup.size)return html;
  const doc=new DOMParser().parseFromString(html,"text/html");
  const walker=document.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT);
  const textNodes=[];
  while(walker.nextNode())textNodes.push(walker.currentNode);
  for(const textNode of textNodes) {
    const text=textNode.textContent;
    const matches=[...text.matchAll(/TOANMATH\d+END/g)];
    if(!matches.length)continue;
    const fragment=doc.createDocumentFragment();
    let offset=0;
    for(const match of matches) {
      fragment.append(text.slice(offset,match.index));
      const markup=mathMarkup.get(match[0]);
      if(markup) {
        const mathNamespace="http://www.w3.org/1998/Math/MathML";
        const normalizedMarkup=markup.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g,`xmlns="${mathNamespace}"`);
        const mathDoc=new DOMParser().parseFromString(normalizedMarkup,"application/xml");
        if(mathDoc.querySelector("parsererror"))throw new Error("Không đọc được công thức MathML từ tệp Word.");
        let math=mathDoc.documentElement;
        if(math.localName!=="math") {
          const wrapper=mathDoc.createElementNS(mathNamespace,"math");
          math.parentNode.replaceChild(wrapper,math);
          wrapper.appendChild(math);
          math=wrapper;
        }
        fragment.append(doc.importNode(math,true));
      } else fragment.append(match[0]);
      offset=match.index+match[0].length;
    }
    fragment.append(text.slice(offset));
    textNode.replaceWith(fragment);
  }
  return doc.body.innerHTML;
}
async function parsePdfDocument(file,{analyzeQuestions=false}={}) {
  const pdfjs=await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
  const pdfjsCdn="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/";
  const pdf=await pdfjs.getDocument({
    data:new Uint8Array(await file.arrayBuffer()),
    cMapUrl:`${pdfjsCdn}cmaps/`,
    cMapPacked:true,
    standardFontDataUrl:`${pdfjsCdn}standard_fonts/`
  }).promise;
  if(pdf.numPages>80)throw new Error("PDF có hơn 80 trang. Hãy chia nhỏ tệp rồi tải từng phần.");
  const pages=new Map(),paragraphs=[];
  let extractedCharacters=0;
  for(let pageNumber=1;pageNumber<=pdf.numPages;pageNumber++) {
    const page=await pdf.getPage(pageNumber);
    const baseViewport=page.getViewport({scale:1});
    // Render at up to 1600 px wide so small operators, superscripts and infinity signs
    // remain legible in the per-question source crop stored by the free Firestore path.
    const scale=Math.min(2.5,1600/baseViewport.width);
    const viewport=page.getViewport({scale});
    const content=await page.getTextContent();
    const lines=groupPdfTextItems(content.items,pageNumber);
    extractedCharacters+=lines.reduce((sum,line)=>sum+line.text.length,0);
    pages.set(pageNumber,{page,viewport,scale,canvas:null,renderPromise:null});
    for(const line of lines)paragraphs.push(`<p data-source-page="${pageNumber}" data-source-y="${line.y}" data-source-height="${line.height}">${safe(line.text)}</p>`);
  }
  if(!extractedCharacters) {
    if(!analyzeQuestions)throw new Error("PDF này không có lớp văn bản. Bật Dùng Gemini AI để OCR PDF scan.");
    if(pdf.numPages>20)throw new Error("PDF scan vượt quá 20 trang AI mỗi lần. Hãy chia nhỏ tệp để tránh yêu cầu quá lớn.");
    const aiQuestions=[];
    for(let pageNumber=1;pageNumber<=pdf.numPages;pageNumber++) {
      const source=pages.get(pageNumber);
      const pageImages=await renderPdfPageForAi(source);
      const analysis=await analyzeMathQuestions([{
        index:pageNumber-1,
        content:"Đọc và bóc tách câu hỏi Toán trong ảnh trang PDF đính kèm.",
        image_ids:[]
      }],{pageImageBase64:pageImages.ai.split(",")[1]});
      aiQuestions.push(...analysis.questions.map(question=>({...question,pageImageData:pageImages.review,sourcePageNumber:pageNumber})));
    }
    pages.forEach(source=>source.page.cleanup());
    return {aiQuestions};
  }
  return {html:paragraphs.join(""),pages};
}
async function renderPdfPageForAi(source) {
  const canvas=document.createElement("canvas");
  canvas.width=Math.ceil(source.viewport.width);
  canvas.height=Math.ceil(source.viewport.height);
  await source.page.render({canvasContext:canvas.getContext("2d"),viewport:source.viewport}).promise;
  const reviewDataUrl=canvas.toDataURL("image/jpeg",.88);
  let output=document.createElement("canvas"),scale=1;
  for(let attempt=0;attempt<4;attempt++) {
    output.width=Math.max(400,Math.floor(canvas.width*scale));
    output.height=Math.max(500,Math.floor(canvas.height*scale));
    output.getContext("2d").drawImage(canvas,0,0,output.width,output.height);
    const dataUrl=output.toDataURL("image/jpeg",.5);
    if(dataUrl.length<=650000) {
      canvas.width=0;canvas.height=0;output.width=0;output.height=0;
      return {ai:dataUrl,review:reviewDataUrl};
    }
    scale*=.75;
  }
  canvas.width=0;canvas.height=0;output.width=0;output.height=0;
  throw new Error("Không thể nén trang PDF đủ nhỏ để gửi OCR. Hãy chia nhỏ hoặc giảm độ phân giải của tệp.");
}
function buildAiPdfResult(aiQuestions) {
  const sourcePages={};
  const questions=aiQuestions.map((question,index)=>{
    const imageIds=Array.isArray(question.image_ids)?question.image_ids:[];
    const page=Number(question.sourcePageNumber)||index+1;
    if(question.pageImageData)sourcePages[page]=question.pageImageData;
    const options=(question.options||[]).map(option=>({
      label:option.label,text:option.content,html:safe(option.content)
    }));
    const type=question.type;
    return {
      id:`q-${Date.now()}-ocr-${index}`,
      question_number:question.question_number,
      type,
      content:question.content,
      html:"",
      choices:options,
      section:type==="multiple_choice"?"Trắc nghiệm":"Trả lời ngắn",
      errorId:inferErrorCode(question.content),
      answerKey:null,
      correct_answer:null,
      image_ids:imageIds,
      hasImages:Boolean(question.pageImageData)||imageIds.length>0,
      sourceImageOnly:Boolean(question.pageImageData),
      sourceImageRects:question.pageImageData?[{page,x:0,y:0,width:1,height:1}]:[],
      sourceImageCrops:question.pageImageData?[null]:[],
      classificationConfidence:"review"
    };
  });
  return {
    html:"",
    text:questions.map(question=>question.content).join("\n"),
    questions,
    sourcePages,
    imageCount:new Set(aiQuestions.map(question=>question.pageImageData)).size,
    aiUsed:true,
    aiMessage:""
  };
}
function groupPdfTextItems(items,pageNumber) {
  const lines=[];
  const textItems=items.filter(item=>item.str?.trim()&&item.transform?.length>=6).sort((a,b)=>b.transform[5]-a.transform[5]||a.transform[4]-b.transform[4]);
  for(const item of textItems) {
    const y=Number(item.transform[5]),height=Number(item.height)||10;
    let line=lines.find(candidate=>Math.abs(candidate.y-y)<=Math.max(2.5,height*.28));
    if(!line){line={page:pageNumber,y,height,items:[]};lines.push(line);}
    line.items.push(item);line.height=Math.max(line.height,height);
  }
  return lines.sort((a,b)=>b.y-a.y).map(line=>{
    line.items.sort((a,b)=>a.transform[4]-b.transform[4]);
    let text="",lastRight=null;
    for(const item of line.items) {
      const x=Number(item.transform[4]);
      if(text&&lastRight!==null&&x-lastRight>Math.max(1.5,line.height*.15)&&!/\s$/.test(text)&&!/^[,.;:!?%)\]}]/.test(item.str))text+=" ";
      text+=item.str;
      lastRight=x+(Number(item.width)||0);
    }
    return {...line,text:text.trim()};
  }).filter(line=>line.text);
}
async function renderPdfQuestionImages(nodes,pages,questionStarts=[]) {
  const currentQuestion=nodes.filter(node=>isQuestionStart(node.textContent.trim())).at(-1);
  const currentPage=Number(currentQuestion?.getAttribute("data-source-page"));
  const currentY=Number(currentQuestion?.getAttribute("data-source-y"));
  const sourceLines=nodes.map(node=>({
    page:Number(node.getAttribute("data-source-page")),
    y:Number(node.getAttribute("data-source-y")),
    height:Number(node.getAttribute("data-source-height"))||10
  })).filter(line=>pages.has(line.page)&&Number.isFinite(line.y));
  const byPage=new Map();
  for(const line of sourceLines) {
    const lines=byPage.get(line.page)||[];
    lines.push(line);byPage.set(line.page,lines);
  }
  const images=[],crops=[],sourceRects=[];
  for(const [pageNumber,lines] of byPage) {
    const source=pages.get(pageNumber);
    if(!source.canvas) {
      source.canvas=document.createElement("canvas");
      source.canvas.width=Math.ceil(source.viewport.width);
      source.canvas.height=Math.ceil(source.viewport.height);
      source.renderPromise=source.page.render({canvasContext:source.canvas.getContext("2d"),viewport:source.viewport}).promise;
    }
    await source.renderPromise;
    let minY=Math.min(...lines.map(line=>line.y));
    let maxY=Math.max(...lines.map(line=>line.y+line.height));
    const nextQuestion=questionStarts
      .map(node=>({page:Number(node.getAttribute("data-source-page")),y:Number(node.getAttribute("data-source-y")),height:Number(node.getAttribute("data-source-height"))||10}))
      .filter(anchor=>anchor.page===pageNumber&&Number.isFinite(anchor.y)&&(pageNumber>currentPage||(pageNumber===currentPage&&anchor.y<currentY)))
      .sort((a,b)=>b.y-a.y)[0];
    // PDF coordinates increase upward. Fractions, radicals, and superscripts belonging
    // to the next question can sit above its heading in the text layer. Extend the
    // previous crop's lower edge past that heading so the next question's glyphs stay
    // together instead of appearing as a cut-off fragment at the bottom.
    const headingPad=anchor=>Math.max(10,anchor.height*2.25);
    if(nextQuestion)minY=Math.max(minY,nextQuestion.y+headingPad(nextQuestion));
    const padding=Math.max(18,Math.ceil(Math.max(...lines.map(line=>line.height))*source.scale*.75));
    const top=Math.max(0,Math.floor(source.viewport.height-maxY*source.scale-padding));
    const bottom=Math.min(source.canvas.height,Math.ceil(source.viewport.height-minY*source.scale+padding));
    const crop=document.createElement("canvas");
    crop.width=source.canvas.width;crop.height=Math.max(1,bottom-top);
    crop.getContext("2d").drawImage(source.canvas,0,top,crop.width,crop.height,0,0,crop.width,crop.height);
    const dataUrl=crop.toDataURL("image/jpeg",.92);
    images.push(`<img class="pdf-source-image" src="${dataUrl}" alt="Ảnh câu hỏi từ trang PDF ${pageNumber}"/>`);
    crops.push(dataUrl);
    sourceRects.push({page:pageNumber,x:0,y:top/source.canvas.height,width:1,height:(bottom-top)/source.canvas.height});
  }
  return {html:images.join(""),crops,sourceRects};
}
async function parseQuestionHtml(html,pdfPages=null,{analyzeQuestions=true}={}) {
  const safeHtml=sanitizeDocumentHtml(html,{preservePdfSource:Boolean(pdfPages)});
  const doc=new DOMParser().parseFromString(safeHtml,"text/html");
  const blocks=splitQuestionParagraphs([...doc.body.children]);
  let aiQuestions=null,aiMessage=analyzeQuestions?"":"Bạn đã không chọn gửi văn bản lên AI";
  const imageSources=new Map();
  if(analyzeQuestions&&blocks.length) {
    try {
      const aiInput=prepareAiQuestionInput(blocks);
      const analysis=await analyzeMathQuestions(aiInput.blocks);
      aiQuestions=analysis.questions;
    } catch(error) {
      aiMessage=aiErrorMessage(error);
      console.error("AI math-question analysis failed; using local detection.",error);
    }
  }
  const groups=[];
  let preamble=[];
  let currentSection=null;
  for(let blockIndex=0;blockIndex<blocks.length;blockIndex++) {
    const block=blocks[blockIndex];
    const text=block.textContent.trim();
    const detectedSection=sectionFromText(text);
    if(detectedSection) {
      currentSection=detectedSection;
      continue;
    }
    if(isQuestionStart(text)) {
      const context=preamble.filter(item=>{
        const heading=item.textContent.trim();
        return !(heading.length<100&&heading===heading.toLocaleUpperCase("vi")&&/[A-ZÀ-Ỵ]/.test(heading));
      });
      groups.push({blocks:[...context,block],section:currentSection});
      preamble=[];
    }
    else if(groups.length) groups.at(-1).blocks.push(block);
    else if(text) preamble.push(block);
  }
  if(preamble.length) {
    if(groups.length)groups[0].blocks.unshift(...preamble);
    else groups.push({blocks:preamble,section:currentSection});
  }
  if(!groups.length&&safeHtml.trim())groups.push({blocks:[...doc.body.children],section:currentSection});
  const questions=[];
  for(let i=0;i<groups.length;i++) {
    const group=groups[i];
    const nodes=group.blocks;
    const questionNodes=nodes.filter(node=>!sectionFromText(node.textContent.trim()));
    const optionNodes=[];
    const contentNodes=[];
    for(const node of questionNodes) {
      const inline=splitInlineOptions(node);
      if(inline) {
        if(inline.prompt.trim())contentNodes.push(htmlBlock(node,inline.prompt));
        optionNodes.push(...inline.choices.map(choice=>({label:choice.label,html:choice.html,text:choice.text})));
        continue;
      }
      const start=node.textContent.match(/^\s*(?:\*\*)?([A-Da-d])\s*[).:](?:\*\*)?\s*/);
      if(start)optionNodes.push({label:start[1].toUpperCase(),html:richTextSlice(node,start[0].length,node.textContent.length),text:node.textContent.slice(start[0].length).trim()});
      else contentNodes.push(node);
    }
    const choices=optionNodes.filter(choice=>choice.label&&choice.text);
    const rawContent=questionNodes.map(node=>node.textContent.trim()).filter(Boolean).join("\n");
    const content=contentNodes.filter(node=>!/^(?:đáp\s*án|đáp\s*số|kết\s*quả)\s*[:：]/i.test(node.textContent.trim())).map(node=>node.textContent.trim()).filter(Boolean).join("\n");
    const section=group.section||classifySection(rawContent,i,choices.length);
    const answerKey=inferAnswerKey(rawContent,section,choices);
    const visibleNodes=contentNodes.filter(node=>!/^(?:đáp\s*án|đáp\s*số|kết\s*quả)\s*[:：]/i.test(node.textContent.trim()));
    let questionHtml=visibleNodes.map(node=>removePdfSourceAttributes(node).outerHTML).join("");
    let sourceImageRects=[],sourceImageCrops=[];
    if(pdfPages) {
      const rendered=await renderPdfQuestionImages(nodes,pdfPages,blocks.filter(candidate=>isQuestionStart(candidate.textContent.trim())));
      questionHtml=rendered.html;sourceImageRects=rendered.sourceRects;sourceImageCrops=rendered.crops;
      if(!questionHtml)questionHtml=visibleNodes.map(node=>removePdfSourceAttributes(node).outerHTML).join("");
    }
    const selectedChoices=section==="Đúng / Sai"?choices.filter(choice=>/^[a-d]$/.test(choice.label.toLowerCase())):choices;
    const errorCode=inferErrorCode(content);
    const imageIds=[...new Set([...rawContent.matchAll(/\[IMAGE_ID:\s*([^\]]+)\]|\[(IMAGE_\d+[^]\s]*)\]/gi)].map(match=>(match[1]||match[2]).trim()))];
    const question={id:`q-${Date.now()}-${i}`,content,html:questionHtml,choices:selectedChoices,section,errorId:errorCode,answerKey,hasImages:questionHtml.includes("<img")||selectedChoices.some(choice=>choice.html.includes("<img")),sourceImageOnly:Boolean(pdfPages&&questionHtml.includes("<img")),sourceImageRects,sourceImageCrops,classificationConfidence:(group.section||choices.length>=2)&&errorCode?"high":"review",image_ids:imageIds};
    if(question.content.length>5||question.hasImages)questions.push(question);
  }
  if(aiQuestions) {
    const normalizedAiQuestions=aiQuestions.map((aiQuestion,index)=>{
      const source=questions.length?questions[Math.min(index,questions.length-1)]:null;
      const options=(aiQuestion.options||[]).map(option=>{
        const original=source?.choices?.find(choice=>choice.label.toUpperCase()===option.label.toUpperCase());
        return {
          label:option.label,
          text:option.content,
          html:`${renderAiQuestionContent(option.content,imageSources)||safe(option.content)}${original?.html?.match(/<img\b[^>]*>/gi)?.join("")||""}`
        };
      });
      const type=aiQuestion.type;
      const section=type==="multiple_choice"?(options.length>=2?"Trắc nghiệm":source?.section||"Trắc nghiệm"):"Trả lời ngắn";
      const imageIds=Array.isArray(aiQuestion.image_ids)?aiQuestion.image_ids:[];
      const imageHtml=renderAiQuestionContent(aiQuestion.content,imageSources);
      const sourceImages=source?.html?.match(/<img\b[^>]*>/gi)||[];
      return {
        id:`q-${Date.now()}-ai-${index}`,
        question_number:aiQuestion.question_number,
        type,
        content:aiQuestion.content,
        html:`${imageHtml||safe(aiQuestion.content)}${sourceImages.length?`<br/>${sourceImages.join("")}`:""}`,
        choices:options,
        section,
        errorId:inferErrorCode(aiQuestion.content),
        answerKey:null,
        correct_answer:null,
        image_ids:imageIds,
        hasImages:imageIds.length>0||Boolean(source?.hasImages),
        sourceImageRects:source?.sourceImageRects||[],
        sourceImageCrops:source?.sourceImageCrops||[],
        sourceImageOnly:Boolean(source?.sourceImageOnly),
        classificationConfidence:"review"
      };
    });
    questions.splice(0,questions.length,...normalizedAiQuestions);
  }
  const sourcePages={};
  if(pdfPages)for(const question of questions)for(const rect of question.sourceImageRects||[]) {
    const source=pdfPages.get(rect.page);
    if(source?.canvas&&!sourcePages[rect.page])sourcePages[rect.page]=source.canvas.toDataURL("image/jpeg",.88);
  }
  pdfPages?.forEach(page=>{if(page.canvas){page.canvas.width=0;page.canvas.height=0;}}); 
  const text=questions.map(q=>q.content).join("\n");
  return {html:safeHtml,text,questions,sourcePages,imageCount:Math.max((safeHtml.match(/<img\b/gi)||[]).length,questions.filter(q=>q.hasImages).length),aiUsed:Boolean(aiQuestions),aiMessage};
}
function prepareAiQuestionInput(blocks) {
  const prepared=blocks.map((block,index)=>{
    const content=block.innerHTML.replace(/<img\b[^>]*>/gi,"[HÌNH ẢNH GỐC ĐƯỢC GIỮ NGUYÊN]");
    const imageIds=[...new Set([...content.matchAll(/\[IMAGE_ID:\s*([^\]]+)\]|\[(IMAGE_\d+[^]\s]*)\]/gi)].map(match=>(match[1]||match[2]).trim()))];
    return {index,content,image_ids:imageIds};
  });
  const totalLength=prepared.reduce((sum,block)=>sum+block.content.length,0);
  if(prepared.length>1200||totalLength>70000)throw new Error("Tài liệu quá dài để phân tích AI một lần. Hãy chia nhỏ file.");
  return {blocks:prepared};
}
function renderAiQuestionContent(content,imageSources) {
  const escaped=safe(content);
  const withImages=escaped.replace(/\[IMAGE_ID:\s*([^\]]+)\]/g,(placeholder,id)=>{
    const source=imageSources.get(id.trim());
    return source?`<img src="${source}" alt="Hình ${safe(id.trim())}"/>`:placeholder;
  });
  return withImages.replace(/\r?\n/g,"<br/>");
}
async function analyzeMathQuestions(blocks,options={}) {
  if(!session?.id||!FIREBASE_CONFIG)throw new Error("Cần đăng nhập và cấu hình Firebase Functions.");
  if(!blocks.length)return {total_questions:0,questions:[]};
  await configureFirebaseFunctions();
  const callable=firebaseSdk.httpsCallable(firebaseFunctions,"analyzeMathQuestions",{timeout:120000});
  const result=await callable({blocks,...options});
  const questions=result.data?.questions;
  if(!Array.isArray(questions))throw new Error("AI không trả về danh sách câu hỏi hợp lệ.");
  return {total_questions:questions.length,questions};
}
function aiErrorMessage(error) {
  if(error.code==="functions/not-found")return "Cloud Function AI chưa được triển khai";
  if(error.code==="functions/unauthenticated")return "Phiên đăng nhập đã hết hạn";
  if(error.code==="functions/permission-denied")return "Tài khoản hiện tại chưa có quyền giáo viên";
  if(error.code==="functions/failed-precondition")return "Chưa cấu hình GEMINI_API_KEY cho Cloud Functions";
  if(error.code==="functions/unavailable")return "Gemini hoặc Cloud Functions tạm thời không khả dụng";
  return error.message||"Dịch vụ AI hiện chưa sẵn sàng";
}
function isQuestionStart(text) {
  const normalized=String(text).replace(/[\u00a0\u2007\u202f]/g," ").trimStart();
  return /^(?:[\[(]\s*)?(?:(?:c[âa]u(?:\s*h[oỏ]i|\s*s[oố])?|b[àa]i(?:\s*t[aậ]p)?|question|problem|q)\s*(?:s[oố]\s*)?\d{1,3}(?:\s*[:.)]|\s+[-–—]\s+|\s+(?=\S)|$)|\d{1,3}\s*[.):]\s*(?=\S))/i.test(normalized);
}
function richTextSlice(node,start,end) {
  if(end<=start)return "";
  const walker=node.ownerDocument.createTreeWalker(node,NodeFilter.SHOW_TEXT),runs=[];
  let offset=0;
  while(walker.nextNode()) {
    const current=walker.currentNode,from=offset,to=offset+current.textContent.length;
    if(to>start&&from<end)runs.push({node:current,from,to});
    offset=to;
  }
  if(!runs.length)return "";
  const range=node.ownerDocument.createRange();
  range.setStart(runs[0].node,Math.max(0,start-runs[0].from));
  const last=runs[runs.length-1];
  range.setEnd(last.node,Math.min(last.node.textContent.length,end-last.from));
  const container=node.ownerDocument.createElement("div");
  container.append(range.cloneContents());
  return container.innerHTML;
}
function htmlBlock(node,content) {
  const tag=["P","DIV","LI"].includes(node.tagName)?node.tagName.toLowerCase():"p";
  const copy=node.ownerDocument.createElement(tag);
  copy.innerHTML=content;
  return copy;
}
function splitQuestionParagraphs(nodes) {
  const result=[];
  const boundary=/\s+(?=(?:C[âa]u(?:\s*h[oỏ]i|\s*số)?|B[àa]i(?:\s*tập)?|Question|Problem)\s*(?:số\s*)?\d{1,3}\s*[:.)])/gi;
  for(const node of nodes) {
    if(node.hasAttribute("data-source-page")){result.push(node);continue;}
    const text=node.textContent,starts=[0];
    for(const match of text.matchAll(boundary)) {
      const start=match.index+match[0].length;
      if(start>starts.at(-1)&&start<text.length)starts.push(start);
    }
    if(starts.length===1){result.push(node);continue;}
    for(let index=0;index<starts.length;index++) {
      const content=richTextSlice(node,starts[index],starts[index+1]??text.length).trim();
      if(content)result.push(htmlBlock(node,content));
    }
  }
  return result;
}
function splitInlineOptions(node) {
  const text=node.textContent;
  const matches=[...text.matchAll(/(^|[\s\u00a0])(\*\*)?([A-D])\s*[).:](?:\*\*)?\s*(?=\S)/g)];
  const choices=matches.map(match=>({label:match[3],start:match.index+match[1].length,end:match.index+match[0].length}));
  if(choices.length<2||choices[0].label!=="A")return null;
  for(let index=1;index<choices.length;index++)if(choices[index].label.charCodeAt(0)!==choices[index-1].label.charCodeAt(0)+1)return null;
  let promptEnd=choices[0].start;
  const optionNumber=text.slice(0,promptEnd).match(/\s+\d{1,2}[.)]\s*$/);
  if(optionNumber)promptEnd-=optionNumber[0].length;
  const prefix=richTextSlice(node,0,promptEnd).trim();
  const result=choices.map((choice,index)=>{
    const end=choices[index+1]?.start??text.length;
    const body=richTextSlice(node,choice.end,end).trim();
    const bodyText=text.slice(choice.end,end).trim();
    return {label:choice.label,html:body,text:bodyText};
  }).filter(choice=>choice.text);
  return result.length>=2?{prompt:prefix,choices:result}:null;
}
function removePdfSourceAttributes(node) {
  const clone=node.cloneNode(true);
  for(const element of [clone,...clone.querySelectorAll("*")])for(const attr of [...element.attributes])if(attr.name.startsWith("data-source-"))element.removeAttribute(attr.name);
  return clone;
}
function sanitizeDocumentHtml(html,{preservePdfSource=false}={}) {
  const parsed=new DOMParser().parseFromString(html,"text/html");
  const allowed=new Set(["P","DIV","SPAN","BR","B","STRONG","I","EM","U","SUB","SUP","TABLE","THEAD","TBODY","TR","TD","TH","UL","OL","LI","PRE","CODE","IMG","MATH","MI","MN","MO","MROW","MSUP","MSUB","MSUBSUP","MFRAC","MSQRT","MROOT","MSTYLE","MTEXT","MTABLE","MTR","MTD","MUNDER","MOVER","MUNDEROVER","MFENCED","MSPACE","MPADDED","MPHANTOM","MENCLOSE","SEMANTICS","ANNOTATION"]);
  const mathAttributes=new Set(["accent","accentunder","columnalign","columnspacing","depth","displaystyle","display","fence","height","linethickness","lspace","mathvariant","rowalign","rowspacing","rspace","scriptlevel","separator","stretchy","width","encoding"]);
  const clean=node=>{
    for(const child of [...node.children]) {
      const tagName=child.tagName.toUpperCase();
      if(!allowed.has(tagName)){child.replaceWith(...child.childNodes);continue;}
      for(const attr of [...child.attributes]) {
        let safeStorageImage=false;
        if(tagName==="IMG"&&attr.name==="src"&&FIREBASE_CONFIG?.storageBucket) {
          try {
            const url=new URL(attr.value);
            safeStorageImage=url.protocol==="https:"&&url.hostname==="firebasestorage.googleapis.com"&&url.pathname.includes(FIREBASE_CONFIG.storageBucket);
          } catch {}
        }
        const safeImage=tagName==="IMG"&&attr.name==="src"&&(/^data:image\/(?:png|jpeg|gif|webp);base64,/i.test(attr.value)||safeStorageImage);
        const safeAlt=tagName==="IMG"&&attr.name==="alt";
        const safeMath=child.namespaceURI==="http://www.w3.org/1998/Math/MathML"&&mathAttributes.has(attr.name.toLowerCase())&&/^[\w\s.%\-+]*$/.test(attr.value);
        const safePdf=preservePdfSource&&/^data-source-(?:page|y|height)$/.test(attr.name)&&/^\d+(?:\.\d+)?$/.test(attr.value);
        if(safeImage||safeAlt||safeMath||safePdf)continue;
        child.removeAttribute(attr.name);
      }
      clean(child);
    }
  };
  clean(parsed.body);
  return parsed.body.innerHTML;
}
function sectionFromText(text) {
  const heading=normalizeVietnamese(text.trim());
  if(/^(?:phan|part)\s*(?:iii|3)\b|^tra loi (?:ngan|ket qua)\b/i.test(heading))return "Trả lời ngắn";
  if(/^(?:phan|part)\s*(?:ii|2)\b|^dung\s*[/&]?\s*sai\b/i.test(heading))return "Đúng / Sai";
  if(/^(?:phan|part)\s*(?:i|1)\b|^trac nghiem nhieu lua chon\b/i.test(heading))return "Trắc nghiệm";
  return null;
}
function normalizeVietnamese(text) {
  return String(text).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[đĐ]/g,"d").toLocaleLowerCase("vi");
}
function classifySection(text,index,choiceCount=0) {
  const normalized=normalizeVietnamese(text);
  if(/tra loi ngan|dap so|dien ket qua/i.test(normalized))return "Trả lời ngắn";
  if(/dung\s*[/&]?\s*sai|moi menh de|cac menh de|xac dinh tinh dung/i.test(normalized))return "Đúng / Sai";
  if(choiceCount>=2)return "Trắc nghiệm";
  return "Trả lời ngắn";
}
function inferAnswerKey(text,section,choices) {
  const explicit=text.match(/(?:đáp\s*án|đáp\s*số|kết\s*quả)\s*[:：]\s*([^\n]+)/i)?.[1]?.trim()
    ||text.match(/(?:^|\n)\s*(?:[a-d]\s*[).:]\s*(?:đúng|sai|đ|s)\s*[,;]?[\s]*){2,}/i)?.[0]?.trim();
  if(!explicit)return null;
  if(section==="Đúng / Sai") {
    const answers=[...explicit.matchAll(/(?:^|[\s,;])([a-d])\s*[).:= -]?\s*(đúng|sai|đ|s)\b/gi)];
    if(answers.length)return answers.map(match=>`${match[1].toUpperCase()}:${/^(đúng|đ)$/i.test(match[2])?"Đ":"S"}`).join("|");
    const sequence=explicit.match(/^(?:(?:đúng|sai|đ|s)(?:[\s,;/|-]+(?:đúng|sai|đ|s))+)$/i)?.[0];
    if(sequence)return sequence.split(/[\s,;/|-]+/).map((value,index)=>`${String.fromCharCode(65+index)}:${/^(đúng|đ)$/i.test(value)?"Đ":"S"}`).join("|");
  }
  const option=explicit.match(/^\s*([A-D])(?:\b|[).])/i)?.[1]?.toUpperCase();
  if(option&&choices.some(choice=>choice.label===option))return option;
  const numeric=explicit.match(/[-+]?\d+(?:[.,]\d+)?(?:\s*\/\s*[-+]?\d+(?:[.,]\d+)?)?/);
  return numeric?.[0].replace(/\s/g,"").replace(",",".")||null;
}
function inferErrorCode(text) {
  const normalized=normalizeVietnamese(text);
  if(/mo hinh|tinh huong thuc te|bai toan thuc te|dat an|dai luong thuc te|chuyen .*thanh .*toan hoc/i.test(normalized))return "MH";
  if(/doc hieu|du kien|du lieu|yeu cau|theo de|quan sat hinh|dua vao bieu do/i.test(normalized))return "DG";
  if(/dieu kien|quy trinh|kiem tra nghiem|tap xac dinh|truong hop/i.test(normalized))return "QT";
  if(/suy luan|lap luan|chung minh|ket luan/i.test(normalized))return "SU";
  if(/phuong phap|cach giai|chien luoc|gia tri lon nhat|gia tri nho nhat/i.test(normalized))return "PP";
  if(/dao ham|sai dau|bien doi|tinh toan|gioi han|tinh gia tri|giai phuong trinh|giai bat phuong trinh|(?:^|\n)\s*(?:cau\s*\d+[.:)]?\s*)?(?:tinh|tim|rut gon|khai trien)\b/i.test(normalized))return "TT";
  if(/dinh nghia|khai niem|cong thuc|dinh ly|tinh chat|diem cuc tri|do thi|tiep can/i.test(normalized))return "KT";
  return null;
}
async function compressInlineImage(dataUrl,maxBytes=300*1024) {
  if(!/^data:image\/(?:png|jpeg|webp);base64,/i.test(dataUrl)||dataUrl.length<maxBytes*1.35)return dataUrl;
  try {
    const image=new Image();
    image.src=dataUrl;
    await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;});
    const maxDimension=Math.max(image.naturalWidth,image.naturalHeight);
    for(const dimension of [2000,1600,1400,1200,1000,850]) {
      const scale=Math.min(1,dimension/maxDimension);
      const canvas=document.createElement("canvas");
      canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
      canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
      canvas.getContext("2d").drawImage(image,0,0,canvas.width,canvas.height);
      for(const quality of [0.88,0.82,0.76,0.7]) {
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/webp",quality));
        if(!blob)break;
        if(blob.size<=maxBytes)return await new Promise((resolve,reject)=>{
          const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);
        });
      }
    }
  } catch(error) { console.warn("Không thể nén ảnh nhúng; sẽ thử lưu ảnh gốc.",error); }
  return dataUrl;
}
async function saveQuestionSet(set) {
  await configureFirestore();
  const fs=firebaseSdk;
  let uploadStep="kiểm tra hồ sơ giáo viên";
  const profile=await firebaseRequest(fs.getDoc(fs.doc(firebaseDb,"users",session.id)));
  if(!profile.exists()||!["teacher","owner"].includes(profile.data().role)) {
    const error=new Error("Tài khoản Firebase này chưa có role teacher/owner trong users/{UID}. Đăng nhập bằng tài khoản giáo viên đã được cấp quyền rồi thử lại.");
    error.code="app/teacher-role-required";
    throw error;
  }
  const setRef=fs.doc(firebaseDb,"questionSets",set.id);
  const metadata={
    id:set.id,title:set.title,filename:set.filename,type:set.type,questionCount:set.questionCount,
    sections:set.sections,teacherId:session.id,status:"uploading",hiddenFromStudents:false,createdAt:new Date().toISOString()
  };
  const storedQuestionIds=[];
  try {
    uploadStep="tạo bộ đề trong Firestore";
    await firebaseRequest(fs.setDoc(setRef,metadata));
    const questions=[];
    for(const [questionIndex,original] of set.questions.entries()) {
      const question={...original,setId:set.id};
      const preserveInlineImages=async html=>{
        const parsed=new DOMParser().parseFromString(html||"","text/html");
        for(const image of parsed.querySelectorAll("img")) {
          if(/^data:image\/(?:png|jpeg|webp);base64,/i.test(image.src)) {
            uploadStep=`nén hình câu ${questionIndex+1} để lưu trong Firestore`;
            image.src=await compressInlineImage(image.src);
          }
        }
        return parsed.body.innerHTML;
      };
      question.html=await preserveInlineImages(question.html);
      for(const choice of question.choices||[]) {
        choice.html=await preserveInlineImages(choice.html);
      }
      if(new Blob([JSON.stringify(question)]).size>850*1024)throw new Error(`Câu ${question.questionNumber||question.id} vẫn quá lớn sau khi nén ảnh. Hãy giảm ảnh hoặc bỏ ảnh trong câu này.`);
      uploadStep=`lưu câu ${questionIndex+1} vào Firestore`;
      await firebaseRequest(fs.setDoc(fs.doc(setRef,"questions",question.id),question));
      storedQuestionIds.push(question.id);
      questions.push(question);
    }
    uploadStep="công bố bộ đề cho học sinh";
    await firebaseRequest(fs.updateDoc(setRef,{status:"published"}));
    return {...set,...metadata,status:"published",questions};
  } catch(error) {
    await Promise.allSettled(storedQuestionIds.map(questionId=>fs.deleteDoc(fs.doc(setRef,"questions",questionId))));
    await fs.deleteDoc(setRef).catch(()=>{});
    error.message=`${uploadStep}: ${error.message}`;
    throw error;
  }
}
async function deleteFirebaseQuestionSet(set) {
  await configureFirestore();
  const fs=firebaseSdk;
  const setRef=fs.doc(firebaseDb,"questionSets",set.id);
  const questions=await firebaseRequest(fs.getDocs(fs.collection(setRef,"questions")));
  for(let index=0;index<questions.docs.length;index+=500) {
    const batch=fs.writeBatch(firebaseDb);
    questions.docs.slice(index,index+500).forEach(question=>batch.delete(question.ref));
    await firebaseRequest(batch.commit());
  }
  await firebaseRequest(fs.deleteDoc(setRef));
}
async function saveUploadedDoc(errorsOnly) {
  if(!pendingUpload)return;
  const name=document.querySelector("#doc-title").value.trim()||pendingUpload.file.name;
  if(errorsOnly) {
    data.errorDocs=data.errorDocs||[];
    data.errorDocs.push({id:`e-${Date.now()}`,name,summary:summarizeErrors(pendingUpload.parsed.text),text:pendingUpload.parsed.text.slice(0,6000)});
  } else {
    const uncropped=pendingUpload.parsed.questions.find(q=>q.sourceImageOnly&&q.sourceImageRects?.some((rect,index)=>!q.sourceImageCrops?.[index]));
    if(uncropped) {
      const row=document.querySelector(`[data-question-id="${CSS.escape(uncropped.id)}"]`);
      const details=row?.querySelector(".review-detail");if(details)details.open=true;
      row?.scrollIntoView({behavior:"smooth",block:"center"});
      toast("Cắt ảnh trọn câu cho các câu được đánh dấu trước khi lưu.");
      return;
    }
    const questions=pendingUpload.parsed.questions.map(question=>{
      const stored={...question,html:question.sourceImageRects?.length?questionSourceImageHtml(question):question.html};
      delete stored.sourceImageRects;delete stored.sourceImageCrops;
      return stored;
    });
    let set={id:`set-${Date.now()}`,title:name,filename:pendingUpload.file.name,type:document.querySelector("#doc-topic").value,questionCount:questions.length,sections:[...new Set(questions.map(q=>q.section))],questions};
    if(session?.source==="firebase")set=await saveQuestionSet(set);
    data.sets.push(set);data.questions.push(...set.questions.map(q=>({...q,setId:set.id})));
  }
  const cloudSaved=!errorsOnly&&session?.source==="firebase";
  const savedLocally=saveData();
  if(!savedLocally&&!cloudSaved)return;
  pendingUpload=null;document.querySelector(".modal-backdrop")?.remove();render();
  toast(!savedLocally
    ?"Đã lưu bộ đề lên Firebase; trình duyệt không đủ dung lượng để lưu bản tạm."
    :errorsOnly?"Đã lưu tài liệu và tạo tóm tắt nội dung.":cloudSaved?"Đã lưu câu hỏi và hình ảnh đã nén trong Firestore; tệp gốc không được lưu trên đám mây.":"Đã thêm bộ đề vào kho câu hỏi.");
}
function summarizeErrors(text) {
  const matches=errors.filter(e=>e[1].toLocaleLowerCase("vi").split(" ").some(w=>w.length>4&&text.toLocaleLowerCase("vi").includes(w)));
  return matches.length?`Nhận diện nội dung liên quan: ${matches.map(e=>e[1]).join(", ")}.`:"Đã trích xuất nội dung. Chưa có AI kết nối; giáo viên vui lòng xem tài liệu để xác nhận và gắn nhóm lỗi phù hợp.";
}
function showSetModal(set) {
  if(!set)return;
  const qs=set.questions||[];
  if(!isTeacher()) {
    showModal(`Xem trước bộ đề: ${safe(set.title)}`,
      `<p class="subhead">${set.questionCount} câu · ${safe(set.filename)} · ${qs.filter(q=>q.hasImages).length} câu có hình.</p><div class="question-preview review-list">${qs.map((q,i)=>`<article class="review-row"><div class="review-info"><strong>Câu ${i+1}</strong><span>${q.sourceImageOnly?"Nội dung được giữ nguyên trong ảnh câu hỏi.":`${safe(q.content.slice(0,145))}${q.content.length>145?"…":""}`}</span></div><details class="review-detail"><summary>Xem nội dung câu hỏi</summary><div class="doc-html">${q.html||safe(q.content)}${renderQuestionChoices(q)}</div></details></article>`).join("")}</div>`,
      `<button class="btn secondary" data-action="close-modal">Đóng</button><button class="btn" data-action="choose-set" data-id="${safe(set.id)}">Chọn đề tự luyện</button>`);
    return;
  }
  const counts=Object.fromEntries(["Trắc nghiệm","Đúng / Sai","Trả lời ngắn"].map(section=>[section,qs.filter(q=>q.section===section).length]));
  showModal(`Rà soát bộ đề: ${safe(set.title)}`,`<p class="subhead">${set.questionCount} câu · ${safe(set.filename)} · ${qs.filter(q=>q.hasImages).length} câu có hình. Phần thi và mã lỗi đã được gợi ý tự động.</p><div class="review-summary">${Object.entries(counts).map(([section,count])=>`<span>${section}: <b>${count}</b></span>`).join("")}<span>Cần rà soát: <b>${qs.filter(q=>q.classificationConfidence==="review"||!q.errorId).length}</b></span></div><div class="question-preview review-list">${qs.map((q,i)=>`<article class="review-row"><div class="review-info"><strong>Câu ${i+1}${q.classificationConfidence==="review"?'<span class="priority">Cần xem</span>':""}</strong><span>${q.sourceImageOnly?"Nội dung được giữ nguyên trong ảnh câu hỏi.":`${safe(q.content.slice(0,145))}${q.content.length>145?"…":""}`}</span><small>${q.choices?.length?`${q.choices.length} lựa chọn`:"Câu trả lời ngắn"} · ${q.hasImages?"Có hình": "Không có hình"}</small></div><select aria-label="Phần đề câu ${i+1}" class="question-section compact-select" data-question-id="${q.id}">${["Trắc nghiệm","Đúng / Sai","Trả lời ngắn"].map(s=>`<option ${q.section===s?"selected":""}>${s}</option>`).join("")}</select><select aria-label="Mã lỗi câu ${i+1}" class="question-error compact-select" data-question-id="${q.id}"><option value="">Mã lỗi…</option>${errors.map(e=>`<option value="${e[0]}" ${q.errorId===e[0]?"selected":""}>${e[0]}</option>`).join("")}</select><details class="review-detail"><summary>Xem câu và đáp án</summary><div class="doc-html">${q.html||safe(q.content)}${renderQuestionChoices(q)}</div><label class="answer-key-label">Đáp án đúng <input class="question-key" data-question-id="${q.id}" value="${safe(q.answerKey||"")}" placeholder="${q.section==="Trả lời ngắn"?"Ví dụ: 2 hoặc 3/4":"A, B, C, D hoặc chuỗi Đ/S"}"/></label></details></article>`).join("")}</div><p class="notice">AI tách câu và công thức khi được bật lúc tải tài liệu. Đáp án AI luôn để trống, không tự giải; phần thi và mã lỗi là gợi ý, hãy kiểm tra nội dung và đáp án trước khi lưu.</p>`,`<button class="btn" data-action="close-modal">Lưu rà soát</button>`);
  document.querySelectorAll(".question-error").forEach(el=>el.onchange=()=>updateQuestion(set.id,el.dataset.questionId,{errorId:el.value||null}));
  document.querySelectorAll(".question-key").forEach(el=>el.onchange=()=>{
    const question=set.questions.find(item=>item.id===el.dataset.questionId);
    if(question)updateQuestion(set.id,el.dataset.questionId,{answerKey:normalizeQuestionKey(el.value,question.section)});
  });
  document.querySelectorAll(".question-section").forEach(el=>el.onchange=()=>{
    const question=set.questions.find(item=>item.id===el.dataset.questionId);
    if(question)updateQuestion(set.id,el.dataset.questionId,{section:el.value,answerKey:normalizeQuestionKey(question.answerKey,el.value)});
  });
}
async function updateQuestion(setId,questionId,changes) {
  const set=data.sets.find(item=>item.id===setId);
  const update=list=>{const q=list.find(item=>item.id===questionId);if(q)Object.assign(q,changes);};
  if(set)update(set.questions||[]);
  update(data.questions);
  if(!saveData())return;
  const question=data.questions.find(item=>item.id===questionId);
  if(session?.source==="firebase"&&set&&question) {
    try {
      await configureFirestore();
      await firebaseRequest(firebaseSdk.setDoc(
        firebaseSdk.doc(firebaseDb,"questionSets",setId,"questions",questionId),
        question,
        {merge:true}
      ));
    } catch(error) {
      console.error("Could not update Firebase question metadata.",error);
      toast(`Không đồng bộ được phân loại câu hỏi: ${firebaseFirestoreError(error)}`);
    }
  }
}
function showStudentModal() {
  showModal("Hướng dẫn học sinh đăng ký",`<p class="subhead">Học sinh cần tự tạo tài khoản để liên kết an toàn với Firebase Authentication.</p><ol style="font-size:11px;line-height:1.9;color:#68748a;padding-left:20px"><li>Mở website Toán học và chọn vai trò <b>Học sinh</b>.</li><li>Nhập email, mật khẩu rồi chọn <b>Tạo tài khoản học sinh</b>.</li><li>Sau khi đăng ký, tài khoản sẽ tự xuất hiện trong danh sách này.</li></ol><p class="notice">Không nhập hoặc lưu mật khẩu của học sinh thay các em.</p>`,`<button class="btn" data-action="close-modal">Đã hiểu</button>`);
}
function showExamModal(personal,studentId=null,selectedSetIds=[],selectedErrorIds=[]) {
  const sets=data.sets||[];
  const activeStudents=data.users.filter(user=>user.role==="student"&&user.accountStatus!=="pendingDeletion");
  const initialErrors=errors.map((e,i)=>({code:e[0],count:userStats(session).counts[i]})).sort((a,b)=>b.count-a.count).slice(0,3).map(e=>e.code);
  const checkedErrors=selectedErrorIds.length?selectedErrorIds:initialErrors;
  if(!sets.length){toast("Bạn cần tải ít nhất một file .docx vào Kho câu hỏi trước.");if(isTeacher()){currentPage="library";render();}return;}
  showModal(personal?"Tạo đề tự luyện":"Tạo đề ôn tập mới",
    `<div class="form-grid"><div class="field full"><label>Tên đề</label><input id="exam-title" value="${personal?"Đề tự luyện của "+safe(userName()):"Đề ôn tập mới"}"/></div><div class="field"><label>Số câu</label><select id="exam-count">${[10,20,30,40].map(x=>`<option>${x}</option>`).join("")}</select></div><div class="field"><label>Hạn hoàn thành</label><input id="exam-due" type="date"/></div><div class="field full"><label>Chọn bộ đề làm nguồn (có thể chọn nhiều)</label><div class="assignment-list">${sets.map(s=>`<label class="assignment"><input class="exam-set-check" type="checkbox" value="${safe(s.id)}" ${selectedSetIds.length?selectedSetIds.includes(s.id)?"checked":"": "checked"}/><div class="assignment-details"><strong>${safe(s.title)}</strong><span>${s.questionCount} câu · ${safe(s.filename)}</span></div></label>`).join("")}</div></div>${!personal?`<div class="field full"><label>Giao đề cho học sinh</label>${activeStudents.length?`<div class="assignment-list">${activeStudents.map(user=>`<label class="assignment"><input class="exam-student-check" type="checkbox" value="${safe(user.id)}" ${studentId?studentId===user.id?"checked":"disabled":"checked"}/><div class="assignment-details"><strong>${safe(user.name)}</strong><span>${safe(user.email)}</span></div>${studentId===user.id?'<span class="priority">Giao đề ưu tiên</span>':""}</label>`).join("")}</div>`:`<p class="notice">Chưa có học sinh Firebase hoạt động. Tải lại danh sách học sinh rồi thử lại.</p>`}</div>`:""}${personal?`<div class="field full"><label>Ưu tiên nhóm lỗi</label><div class="assignment-list">${errors.map((e,i)=>`<label class="assignment"><input class="exam-error-check" type="checkbox" value="${e[0]}" ${checkedErrors.includes(e[0])?"checked":""}/><div class="assignment-details"><strong>${e[0]} · ${e[1]}</strong><span>${e[2]}</span></div>${checkedErrors.includes(e[0])?'<span class="priority">Ưu tiên</span>':""}</label>`).join("")}</div></div>`:""}<div class="field full"><label>Cơ cấu đề THPT</label><p class="subhead" style="margin:0">Trắc nghiệm · Đúng / Sai · Trả lời ngắn (lấy theo phân loại câu đã tải)</p></div></div><p class="notice">Câu hỏi được trộn ngẫu nhiên, cân bằng theo phần đề và mã lỗi khi dữ liệu nguồn đã được phân loại. Đề giáo viên được đồng bộ qua Firebase đến các tài khoản đã chọn.</p>`,
    `<button class="btn secondary" data-action="close-modal">Hủy</button><button class="btn" id="save-exam">${personal?"Tạo đề và bắt đầu":"Tạo đề"}</button>`);
  document.querySelector("#save-exam").onclick=async()=>{
    const saveButton=document.querySelector("#save-exam");
    if(saveButton.disabled)return;
    const setIds=[...document.querySelectorAll(".exam-set-check:checked")].map(x=>x.value);
    let pool=data.questions.filter(q=>setIds.includes(q.setId));
    if(personal) {
      const errorIds=[...document.querySelectorAll(".exam-error-check:checked")].map(x=>x.value);
      const targeted=pool.filter(q=>errorIds.includes(q.errorId));
      if(targeted.length)pool=targeted;
      else if(errorIds.length)toast("Nguồn đã chọn chưa có câu hỏi mang mã lỗi này; đề lấy từ toàn bộ bộ đề.");
    }
    if(!pool.length){toast("Chọn ít nhất một bộ đề có câu hỏi.");return;}
    const recipients=personal?[]:[...document.querySelectorAll(".exam-student-check:checked")].map(input=>input.value);
    if(!personal&&!recipients.length){toast("Chọn ít nhất một học sinh để giao đề.");return;}
    const count=Number(document.querySelector("#exam-count").value),chosen=selectBalancedQuestions(pool,count);
    const exam={id:`exam-${Date.now()}`,title:document.querySelector("#exam-title").value.trim()||"Đề ôn tập",questions:chosen,sections:["Trắc nghiệm","Đúng / Sai","Trả lời ngắn"],source:personal?"personal":"teacher"};
    if(personal){document.querySelector(".modal-backdrop")?.remove();currentPractice={...exam,startedAt:Date.now(),answers:{},questionTimes:{}};currentQuestionIndex=0;questionStart=Date.now();renderPractice();}
    else {
      saveButton.disabled=true;
      saveButton.textContent="Đang đồng bộ...";
      const dueValue=document.querySelector("#exam-due").value;
      const assignment={
        id:exam.id,teacherId:session.id,title:exam.title,questions:chosen.length,
        students:recipients.length,studentIds:recipients,
        due:dueValue?new Date(`${dueValue}T23:59:59`).toLocaleDateString("vi-VN"):"Chưa đặt hạn",
        state:"Đang mở",sections:exam.sections,exam,createdAt:new Date().toISOString()
      };
      const payload=JSON.parse(JSON.stringify(assignment));
      if(new Blob([JSON.stringify(payload)]).size>850*1024) {
        saveButton.disabled=false;
        saveButton.textContent="Tạo đề";
        toast("Đề quá lớn để đồng bộ Firestore (giới hạn an toàn 850 KB). Hãy giảm số câu hoặc dung lượng ảnh.");
        return;
      }
      try {
        await configureFirestore();
        await firebaseRequest(firebaseSdk.setDoc(firebaseSdk.doc(firebaseDb,"assignments",exam.id),payload));
        data.assignments.unshift(assignment);
        saveData();
        document.querySelector(".modal-backdrop")?.remove();
        render();
        toast(`Đã giao đề cho ${recipients.length} học sinh và đồng bộ lên Firebase.`);
      } catch(error) {
        saveButton.disabled=false;
        saveButton.textContent="Tạo đề";
        console.error("Could not publish Firebase assignment.",error);
        toast(`Không thể giao đề: ${firebaseFirestoreError(error)}`);
      }
      return;
    }
    document.querySelector(".modal-backdrop")?.remove();
  };
}
function shuffle(arr) { for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr; }
function selectBalancedQuestions(pool,count) {
  const remaining=shuffle([...pool]);
  const selected=[];
  const sections=["Trắc nghiệm","Đúng / Sai","Trả lời ngắn"];
  while(remaining.length&&selected.length<count) {
    let added=false;
    for(const section of sections) {
      if(selected.length>=count)break;
      const sectionChoices=remaining.filter(q=>q.section===section);
      if(!sectionChoices.length)continue;
      const codeOrder=errors.map(e=>e[0]).sort((a,b)=>
        selected.filter(q=>q.errorId===a).length-selected.filter(q=>q.errorId===b).length);
      const candidate=sectionChoices.find(q=>q.errorId&&codeOrder.indexOf(q.errorId)>=0&&
        selected.filter(item=>item.errorId===q.errorId).length===Math.min(...codeOrder.map(code=>selected.filter(item=>item.errorId===code).length)));
      const chosen=candidate||sectionChoices[0];
      remaining.splice(remaining.indexOf(chosen),1);
      selected.push(chosen);
      added=true;
    }
    if(!added)selected.push(...remaining.splice(0,count-selected.length));
  }
  return selected;
}
function startAssignment(assignment) {
  if(!assignment?.exam?.questions?.length){toast("Đề này chưa có câu hỏi tương tác. Đề mẫu sẽ sớm được cập nhật.");return;}
  currentPractice={...assignment.exam,source:"teacher",startedAt:Date.now(),answers:{},questionTimes:{}};currentQuestionIndex=0;questionStart=Date.now();renderPractice();
}
function renderPractice() {
  practiceReturnPage=currentPage;
  const q=currentPractice.questions[currentQuestionIndex];if(!q){finishExam();return;}
  const root=document.querySelector("#app");
  root.innerHTML=`<main class="main" style="max-width:920px;margin:auto;padding-top:24px"><div class="topbar"><button class="btn secondary" data-action="finish-exam">← Thoát đề</button><div style="font-size:10px;color:#919bad">Câu ${currentQuestionIndex+1} / ${currentPractice.questions.length} <span id="timer"></span></div></div><div class="eyebrow">${safe(q.section)} · ${currentPractice.source==="personal"?"TỰ LUYỆN":"ĐỀ ĐƯỢC GIAO"}</div><h1 style="font-size:21px">${safe(currentPractice.title)}</h1><section class="card section-card" style="margin-top:18px"><div class="doc-html">${q.html||safe(q.content)}</div>${questionForm(q)}<div style="display:flex;justify-content:space-between;margin-top:20px"><span class="subhead">Nhóm lỗi: ${safe(errors.find(e=>e[0]===q.errorId)?.[1]||"Chưa phân loại")}</span><button class="btn" data-action="${currentQuestionIndex===currentPractice.questions.length-1?"submit-practice":"next-question"}">${currentQuestionIndex===currentPractice.questions.length-1?"Nộp bài":"Câu tiếp theo →"}</button></div></section><div class="notice">Thời gian trả lời mỗi câu được ghi nhận để giúp bạn theo dõi tốc độ làm bài.</div></main>`;
  void typesetMath(root);
  document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>handleAction(b));
  document.querySelectorAll(".answer").forEach(el=>el.onchange=()=>{
    if(el.classList.contains("true-false-answer"))currentPractice.answers[q.id]=Object.fromEntries([...document.querySelectorAll(".true-false-answer")].filter(input=>input.value).map(input=>[input.dataset.label,input.value]));
    else currentPractice.answers[q.id]=el.type==="radio"?el.value:el.value;
  });
}
function questionForm(q) {
  const answer=currentPractice.answers[q.id];
  const imageChoices=q.sourceImageOnly&&["Trắc nghiệm","Đúng / Sai"].includes(q.section)
    ?"ABCD".split("").map(label=>({label,html:""}))
    :(q.choices||[]);
  if(q.type==="essay")return `<div class="field" style="margin-top:17px"><label>Bài làm của bạn</label><textarea class="answer essay-answer" rows="7" placeholder="Trình bày lời giải...">${safe(answer||"")}</textarea></div>`;
  if(q.section==="Trả lời ngắn")return `<div class="field" style="margin-top:17px"><label>Đáp án của bạn</label><input class="answer" placeholder="Nhập đáp án..." value="${safe(answer||"")}"/></div>`;
  if(q.section==="Đúng / Sai"&&imageChoices.length)return `<div class="question-options statement-options">${imageChoices.map(choice=>`<label><b>${choice.label}.</b><span>${q.sourceImageOnly?"Mệnh đề nằm trong ảnh câu hỏi":choice.html}</span><select class="answer true-false-answer" data-label="${choice.label}" aria-label="Chọn đúng sai cho mệnh đề ${choice.label}"><option value="">Chọn</option><option value="Đ" ${answer?.[choice.label]==="Đ"?"selected":""}>Đúng</option><option value="S" ${answer?.[choice.label]==="S"?"selected":""}>Sai</option></select></label>`).join("")}</div>`;
  if(q.section==="Trắc nghiệm"&&imageChoices.length)return `<div class="question-options">${imageChoices.map(choice=>`<label><input class="answer" type="radio" name="answer-${q.id}" value="${choice.label}" ${answer===choice.label?"checked":""}/><b>${choice.label}.</b><span>${q.sourceImageOnly?"Phương án nằm trong ảnh câu hỏi":choice.html}</span></label>`).join("")}</div>`;
  return `<div class="field" style="margin-top:17px"><label>Đáp án của bạn</label><input class="answer" placeholder="Nhập đáp án..." value="${safe(answer||"")}"/></div>`;
}
function nextQuestion() {
  const q=currentPractice.questions[currentQuestionIndex];currentPractice.questionTimes[q.id]=(currentPractice.questionTimes[q.id]||0)+Math.round((Date.now()-questionStart)/1000);currentQuestionIndex++;questionStart=Date.now();renderPractice();
}
function submitPractice() {
  const q=currentPractice.questions[currentQuestionIndex];currentPractice.questionTimes[q.id]=(currentPractice.questionTimes[q.id]||0)+Math.round((Date.now()-questionStart)/1000);finishExam();
}
function finishExam() {
  if(!currentPractice)return;
  const graded=currentPractice.questions.filter(q=>q.answerKey);
  const correct=graded.filter(q=>normalizeAnswer(currentPractice.answers[q.id])===normalizeAnswer(q.answerKey)).length;
  const total=currentPractice.questions.length;
  const score=graded.length?Math.round((correct/graded.length)*100)/10:null;
  const answeredUnknown=currentPractice.questions.filter(q=>!q.answerKey&&currentPractice.answers[q.id]).length;
  const attempt={id:`attempt-${crypto.randomUUID?.()||Date.now()}`,userId:session.id,title:currentPractice.title,source:currentPractice.source==="personal"?"personal":"teacher",score,correct,total,graded:graded.length,duration:Math.round((Date.now()-currentPractice.startedAt)/1000),createdAt:new Date().toISOString(),mistakes:errors.map(e=>currentPractice.questions.filter(q=>q.errorId===e[0]&&q.answerKey&&normalizeAnswer(currentPractice.answers[q.id])!==normalizeAnswer(q.answerKey)).length),questionTimes:currentPractice.questionTimes};
  data.attempts.push(attempt);saveData();currentPractice=null;currentPage="progress";render();
  if(session?.source==="firebase")void saveFirebaseAttempt(attempt).catch(error=>{console.error("Could not sync completed attempt.",error);toast("Đã lưu lượt làm trên thiết bị; hệ thống sẽ đồng bộ lại khi có mạng.")});
  showModal("Hoàn thành bài ôn tập",`<div style="text-align:center;padding:12px"><div class="stat-icon purple" style="width:58px;height:58px;border-radius:18px;margin:auto">${icon("spark")}</div><h1 style="font-size:31px;margin-top:14px">${score===null?"Chưa chấm":`${score}/10`}</h1><p class="subhead">${score===null?`Lượt làm đã được ghi nhận. ${total} câu chưa có đáp án để chấm tự động.`:`Bạn trả lời đúng ${correct}/${graded.length} câu đã có đáp án.`} ${answeredUnknown?`${answeredUnknown} câu chưa có đáp án đúng để đối chiếu. `:""}Thời gian: ${formatDuration(attempt.duration)}.</p></div>`,`<button class="btn" data-action="close-modal">Xem lộ trình</button>`);
}
function normalizeAnswer(value) {
  if(value&&typeof value==="object")return Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${key}:${item}`).join("|").toUpperCase();
  if(Array.isArray(value))return value.slice().sort().join("").toUpperCase();
  return String(value??"").trim().replace(/\s+/g,"").replace(/(\d),(\d)/g,"$1.$2").toUpperCase();
}
window.addEventListener("online",()=>{
  if(session?.source==="firebase")void loadFirebaseAttempts();
});
if(FIREBASE_CONFIG) {
  session=null;
  localStorage.removeItem(SESSION_KEY);
  setLoginFeedback("Đang kiểm tra phiên đăng nhập…","loading");
  render();
  configureFirebaseAuth().then(auth=>firebaseSdk.onAuthStateChanged(auth,user=>{
    if(user&&!registeringFirebaseAccount&&!loginInProgress) {
      const attemptAtRestore=loginAttemptSequence;
      firebaseProfile(user).then(profile=>{
        if(loginInProgress||attemptAtRestore!==loginAttemptSequence)return;
        setSession(profile);
        if(profile.role==="teacher"||profile.role==="owner")void loadFirebaseStudents();
      }).catch(async error=>{
        console.error("Firebase profile lookup failed.",error);
        if(loginInProgress||attemptAtRestore!==loginAttemptSequence)return;
        if(firebaseAuth.currentUser?.uid===user.uid)await firebaseSdk.signOut(firebaseAuth);
        setLoginFeedback(error.message,"error");
      });
    } else if(!user&&!loginInProgress) {
      if(session)setSession(null);
      if(loginNoticeKind==="loading")setLoginFeedback("","info");
    }
  })).catch(error=>{
    console.error("Firebase initialization failed.",error);
    toast(firebaseError(error));
  });
} else render();
