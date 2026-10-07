const FIREBASE_CONFIG = window.FIREBASE_CONFIG || null;
const STORE_KEY = "toan-mach-data-v1";
const LEGACY_ERROR_DOCS_KEY = "toan-mach-error-docs-to-import-v1";
const SESSION_KEY = "toan-mach-session-v1";
const DEFAULT_ERRORS = [
  ["KT", "Lỗi kiến thức", "Chưa nắm đúng khái niệm, định nghĩa, tính chất, công thức hoặc điều kiện áp dụng định lý; ví dụ nhầm điểm cực trị của hàm số với điểm cực trị của đồ thị."],
  ["TT", "Lỗi tính toán, biến đổi", "Đã chọn được hướng giải nhưng tính chưa chính xác: sai đạo hàm, sai dấu, sai phép biến đổi hoặc tính sai giới hạn."],
  ["PP", "Lỗi lựa chọn và vận dụng phương pháp", "Chưa chọn được phương pháp phù hợp với yêu cầu hoặc vận dụng phương pháp sai, thường gặp trong bài toán thực tế."],
  ["DG", "Lỗi đọc hiểu và xác định dữ liệu", "Đọc chưa kỹ đề, nhầm dữ kiện, chưa xác định đúng đại lượng cần tìm hoặc chuyển thông tin thực tế sang toán học chưa đúng."],
  ["SU", "Lỗi suy luận và lập luận", "Suy luận thiếu căn cứ, kết luận khi chưa đủ điều kiện hoặc bỏ sót trường hợp, nhất là ở bài vận dụng."],
  ["QT", "Lỗi quy trình giải toán", "Thiếu bước trong trình tự giải như xác định điều kiện, kiểm tra nghiệm, xét trường hợp đặc biệt hoặc kiểm tra kết quả."],
  ["MH", "Lỗi mô hình hóa toán học", "Chuyển tình huống thực tế sang biến, điều kiện, phương trình hoặc bất phương trình chưa đúng."]
];
let errors = structuredClone(DEFAULT_ERRORS);
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
  attempts: [],
  errorDocs: []
};
let data = loadData();
let session = loadSession();
let legacyErrorDocs=[];
try { legacyErrorDocs=JSON.parse(localStorage.getItem(LEGACY_ERROR_DOCS_KEY)||"[]");if(!Array.isArray(legacyErrorDocs))legacyErrorDocs=[]; }
catch { legacyErrorDocs=[]; }
if(session?.source==="firebase"&&data.errorDocs?.length) {
  legacyErrorDocs=mergeLegacyErrorDocs(legacyErrorDocs,data.errorDocs);
  data.errorDocs=[];
  saveData();
  persistLegacyErrorDocs();
}
if(session?.source==="firebase")data.errorDocs=[];
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
let attemptHistoryState = "idle";
let attemptHistoryError = "";
let studentDirectoryState = "idle";
let studentDirectoryError = "";
const pendingAttemptWrites = new Map();
let profileUnsubscribe = null;
let profileSyncGeneration = 0;
let errorCategoryUnsubscribe = null;
let errorCategorySyncGeneration = 0;
let errorDocsUnsubscribe = null;
let errorDocsSyncGeneration = 0;
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
    if (saved) return {...sample,...saved,users:Array.isArray(saved.users)?saved.users:sample.users};
  } catch (error) { console.warn("Không đọc được dữ liệu đã lưu.", error); }
  return structuredClone(sample);
}
function saveData() {
  let persisted=data;
  if(session?.source==="firebase") {
    let reviewBudget=1200*1024;
    const localReviews=new Map();
    for(const attempt of data.attempts.filter(item=>!item.cloudSynced&&Array.isArray(item.reviewQuestions)).slice().sort((left,right)=>Date.parse(right.createdAt||"")-Date.parse(left.createdAt||""))) {
      const bytes=new Blob([JSON.stringify(attempt.reviewQuestions)]).size;
      if(bytes>reviewBudget)continue;
      localReviews.set(attempt.id,attempt.reviewQuestions);
      reviewBudget-=bytes;
    }
    persisted={...data,attempts:data.attempts.map(attempt=>{
      const {reviewQuestions,cloudSynced,...summary}=attempt;
      if(localReviews.has(attempt.id))summary.reviewQuestions=localReviews.get(attempt.id);
      return summary;
    }),users:[],sets:[],questions:[],assignments:[],errorDocs:[]};
  }
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
function mergeLegacyErrorDocs(existing,incoming) {
  const byId=new Map((existing||[]).map(item=>[String(item.id||`${item.name}-${item.text}`),item]));
  for(const item of incoming||[])byId.set(String(item.id||`${item.name}-${item.text}`),item);
  return [...byId.values()];
}
function persistLegacyErrorDocs() {
  try { localStorage.setItem(LEGACY_ERROR_DOCS_KEY,JSON.stringify(legacyErrorDocs));return true; }
  catch(error) { console.warn("Could not preserve the old local error documents.",error);return false; }
}
function setSession(user) {
  const identityChanged=!user||session?.id!==user.id||session?.source!==user.source;
  if(identityChanged){attemptHistoryState=user?.source==="firebase"?"loading":"idle";attemptHistoryError="";}
  if(identityChanged){studentDirectoryState=user?.source==="firebase"&&(user.role==="teacher"||user.role==="owner")?"loading":"idle";studentDirectoryError="";}
  const oldLocalErrorDocs=identityChanged&&user?.source==="firebase"&&session?.source!=="firebase"?data.errorDocs||[]:[];
  if(oldLocalErrorDocs.length) {
    legacyErrorDocs=mergeLegacyErrorDocs(legacyErrorDocs,data.errorDocs);
  }
  if(profileUnsubscribe&&(!user||session?.id!==user.id||session?.source!==user.source)) {
    profileUnsubscribe();
    profileUnsubscribe=null;
    profileSyncGeneration++;
  }
  if(attemptUnsubscribe&&(!user||session?.id!==user.id||session?.source!==user.source)) {
    attemptUnsubscribe();
    attemptUnsubscribe=null;
    attemptSyncGeneration++;
  }
  if(identityChanged&&errorCategoryUnsubscribe) {
    errorCategoryUnsubscribe();errorCategoryUnsubscribe=null;errorCategorySyncGeneration++;
  }
  if(identityChanged&&errorDocsUnsubscribe) {
    errorDocsUnsubscribe();errorDocsUnsubscribe=null;errorDocsSyncGeneration++;
  }
  if(identityChanged)data.errorDocs=[];
  session = user;
  if(identityChanged&&user?.source==="firebase") { saveData();if(oldLocalErrorDocs.length)persistLegacyErrorDocs(); }
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
    void loadFirebaseErrorCategories();
    void loadFirebaseErrorDocs();
    void watchFirebaseAccount(user.id);
  }
}
async function watchFirebaseAccount(userId) {
  const generation=++profileSyncGeneration;
  profileUnsubscribe?.();
  profileUnsubscribe=null;
  try {
    await configureFirestore();
    if(generation!==profileSyncGeneration||session?.id!==userId)return;
    profileUnsubscribe=firebaseSdk.onSnapshot(firebaseSdk.doc(firebaseDb,"users",userId),async snapshot=>{
      if(generation!==profileSyncGeneration||session?.id!==userId)return;
      const status=snapshot.exists()?snapshot.data().accountStatus:"missing";
      if(!["disabled","pendingDeletion","deleting","missing"].includes(status))return;
      const messages={
        disabled:"Tài khoản đã bị giáo viên khóa. Hãy liên hệ giáo viên nếu bạn cần mở lại.",
        pendingDeletion:"Tài khoản này đang bị hạn chế. Hãy liên hệ giáo viên.",
        deleting:"Tài khoản này đang bị vô hiệu hóa. Hãy liên hệ giáo viên.",
        missing:"Hồ sơ tài khoản không còn hoạt động. Hãy liên hệ giáo viên."
      };
      if(firebaseAuth?.currentUser?.uid===userId)await firebaseSdk.signOut(firebaseAuth).catch(error=>console.error("Could not sign out a disabled Firebase account.",error));
      sessionNotice="";
      setSession(null);
      setLoginFeedback(messages[status],"error");
    },error=>console.error("Could not monitor Firebase account status.",error));
  } catch(error) {
    console.error("Could not start Firebase account status listener.",error);
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
  if(info.accountStatus==="disabled")throw new Error("Tài khoản này đã bị giáo viên khóa. Hãy liên hệ giáo viên nếu bạn cần mở lại.");
  if(info.accountStatus==="pendingDeletion"||info.accountStatus==="deleting")throw new Error("Tài khoản này đã bị hạn chế truy cập. Hãy liên hệ giáo viên nếu bạn cần mở lại.");
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
function normalizeErrorCategories(categories) {
  const entries=Array.isArray(categories)?categories:[];
  return DEFAULT_ERRORS.map(([defaultCode,defaultName,defaultDescription],index)=>{
    const item=(entries.find(category=>!Array.isArray(category)&&Number(category?.ordinal)===index+1)||entries[index])||{};
    const value=Array.isArray(item)?{code:item[0],name:item[1],description:item[2],legacyCodes:item[3]}:item;
    const code=String(value.code||defaultCode).trim().toLocaleUpperCase("vi");
    const name=typeof value.name==="string"&&value.name.trim()?value.name.trim().slice(0,100):defaultName;
    const description=typeof value.description==="string"&&value.description.trim()?value.description.trim().slice(0,1600):defaultDescription;
    const legacyCodes=[...new Set([defaultCode,...(Array.isArray(value.legacyCodes)?value.legacyCodes:[]),...(value.code&&value.code!==code?[value.code]:[])].map(alias=>String(alias||"").trim().toLocaleUpperCase("vi")).filter(Boolean))];
    return [code,name,description,legacyCodes];
  });
}
function errorCategoryCodes(category) {
  return [...new Set([category?.[0],...(Array.isArray(category?.[3])?category[3]:[])].filter(Boolean).map(code=>String(code).toLocaleUpperCase("vi")))];
}
function errorIndexForCode(code) {
  const normalized=String(code||"").trim().toLocaleUpperCase("vi");
  return errors.findIndex(category=>errorCategoryCodes(category).includes(normalized));
}
function errorLabelForCode(code) {
  const index=errorIndexForCode(code);
  return index>=0?errors[index][0]:String(code||"");
}
function questionMatchesErrorIndex(question,index) {
  return index>=0&&errorCategoryCodes(errors[index]).includes(String(question?.errorId||"").trim().toLocaleUpperCase("vi"));
}
async function loadFirebaseErrorCategories() {
  if(!session?.id||session.source!=="firebase")return false;
  const userId=session.id,generation=++errorCategorySyncGeneration;
  errorCategoryUnsubscribe?.();errorCategoryUnsubscribe=null;
  try {
    await configureFirestore();
    if(generation!==errorCategorySyncGeneration||session?.id!==userId)return false;
    const ref=firebaseSdk.doc(firebaseDb,"settings","errorCategories");
    errorCategoryUnsubscribe=firebaseSdk.onSnapshot(ref,snapshot=>{
      if(generation!==errorCategorySyncGeneration||session?.id!==userId)return;
      const next=snapshot.exists()?normalizeErrorCategories(snapshot.data().categories):structuredClone(DEFAULT_ERRORS);
      if(JSON.stringify(next)===JSON.stringify(errors))return;
      errors=next;
      if(!document.querySelector(".modal-backdrop")) {
        if(currentPractice)renderPractice();else render();
      }
    },error=>{
      console.error("Shared error category listener failed.",error);
      toast(`Không đồng bộ được nội dung 7 mã lỗi: ${firebaseFirestoreError(error)}`);
    });
    return true;
  } catch(error) {
    console.error("Could not load shared error categories.",error);
    toast(`Không tải được nội dung 7 mã lỗi: ${firebaseFirestoreError(error)}`);
    return false;
  }
}
async function updateErrorCategory(ordinal,code,name,description) {
  if(!isTeacher()||session?.source!=="firebase")throw new Error("Chỉ giáo viên đăng nhập Firebase mới có thể sửa nội dung dùng chung.");
  if(!Number.isInteger(ordinal)||ordinal<1||ordinal>DEFAULT_ERRORS.length)throw new Error("Vị trí mã lỗi không hợp lệ.");
  const index=ordinal-1;
  const normalizedCode=String(code||"").trim().toLocaleUpperCase("vi");
  if(!/^\p{Lu}{1,8}$/u.test(normalizedCode))throw new Error("Mã lỗi chỉ gồm 1–8 chữ cái in hoa, không có dấu cách hoặc ký tự khác.");
  const normalizedName=String(name||"").trim(),normalizedDescription=String(description||"").trim();
  if(!normalizedName||normalizedName.length>100)throw new Error("Tên mã lỗi cần có từ 1 đến 100 ký tự.");
  if(!normalizedDescription||normalizedDescription.length>1600)throw new Error("Mô tả cần có từ 1 đến 1.600 ký tự.");
  await configureFirestore();
  const ref=firebaseSdk.doc(firebaseDb,"settings","errorCategories");
  const updatedCategory=await firebaseRequest(firebaseSdk.runTransaction(firebaseDb,async transaction=>{
    const snapshot=await transaction.get(ref);
    const current=snapshot.exists()?normalizeErrorCategories(snapshot.data().categories):normalizeErrorCategories(DEFAULT_ERRORS);
    const reusedCode=current.some((category,categoryIndex)=>categoryIndex!==index&&errorCategoryCodes(category).includes(normalizedCode));
    if(reusedCode)throw new Error("Mã này đang được dùng hoặc đã là mã cũ của nhóm khác.");
    const previous=current[index];
    const aliases=[...new Set([...errorCategoryCodes(previous),normalizedCode])];
    const updated=current.map((category,categoryIndex)=>categoryIndex===index?[normalizedCode,normalizedName,normalizedDescription,aliases]:category);
    transaction.set(ref,{
      categories:updated.map(([categoryCode,categoryName,categoryDescription,legacyCodes],categoryIndex)=>({ordinal:categoryIndex+1,code:categoryCode,name:categoryName,description:categoryDescription,legacyCodes:legacyCodes.filter(alias=>alias!==categoryCode)})),
      updatedAt:new Date().toISOString(),updatedBy:session.id
    });
    return updated[index];
  }));
  return updatedCategory;
}
async function loadFirebaseErrorDocs() {
  if(!session?.id||session.source!=="firebase"||!isTeacher())return false;
  const userId=session.id,generation=++errorDocsSyncGeneration;
  errorDocsUnsubscribe?.();errorDocsUnsubscribe=null;data.errorDocs=[];
  try {
    await configureFirestore();
    if(generation!==errorDocsSyncGeneration||session?.id!==userId)return false;
    const docs=firebaseSdk.collection(firebaseDb,"errorDocs");
    const query=firebaseSdk.query(docs,firebaseSdk.where("teacherId","==",userId));
    errorDocsUnsubscribe=firebaseSdk.onSnapshot(query,snapshot=>{
      if(generation!==errorDocsSyncGeneration||session?.id!==userId)return;
      data.errorDocs=snapshot.docs.map(document=>({id:document.id,...document.data()}))
        .sort((a,b)=>String(b.createdAt||"").localeCompare(String(a.createdAt||"")));
      if(currentPage==="errors"&&!document.querySelector(".modal-backdrop"))render();
    },error=>{
      console.error("Teacher error document listener failed.",error);
      toast(`Không đồng bộ được tài liệu mã lỗi: ${firebaseFirestoreError(error)}`);
    });
    return true;
  } catch(error) {
    console.error("Could not load teacher error documents.",error);
    toast(`Không tải được tài liệu mã lỗi: ${firebaseFirestoreError(error)}`);
    return false;
  }
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
    reviewQuestionCount:Array.isArray(attempt.reviewQuestions)?attempt.reviewQuestions.length:0,
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
  const hasInlineReview=existing.exists()&&Array.isArray(existing.data()?.reviewQuestions);
  if(!hasInlineReview&&Array.isArray(attempt.reviewQuestions)&&attempt.reviewQuestions.length) {
    const reviewCollection=firebaseSdk.collection(ref,"questions");
    const saved=await firebaseRequest(firebaseSdk.getDocs(reviewCollection));
    const savedIds=new Set(saved.docs.map(document=>document.id));
    const missing=attempt.reviewQuestions.filter(question=>!savedIds.has(String(question.ordinal).padStart(3,"0")));
    for(let index=0;index<missing.length;index+=8) {
      const batch=firebaseSdk.writeBatch(firebaseDb);
      for(const question of missing.slice(index,index+8)) {
        const review={...question,id:String(question.ordinal).padStart(3,"0"),userId};
        if(new Blob([JSON.stringify(review)]).size>950*1024)throw new Error(`Phần xem lại câu ${question.ordinal} quá lớn để đồng bộ.`);
        batch.set(firebaseSdk.doc(reviewCollection,String(question.ordinal).padStart(3,"0")),review);
      }
      await firebaseRequest(batch.commit());
    }
    const finalSnapshot=await firebaseRequest(firebaseSdk.getDocs(reviewCollection));
    if(finalSnapshot.size<attempt.reviewQuestions.length)throw new Error(`Mới đồng bộ được ${finalSnapshot.size}/${attempt.reviewQuestions.length} câu để xem lại.`);
  }
  attempt.cloudSynced=true;
  saveData();
  return true;
}
function trackFirebaseAttemptSave(attempt,userId=session?.id) {
  if(pendingAttemptWrites.has(attempt.id))return pendingAttemptWrites.get(attempt.id);
  const promise=saveFirebaseAttempt(attempt,userId);
  pendingAttemptWrites.set(attempt.id,promise);
  promise.then(
    ()=>{if(pendingAttemptWrites.get(attempt.id)===promise)pendingAttemptWrites.delete(attempt.id);},
    ()=>{if(pendingAttemptWrites.get(attempt.id)===promise)pendingAttemptWrites.delete(attempt.id);}
  );
  return promise;
}
function sortAttempts(attempts) {
  return attempts.slice().sort((a,b)=>attemptTimestampMillis(a.createdAt)-attemptTimestampMillis(b.createdAt)||String(a.id).localeCompare(String(b.id)));
}
function attemptTimestampMillis(value) {
  if(value&&typeof value.toMillis==="function")return value.toMillis();
  const parsed=value instanceof Date?value:new Date(value||"");
  const timestamp=parsed.getTime();
  return Number.isFinite(timestamp)?timestamp:0;
}
function formatAttemptTimestamp(value) {
  const timestamp=attemptTimestampMillis(value);
  if(!timestamp)return "Không rõ thời điểm";
  return new Intl.DateTimeFormat("vi-VN",{
    timeZone:"Asia/Ho_Chi_Minh",day:"2-digit",month:"2-digit",year:"numeric",
    hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"
  }).format(new Date(timestamp));
}
async function loadFirebaseAttempts({forceServer=false}={}) {
  if(!session?.id||session.source!=="firebase")return false;
  const userId=session.id,staffView=isTeacher(),generation=++attemptSyncGeneration;
  attemptHistoryState="loading";
  attemptHistoryError="";
  attemptUnsubscribe?.();
  attemptUnsubscribe=null;
  const cachedAttempts=staffView?data.attempts.slice():data.attempts.filter(attempt=>attempt.userId===userId);
  const localAttempts=cachedAttempts.filter(attempt=>attempt.userId===userId);
  data.attempts=sortAttempts(cachedAttempts);
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
    const applySnapshot=snapshot=>{
      if(generation!==attemptSyncGeneration||session?.id!==userId)return;
      const remote=snapshot.docs.map(document=>({...document.data()}));
      const remoteIds=new Set(remote.map(attempt=>attempt.id));
      const localFallback=data.attempts.filter(attempt=>(staffView||attempt.userId===userId)&&!remoteIds.has(attempt.id));
      data.attempts=sortAttempts([...remote,...localFallback]);
      attemptHistoryState="ready";
      attemptHistoryError="";
      saveData();
      if(!currentPractice&&!document.querySelector(".modal-backdrop"))render();
    };
    const firstSnapshot=await firebaseRequest(forceServer&&firebaseSdk.getDocsFromServer
      ?firebaseSdk.getDocsFromServer(query)
      :firebaseSdk.getDocs(query));
    if(generation!==attemptSyncGeneration||session?.id!==userId)return false;
    applySnapshot(firstSnapshot);
    let hasFreshServerSnapshot=!firstSnapshot.metadata?.fromCache;
    const applyLiveSnapshot=snapshot=>{
      if(hasFreshServerSnapshot&&snapshot.metadata?.fromCache)return;
      if(!snapshot.metadata?.fromCache)hasFreshServerSnapshot=true;
      applySnapshot(snapshot);
    };
    attemptUnsubscribe=firebaseSdk.onSnapshot(query,applyLiveSnapshot,error=>{
      console.error("Firebase attempt listener failed.",error);
      attemptHistoryState="error";
      attemptHistoryError=firebaseFirestoreError(error);
      if(!currentPractice&&!document.querySelector(".modal-backdrop"))render();
      toast(`Không đồng bộ được lịch sử làm bài: ${firebaseFirestoreError(error)}`);
    });
    return true;
  } catch(error) {
    console.error("Could not sync Firebase attempts.",error);
    if(generation===attemptSyncGeneration&&session?.id===userId) {
      attemptHistoryState="error";
      attemptHistoryError=firebaseFirestoreError(error);
      if(!currentPractice&&!document.querySelector(".modal-backdrop"))render();
    }
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
    <div class="shell${currentPage==="home"?" home-shell":""}">
      ${sidebar()}
      <main class="main">
        <header class="topbar">
          <div class="breadcrumb"><button class="icon-button mobile-menu" data-action="menu">${icon("menu")}</button>${currentPage==="home"?" Không gian học tập":` <button class="breadcrumb-home" data-page="home">← Trang chủ</button>`} <span> / </span> <b>${pageTitle()}</b></div>
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
  return ({home:isTeacher()?"Tổng quan":"Đề ôn tập",progress:"Lộ trình cá nhân",compare:"So sánh tiến bộ",personal:"Ôn tập cá nhân hóa",students:"Danh sách học sinh",errors:"Bản đồ nhóm lỗi",library:"Kho câu hỏi", "teacher-exams":"Quản lý đề ôn tập"})[currentPage]||"Tổng quan";
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
function radarLabelLines(value,maxLength=18) {
  const lines=[];let line="";
  for(const word of String(value||"").split(/\s+/)) {
    if(line&&`${line} ${word}`.length>maxLength){lines.push(line);line=word;}
    else line=line?`${line} ${word}`:word;
  }
  if(line)lines.push(line);
  return lines;
}
function radarPolygon(values,cx,cy,radius,maxValue) {
  return values.map((value,index)=>{
    const angle=-Math.PI/2+index*2*Math.PI/values.length,distance=radius*Math.max(0,Math.min(1,(Number(value)||0)/maxValue));
    return `${cx+Math.cos(angle)*distance},${cy+Math.sin(angle)*distance}`;
  }).join(" ");
}
function personalPracticeEvaluation(attempts) {
  const personal=sortAttempts((attempts||[]).filter(attempt=>attempt.source==="personal"));
  const current=personal.at(-1),previous=personal.at(-2);
  if(!current)return `<section class="card section-card practice-evaluation"><div class="section-heading"><div><h2>Đánh giá 7 nhóm kiến thức</h2><p>Biểu đồ cập nhật sau mỗi đề tự luyện; tên nhóm được ghi đầy đủ.</p></div></div><div class="practice-evaluation-empty"><span class="practice-empty-mark">✦</span><strong>Hoàn thành một đề tự luyện để xem biểu đồ</strong><p>Hệ thống sẽ so sánh số câu sai của đề mới nhất với đề trước đó, không cộng dồn lỗi qua nhiều đề.</p></div></section>`;
  const values=errors.map((_,index)=>Math.max(0,Math.floor(Number(current.mistakes?.[index])||0)));
  const previousValues=previous?errors.map((_,index)=>Math.max(0,Math.floor(Number(previous.mistakes?.[index])||0))):null;
  const maximum=Math.max(4,...values,...(previousValues||[]));
  const cx=430,cy=250,radius=150,labelRadius=211;
  const rings=[4,3,2,1].map(level=>`<polygon class="radar-grid-ring" points="${radarPolygon(errors.map(()=>maximum*level/4),cx,cy,radius,maximum)}"/><text class="radar-grid-label" x="${cx+5}" y="${cy-radius*level/4-4}">${Math.round(maximum*level/4)}</text>`).join("");
  const axes=errors.map((category,index)=>{
    const angle=-Math.PI/2+index*2*Math.PI/errors.length,x=cx+Math.cos(angle)*radius,y=cy+Math.sin(angle)*radius;
    const labelX=cx+Math.cos(angle)*labelRadius,labelY=cy+Math.sin(angle)*labelRadius;
    const anchor=Math.cos(angle)>.32?"start":Math.cos(angle)<-.32?"end":"middle";
    const lines=radarLabelLines(category[1]),lineStart=labelY-(lines.length-1)*6;
    return `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/><text class="radar-axis-label" x="${labelX}" y="${lineStart}" text-anchor="${anchor}">${lines.map((line,lineIndex)=>`<tspan x="${labelX}" dy="${lineIndex?14:0}">${safe(line)}</tspan>`).join("")}</text>`;
  }).join("");
  const previousSeries=previousValues?`<polygon class="radar-series radar-series-previous" points="${radarPolygon(previousValues,cx,cy,radius,maximum)}"/>${previousValues.map((value,index)=>{const angle=-Math.PI/2+index*2*Math.PI/errors.length,distance=radius*value/maximum;return `<circle class="radar-point radar-point-previous" cx="${cx+Math.cos(angle)*distance}" cy="${cy+Math.sin(angle)*distance}" r="3.5"/>`;}).join("")}`:"";
  const currentSeries=`<polygon class="radar-series radar-series-current" points="${radarPolygon(values,cx,cy,radius,maximum)}"/>${values.map((value,index)=>{const angle=-Math.PI/2+index*2*Math.PI/errors.length,distance=radius*value/maximum;return `<circle class="radar-point radar-point-current" cx="${cx+Math.cos(angle)*distance}" cy="${cy+Math.sin(angle)*distance}" r="4.5"/>`;}).join("")}`;
  const label=current=>`${safe(current.title)} · ${formatAttemptTimestamp(current.createdAt)}`;
  const changes=errors.map((category,index)=>{
    const delta=previousValues?values[index]-previousValues[index]:null;
    const status=delta===null?"first":delta>0?"up":delta<0?"down":"same";
    const mark=delta===null?"—":delta>0?`↑ +${delta}`:delta<0?`↓ ${delta}`:"→ 0";
    return `<div class="practice-change-row"><span class="practice-change-name">${safe(category[1])}</span><span class="practice-change-count">${values[index]} câu sai</span><strong class="practice-change-delta ${status}">${mark}</strong></div>`;
  }).join("");
  return `<section class="card section-card practice-evaluation"><div class="section-heading"><div><h2>Đánh giá lỗi qua đề tự luyện</h2><p>Số câu sai của đề mới nhất so với đề trước đó · Không cộng dồn.</p></div><span class="practice-analysis-tag">${personal.length} đề đã làm</span></div><div class="practice-evaluation-grid"><div class="practice-radar-wrap"><div class="practice-radar-caption"><strong>${label(current)}</strong><span>${previous?`So với: ${label(previous)}`:"Đây là mốc tự luyện đầu tiên"}</span></div><svg class="practice-radar" viewBox="0 0 860 500" role="img" aria-label="Biểu đồ mạng nhện so sánh số câu sai theo bảy nhóm kiến thức có tên đầy đủ"><title>So sánh số câu sai theo nhóm kiến thức</title>${rings}${axes}${previousSeries}${currentSeries}</svg><div class="practice-radar-legend"><span><i class="radar-legend-dot current"></i>Đề mới nhất</span>${previous?'<span><i class="radar-legend-dot previous"></i>Đề trước đó</span>':""}</div></div><div class="practice-change-panel"><div class="practice-change-heading"><strong>Thay đổi theo nhóm</strong><span>${previous?"So với lần trước":"Mốc ban đầu"}</span></div><div class="practice-change-list">${changes}</div><div class="practice-change-footnote">↑ Tăng số câu sai <span>·</span> ↓ Giảm số câu sai</div></div></div></section>`;
}
function teacherProgressStatus() {
  if(!isTeacher())return "";
  const studentCount=data.users.filter(user=>user.role==="student").length;
  const personalCount=data.attempts.filter(attempt=>attempt.source==="personal").length;
  if(studentDirectoryState==="loading"||attemptHistoryState==="loading") {
    return `<div class="notice" role="status">Đang đồng bộ danh sách học sinh và lịch sử tự luyện từ máy chủ…</div>`;
  }
  if(studentDirectoryState==="error"||attemptHistoryState==="error") {
    const errorsFound=[studentDirectoryState==="error"?`Danh sách học sinh: ${studentDirectoryError}`:"",attemptHistoryState==="error"?`Lịch sử bài làm: ${attemptHistoryError}`:""].filter(Boolean).join(" · ");
    return `<div class="notice" role="alert">Dữ liệu tiến độ chưa tải đủ. ${safe(errorsFound)} <button class="text-button" type="button" data-action="refresh-teacher-progress">Thử đồng bộ lại</button></div>`;
  }
  return `<div class="notice" role="status">Đã đồng bộ ${studentCount} học sinh · ${personalCount} lượt tự luyện từ Firebase. <button class="text-button" type="button" data-action="refresh-teacher-progress">Làm mới dữ liệu</button></div>`;
}
function teacherHome() {
  const students=data.users.filter(u=>u.role==="student"),allAttempts=sortAttempts(data.attempts),scored=allAttempts.filter(attempt=>Number.isFinite(attempt.score)),average=avg(scored.map(attempt=>attempt.score)),recent=data.assignments.slice(0,3),activities=allAttempts.slice(-3).reverse();
  const dateLabel=new Date().toLocaleDateString("vi-VN",{day:"2-digit",month:"long",year:"numeric"});
  const timesAgo=value=>{const seconds=Math.max(0,Math.floor((Date.now()-attemptTimestampMillis(value))/1000));if(!attemptTimestampMillis(value))return "Không rõ thời điểm";if(seconds<60)return "Vừa xong";if(seconds<3600)return `${Math.floor(seconds/60)} phút trước`;if(seconds<86400)return `${Math.floor(seconds/3600)} giờ trước`;return formatAttemptTimestamp(value)};
  return `${welcome(`Chào ${safe(userName())} 👋`,"Cùng xem tình hình học tập và giúp học sinh tiến bộ hơn nhé.",`<button class="date-chip">${icon("calendar")} ${dateLabel}</button>`)}
  ${teacherProgressStatus()}
  <div class="grid stats">${statCard("Tổng số học sinh",students.length,"","users","purple","Tài khoản học sinh trên hệ thống")}${statCard("Đề ôn tập",data.assignments.length,"","book","green","Đề bạn đã tạo hoặc giao")}${statCard("Điểm trung bình",average,"","chart","orange","Trên các lượt đã chấm")}${statCard("Bài đã hoàn thành",allAttempts.length,"","target","blue","Lịch sử đã đồng bộ")}</div>
  <div class="grid content-grid"><section class="card section-card"><div class="section-heading"><div><h2>Tiến bộ của lớp</h2><p>Điểm các lượt luyện tập đã chấm</p></div><div class="chart-legend"><span><i class="legend-dot"></i>Điểm số</span></div></div>${scoreChart(scored.slice(-6).map(attempt=>attempt.score))}</section>
  <section class="card section-card"><div class="section-heading"><div><h2>Hoạt động gần đây</h2><p>Cập nhật từ các lượt làm bài đã đồng bộ</p></div><button class="text-button" data-page="compare">Xem tất cả</button></div><div class="activity-list">${activities.length?activities.map(attempt=>{const student=students.find(user=>user.id===attempt.userId);return `<div class="activity"><div class="avatar">${initial(student?.name||"HS")}</div><div class="activity-main"><strong>${safe(student?.name||"Học sinh")} đã hoàn thành ${safe(attempt.title)}</strong><span>${timesAgo(attempt.createdAt)}</span></div><span class="activity-score">${Number.isFinite(attempt.score)?`${attempt.score}/10`:"Chưa chấm"}</span></div>`}).join(""):`<div class="empty">Chưa có lượt làm bài được đồng bộ.</div>`}</div></section></div>
  <div class="grid bottom-grid"><section class="card section-card"><div class="section-heading"><div><h2>Đề ôn tập gần đây</h2><p>Theo dõi những đề bạn đã giao</p></div><button class="text-button" data-page="teacher-exams">Quản lý đề →</button></div>${assignmentList(recent)}</section><section class="card section-card"><div class="section-heading"><div><h2>Nhóm lỗi cần lưu ý</h2><p>Lỗi phổ biến qua các lượt làm gần nhất</p></div><button class="text-button" data-page="errors">Chi tiết</button></div>${donut(aggregateMistakes(students))}</section></div>`;
}
function aggregateMistakes(users) { return errors.map((_,i)=>users.reduce((n,u)=>n+(userStats(u).counts[i]||0),0)); }
function studentHome() {
  const stats=userStats(session), avgscore=stats.average;
  const personalAttempts=sortAttempts(stats.attempts.filter(attempt=>attempt.source==="personal"));
  const latestPersonalMistakes=personalAttempts.at(-1)?.mistakes||null;
  const completed=stats.attempts.length||stats.scores.length;
  const timeHours=(stats.attempts.reduce((n,a)=>n+a.duration,0)/3600).toFixed(1);
  const days=new Set(stats.attempts.map(a=>new Date(a.createdAt).toLocaleDateString("en-CA"))),streak=days.size;
  const latest=data.assignments.filter(a=>a.state!=="Đã đóng"&&(!a.studentIds||a.studentIds.includes(session.id)));
  return `${welcome(`Chào ${safe(userName())} 👋`,"Hôm nay là một ngày tốt để học thêm điều mới!",`<button class="date-chip">${icon("calendar")} Thứ Hai, 05/10</button>`)}
  <div class="grid stats">${statCard("Điểm trung bình",avgscore,"", "chart","purple","Qua các đề đã chấm")}${statCard("Đề đã hoàn thành",completed,"","book","green","Số lượt làm bài đã ghi nhận")}${statCard("Thời gian học",`${timeHours}h`,"","clock","orange","Tổng thời gian đã làm bài")}${statCard("Ngày có hoạt động",`${streak} ngày`,"","target","blue","Dựa trên lịch sử làm đề")}</div>
  ${personalPracticeEvaluation(stats.attempts)}
  <div class="grid bottom-grid"><section class="card section-card"><div class="section-heading"><div><h2>Đề được giao cho bạn</h2><p>Hoàn thành trước hạn để không bỏ lỡ nhé</p></div><button class="text-button" data-page="home">Xem tất cả →</button></div>${assignmentList(latest)}</section><section class="card section-card"><div class="section-heading"><div><h2>Gợi ý dành cho bạn</h2></div></div><div style="padding:9px 2px"><div class="activity"><div class="activity-icon lilac">${icon("spark")}</div><div class="activity-main"><strong>${latestPersonalMistakes?`Ưu tiên ôn: ${safe(topError(latestPersonalMistakes)[1])}`:"Bắt đầu một đề tự luyện"}</strong><span>${latestPersonalMistakes?"Gợi ý dựa trên đề tự luyện mới nhất.":"Sau khi hoàn thành đề tự luyện, hệ thống sẽ gợi ý nhóm cần ôn theo kết quả mới nhất."}</span></div></div><button class="btn" data-page="personal" style="margin:17px 0 0 40px">Tạo đề cá nhân hóa</button></div></section></div>`;
}
function topError(counts) { let idx=counts.indexOf(Math.max(...counts));return errors[idx]||errors[0];}
function assignmentList(assignments) {
  if(!assignments.length)return `<div class="empty">Chưa có đề ôn tập nào được giao cho bạn.</div>`;
  return `<div class="assignment-list">${assignments.map(a=>`<div class="assignment"><div class="assignment-mark">${icon("file")}</div><div class="assignment-details"><strong>${safe(a.title)}</strong><span>${a.questions} câu · Hạn ${a.due||"Chưa đặt hạn"}</span></div><span class="tag ${a.state==="Đã đóng"?"amber":""}">${a.state==="Đã đóng"?"Đã làm":"Bắt đầu"}</span>${a.state!=="Đã đóng"?`<button class="btn" data-action="start-assignment" data-id="${a.id}">Làm bài</button>`:""}</div>`).join("")}</div>`;
}
function progressPage(user) {
  const stats=userStats(user);
  const personalAttempts=sortAttempts(stats.attempts.filter(attempt=>attempt.source==="personal"));
  const assignedAttempts=sortAttempts(stats.attempts.filter(attempt=>attempt.source!=="personal"));
  const personalScores=personalAttempts.map(attempt=>attempt.score).filter(Number.isFinite);
  const latest=personalAttempts.at(-1),latestMistakes=latest?.mistakes||[0,0,0,0,0,0,0];
  const isTeacherViewingStudent=isTeacher()&&user.id!==session?.id;
  const historySection=isTeacherViewingStudent
    ?`<div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Lịch sử tự luyện</h2><p>${personalAttempts.length} lượt tự luyện · Mở từng lượt để xem câu trả lời, đáp án và kết quả</p></div></div>${attemptTable(personalAttempts)}</div><div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Lịch sử đề giáo viên giao</h2><p>${assignedAttempts.length} lượt làm đề được giao</p></div></div>${attemptTable(assignedAttempts)}</div>`
    :`<div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Lịch sử tất cả bài làm</h2><p>Gồm đề tự luyện và đề giáo viên giao · Mở từng lượt để xem câu trả lời, đáp án và kết quả</p></div></div>${attemptTable(stats.attempts)}</div>`;
  return `${welcome("Lộ trình cá nhân","Theo dõi lượt tự luyện và xem lại mọi câu trong các bài đã làm.")}
  <div class="grid stats">${statCard("Đề tự luyện",personalAttempts.length,"","book","purple","Số lượt đã hoàn thành")}${statCard("Điểm tự luyện trung bình",personalScores.length?avg(personalScores):"—","","chart","green","Chỉ tính đề tự luyện")}${statCard("Điểm tự luyện gần nhất",latest&&Number.isFinite(latest.score)?`${latest.score}/10`:"—","","target","orange","Đề mới nhất")}${statCard("Nhóm lỗi đề mới nhất",latest?topError(latestMistakes)[1]:"Chưa có","","target","blue","Tên nhóm đầy đủ")}</div>
  ${personalPracticeEvaluation(personalAttempts)}
  ${historySection}`;
}
function attemptTable(attempts) {
  const historyNotice=attemptHistoryState==="error"?`<div class="notice">Không tải được lịch sử mới nhất: ${safe(attemptHistoryError)} <button class="text-button" data-action="retry-attempt-history">Thử tải lại</button></div>`:"";
  if(!attempts.length) {
    if(attemptHistoryState==="loading")return `<div class="empty">Đang tải lịch sử học tập từ máy chủ…</div>`;
    if(attemptHistoryState==="error")return `${historyNotice}<div class="empty">Chưa thể xác định lịch sử bài làm. Hãy thử tải lại.</div>`;
    return `<div class="empty">Các bài luyện tập hoàn thành sẽ xuất hiện tại đây.<br/><br/><button class="btn" data-page="home">Chọn đề ôn tập</button></div>`;
  }
  return `${historyNotice}<div class="table-wrap"><table><thead><tr><th>BÀI ÔN TẬP</th><th>LOẠI ĐỀ</th><th>ĐIỂM</th><th>SỐ CÂU ĐÚNG</th><th>THỜI GIAN LÀM</th><th>THỜI ĐIỂM HOÀN THÀNH (24H)</th><th></th></tr></thead><tbody>${attempts.slice().reverse().map(a=>`<tr><td><strong>${safe(a.title)}</strong></td><td>${a.source==="teacher"?"Giáo viên giao":"Tự luyện"}</td><td><b>${Number.isFinite(a.score)?`${a.score}/10`:"Chưa chấm"}</b></td><td>${a.correct}/${a.graded??a.total}</td><td>${formatDuration(a.duration)}</td><td><time datetime="${safe(typeof a.createdAt==="string"?a.createdAt:"")}">${formatAttemptTimestamp(a.createdAt)}</time></td><td><button class="text-button attempt-review-button" type="button" data-action="review-attempt" data-id="${safe(a.id)}">Xem lại →</button></td></tr>`).join("")}</tbody></table></div>`;
}
function formatDuration(seconds) { return `${Math.floor(seconds/60)} phút ${seconds%60} giây`; }
function formatAttemptAnswer(value) {
  if(value===null||value===undefined||value==="")return "Chưa trả lời";
  if(Array.isArray(value))return value.map(item=>String(item)).join(", ");
  if(typeof value==="object")return Object.entries(value).sort(([left],[right])=>left.localeCompare(right)).map(([label,answer])=>`${label}. ${answer}`).join(" · ");
  return String(value).replace(/\|/g," · ").replace(/([A-D]):/g,"$1. ");
}
function attemptReviewQuestionMarkup(question,index) {
  const correctness=questionCorrectness(question),isCorrect=correctness===true,isWrong=correctness===false;
  const resultClass=isCorrect?"correct":isWrong?"incorrect":"ungraded";
  const resultLabel=isCorrect?"Đúng":isWrong?"Chưa đúng":"Chưa có đáp án chấm";
  const errorIndex=Number.isInteger(question.errorIndex)?question.errorIndex:errorIndexForCode(question.errorId);
  const errorName=errorIndex>=0?errors[errorIndex]?.[1]:question.errorName;
  return `<article class="attempt-review-question ${resultClass}"><header><div><span class="attempt-question-number">Câu ${safe(question.questionNumber||index+1)}</span><span class="attempt-question-meta">${safe(question.section||"Câu hỏi")}${errorName?` · ${safe(errorName)}`:""}</span></div><span class="attempt-result-pill ${resultClass}">${resultLabel}</span></header><div class="attempt-review-content doc-html">${question.html||safe(question.content||"")}${renderQuestionChoices(question)}</div><div class="attempt-answer-grid"><div><span>Bài làm của bạn</span><strong>${safe(formatAttemptAnswer(question.userAnswer))}</strong></div><div class="attempt-correct-answer"><span>Đáp án đúng</span><strong>${hasAnswerKey(question)?safe(formatAttemptAnswer(question.answerKey)):"Chưa có đáp án để đối chiếu"}</strong></div></div>${question.questionTime?`<small class="attempt-question-time">Thời gian câu này: ${formatDuration(question.questionTime)}</small>`:""}</article>`;
}
async function showAttemptReview(attempt) {
  if(!attempt)return;
  const pendingWrite=pendingAttemptWrites.get(attempt.id);
  if(pendingWrite){toast("Đang chờ đồng bộ đủ câu trả lời để mở bài xem lại…");await pendingWrite.catch(()=>{});}
  let reviewQuestions=Array.isArray(attempt.reviewQuestions)?attempt.reviewQuestions:null;
  let expectedCount=Number.isInteger(attempt.reviewQuestionCount)?attempt.reviewQuestionCount:null;
  if(expectedCount===null&&reviewQuestions?.length)expectedCount=attempt.total;
  let observedCount=reviewQuestions?.length||0;
  if(session?.source==="firebase"&&(!reviewQuestions||expectedCount!==null&&reviewQuestions.length<expectedCount)) {
    try {
      await configureFirestore();
      const reviewRef=firebaseSdk.collection(firebaseSdk.doc(firebaseDb,"attempts",attempt.id),"questions");
      let snapshot;
      for(let attemptIndex=0;attemptIndex<4;attemptIndex++) {
        snapshot=await firebaseRequest(firebaseSdk.getDocs(reviewRef));
        const remoteQuestions=snapshot.docs.map(document=>document.data()).sort((left,right)=>Number(left.ordinal)-Number(right.ordinal));
        observedCount=remoteQuestions.length;
        if(expectedCount===null&&remoteQuestions.length)expectedCount=attempt.total;
        if(remoteQuestions.length&&(!expectedCount||remoteQuestions.length>=expectedCount)) {
          reviewQuestions=remoteQuestions;
          break;
        }
        if(!remoteQuestions.length&&expectedCount===null) {
          reviewQuestions=[];
          break;
        }
        if(attemptIndex<3)await new Promise(resolve=>setTimeout(resolve,300));
      }
      if(expectedCount===null&&attempt.reviewQuestions?.length)expectedCount=attempt.reviewQuestions.length;
      if(expectedCount&&reviewQuestions?.length<expectedCount&&Array.isArray(attempt.reviewQuestions)&&attempt.reviewQuestions.length>=expectedCount&&attempt.userId===session.id) {
        await trackFirebaseAttemptSave(attempt,session.id);
        const recovered=await firebaseRequest(firebaseSdk.getDocs(reviewRef));
        const recoveredQuestions=recovered.docs.map(document=>document.data()).sort((left,right)=>Number(left.ordinal)-Number(right.ordinal));
        observedCount=recoveredQuestions.length;
        if(recoveredQuestions.length>=expectedCount)reviewQuestions=recoveredQuestions;
      }
      if(reviewQuestions?.length&&(!expectedCount||reviewQuestions.length>=expectedCount))attempt.reviewQuestions=reviewQuestions;
    } catch(error) {
      console.error("Could not load a completed attempt for review.",error);
      toast(`Không tải được câu trả lời để xem lại: ${firebaseFirestoreError(error)}`);
      return;
    }
  }
  if(expectedCount===null&&reviewQuestions?.length)expectedCount=reviewQuestions.length;
  if(expectedCount&&(!reviewQuestions||reviewQuestions.length<expectedCount)) {
    const savedCount=Math.max(reviewQuestions?.length||0,observedCount);
    showModal(`Đang đồng bộ: ${safe(attempt.title)}`,`<div class="attempt-review-unavailable"><div class="attempt-review-empty-icon">${icon("clock")}</div><strong>Chi tiết lượt làm chưa tải đủ</strong><p>Hiện có ${savedCount}/${expectedCount} câu. Bài làm tổng đã hiện trong lịch sử; phần câu hỏi đang được đồng bộ lên máy chủ. Hãy thử tải lại sau ít giây.</p></div>`,`<button class="btn secondary" data-action="close-modal">Đóng</button><button class="btn" data-action="retry-attempt-review" data-id="${safe(attempt.id)}">Thử tải lại</button>`);
    document.querySelector(".modal")?.classList.add("modal-attempt-review");
    document.querySelector('.modal [data-action="retry-attempt-review"]')?.addEventListener("click",event=>{event.stopPropagation();document.querySelector(".modal-backdrop")?.remove();void showAttemptReview(attempt);});
    return;
  }
  if(!reviewQuestions?.length) {
    showModal(`Xem lại: ${safe(attempt.title)}`,`<div class="attempt-review-unavailable"><div class="attempt-review-empty-icon">${icon("book")}</div><strong>Lượt làm cũ chưa lưu chi tiết từng câu</strong><p>Hệ thống trước đây chỉ lưu điểm tổng và số câu sai theo nhóm, nên không thể khôi phục câu hỏi hoặc lựa chọn bạn đã trả lời cho lượt này.</p><div class="attempt-review-summary"><span>Điểm <b>${Number.isFinite(attempt.score)?`${attempt.score}/10`:"Chưa chấm"}</b></span><span>Số câu đúng <b>${attempt.correct}/${attempt.graded??attempt.total}</b></span><span>Thời điểm <b>${formatAttemptTimestamp(attempt.createdAt)}</b></span></div></div>`,`<button class="btn secondary" data-action="close-modal">Đóng</button>`);
    document.querySelector(".modal")?.classList.add("modal-attempt-review");
    return;
  }
  const correct=reviewQuestions.filter(question=>questionCorrectness(question)===true).length;
  const incorrect=reviewQuestions.filter(question=>questionCorrectness(question)===false).length;
  const ungraded=reviewQuestions.length-correct-incorrect;
  const gradedReview=reviewQuestions.filter(hasAnswerKey).length;
  const reviewedScore=gradedReview?Math.round(correct/gradedReview*100)/10:null;
  const body=`<div class="attempt-review-summary"><span>Điểm đối chiếu <b>${reviewedScore===null?"Chưa chấm":`${reviewedScore}/10`}</b></span><span class="review-count-correct">Đúng <b>${correct}</b></span><span class="review-count-incorrect">Sai <b>${incorrect}</b></span>${ungraded?`<span>Chưa chấm <b>${ungraded}</b></span>`:""}<span>Thời gian làm <b>${formatDuration(attempt.duration)}</b></span><span>Hoàn thành <b>${formatAttemptTimestamp(attempt.createdAt)}</b></span></div><p class="subhead">Điểm xem lại được tính từ đáp án và câu trả lời đã lưu.</p><div class="attempt-review-list">${reviewQuestions.map((question,index)=>attemptReviewQuestionMarkup(question,index)).join("")}</div>`;
  showModal(`Xem lại bài: ${safe(attempt.title)}`,body,`<button class="btn secondary" data-action="close-modal">Đóng</button>`);
  document.querySelector(".modal")?.classList.add("modal-attempt-review");
  void typesetMath(document.querySelector(".modal"));
}
function comparePage() {
  if(isTeacher()&&selectedStudent) {
    const u=data.users.find(x=>x.id===selectedStudent);if(u)return `${welcome(`Lộ trình của ${safe(u.name)}`,"Phân tích tiến bộ và gợi ý hỗ trợ theo từng nhóm lỗi.",`<button class="btn secondary" data-action="back-students">← Danh sách học sinh</button><button class="btn secondary" data-action="refresh-teacher-progress">Làm mới</button><button class="btn" data-action="assign-priority" data-id="${u.id}">${icon("plus")} Giao đề ưu tiên</button>`)}${teacherProgressStatus()}${progressPage(u)}`;
  }
  const users=isTeacher()?data.users.filter(u=>u.role==="student"):[session];
  if(!isTeacher()) {
    const attempts=sortAttempts(userStats(session).attempts.filter(attempt=>attempt.source==="personal"));
    const scores=attempts.map(attempt=>attempt.score).filter(Number.isFinite);
    const latestMistakes=attempts.at(-1)?.mistakes||[0,0,0,0,0,0,0];
    return `${welcome("Tiến bộ qua đề tự luyện","So sánh từng đề mới với đề ngay trước đó. Số lỗi không bị cộng dồn qua nhiều lượt.")}<div class="grid stats">${statCard("Đề tự luyện",attempts.length,"","book","purple","Số lượt đã hoàn thành")}${statCard("Điểm gần nhất",scores.length?scores[scores.length-1]:"—","", "chart","green","Trên thang điểm 10")}${statCard("Điểm trung bình",scores.length?avg(scores):"—","","target","orange","Chỉ tính đề tự luyện")}${statCard("Nhóm cần ôn",topError(latestMistakes)[1],"","target","blue","Tên nhóm đầy đủ")}</div>${personalPracticeEvaluation(attempts)}<div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Lịch sử đề tự luyện</h2><p>${attempts.length} lượt hoàn thành · Chọn một đề để xem lại từng câu</p></div></div>${attemptTable(attempts)}</div>`;
  }
  return `${welcome("So sánh tiến bộ học sinh","Xem lịch sử tự luyện, câu đúng/sai và thời điểm làm bài của từng học sinh.",`<button class="btn" data-action="refresh-teacher-progress">${icon("clock")} Làm mới tiến độ</button>`)}${teacherProgressStatus()}<div class="card section-card"><div class="section-heading"><div><h2>Danh sách học sinh</h2><p>Chọn “Xem tiến độ” để mở lịch sử tự luyện chi tiết.</p></div></div>${studentsTable(users,true)}</div>`;
}
function studentsPage() {
  const students=data.users.filter(user=>user.role==="student");
  const teachers=data.users.filter(user=>user.role==="teacher");
  const disabled=students.filter(user=>["disabled","pendingDeletion","deleting"].includes(user.accountStatus));
  const active=students.filter(user=>!["disabled","pendingDeletion","deleting"].includes(user.accountStatus));
  return `${welcome("Học sinh của bạn","Quản lý quyền truy cập học sinh. Khóa tài khoản sẽ ngăn đăng nhập và kết thúc phiên đang mở.",`<button class="btn" data-action="add-student">${icon("plus")} Hướng dẫn đăng ký</button>`)}
  <div class="card section-card"><div class="section-heading"><div><h2>Danh sách học sinh</h2><p>${active.length} tài khoản có quyền truy cập</p></div><div class="toolbar"><input placeholder="Tìm học sinh..." id="student-filter"/></div></div>${studentManagementTable(active)}</div>
  <div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Tài khoản bị khóa</h2><p>Không thể đăng nhập hoặc tiếp tục sử dụng web. Có thể mở lại bất cứ lúc nào.</p></div><span class="tag amber">${disabled.length} tài khoản</span></div>${studentManagementTable(disabled,true)}</div>
  <div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Danh sách giáo viên</h2><p>${teachers.length} giáo viên trên hệ thống</p></div></div>${teacherDirectoryTable(teachers)}</div>
  ${session?.role==="owner"?`<div class="notice">Quản trị viên: bạn có thể cấp hoặc thu hồi quyền giáo viên cho học sinh. Cấp quyền chỉ khả dụng cho tài khoản đã đăng ký Firebase.</div>`:""}`;
}
function teacherDirectoryTable(users) {
  if(!users.length)return `<div class="empty">Chưa có tài khoản giáo viên. Chủ sở hữu có thể cấp quyền giáo viên cho học sinh đã đăng ký.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>GIÁO VIÊN</th><th>VAI TRÒ</th></tr></thead><tbody>${users.map(user=>`<tr><td><div class="student-cell"><div class="avatar">${initial(user.name)}</div><div><strong>${safe(user.name)}</strong><div style="font-size:8px;color:#9aa3b3;margin-top:3px">${safe(user.email)}</div></div></div></td><td><span class="tag">Giáo viên</span></td></tr>`).join("")}</tbody></table></div>`;
}
function studentManagementTable(users,disabled=false) {
  if(!users.length)return `<div class="empty">${disabled?"Không có tài khoản học sinh bị khóa.":"Chưa có tài khoản học sinh trong Firebase."}</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>HỌC SINH</th><th>TRẠNG THÁI</th><th>QUẢN LÝ</th></tr></thead><tbody>${users.map(user=>{
    return `<tr><td><div class="student-cell"><div class="avatar">${initial(user.name)}</div><div><strong>${safe(user.name)}</strong><div style="font-size:8px;color:#9aa3b3;margin-top:3px">${safe(user.email)}</div></div></div></td><td>${disabled?'<span class="tag amber">Đã khóa</span>':`<span class="tag">Đang hoạt động</span>`}</td><td><div class="student-actions">${!disabled&&session?.role==="owner"?`<button class="text-button" data-action="grant-teacher" data-id="${safe(user.id)}">Cấp giáo viên</button>`:""}<button class="text-button ${disabled?"":"danger-text"}" data-action="${disabled?"enable-student":"disable-student"}" data-id="${safe(user.id)}">${disabled?"Mở khóa":"Khóa truy cập"}</button></div></td></tr>`;
  }).join("")}</tbody></table></div>`;
}
function studentsTable(users,clickable) {
  if(!users.length)return `<div class="empty">Chưa có dữ liệu học sinh.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>HỌC SINH</th><th>ĐỀ TỰ LUYỆN</th><th>ĐIỂM TB TỰ LUYỆN</th><th>NHÓM LỖI ĐỀ MỚI NHẤT</th><th>ĐIỂM GẦN NHẤT</th>${clickable?"<th>CHI TIẾT</th>":""}</tr></thead><tbody>${users.map(user=>{const personal=sortAttempts(userStats(user).attempts.filter(attempt=>attempt.source==="personal")),scores=personal.map(attempt=>attempt.score).filter(Number.isFinite),latest=personal.at(-1),worst=latest?topError(latest.mistakes||[0,0,0,0,0,0,0]):null;return `<tr ${clickable?`data-action="select-student" data-id="${safe(user.id)}" style="cursor:pointer"`:""}><td><div class="student-cell"><div class="avatar">${initial(user.name)}</div><div><strong>${safe(user.name)}</strong><div style="font-size:8px;color:#9aa3b3;margin-top:3px">${safe(user.email)}</div></div></div></td><td>${personal.length} đề</td><td><strong>${scores.length?avg(scores):"—"}</strong>${scores.length?"/10":""}</td><td>${worst?`<span class="priority">${safe(worst[1])}</span>`:"Chưa tự luyện"}</td><td>${latest&&Number.isFinite(latest.score)?`${latest.score}/10`:"—"}</td>${clickable?`<td><button class="text-button" type="button" data-action="select-student" data-id="${safe(user.id)}">Xem tiến độ →</button></td>`:""}</tr>`}).join("")}</tbody></table></div>`;
}
function errorsPage() {
  const teacher=isTeacher();
  const legacyNotice=teacher&&session?.source==="firebase"&&legacyErrorDocs.length?`<div class="legacy-error-notice"><div><strong>Tìm thấy ${legacyErrorDocs.length} tài liệu cũ trên thiết bị này</strong><p>Chúng chưa được gắn với tài khoản giáo viên nào. Bạn có thể xác nhận trước khi chuyển chúng sang tài khoản ${safe(userName())}.</p></div><button class="btn secondary" data-action="import-legacy-error-docs">Rà soát và chuyển</button></div>`:"";
  const mistakeCounts=aggregateMistakes(data.users.filter(user=>user.role==="student"));
  return `${welcome("Bản đồ nhóm lỗi","Quản lý mã và nội dung của 7 nhóm. Vị trí số là mốc thống kê cố định.",`<button class="btn" data-action="upload-errors">${icon("upload")} Nạp tài liệu mã lỗi</button>`)}
  <div class="error-page-intro"><div class="error-intro-icon">${icon("target")}</div><div><strong>Mã chữ có thể đổi; vị trí thống kê luôn được giữ</strong><p>Ví dụ: đổi mã DG thành ĐH ở nhóm 4. Câu hỏi và lịch sử cũ vẫn thuộc nhóm 4.</p></div><span>7 NHÓM · ĐỒNG BỘ</span></div>
  <div class="grid stats">${statCard("Nhóm kiến thức","07","","target","purple","Thứ tự 1–7 không thay đổi")}${statCard("Tài liệu phân tích",data.errorDocs?.length||0,"","file","green","Tài liệu của giáo viên này")}${statCard("Mã lỗi đang dùng",errors.length,"","book","orange","Có thể đổi mã chữ")}${statCard("Câu hỏi đã gắn mã",data.questions.filter(question=>question.errorId).length,"","chart","blue","Trong kho câu hỏi")}</div>
  ${legacyNotice}<div class="error-groups">${errors.map((category,index)=>{
    const ordinal=index+1;
    return `<article class="card section-card error-group" data-error-ordinal="${ordinal}"><div class="error-display"><div class="error-head"><div class="error-title-block"><span class="error-ordinal">NHÓM <b>${String(ordinal).padStart(2,"0")}</b></span><div><div class="eyebrow">MÃ HIỂN THỊ</div><div class="error-code-badge">${safe(category[0])}</div></div></div><div class="error-card-actions"><span class="error-count">${mistakeCounts[index]} lượt sai</span>${teacher?`<button class="text-button" type="button" data-action="edit-error-category" data-ordinal="${ordinal}">Chỉnh sửa <span aria-hidden="true">→</span></button>`:""}</div></div><h2 class="error-name">${safe(category[1])}</h2><p class="error-description">${safe(category[2])}</p></div>${teacher?`<div class="error-edit-form" hidden><div class="error-edit-heading"><span class="error-ordinal">MỐC THỐNG KÊ CỐ ĐỊNH</span><strong>Nhóm ${ordinal}</strong></div><label>Mã lỗi hiển thị<input class="error-code-input" maxlength="8" value="${safe(category[0])}" autocomplete="off" aria-label="Mã lỗi hiển thị của nhóm ${ordinal}" placeholder="Ví dụ: ĐH"/></label><label>Tên nhóm lỗi<input class="error-name-input" maxlength="100" value="${safe(category[1])}"/></label><label>Mô tả nhóm lỗi<textarea class="error-description-input" maxlength="1600" rows="4">${safe(category[2])}</textarea></label><div class="error-edit-actions"><button class="btn" type="button" data-action="save-error-category" data-ordinal="${ordinal}">Lưu thay đổi</button><button class="btn secondary" type="button" data-action="cancel-error-edit" data-ordinal="${ordinal}">Hủy</button></div><small>Đổi DG thành ĐH chỉ đổi mã hiển thị. Nhóm ${ordinal} vẫn là vị trí dùng để nối câu hỏi và thống kê cũ.</small></div>`:""}</article>`;
  }).join("")}</div>
  <div class="card section-card error-docs-panel"><div class="section-heading"><div><h2>Tài liệu mã lỗi đã nạp</h2><p>Tài liệu được lưu cho tài khoản giáo viên và đồng bộ giữa các thiết bị</p></div></div>${data.errorDocs?.length?`<div class="assignment-list">${data.errorDocs.map(d=>`<article class="assignment"><div class="assignment-mark">${icon("file")}</div><div class="assignment-details"><strong>${safe(d.name)}</strong><span>${safe(d.summary)}</span></div><span class="tag">${d.text?.length||0} ký tự</span></article>`).join("")}</div>`:`<div class="empty">Chưa có tài liệu. Nạp Word, PDF có lớp văn bản hoặc tệp TXT; nội dung sẽ được rà soát trước khi lưu.</div>`}</div>`;
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
  const personalAttempts=sortAttempts(userStats(session).attempts.filter(attempt=>attempt.source==="personal"));
  const counts=personalAttempts.at(-1)?.mistakes||userStats(session).counts, priorities=errors.map((e,i)=>({e,i,n:counts[i]||0})).sort((a,b)=>b.n-a.n);
  return `${welcome("Ôn tập cá nhân hóa","Chọn bộ đề và những nhóm lỗi bạn muốn tập trung cải thiện.",`<button class="btn" data-action="create-personal">${icon("spark")} Tạo đề cho mình</button>`)}
  <div class="grid content-grid"><section class="card section-card"><div class="section-heading"><div><h2>Chọn nguồn câu hỏi</h2><p>Luyện từ đề giáo viên đã tải lên</p></div></div>${data.sets.length?`<div class="assignment-list">${data.sets.map(s=>`<label class="assignment" style="cursor:pointer"><input class="set-check" type="checkbox" value="${s.id}"/><div class="assignment-mark">${icon("book")}</div><div class="assignment-details"><strong>${safe(s.title)}</strong><span>${s.questionCount} câu · ${safe(s.filename)}</span></div></label>`).join("")}</div>`:`<div class="empty">Chưa có bộ đề trong kho. Giáo viên cần tải đề Word lên trước.</div>`}</section>
  <section class="card section-card"><div class="section-heading"><div><h2>Chọn nhóm lỗi cần luyện</h2><p>Ưu tiên theo đề tự luyện gần nhất; hiển thị tên nhóm đầy đủ</p></div></div><div class="assignment-list">${priorities.map((x,i)=>`<label class="assignment" style="cursor:pointer"><input class="error-check" type="checkbox" value="${x.i}" ${i<3?"checked":""}/><div class="activity-icon ${i===0?"peach":"lilac"}">${icon("target")}</div><div class="assignment-details"><strong>${safe(x.e[1])}</strong><span>${x.e[2]}</span></div>${i<3?'<span class="priority">Ưu tiên</span>':""}</label>`).join("")}</div></section></div>
  ${personalPracticeEvaluation(personalAttempts)}
  <div class="card section-card" style="margin-top:16px"><div class="section-heading"><div><h2>Lịch sử tự luyện</h2><p>Kết quả đề cá nhân không gộp với bài giáo viên giao · Bấm xem lại để học lại từng câu</p></div></div>${attemptTable(personalAttempts)}</div>`;
}
function bindApp() {
  document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{
    currentPage=b.dataset.page;selectedStudent=null;render();
    if(["students","compare"].includes(currentPage)&&isTeacher()) {
      void loadFirebaseStudents({forceServer:true});
      if(currentPage==="compare")void loadFirebaseAttempts({forceServer:true});
    }
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
  if(action==="edit-error-category") {
    if(!isTeacher())return;
    const card=button.closest(".error-group");
    if(card){card.querySelector(".error-display").hidden=true;card.querySelector(".error-edit-form").hidden=false;card.querySelector(".error-code-input").focus();}
    return;
  }
  if(action==="cancel-error-edit") {
    const card=button.closest(".error-group");
    if(card){card.querySelector(".error-edit-form").hidden=true;card.querySelector(".error-display").hidden=false;}
    return;
  }
  if(action==="save-error-category") {
    if(!isTeacher()){toast("Chỉ giáo viên mới được sửa nội dung mã lỗi.");return;}
    const ordinal=Number(button.dataset.ordinal),index=ordinal-1,card=button.closest(".error-group"),code=card?.querySelector(".error-code-input")?.value,name=card?.querySelector(".error-name-input")?.value,description=card?.querySelector(".error-description-input")?.value;
    if(!card)return;
    button.disabled=true;button.textContent="Đang đồng bộ…";
    try {
      const updated=await updateErrorCategory(ordinal,code,name,description);
      errors=errors.map((category,categoryIndex)=>categoryIndex===index?updated:category);
      render();toast(`Đã cập nhật nhóm ${index+1}; thống kê lịch sử vẫn giữ đúng vị trí.`);
    } catch(error) {
      console.error("Could not update shared error category.",error);
      button.disabled=false;button.textContent="Lưu thay đổi";
      toast(error.code?`Không lưu được nội dung mã lỗi: ${firebaseFirestoreError(error)}`:error.message);
    }
    return;
  }
  if(action==="import-legacy-error-docs") {
    if(!isTeacher()||session?.source!=="firebase"){toast("Hãy đăng nhập tài khoản giáo viên Firebase để chuyển tài liệu.");return;}
    if(!legacyErrorDocs.length)return;
    const names=legacyErrorDocs.map(doc=>doc.name||"Tài liệu chưa đặt tên").join("\n• ");
    if(!confirm(`Chuyển ${legacyErrorDocs.length} tài liệu cũ vào tài khoản ${userName()}?\n\n• ${names}\n\nCác bản cũ chỉ có trên thiết bị này; thao tác này gắn chúng với tài khoản đang đăng nhập.`))return;
    button.disabled=true;button.textContent="Đang chuyển…";
    try {
      await configureFirestore();
      const migrated=[];
      for(const old of legacyErrorDocs) {
        const safeId=String(old.id||crypto.randomUUID?.()||Date.now()).replace(/[^A-Za-z0-9_-]/g,"_").slice(0,100);
        const record={id:`e-legacy-${session.id}-${safeId}`,teacherId:session.id,name:String(old.name||"Tài liệu mã lỗi cũ").slice(0,200),summary:String(old.summary||summarizeErrors(old.text||"")).slice(0,1000),text:String(old.text||"").slice(0,40000),createdAt:typeof old.createdAt==="string"?old.createdAt:new Date().toISOString()};
        if(!record.text.trim())continue;
        await firebaseRequest(firebaseSdk.setDoc(firebaseSdk.doc(firebaseDb,"errorDocs",record.id),record));
        migrated.push(record);
      }
      data.errorDocs=[...migrated,...(data.errorDocs||[])];
      legacyErrorDocs=[];persistLegacyErrorDocs();saveData();render();
      toast(`Đã chuyển ${migrated.length} tài liệu cũ vào tài khoản giáo viên này.`);
    } catch(error) {
      console.error("Could not migrate old local error documents.",error);
      button.disabled=false;button.textContent="Chuyển vào tài khoản này";
      toast(`Chưa chuyển hết tài liệu: ${firebaseFirestoreError(error)}. Bạn có thể thử lại; các bản đã chuyển sẽ không bị nhân đôi.`);
    }
    return;
  }
  if(action==="logout") {
    if(firebaseAuth) try {await firebaseSdk.signOut(firebaseAuth);}catch(e){toast(firebaseError(e));return;}
    sessionNotice="";
    setSession(null);currentPage="home";return;
  }
  if(action==="help"){toast("Tải đề Word vào Kho câu hỏi, rồi chọn câu để tạo đề ôn tập.");return;}
  if(action==="upload-doc"){
    if(!isTeacher()){toast("Chỉ giáo viên mới được tải đề lên kho dùng chung.");return;}
    showUploadModal();return;
  }
  if(action==="upload-errors"){
    if(!isTeacher()){toast("Chỉ giáo viên mới được tải tài liệu mã lỗi lên.");return;}
    showErrorUploadModal();return;
  }
  if(action==="add-student"){showStudentModal();return;}
  if(action==="disable-student"||action==="enable-student"){
    const student=data.users.find(user=>user.id===id&&user.role==="student");
    if(!student)return;
    const disabled=action==="disable-student";
    if(disabled&&!confirm(`Khóa tài khoản ${student.name} (${student.email}) ngay bây giờ? Học sinh sẽ bị đăng xuất và không thể vào web. Dữ liệu vẫn được giữ và có thể mở khóa lại.`))return;
    if(session?.source!=="firebase"||!isTeacher()){toast("Cần đăng nhập giáo viên Firebase để thay đổi quyền truy cập.");return;}
    try {
      await configureFirestore();
      await firebaseRequest(firebaseSdk.updateDoc(firebaseSdk.doc(firebaseDb,"users",id),{accountStatus:disabled?"disabled":"active"}));
      if(!await loadFirebaseStudents())return;
      toast(disabled?"Đã khóa quyền truy cập. Học sinh sẽ bị đăng xuất khi trạng thái đồng bộ.":"Đã mở khóa tài khoản học sinh.");
    } catch(error) {
      console.error("Could not update student access status.",error);
      toast(`Không thể ${disabled?"khóa":"mở khóa"} tài khoản: ${firebaseFirestoreError(error)}`);
    }
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
    const errorIds=[...document.querySelectorAll(".error-check:checked")].map(el=>String(el.value));
    showExamModal(true,null,setIds,errorIds);return;
  }
  if(action==="review-attempt"){
    const attempt=data.attempts.find(item=>item.id===id);
    await showAttemptReview(attempt);
    return;
  }
  if(action==="retry-attempt-review"){
    const attempt=data.attempts.find(item=>item.id===id);
    await showAttemptReview(attempt);
    return;
  }
  if(action==="retry-attempt-history"){
    await loadFirebaseAttempts({forceServer:true});
    return;
  }
  if(action==="refresh-teacher-progress"){
    if(!isTeacher()){toast("Chỉ giáo viên mới xem được tiến độ của toàn bộ học sinh.");return;}
    const [studentsLoaded,attemptsLoaded]=await Promise.all([
      loadFirebaseStudents({forceServer:true}),
      loadFirebaseAttempts({forceServer:true})
    ]);
    if(studentsLoaded&&attemptsLoaded)toast("Đã tải lại danh sách học sinh và lịch sử tự luyện từ máy chủ.");
    return;
  }
  if(action==="select-student"){selectedStudent=id;currentPage="compare";render();if(session?.source==="firebase")void loadFirebaseAttempts({forceServer:true});return;}
  if(action==="back-students"){selectedStudent=null;currentPage="students";render();return;}
  if(action==="assign-priority"){
    if(await loadFirebaseStudents())showExamModal(false,id);
    return;
  }
  if(action==="start-assignment"){startAssignment(data.assignments.find(a=>a.id===id));return;}
  if(action==="view-set"){showSetModal(data.sets.find(s=>s.id===id));return;}
  if(action==="delete-question"){
    if(button.disabled)return;
    button.disabled=true;
    button.textContent="Đang xóa…";
    try { await deleteQuestionFromSet(button.dataset.setId,id); }
    finally { if(button.isConnected){button.disabled=false;button.textContent="Xóa câu";} }
    return;
  }
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
async function loadFirebaseStudents({forceServer=false}={}) {
  if(!isTeacher())return false;
  const userId=session?.id;
  studentDirectoryState="loading";
  studentDirectoryError="";
  if(["home","students","compare"].includes(currentPage)&&!currentPractice&&!document.querySelector(".modal-backdrop"))render();
  try {
    await configureFirestore();
    if(session?.id!==userId)return false;
    const users=firebaseSdk.collection(firebaseDb,"users");
    const snapshot=await firebaseRequest(forceServer&&firebaseSdk.getDocsFromServer
      ?firebaseSdk.getDocsFromServer(users)
      :firebaseSdk.getDocs(users));
    if(session?.id!==userId)return false;
    const localById=new Map(data.users.map(user=>[user.id,user]));
    data.users=snapshot.docs.map(doc=>{
      const profile=doc.data(),local=localById.get(doc.id);
      return {
        ...local,id:doc.id,email:profile.email||local?.email||"",
        name:profile.displayName||profile.name||local?.name||profile.email||"Học sinh",
        role:profile.role,source:"firebase",accountStatus:profile.accountStatus||"active",
        deleteAfter:profile.deleteAfter?.toDate?.().toISOString?.()||profile.deleteAfter||null
      };
    }).filter(user=>user.role==="student"||user.role==="teacher");
    studentDirectoryState="ready";
    render();
    return true;
  } catch(error) {
    console.error("Could not load Firebase student profiles.",error);
    studentDirectoryState="error";
    studentDirectoryError=firebaseFirestoreError(error);
    data.users=data.users.filter(user=>user.source==="firebase"||(user.id===session?.id&&user.role==="student"));
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
async function extractDocumentText(file) {
  const extension=file.name.split(".").pop().toLowerCase();
  if(extension==="txt")return (await file.text()).replace(/\r\n?/g,"\n").trim();
  if(extension==="pdf") {
    const parsed=await parsePdfDocument(file,{analyzeQuestions:false});
    try {
      const doc=new DOMParser().parseFromString(parsed.html||"","text/html");
      return [...doc.body.children].map(node=>node.textContent.replace(/\s+/g," ").trim()).filter(Boolean).join("\n");
    } finally {
      parsed.pages?.forEach(source=>source.page.cleanup());
      await parsed.document?.destroy().catch(()=>{});
    }
  }
  if(extension==="docx") {
    let mammoth=window.mammoth;
    if(!mammoth?.convertToHtml) {
      await import("https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js");
      mammoth=window.mammoth;
    }
    if(!mammoth?.convertToHtml||!mammoth.images?.imgElement)throw new Error("Không tải được bộ đọc Word từ CDN. Kiểm tra kết nối Internet rồi thử lại.");
    const prepared=await prepareWordFile(file);
    const result=await mammoth.convertToHtml({arrayBuffer:prepared.arrayBuffer},{convertImage:mammoth.images.imgElement(image=>image.read("base64").then(data=>({src:`data:${image.contentType};base64,${data}`})))});
    const html=replaceMathPlaceholders(result.value,prepared.mathMarkup);
    const doc=new DOMParser().parseFromString(sanitizeDocumentHtml(html),"text/html");
    const blocks=[...doc.body.querySelectorAll("p,h1,h2,h3,h4,li,tr,pre")].map(node=>
      node.tagName==="TR"?[...node.children].map(cell=>cell.textContent.trim()).filter(Boolean).join(" | "):node.textContent.trim()
    ).filter(Boolean);
    return (blocks.length?blocks: [doc.body.textContent]).join("\n").trim();
  }
  throw new Error("Chỉ hỗ trợ file .docx, .pdf có lớp văn bản hoặc .txt.");
}
function showErrorUploadModal() {
  let parseSequence=0;
  showModal("Nạp và rà soát tài liệu mã lỗi",
    `<div class="review-workspace error-doc-workspace"><aside class="review-sidebar"><p class="subhead">Tài liệu sẽ được trích xuất thành văn bản để giáo viên kiểm tra trước khi lưu. Luồng này không tách nội dung thành câu hỏi.</p><label class="upload-zone" for="error-doc-file" tabindex="0">${icon("upload")}<strong>Chọn hoặc kéo thả tài liệu</strong><span>Word, PDF có lớp văn bản hoặc TXT · Tối đa 15 MB</span><input id="error-doc-file" type="file" accept=".docx,.pdf,.txt"/></label><div class="field"><label for="doc-title">Tên tài liệu</label><input id="doc-title" placeholder="Ví dụ: Hướng dẫn phân loại 7 mã lỗi"/></div><div class="notice">Tài liệu chỉ lưu làm nguồn tham khảo cho giáo viên này. Tên và mô tả 7 mã lỗi được chỉnh riêng ở các thẻ bên dưới trang.</div></aside><section class="review-main"><div id="doc-preview" class="error-doc-review"><div class="error-doc-empty"><div class="empty-icon">${icon("file")}</div><strong>Chưa có văn bản để rà soát</strong><p>Chọn tài liệu ở cột bên trái; nội dung trích xuất sẽ hiện tại đây để bạn chỉnh trước khi lưu.</p></div></div></section></div>`,
    `<button class="btn secondary" data-action="close-modal">Hủy</button><button class="btn" id="save-upload" disabled>Lưu tài liệu</button>`);
  const modal=document.querySelector(".modal"),input=document.querySelector("#error-doc-file"),zone=document.querySelector(".error-doc-workspace .upload-zone"),preview=document.querySelector("#doc-preview"),saveButton=document.querySelector("#save-upload");
  modal?.classList.add("modal-review");
  const processFile=async file=>{
    if(!file)return;
    if(file.size>15*1024*1024){toast("File vượt quá giới hạn 15 MB.");return;}
    if(!/\.(?:docx|pdf|txt)$/i.test(file.name)){toast("Chỉ hỗ trợ file .docx, .pdf hoặc .txt.");return;}
    const sequence=++parseSequence;
    if(!document.querySelector(".modal-backdrop")?.isConnected)return;
    const title=document.querySelector("#doc-title");if(!title.value)title.value=file.name.replace(/\.[^.]+$/,"");
    pendingUpload=null;saveButton.disabled=true;
    preview.innerHTML=`<div class="error-doc-loading"><span class="loading-orbit"></span><strong>Đang trích xuất văn bản…</strong><p>Tệp được xử lý trong trình duyệt.</p></div>`;
    try {
      const text=await extractDocumentText(file);
      const backdrop=document.querySelector(".modal-backdrop");
      if(!backdrop?.isConnected||sequence!==parseSequence)return;
      if(!text.trim())throw new Error("Không tìm thấy văn bản. PDF scan cần được OCR trước khi nạp.");
      pendingUpload={kind:"errors",file,parsed:{text}};
      const maxLength=40000,shownText=text.slice(0,maxLength),truncated=text.length>maxLength;
      preview.innerHTML=`<div class="review-summary error-doc-summary"><b>${safe(file.name)}</b><span>${text.length.toLocaleString("vi-VN")} ký tự trích xuất</span><span id="error-doc-code-summary">${safe(summarizeErrors(shownText))}</span></div>${truncated?'<p class="notice">Tài liệu dài hơn giới hạn 40.000 ký tự; phần đang hiển thị sẽ được lưu. Hãy kiểm tra cuối văn bản trước khi xác nhận.</p>':""}<label class="field full error-doc-text-field"><span>Văn bản trích xuất — có thể chỉnh sửa trước khi lưu</span><textarea id="error-document-text" class="error-document-text" maxlength="40000" spellcheck="false">${safe(shownText)}</textarea><small><span data-error-doc-length>${shownText.length.toLocaleString("vi-VN")}</span> / 40.000 ký tự</small></label>`;
      preview.querySelector("#error-document-text").addEventListener("input",event=>{
        const value=event.currentTarget.value;
        preview.querySelector("[data-error-doc-length]").textContent=value.length.toLocaleString("vi-VN");
        preview.querySelector("#error-doc-code-summary").textContent=summarizeErrors(value);
        pendingUpload.parsed.text=value;
      });
      zone.querySelector("strong").textContent="Chọn tài liệu khác";
      zone.querySelector("span").textContent=file.name;
      saveButton.disabled=false;
    } catch(error) {
      if(!document.querySelector(".modal-backdrop")?.isConnected||sequence!==parseSequence)return;
      pendingUpload=null;
      preview.innerHTML=`<div class="error-doc-empty"><strong>Chưa trích xuất được văn bản</strong><p>${safe(error.message.includes("lớp văn bản")?"PDF scan không có lớp chữ để trích xuất. Hãy OCR trước hoặc dán nội dung từ một tệp TXT/Word vào quy trình này.":error.message)}</p></div>`;
      toast(`Không đọc được tài liệu: ${error.message}`);
    }
  };
  input.onchange=()=>processFile(input.files[0]);
  zone.addEventListener("dragover",event=>{event.preventDefault();zone.classList.add("is-dragover");});
  zone.addEventListener("dragleave",event=>{if(!zone.contains(event.relatedTarget))zone.classList.remove("is-dragover");});
  zone.addEventListener("drop",event=>{event.preventDefault();zone.classList.remove("is-dragover");processFile(event.dataTransfer.files[0]);});
  saveButton.onclick=async event=>{
    const button=event.currentTarget,label=button.textContent;
    if(button.disabled)return;
    button.disabled=true;button.textContent="Đang lưu…";
    try { await saveUploadedDoc(true); }
    catch(error) {
      console.error("Could not save teacher error document.",error);
      toast(`Không lưu được tài liệu mã lỗi: ${error.code?firebaseFirestoreError(error):error.message}`);
    } finally {
      if(button.isConnected){button.disabled=false;button.textContent=label;}
    }
  };
}
function showUploadModal() {
  let parseSequence=0;
  showModal("Tải đề Toán từ Word hoặc PDF",
    `<p class="subhead" style="margin:0 0 14px">Hệ thống giữ ảnh, hình vẽ và công thức Word; PDF được tách theo nội dung văn bản và lưu ảnh chụp từng câu để đối chiếu.</p>
    <label class="upload-zone" for="doc-file" tabindex="0">${icon("upload")}<strong>Chọn hoặc kéo thả file vào đây</strong><span>Định dạng hỗ trợ .docx, .pdf hoặc .txt · Tối đa 15 MB</span><input id="doc-file" type="file" accept=".docx,.pdf,.txt"/></label>
    <div class="field" style="margin-top:13px"><label for="doc-title">Tên bộ đề / tài liệu</label><input id="doc-title" placeholder="Ví dụ: Hàm số — Chuyên đề 1"/></div>
    <div class="field" style="margin-top:10px"><label for="doc-topic">Chủ đề / phần thi</label><select id="doc-topic"><option>Trắc nghiệm</option><option>Đúng / Sai</option><option>Trả lời ngắn</option><option>Toán tổng hợp</option><option>Mã lỗi thường gặp</option></select></div>
    <label class="ai-opt-in"><input id="ai-boundaries" type="checkbox" checked/> Dùng Gemini AI để bóc tách câu và công thức. Gửi văn bản trích xuất; PDF scan sẽ gửi ảnh trang. Ảnh trong đề vẫn được giữ nguyên.</label>
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
      const analyzeQuestions=Boolean(uploadModal.querySelector("#ai-boundaries")?.checked);
      preview.innerHTML=`<p class="notice">${analyzeQuestions?"Đang trích xuất nội dung và gửi văn bản tới Gemini để bóc tách câu hỏi…":"Đang trích xuất nội dung và nhận diện câu hỏi trong trình duyệt…"}</p>`;
      const parsed=await parseDocument(file,{analyzeQuestions});
      if(!parsed.questions.length)throw new Error("Không nhận diện được câu hỏi. Kiểm tra tệp hoặc thử tải bản rõ hơn.");
      if(!uploadModal.isConnected||sequence!==parseSequence)return;
      pendingUpload={kind:"questions",file,parsed,title:title.value};
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
    try { await saveUploadedDoc(false); }
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
    return `<article class="review-row ${issues.length?"has-review-issue":""}" data-question-id="${safe(q.id)}"><div class="review-info"><strong>Câu ${i+1}${issues.length?`<span class="review-issue">${issues.join(" · ")}</span>`:'<span class="review-ok">Đã nhận diện</span>'}</strong><span>${q.sourceImageOnly?"Xem và căn chỉnh ảnh trọn câu, gồm nội dung và các phương án.":`${safe(q.content.slice(0,180))}${q.content.length>180?"…":""}`}</span><small>${q.choices?.length?`${q.choices.length} nhãn phương án`:"Trả lời bằng số / ký hiệu"} · ${safe(errorLabelForCode(q.errorId)||"chưa gắn mã")}</small></div><select aria-label="Phần đề câu ${i+1}" class="import-section compact-select" data-question-id="${safe(q.id)}">${sections.map(section=>`<option ${q.section===section?"selected":""}>${section}</option>`).join("")}</select><select aria-label="Mã lỗi câu ${i+1}" class="import-error compact-select" data-question-id="${safe(q.id)}"><option value="">Mã lỗi…</option>${errors.map(error=>`<option value="${safe(error[0])}" ${errorCategoryCodes(error).includes(String(q.errorId||"").toLocaleUpperCase("vi"))?"selected":""}>${safe(error[0])}</option>`).join("")}</select><details class="review-detail"><summary>${q.sourceImageRects?.length?"Xem và căn chỉnh ảnh câu hỏi":"Xem nội dung, đáp án, hình vẽ"}</summary><div class="doc-html">${q.sourceImageRects?.length?renderQuestionImageReview(q,parsed.sourcePages):`${q.html||safe(q.content)}${renderImportChoices(q)}`}</div>${!q.sourceImageOnly?`<label class="answer-key-label">Đáp án đúng <input class="import-key" data-question-id="${safe(q.id)}" value="${safe(q.answerKey||"")}" placeholder="${q.section==="Trả lời ngắn"?"Ví dụ: 2, 3/4":"A/B/C/D hoặc chuỗi Đ/S"}"/></label>`:`<label class="answer-key-label">Đáp án đúng <input class="import-key" data-question-id="${safe(q.id)}" value="${safe(q.answerKey||"")}" placeholder="Giáo viên nhập A/B/C/D"/></label>`}</details></article>`;
  }).join("")}</div><p class="notice">${aiNotice} ${hasPdfSource?"Ảnh PDF được cắt theo câu làm gợi ý; mở từng câu để căn lại khung từ ảnh trang gốc. Đáp án lựa chọn sẽ nằm trong ảnh, không chép lại nội dung phương án.":"Ảnh và công thức Word được giữ nguyên; kiểm tra phần thi, mã lỗi và đáp án trước khi lưu."} Các câu có điểm cần rà soát được đánh dấu nổi bật.</p>`;
}
function questionSourceImageHtml(question) {
  return (question.sourceImageCrops||[]).filter(Boolean).map((src,index)=>`<img class="pdf-source-image" src="${safe(src)}" alt="Ảnh câu hỏi${index?` phần ${index+1}`:""}"/>`).join("");
}
function renderQuestionImageReview(question,sourcePages={}) {
  return `<div class="question-source-review">${(question.sourceImageRects||[]).map((rect,index)=>{
    const crop=question.sourceImageCrops?.[index];
    const source=sourcePages[rect.page];
    return `<section class="question-image-part"><div class="question-image-preview">${crop?`<img class="pdf-source-image" src="${safe(crop)}" alt="Ảnh câu hỏi đã cắt"/>`:'<div class="question-image-empty">Ảnh trang nguồn chưa được cắt thành câu hỏi.</div>'}</div><button type="button" class="btn secondary question-crop-open" data-question-id="${safe(question.id)}" data-part-index="${index}" ${source?"": "disabled"}>${crop?"Căn chỉnh khung ảnh câu hỏi":"Cắt ảnh câu hỏi"}</button><div class="question-crop-editor" data-question-id="${safe(question.id)}" data-part-index="${index}" data-source-page="${rect.page}" hidden><p class="subhead">Giữ chuột trái và kéo khung đỏ quanh trọn câu hỏi cùng các phương án. Ảnh xem trước bên dưới sẽ cho biết chính xác vùng được lưu.</p><div class="question-crop-stage"><img class="question-crop-source" alt="Trang PDF gốc"/><div class="question-crop-selection" hidden></div></div><div class="question-crop-output-wrap"><strong>Ảnh sẽ lưu theo khung đỏ</strong><canvas class="question-crop-output"></canvas></div><div><button type="button" class="btn question-crop-save">Dùng khung này</button><button type="button" class="btn secondary question-crop-move">Dời khung</button><button type="button" class="text-button question-crop-cancel">Hủy</button></div></div></section>`;
  }).join("")}</div>`;
}
function renderSavedQuestionImageReview(question,set) {
  const parsed=new DOMParser().parseFromString(question.html||"","text/html");
  const images=[...parsed.body.querySelectorAll("img")];
  if(!images.length)return `<div class="doc-html">${question.html||safe(question.content)}</div>`;
  const rects=question.sourceImageRects||[];
  return `<div class="doc-html saved-question-image-content">${question.html}</div>${images.map((image,index)=>{
    const rect=rects[index];
    const hasSourcePage=rect?.page!==null&&rect?.page!==undefined&&Number.isFinite(Number(rect.page));
    return `<section class="saved-question-image-part"><button type="button" class="btn secondary saved-question-crop-open" data-set-id="${safe(set.id)}" data-question-id="${safe(question.id)}" data-part-index="${index}">${hasSourcePage?"Căn lại từ trang gốc":"Chỉnh ảnh đã lưu"}</button><div class="question-crop-editor saved-question-crop-editor" data-set-id="${safe(set.id)}" data-question-id="${safe(question.id)}" data-part-index="${index}" hidden><p class="subhead" data-saved-crop-help></p><div class="question-crop-stage"><img class="question-crop-source" alt="Ảnh nguồn để căn lại câu hỏi"/><div class="question-crop-selection" hidden></div></div><div class="question-crop-output-wrap"><strong>Ảnh sẽ lưu theo khung đỏ</strong><canvas class="question-crop-output"></canvas></div><div class="saved-crop-actions"><button type="button" class="btn saved-question-crop-save">Dùng khung này</button><button type="button" class="btn secondary question-crop-move">Dời khung</button><button type="button" class="text-button question-crop-cancel">Hủy</button></div></div></section>`;
  }).join("")}`;
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
    const sourceImage=editor.querySelector(".question-crop-source");
    const hasCrop=Boolean(question.sourceImageCrops?.[partIndex]);
    editor.dataset.cropRect=hasCrop?JSON.stringify(rect):"null";
    editor.dataset.mode="draw";
    editor.querySelector(".question-crop-move").textContent="Dời khung";
    editor.querySelector(".question-crop-stage").classList.remove("is-moving");
    editor.hidden=false;
    sourceImage.onload=()=>{if(hasCrop){drawQuestionCropSelection(selection,rect);drawQuestionCropPreview(editor,rect);}};
    sourceImage.src=sourcePage;
    if(sourceImage.complete&&sourceImage.naturalWidth&&hasCrop){drawQuestionCropSelection(selection,rect);drawQuestionCropPreview(editor,rect);}else if(!hasCrop)selection.hidden=true;
    bindQuestionCropEditor(editor);
  });
  document.querySelectorAll(".question-crop-cancel").forEach(button=>button.onclick=()=>{button.closest(".question-crop-editor").hidden=true;});
  document.querySelectorAll(".question-crop-move").forEach(button=>button.onclick=()=>{
    const editor=button.closest(".question-crop-editor");
    editor.dataset.mode=editor.dataset.mode==="move"?"draw":"move";
    button.textContent=editor.dataset.mode==="move"?"Vẽ khung mới":"Dời khung";
    editor.querySelector(".question-crop-stage").classList.toggle("is-moving",editor.dataset.mode==="move");
  });
  document.querySelectorAll(".question-crop-save").forEach(button=>button.onclick=()=>{
    const editor=button.closest(".question-crop-editor"),question=getQuestion(editor.dataset.questionId);
    const partIndex=Number(editor.dataset.partIndex),rect=JSON.parse(editor.dataset.cropRect||"null");
    const image=editor.querySelector(".question-crop-source");
    if(!question||!rect||rect.width<.01||rect.height<.01||!image.naturalWidth){toast("Kéo để khoanh trọn câu hỏi và các phương án.");return;}
    const {sx,sy,sw,sh}=questionCropPixels(image,rect);
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
  const meta=row.querySelector(".review-info small");
  if(meta)meta.textContent=`${question.choices?.length?`${question.choices.length} nhãn phương án`:"Trả lời bằng số / ký hiệu"} · ${errorLabelForCode(question.errorId)||"chưa gắn mã"}`;
  const count=pendingUpload.parsed.questions.filter(item=>item.classificationConfidence==="review"||!item.errorId||!item.answerKey||(item.sourceImageOnly&&item.sourceImageRects?.some((rect,index)=>!item.sourceImageCrops?.[index]))).length;
  const counter=document.querySelector("[data-review-flag-count] b");if(counter)counter.textContent=count;
}
function drawQuestionCropSelection(selection,rect) {
  selection.hidden=false;
  const stage=selection.parentElement,image=stage?.querySelector(".question-crop-source");
  const stageBounds=stage?.getBoundingClientRect(),imageBounds=image?.getBoundingClientRect();
  if(stageBounds?.width&&stageBounds.height&&imageBounds?.width&&imageBounds.height) {
    selection.style.left=`${imageBounds.left-stageBounds.left+rect.x*imageBounds.width}px`;
    selection.style.top=`${imageBounds.top-stageBounds.top+rect.y*imageBounds.height}px`;
    selection.style.width=`${rect.width*imageBounds.width}px`;
    selection.style.height=`${rect.height*imageBounds.height}px`;
  } else {
    selection.style.left=`${rect.x*100}%`;selection.style.top=`${rect.y*100}%`;
    selection.style.width=`${rect.width*100}%`;selection.style.height=`${rect.height*100}%`;
  }
}
function questionCropPixels(image,rect) {
  const sx=Math.max(0,Math.floor(rect.x*image.naturalWidth)),sy=Math.max(0,Math.floor(rect.y*image.naturalHeight));
  const ex=Math.min(image.naturalWidth,Math.ceil((rect.x+rect.width)*image.naturalWidth)),ey=Math.min(image.naturalHeight,Math.ceil((rect.y+rect.height)*image.naturalHeight));
  return {sx,sy,sw:Math.max(1,ex-sx),sh:Math.max(1,ey-sy)};
}
function drawQuestionCropPreview(editor,rect) {
  const image=editor.querySelector(".question-crop-source"),canvas=editor.querySelector(".question-crop-output");
  if(!image?.naturalWidth||!canvas||rect.width<.01||rect.height<.01)return;
  const {sx,sy,sw,sh}=questionCropPixels(image,rect);
  canvas.width=sw;canvas.height=sh;
  canvas.getContext("2d").drawImage(image,sx,sy,sw,sh,0,0,sw,sh);
}
function bindQuestionCropEditor(editor) {
  if(editor.dataset.bound==="true")return;
  editor.dataset.bound="true";
  const stage=editor.querySelector(".question-crop-stage"),image=editor.querySelector(".question-crop-source"),selection=editor.querySelector(".question-crop-selection");
  let start=null,origin=null,moveExisting=false,previewFrame=0;
  const point=event=>{
    const bounds=image.getBoundingClientRect();
    return {x:Math.max(0,Math.min(1,(event.clientX-bounds.left)/Math.max(1,bounds.width))),y:Math.max(0,Math.min(1,(event.clientY-bounds.top)/Math.max(1,bounds.height)))};
  };
  stage.onpointerdown=event=>{
    if(!image.complete||!image.naturalWidth)return;
    event.preventDefault();stage.setPointerCapture(event.pointerId);start=point(event);
    try { origin=JSON.parse(editor.dataset.cropRect||"null"); } catch { origin=null; }
    moveExisting=editor.dataset.mode==="move"&&Boolean(origin&&start.x>=origin.x&&start.x<=origin.x+origin.width&&start.y>=origin.y&&start.y<=origin.y+origin.height);
    if(editor.dataset.mode==="move"&&!moveExisting){start=null;origin=null;stage.releasePointerCapture(event.pointerId);return;}
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
    if(!previewFrame)previewFrame=requestAnimationFrame(()=>{
      previewFrame=0;
      try { drawQuestionCropPreview(editor,JSON.parse(editor.dataset.cropRect||"null")); } catch {}
    });
  };
  const finish=event=>{if(start){if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);try { drawQuestionCropPreview(editor,JSON.parse(editor.dataset.cropRect||"null")); } catch {}start=null;origin=null;moveExisting=false;}};
  stage.onpointerup=finish;stage.onpointercancel=finish;
}
function normalizeMathAnswer(value) {
  return String(value??"").trim()
    .replace(/\u00a0/g," ")
    .replace(/[−–—﹣]/g,"-")
    .replace(/\\\(|\\\)|\\\[|\\\]|\$/g,"")
    .replace(/\\(?:left|right)\b/g,"")
    .replace(/\\(?:dfrac|tfrac|frac)\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g,"($1)/($2)")
    .replace(/([+-]?)\(([-+]?\d+(?:\.\d+)?)\)\/\(([-+]?\d+(?:\.\d+)?)\)/g,(_,sign,numerator,denominator)=>`${sign}${numerator}/${denominator}`)
    .replace(/\\(?:cdot|times)\b/g,"*")
    .replace(/\\div\b/g,"/")
    .replace(/\\pi\b/g,"π")
    .replace(/\\sqrt\s*\{([^{}]+)\}/g,"√$1")
    .replace(/sqrt\(([^()]*)\)/gi,"√$1")
    .replace(/[{}]/g,"")
    .replace(/\s+/g,"")
    .replace(/(\d),(\d)/g,"$1.$2")
    .toLocaleUpperCase("vi");
}
function normalizeNumericAnswer(value) {
  let text=normalizeMathAnswer(value).replace(/^([+-]?)\./,(_,sign)=>`${sign}0.`).replace(/\.$/,".0");
  if(!/^[+-]?\d+(?:\.\d+)?(?:\/[+-]?\d+(?:\.\d+)?)?$/.test(text))return null;
  const decimalRational=part=>{
    const negative=part.startsWith("-");
    const unsigned=part.replace(/^[+-]/,"");
    const [whole,fraction=""]=unsigned.split(".");
    const denominator=10n**BigInt(fraction.length);
    let numerator=BigInt(`${whole||"0"}${fraction}`||"0");
    if(negative)numerator=-numerator;
    return [numerator,denominator];
  };
  const [left,right]=text.split("/");
  let [numerator,denominator]=decimalRational(left);
  if(right!==undefined) {
    const [divisor,divisorScale]=decimalRational(right);
    if(divisor===0n)return null;
    numerator*=divisorScale;
    denominator*=divisor;
  }
  if(denominator<0n){numerator=-numerator;denominator=-denominator;}
  const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){const remainder=a%b;a=b;b=remainder;}return a||1n;};
  const divisor=gcd(numerator,denominator);
  return `${numerator/divisor}/${denominator/divisor}`;
}
function truthFalseValue(value) {
  const normalized=String(value??"").trim().toLocaleUpperCase("vi");
  if(["Đ","ĐÚNG","TRUE","T"].includes(normalized))return "Đ";
  if(["S","SAI","FALSE","F"].includes(normalized))return "S";
  return null;
}
function canonicalTrueFalse(value) {
  if(value&&typeof value==="object"&&!Array.isArray(value)) {
    const pairs=Object.entries(value).map(([label,state])=>[String(label).trim().toLocaleUpperCase("vi"),truthFalseValue(state)])
      .filter(([label,state])=>/^[A-D]$/.test(label)&&state);
    return pairs.length?pairs.sort(([left],[right])=>left.localeCompare(right)).map(([label,state])=>`${label}:${state}`).join("|"):null;
  }
  const text=String(value??"").trim().replace(/^(?:ĐÁP\s*ÁN|ĐÁP\s*SỐ|KẾT\s*QUẢ)\s*[:：]\s*/i,"").replace(/[.。]+$/g,"");
  const labeled=[...text.matchAll(/(?:^|[\s,;|/])([A-D])\s*[).:= -]?\s*(đúng|sai|đ|s|true|false|t|f)(?=$|[\s,;|/.])/gi)];
  if(labeled.length)return [...new Map(labeled.map(match=>[match[1].toLocaleUpperCase("vi"),truthFalseValue(match[2])]))]
    .sort(([left],[right])=>left.localeCompare(right)).map(([label,state])=>`${label}:${state}`).join("|");
  const tokens=text.split(/[\s,;|/]+/).filter(Boolean),states=tokens.map(truthFalseValue);
  if(states.length&&states.every(Boolean))return states.map((state,index)=>`${String.fromCharCode(65+index)}:${state}`).join("|");
  const single=truthFalseValue(text);
  return single?`A:${single}`:null;
}
function normalizeQuestionKey(value,section) {
  let text=String(value??"").trim();
  if(!text)return null;
  text=text.replace(/^(?:ĐÁP\s*ÁN|ĐÁP\s*SỐ|KẾT\s*QUẢ)\s*[:：]\s*/i,"");
  const formatted=normalizeMathAnswer(text);
  if(section==="Đúng / Sai")return canonicalTrueFalse(text)||formatted;
  if(section==="Trắc nghiệm") {
    const option=formatted.match(/^([A-D])(?:[).:]|$)/)?.[1];
    if(option)return option;
  }
  if(section==="Trả lời ngắn") {
    const equation=formatted.match(/^[A-Z]\s*=\s*(.+)$/);
    if(equation)text=equation[1];
    return normalizeMathAnswer(text);
  }
  return formatted;
}
async function parseDocument(file,{analyzeQuestions=true}={}) {
  const extension=file.name.split(".").pop().toLowerCase();
  if(extension==="pdf") {
    const pdf=await parsePdfDocument(file,{analyzeQuestions});
    if(pdf.aiQuestions)return buildAiPdfResult(pdf.aiQuestions);
    try { return await parseQuestionHtml(pdf.html,pdf.pages,{analyzeQuestions}); }
    finally { await pdf.document?.destroy().catch(()=>{}); }
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
    if(!analyzeQuestions) {
      pages.forEach(source=>source.page.cleanup());
      await pdf.destroy().catch(()=>{});
      throw new Error("PDF scan không có lớp văn bản để trích xuất. Hãy OCR trước khi nạp.");
    }
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
    await pdf.destroy().catch(()=>{});
    return {aiQuestions};
  }
  return {html:paragraphs.join(""),pages,document:pdf};
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
  const key=normalizeQuestionKey(explicit,section);
  if(section==="Trắc nghiệm") {
    const option=key?.match(/^([A-D])$/)?.[1];
    return option&&choices.some(choice=>choice.label===option)?option:null;
  }
  return key||null;
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
  const storedQuestionIds=[],storedSourcePageIds=[];
  try {
    uploadStep="tạo bộ đề trong Firestore";
    await firebaseRequest(fs.setDoc(setRef,metadata));
    for(const [pageNumber,originalImage] of Object.entries(set.sourcePages||{})) {
      uploadStep=`nén ảnh trang ${pageNumber} để giáo viên có thể căn lại câu sau khi lưu`;
      const image=await compressInlineImage(originalImage,700*1024);
      const sourcePage={page:Number(pageNumber),image,teacherId:session.id};
      if(new Blob([JSON.stringify(sourcePage)]).size>900*1024)throw new Error(`Ảnh trang ${pageNumber} quá lớn để lưu làm bản gốc. Hãy giảm độ phân giải PDF rồi tải lại.`);
      uploadStep=`lưu ảnh trang gốc ${pageNumber}`;
      await firebaseRequest(fs.setDoc(fs.doc(setRef,"sourcePages",String(pageNumber)),sourcePage));
      storedSourcePageIds.push(String(pageNumber));
    }
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
    const {sourcePages:discardedSourcePages,...savedSet}=set;
    return {...savedSet,...metadata,status:"published",questions};
  } catch(error) {
    await Promise.allSettled(storedQuestionIds.map(questionId=>fs.deleteDoc(fs.doc(setRef,"questions",questionId))));
    await Promise.allSettled(storedSourcePageIds.map(pageId=>fs.deleteDoc(fs.doc(setRef,"sourcePages",pageId))));
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
  const sourcePages=await firebaseRequest(fs.getDocs(fs.collection(setRef,"sourcePages")));
  const childRefs=[...questions.docs,...sourcePages.docs].map(document=>document.ref);
  for(let index=0;index<childRefs.length;index+=500) {
    const batch=fs.writeBatch(firebaseDb);
    childRefs.slice(index,index+500).forEach(ref=>batch.delete(ref));
    await firebaseRequest(batch.commit());
  }
  await firebaseRequest(fs.deleteDoc(setRef));
}
async function saveUploadedDoc(errorsOnly) {
  if(!pendingUpload)return;
  const name=document.querySelector("#doc-title").value.trim()||pendingUpload.file.name;
  if(errorsOnly) {
    if(!isTeacher()||session?.source!=="firebase")throw new Error("Hãy đăng nhập bằng tài khoản giáo viên Firebase để đồng bộ tài liệu giữa các thiết bị.");
    const text=String(document.querySelector("#error-document-text")?.value||pendingUpload.parsed.text||"").trim();
    if(!text){toast("Văn bản đang trống. Hãy nạp hoặc nhập nội dung trước khi lưu.");return;}
    const record={id:`e-${crypto.randomUUID?.()||Date.now()}`,teacherId:session.id,name:name.slice(0,200),summary:summarizeErrors(text),text:text.slice(0,40000),createdAt:new Date().toISOString()};
    await configureFirestore();
    await firebaseRequest(firebaseSdk.setDoc(firebaseSdk.doc(firebaseDb,"errorDocs",record.id),record));
    data.errorDocs=[record,...(data.errorDocs||[]).filter(item=>item.id!==record.id)];
    saveData();
    pendingUpload=null;document.querySelector(".modal-backdrop")?.remove();render();
    toast("Đã lưu tài liệu mã lỗi lên Firebase; tài khoản giáo viên này sẽ thấy tài liệu trên các thiết bị.");
    return;
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
      delete stored.sourceImageCrops;
      return stored;
    });
    let set={id:`set-${Date.now()}`,title:name,filename:pendingUpload.file.name,type:document.querySelector("#doc-topic").value,questionCount:questions.length,sections:[...new Set(questions.map(q=>q.section))],questions,sourcePages:session?.source==="firebase"?pendingUpload.parsed.sourcePages||{}:{}};
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
  const normalized=normalizeVietnamese(text);
  const matches=errors.filter(([code,name])=>new RegExp(`(?:^|[^a-z])${normalizeVietnamese(code)}(?:$|[^a-z])`).test(normalized)||normalized.includes(normalizeVietnamese(name)));
  return matches.length?`Tài liệu có nhắc đến: ${matches.map(([code,name])=>`${code} · ${name}`).join("; ")}. Đây là gợi ý theo chữ xuất hiện, không tự thay đổi nội dung mã lỗi.`:`Đã trích xuất văn bản. Chưa thấy tên hoặc mã ${errors.map(category=>category[0]).join(", ")}; hãy rà lại nội dung đã trích xuất.`;
}
function showSetModal(set) {
  if(!set)return;
  const qs=set.questions||[];
  const counts=Object.fromEntries(["Trắc nghiệm","Đúng / Sai","Trả lời ngắn"].map(section=>[section,qs.filter(q=>q.section===section).length]));
  const summary=`<p class="subhead">${qs.length} câu · ${safe(set.filename||"Bộ đề đã lưu")} · ${qs.filter(q=>q.hasImages).length} câu có hình.</p><div class="review-summary">${Object.entries(counts).map(([section,count])=>`<span>${section}: <b>${count}</b></span>`).join("")}<span>Tổng số câu: <b>${qs.length}</b></span></div>`;
  if(!isTeacher()) {
    showModal(`Xem trước bộ đề: ${safe(set.title)}`,
      `<div class="review-workspace set-review-workspace"><aside class="review-sidebar">${summary}<p class="notice">Chọn câu hỏi để xem nội dung. Nội dung câu trả lời nằm trong ảnh sẽ được giữ nguyên như đề gốc.</p></aside><section class="review-main"><div id="doc-preview"><div class="question-preview review-list">${qs.map((q,i)=>`<article class="review-row"><div class="review-info"><strong>Câu ${i+1}</strong><span>${q.sourceImageOnly?"Nội dung và phương án được giữ nguyên trong ảnh câu hỏi.":`${safe(q.content.slice(0,180))}${q.content.length>180?"…":""}`}</span></div><details class="review-detail"><summary>Xem nội dung câu hỏi</summary><div class="doc-html">${q.html||safe(q.content)}${renderQuestionChoices(q)}</div></details></article>`).join("")}</div></div></section></div>`,
      `<button class="btn secondary" data-action="close-modal">Đóng</button><button class="btn" data-action="choose-set" data-id="${safe(set.id)}">Chọn đề tự luyện</button>`);
    document.querySelector(".modal")?.classList.add("modal-review");
    document.querySelectorAll('.modal-backdrop [data-action="choose-set"]').forEach(button=>button.onclick=()=>handleAction(button));
    void typesetMath(document.querySelector(".modal"));
    return;
  }
  const questionRows=qs.map((q,i)=>`<article class="review-row"><div class="review-info"><strong>Câu ${i+1}${q.classificationConfidence==="review"?'<span class="priority">Cần xem</span>':""}</strong><span>${q.sourceImageOnly?"Nội dung và phương án được giữ nguyên trong ảnh câu hỏi.":`${safe(q.content.slice(0,180))}${q.content.length>180?"…":""}`}</span><div class="review-question-actions"><small>${q.choices?.length?`${q.choices.length} lựa chọn`:"Câu trả lời ngắn"} · ${q.hasImages?"Có hình":"Không có hình"}</small><button type="button" class="text-button danger-text" data-action="delete-question" data-id="${safe(q.id)}" data-set-id="${safe(set.id)}">Xóa câu</button></div></div><select aria-label="Phần đề câu ${i+1}" class="question-section compact-select" data-question-id="${safe(q.id)}">${["Trắc nghiệm","Đúng / Sai","Trả lời ngắn"].map(section=>`<option ${q.section===section?"selected":""}>${section}</option>`).join("")}</select><select aria-label="Mã lỗi câu ${i+1}" class="question-error compact-select" data-question-id="${safe(q.id)}"><option value="">Mã lỗi…</option>${errors.map((category,index)=>`<option value="${safe(category[0])}" ${errorCategoryCodes(category).includes(String(q.errorId||"").toLocaleUpperCase("vi"))?"selected":""}>${safe(category[0])}</option>`).join("")}</select><details class="review-detail"><summary>Xem và sửa nội dung, đáp án, ảnh</summary>${q.sourceImageOnly?renderSavedQuestionImageReview(q,set):`<div class="doc-html">${q.html||safe(q.content)}${renderQuestionChoices(q)}</div>`}<label class="answer-key-label">Đáp án đúng <input class="question-key" data-question-id="${safe(q.id)}" value="${safe(q.answerKey||"")}" placeholder="${q.section==="Trả lời ngắn"?"Ví dụ: 2 hoặc 3/4":"A, B, C, D hoặc chuỗi Đ/S"}"/><span>Nhập đáp án mới rồi bấm Tab hoặc nhấp ra ngoài để lưu.</span></label></details></article>`).join("");
  showModal(`Rà soát bộ đề: ${safe(set.title)}`,`<div class="review-workspace set-review-workspace"><aside class="review-sidebar">${summary}<p class="notice">Phần thi, mã lỗi, ảnh câu hỏi và đáp án có thể chỉnh tại đây; thay đổi được lưu tự động. Xóa câu sẽ hỏi xác nhận.</p></aside><section class="review-main"><div id="doc-preview"><div class="question-preview review-list">${questionRows}</div></div></section></div>`,`<button class="btn secondary" data-action="close-modal">Đóng</button>`);
  document.querySelector(".modal")?.classList.add("modal-review");
  void typesetMath(document.querySelector(".modal"));
  document.querySelectorAll('.modal-backdrop [data-action="delete-question"]').forEach(button=>button.onclick=()=>{void handleAction(button);});
  document.querySelectorAll(".saved-question-crop-open").forEach(button=>button.onclick=()=>{void openSavedQuestionCrop(button,set);});
  document.querySelectorAll(".saved-question-crop-save").forEach(button=>button.onclick=()=>{void saveSavedQuestionCrop(button,set);});
  document.querySelectorAll(".question-crop-move").forEach(button=>button.onclick=()=>{
    const editor=button.closest(".question-crop-editor");
    editor.dataset.mode=editor.dataset.mode==="move"?"draw":"move";
    button.textContent=editor.dataset.mode==="move"?"Vẽ khung mới":"Dời khung";
    editor.querySelector(".question-crop-stage").classList.toggle("is-moving",editor.dataset.mode==="move");
  });
  document.querySelectorAll(".question-crop-cancel").forEach(button=>button.onclick=()=>{button.closest(".question-crop-editor").hidden=true;});
  document.querySelectorAll(".question-error").forEach(el=>el.onchange=()=>updateQuestion(set.id,el.dataset.questionId,{errorId:el.value||null}));
  document.querySelectorAll(".question-key").forEach(el=>el.onchange=async()=>{
    const question=set.questions.find(item=>item.id===el.dataset.questionId);
    if(question){
      const answerKey=normalizeQuestionKey(el.value,question.section);
      if(await updateQuestion(set.id,el.dataset.questionId,{answerKey})){el.value=answerKey||"";toast(`Đã lưu đáp án câu ${set.questions.findIndex(item=>item.id===question.id)+1}.`);}
    }
  });
  document.querySelectorAll(".question-section").forEach(el=>el.onchange=()=>{
    const question=set.questions.find(item=>item.id===el.dataset.questionId);
    if(question)updateQuestion(set.id,el.dataset.questionId,{section:el.value,answerKey:normalizeQuestionKey(question.answerKey,el.value)});
  });
}
async function openSavedQuestionCrop(button,set) {
  const question=set.questions.find(item=>item.id===button.dataset.questionId),partIndex=Number(button.dataset.partIndex);
  const editor=button.parentElement.querySelector(".saved-question-crop-editor");
  const rect=question?.sourceImageRects?.[partIndex];
  if(!question||!editor)return;
  button.disabled=true;
  const originalLabel=button.textContent;
  button.textContent="Đang mở ảnh…";
  try {
    let sourceImage="",sourceMode="saved-crop",cropRect={x:0,y:0,width:1,height:1};
    if(rect?.page!==null&&rect?.page!==undefined&&Number.isFinite(Number(rect.page))&&session?.source==="firebase") {
      await configureFirestore();
      const pageRef=firebaseSdk.doc(firebaseDb,"questionSets",set.id,"sourcePages",String(rect.page));
      const snapshot=await firebaseRequest(firebaseSdk.getDoc(pageRef));
      if(snapshot.exists()&&typeof snapshot.data().image==="string") {
        sourceImage=snapshot.data().image;sourceMode="page";cropRect={...rect};
      }
    }
    if(!sourceImage) {
      const parsed=new DOMParser().parseFromString(question.html||"","text/html");
      sourceImage=parsed.body.querySelectorAll("img")[partIndex]?.src||"";
      if(!sourceImage)throw new Error("Không tìm thấy ảnh câu hỏi để căn chỉnh.");
      editor.querySelector("[data-saved-crop-help]").textContent="Bộ đề cũ chỉ còn ảnh đã cắt. Bạn có thể căn lại trong phần ảnh hiện có; vùng ngoài ảnh cũ không thể khôi phục.";
    } else editor.querySelector("[data-saved-crop-help]").textContent="Kéo để chọn lại toàn bộ câu và các phương án. Khung xem trước sẽ khớp chính xác vùng ảnh được lưu.";
    editor.dataset.sourceMode=sourceMode;
    editor.dataset.cropRect=JSON.stringify(cropRect);
    editor.dataset.mode="draw";
    const moveButton=editor.querySelector(".question-crop-move");
    moveButton.textContent="Dời khung";
    editor.querySelector(".question-crop-stage").classList.remove("is-moving");
    const image=editor.querySelector(".question-crop-source");
    const draw=()=>{drawQuestionCropSelection(editor.querySelector(".question-crop-selection"),cropRect);drawQuestionCropPreview(editor,cropRect);};
    image.onload=draw;
    image.src=sourceImage;
    editor.hidden=false;
    if(image.complete&&image.naturalWidth)draw();
    bindQuestionCropEditor(editor);
    button.textContent=originalLabel;
  } catch(error) {
    toast(`Không mở được ảnh để căn chỉnh: ${firebaseFirestoreError(error)}`);
    button.textContent=originalLabel;
  } finally { button.disabled=false; }
}
async function saveSavedQuestionCrop(button,set) {
  const editor=button.closest(".question-crop-editor"),question=set.questions.find(item=>item.id===editor?.dataset.questionId);
  if(!editor||!question)return;
  const partIndex=Number(editor.dataset.partIndex),image=editor.querySelector(".question-crop-source");
  let rect=null;
  try { rect=JSON.parse(editor.dataset.cropRect||"null"); } catch {}
  if(!rect||rect.width<.01||rect.height<.01||!image.naturalWidth){toast("Kéo để khoanh trọn câu hỏi và các phương án.");return;}
  const {sx,sy,sw,sh}=questionCropPixels(image,rect);
  const canvas=document.createElement("canvas");canvas.width=sw;canvas.height=sh;
  canvas.getContext("2d").drawImage(image,sx,sy,sw,sh,0,0,sw,sh);
  const crop=await compressInlineImage(canvas.toDataURL("image/webp",.92));
  const documentHtml=new DOMParser().parseFromString(question.html||"","text/html"),questionImages=[...documentHtml.body.querySelectorAll("img")];
  if(!questionImages[partIndex]){toast("Không tìm thấy ảnh cần cập nhật trong câu hỏi.");return;}
  questionImages[partIndex].src=crop;
  const sourceImageRects=[...(question.sourceImageRects||[])];
  sourceImageRects[partIndex]=editor.dataset.sourceMode==="page"?{...rect,page:Number(rect.page)}:{x:0,y:0,width:1,height:1,page:null};
  button.disabled=true;
  const label=button.textContent;button.textContent="Đang lưu ảnh…";
  try {
    const saved=await updateQuestion(set.id,question.id,{html:documentHtml.body.innerHTML,sourceImageRects,hasImages:true,sourceImageOnly:true});
    if(!saved)return;
    const imagePreview=button.closest(".review-detail")?.querySelector(".saved-question-image-content");
    if(imagePreview)imagePreview.innerHTML=question.html;
    editor.hidden=true;
    toast("Đã lưu ảnh câu hỏi đã căn chỉnh.");
  } finally { if(button.isConnected){button.disabled=false;button.textContent=label;} }
}
async function deleteQuestionFromSet(setId,questionId) {
  if(!isTeacher()){toast("Chỉ giáo viên mới được xóa câu hỏi khỏi bộ đề.");return false;}
  const set=data.sets.find(item=>item.id===setId);
  const originalQuestions=set?.questions||[];
  const question=originalQuestions.find(item=>item.id===questionId);
  if(!set||!question)return false;
  if(originalQuestions.length<=1){toast("Bộ đề cần còn ít nhất một câu. Nếu muốn bỏ toàn bộ, hãy xóa cả bộ đề trong Kho câu hỏi.");return false;}
  if(!window.confirm(`Xóa câu ${question.questionNumber||questionId} khỏi bộ đề “${set.title}”? Học sinh sẽ không còn thấy câu này trong kho. Các đề đã giao vẫn giữ bản sao câu hỏi.`))return false;
  const remaining=originalQuestions.filter(item=>item.id!==questionId);
  const sections=[...new Set(remaining.map(item=>item.section).filter(section=>["Trắc nghiệm","Đúng / Sai","Trả lời ngắn"].includes(section)))];
  if(session?.source==="firebase") {
    try {
      await configureFirestore();
      const batch=firebaseSdk.writeBatch(firebaseDb);
      batch.delete(firebaseSdk.doc(firebaseDb,"questionSets",setId,"questions",questionId));
      batch.update(firebaseSdk.doc(firebaseDb,"questionSets",setId),{questionCount:remaining.length,sections});
      await firebaseRequest(batch.commit());
    } catch(error) {
      console.error("Could not delete a question from the shared question set.",error);
      toast(`Không thể xóa câu hỏi khỏi Firebase: ${firebaseFirestoreError(error)}`);
      return false;
    }
  }
  const currentSet=data.sets.find(item=>item.id===setId);
  if(currentSet) {
    currentSet.questions=(currentSet.questions||[]).filter(item=>item.id!==questionId);
    currentSet.questionCount=currentSet.questions.length;
    currentSet.sections=[...new Set(currentSet.questions.map(item=>item.section).filter(section=>["Trắc nghiệm","Đúng / Sai","Trả lời ngắn"].includes(section)))];
  }
  data.questions=(data.sets||[]).flatMap(item=>(item.questions||[]).map(itemQuestion=>({...itemQuestion,setId:item.id})));
  const stored=saveData();
  if(!stored&&session?.source!=="firebase")return false;
  document.querySelector(".modal-backdrop")?.remove();
  render();
  const updatedSet=data.sets.find(item=>item.id===setId);
  if(updatedSet)showSetModal(updatedSet);
  toast("Đã xóa câu khỏi bộ đề và cập nhật số lượng câu hỏi.");
  return true;
}
async function updateQuestion(setId,questionId,changes) {
  const set=data.sets.find(item=>item.id===setId);
  const question=set?.questions?.find(item=>item.id===questionId);
  if(!set||!question)return false;
  const updated={...question,...changes,setId};
  if(typeof updated.html==="string") {
    const parsed=new DOMParser().parseFromString(updated.html,"text/html");
    for(const image of parsed.querySelectorAll("img"))if(/^data:image\/(?:png|jpeg|webp);base64,/i.test(image.src))image.src=await compressInlineImage(image.src);
    updated.html=parsed.body.innerHTML;
  }
  if(new Blob([JSON.stringify(updated)]).size>850*1024) {
    toast("Câu hỏi quá lớn để lưu an toàn trong Firestore. Hãy giảm kích thước ảnh rồi thử lại.");
    return false;
  }
  if(session?.source==="firebase") {
    try {
      await configureFirestore();
      await firebaseRequest(firebaseSdk.setDoc(
        firebaseSdk.doc(firebaseDb,"questionSets",setId,"questions",questionId),
        updated,
        {merge:true}
      ));
    } catch(error) {
      console.error("Could not update Firebase question metadata.",error);
      toast(`Không thể lưu thay đổi câu hỏi: ${firebaseFirestoreError(error)}`);
      return false;
    }
  }
  Object.assign(question,updated);
  const bankQuestion=data.questions.find(item=>item.id===questionId&&item.setId===setId);
  if(bankQuestion)Object.assign(bankQuestion,updated);
  saveData();
  return true;
}
function showStudentModal() {
  showModal("Hướng dẫn học sinh đăng ký",`<p class="subhead">Học sinh cần tự tạo tài khoản để liên kết an toàn với Firebase Authentication.</p><ol style="font-size:11px;line-height:1.9;color:#68748a;padding-left:20px"><li>Mở website Toán học và chọn vai trò <b>Học sinh</b>.</li><li>Nhập email, mật khẩu rồi chọn <b>Tạo tài khoản học sinh</b>.</li><li>Sau khi đăng ký, tài khoản sẽ tự xuất hiện trong danh sách này.</li></ol><p class="notice">Không nhập hoặc lưu mật khẩu của học sinh thay các em.</p>`,`<button class="btn" data-action="close-modal">Đã hiểu</button>`);
}
function showExamModal(personal,studentId=null,selectedSetIds=[],selectedErrorIds=[]) {
  const sets=data.sets||[];
  const activeStudents=data.users.filter(user=>user.role==="student"&&!(["disabled","pendingDeletion","deleting"].includes(user.accountStatus)));
  const initialErrors=errors.map((e,index)=>({index,count:userStats(session).counts[index]})).sort((a,b)=>b.count-a.count).slice(0,3).map(e=>String(e.index));
  const checkedErrors=selectedErrorIds.length?selectedErrorIds:initialErrors;
  if(!sets.length){toast("Bạn cần tải ít nhất một file .docx vào Kho câu hỏi trước.");if(isTeacher()){currentPage="library";render();}return;}
  showModal(personal?"Tạo đề tự luyện":"Tạo đề ôn tập mới",
    `<div class="form-grid"><div class="field full"><label>Tên đề</label><input id="exam-title" value="${personal?"Đề tự luyện của "+safe(userName()):"Đề ôn tập mới"}"/></div><div class="field"><label>Số câu</label><select id="exam-count">${[10,20,30,40].map(x=>`<option>${x}</option>`).join("")}</select></div><div class="field"><label>Hạn hoàn thành</label><input id="exam-due" type="date"/></div><div class="field full"><label>Chọn bộ đề làm nguồn (có thể chọn nhiều)</label><div class="assignment-list">${sets.map(s=>`<label class="assignment"><input class="exam-set-check" type="checkbox" value="${safe(s.id)}" ${selectedSetIds.length?selectedSetIds.includes(s.id)?"checked":"": "checked"}/><div class="assignment-details"><strong>${safe(s.title)}</strong><span>${s.questionCount} câu · ${safe(s.filename)}</span></div></label>`).join("")}</div></div>${!personal?`<div class="field full"><label>Giao đề cho học sinh</label>${activeStudents.length?`<div class="assignment-list">${activeStudents.map(user=>`<label class="assignment"><input class="exam-student-check" type="checkbox" value="${safe(user.id)}" ${studentId?studentId===user.id?"checked":"disabled":"checked"}/><div class="assignment-details"><strong>${safe(user.name)}</strong><span>${safe(user.email)}</span></div>${studentId===user.id?'<span class="priority">Giao đề ưu tiên</span>':""}</label>`).join("")}</div>`:`<p class="notice">Chưa có học sinh Firebase hoạt động. Tải lại danh sách học sinh rồi thử lại.</p>`}</div>`:""}${personal?`<div class="field full"><label>Ưu tiên nhóm lỗi</label><div class="assignment-list">${errors.map((e,index)=>`<label class="assignment"><input class="exam-error-check" type="checkbox" value="${index}" ${checkedErrors.includes(String(index))?"checked":""}/><div class="assignment-details"><strong>Nhóm ${index+1} · ${e[0]} · ${e[1]}</strong><span>${e[2]}</span></div>${checkedErrors.includes(String(index))?'<span class="priority">Ưu tiên</span>':""}</label>`).join("")}</div></div>`:""}<div class="field full"><label>Cơ cấu đề THPT</label><p class="subhead" style="margin:0">Trắc nghiệm · Đúng / Sai · Trả lời ngắn (lấy theo phân loại câu đã tải)</p></div></div><p class="notice">Câu hỏi được trộn ngẫu nhiên, cân bằng theo phần đề và mã lỗi khi dữ liệu nguồn đã được phân loại. Đề giáo viên được đồng bộ qua Firebase đến các tài khoản đã chọn.</p>`,
    `<button class="btn secondary" data-action="close-modal">Hủy</button><button class="btn" id="save-exam">${personal?"Tạo đề và bắt đầu":"Tạo đề"}</button>`);
  document.querySelector("#save-exam").onclick=async()=>{
    const saveButton=document.querySelector("#save-exam");
    if(saveButton.disabled)return;
    const setIds=[...document.querySelectorAll(".exam-set-check:checked")].map(x=>x.value);
    let pool=data.questions.filter(q=>setIds.includes(q.setId));
    if(personal) {
      const errorIds=[...document.querySelectorAll(".exam-error-check:checked")].map(x=>Number(x.value));
      const targeted=pool.filter(q=>errorIds.includes(errorIndexForCode(q.errorId)));
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
      const codeOrder=errors.map((_,index)=>index).sort((a,b)=>
        selected.filter(q=>questionMatchesErrorIndex(q,a)).length-selected.filter(q=>questionMatchesErrorIndex(q,b)).length);
      const candidate=sectionChoices.find(q=>{
        const index=errorIndexForCode(q.errorId);
        return index>=0&&codeOrder.includes(index)&&selected.filter(item=>errorIndexForCode(item.errorId)===index).length===Math.min(...codeOrder.map(codeIndex=>selected.filter(item=>questionMatchesErrorIndex(item,codeIndex)).length));
      });
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
  const errorIndex=errorIndexForCode(q.errorId);
  root.innerHTML=`<main class="main" style="max-width:920px;margin:auto;padding-top:24px"><div class="topbar"><button class="btn secondary" data-action="finish-exam">← Thoát đề</button><div style="font-size:10px;color:#919bad">Câu ${currentQuestionIndex+1} / ${currentPractice.questions.length} <span id="timer"></span></div></div><div class="eyebrow">${safe(q.section)} · ${currentPractice.source==="personal"?"TỰ LUYỆN":"ĐỀ ĐƯỢC GIAO"}</div><h1 style="font-size:21px">${safe(currentPractice.title)}</h1><section class="card section-card" style="margin-top:18px"><div class="doc-html">${q.html||safe(q.content)}</div>${questionForm(q)}<div style="display:flex;justify-content:space-between;margin-top:20px"><span class="subhead">Nhóm lỗi: ${safe(errors[errorIndex]?.[1]||"Chưa phân loại")}</span><button class="btn" data-action="${currentQuestionIndex===currentPractice.questions.length-1?"submit-practice":"next-question"}">${currentQuestionIndex===currentPractice.questions.length-1?"Nộp bài":"Câu tiếp theo →"}</button></div></section><div class="notice">Thời gian trả lời mỗi câu được ghi nhận để giúp bạn theo dõi tốc độ trả lời.</div></main>`;
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
  if(q.section==="Đúng / Sai"&&imageChoices.length)return `<div class="question-options statement-options">${imageChoices.map(choice=>`<label><b>${choice.label}.</b>${q.sourceImageOnly?"":`<span>${choice.html}</span>`}<select class="answer true-false-answer" data-label="${choice.label}" aria-label="Chọn đúng sai cho mệnh đề ${choice.label}"><option value="">Chọn</option><option value="Đ" ${answer?.[choice.label]==="Đ"?"selected":""}>Đúng</option><option value="S" ${answer?.[choice.label]==="S"?"selected":""}>Sai</option></select></label>`).join("")}</div>`;
  if(q.section==="Trắc nghiệm"&&imageChoices.length)return `<div class="question-options">${imageChoices.map(choice=>`<label><input class="answer" type="radio" name="answer-${q.id}" value="${choice.label}" ${answer===choice.label?"checked":""}/><b>${choice.label}.</b>${q.sourceImageOnly?"":`<span>${choice.html}</span>`}</label>`).join("")}</div>`;
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
  const graded=currentPractice.questions.filter(hasAnswerKey);
  const correct=graded.filter(q=>answersMatch(currentPractice.answers[q.id],q.answerKey,q.section)).length;
  const total=currentPractice.questions.length;
  const score=graded.length?Math.round((correct/graded.length)*100)/10:null;
  const answeredUnknown=currentPractice.questions.filter(q=>!hasAnswerKey(q)&&currentPractice.answers[q.id]).length;
  const reviewQuestions=currentPractice.questions.map((question,index)=>{
    const answerKey=hasAnswerKey(question)?String(question.answerKey):null,userAnswer=currentPractice.answers[question.id]??null,errorIndex=errorIndexForCode(question.errorId);
    return {
      ordinal:index+1,
      questionId:String(question.id||`question-${index+1}`).slice(0,160),
      questionNumber:String(question.questionNumber||question.question_number||index+1).slice(0,80),
      section:String(question.section||"").slice(0,80),
      errorIndex,
      errorName:errorIndex>=0?String(errors[errorIndex]?.[1]||"").slice(0,160):"",
      content:String(question.content||""),
      html:String(question.html||safe(question.content||"")),
      sourceImageOnly:Boolean(question.sourceImageOnly),
      choices:question.sourceImageOnly?[]:(question.choices||[]).map(choice=>({label:String(choice.label||"").slice(0,8),html:String(choice.html||""),text:String(choice.text||"")})),
      answerKey,
      userAnswer,
      isCorrect:answerKey!==null?answersMatch(userAnswer,answerKey,question.section):null,
      questionTime:Math.max(0,Math.floor(Number(currentPractice.questionTimes?.[question.id])||0))
    };
  });
  const attempt={id:`attempt-${crypto.randomUUID?.()||Date.now()}`,userId:session.id,title:currentPractice.title,source:currentPractice.source==="personal"?"personal":"teacher",score,correct,total,graded:graded.length,duration:Math.round((Date.now()-currentPractice.startedAt)/1000),createdAt:new Date().toISOString(),mistakes:errors.map((_,index)=>currentPractice.questions.filter(q=>questionMatchesErrorIndex(q,index)&&hasAnswerKey(q)&&!answersMatch(currentPractice.answers[q.id],q.answerKey,q.section)).length),questionTimes:{...currentPractice.questionTimes},reviewQuestions,reviewQuestionCount:reviewQuestions.length};
  data.attempts.push(attempt);
  const cloudSave=session?.source==="firebase"?trackFirebaseAttemptSave(attempt):null;
  saveData();currentPractice=null;currentPage="progress";render();
  if(cloudSave)void cloudSave.catch(error=>{console.error("Could not sync completed attempt.",error);toast("Bài làm đã ghi nhận trên thiết bị nhưng chưa đồng bộ đủ lên máy chủ. Hãy giữ trang này mở và kiểm tra kết nối mạng.")});
  showModal("Hoàn thành bài ôn tập",`<div style="text-align:center;padding:12px"><div class="stat-icon purple" style="width:58px;height:58px;border-radius:18px;margin:auto">${icon("spark")}</div><h1 style="font-size:31px;margin-top:14px">${score===null?"Chưa chấm":`${score}/10`}</h1><p class="subhead">${score===null?`Lượt làm đã được ghi nhận. ${total} câu chưa có đáp án để chấm tự động.`:`Bạn trả lời đúng ${correct}/${graded.length} câu đã có đáp án.`} ${answeredUnknown?`${answeredUnknown} câu chưa có đáp án đúng để đối chiếu. `:""}Thời gian: ${formatDuration(attempt.duration)}.</p></div>`,`<button class="btn" data-action="close-modal">Xem lộ trình</button>`);
}
function normalizeAnswer(value) {
  return normalizeAnswerForSection(value,"");
}
function normalizeAnswerForSection(value,section) {
  if(section==="Đúng / Sai") {
    const trueFalse=canonicalTrueFalse(value);
    if(trueFalse)return trueFalse;
  }
  if(value&&typeof value==="object") {
    if(Array.isArray(value))return value.map(item=>normalizeMathAnswer(item)).sort().join("|");
    return Object.entries(value).sort(([left],[right])=>left.localeCompare(right)).map(([key,item])=>`${normalizeMathAnswer(key)}:${normalizeMathAnswer(item)}`).join("|");
  }
  let text=normalizeMathAnswer(value).replace(/^(?:ĐÁP\s*ÁN|ĐÁP\s*SỐ|KẾT\s*QUẢ)[:：]/,"");
  if(section==="Trắc nghiệm") {
    const option=text.match(/^([A-D])(?:[).:]|$)/)?.[1];
    if(option)return option;
  }
  if(section==="Trả lời ngắn")return normalizeNumericAnswer(text)||text;
  return text;
}
function hasAnswerKey(question) {
  return question?.answerKey!==null&&question?.answerKey!==undefined&&String(question.answerKey).trim()!=="";
}
function answersMatch(userAnswer,answerKey,section) {
  return normalizeAnswerForSection(userAnswer,section)===normalizeAnswerForSection(answerKey,section);
}
function questionCorrectness(question) {
  if(!hasAnswerKey(question))return null;
  return answersMatch(question.userAnswer,question.answerKey,question.section);
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
