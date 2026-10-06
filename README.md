# Toán học

Ứng dụng web tiếng Việt dành cho luồng luyện tập Toán: đăng nhập học sinh/giáo viên, kho đề Word, tạo đề trộn, theo dõi tiến bộ, so sánh kết quả và bảy nhóm mã lỗi KT/TT/PP/DG/SU/QT/MH.

## Chạy thử

Mở thư mục bằng VS Code và chạy `index.html` qua tiện ích Live Server. Không mở trực tiếp bằng `file://`: trình duyệt cần HTTP để tải JavaScript module và bộ đọc `.docx`.

Firebase Authentication dùng Email/Password và Google. Hồ sơ vai trò đọc từ Firestore (`users/{uid}`); chủ sở hữu cấp quyền giáo viên tại mục **Học sinh**. Giáo viên có thể khóa hoặc mở lại quyền truy cập học sinh từ Firestore, không cần Cloud Functions. Khi trạng thái khóa được đồng bộ, học sinh bị đăng xuất; lần đăng nhập kế tiếp bị từ chối. Kho câu hỏi, đề giao và tóm tắt lượt làm hoàn thành được chia sẻ/đồng bộ qua Firestore. Bài làm dở và nội dung câu trả lời chi tiết không được đồng bộ.

Bảy mã lỗi có mã và thứ tự cố định để giữ nguyên liên kết với câu hỏi và thống kê cũ; giáo viên có thể sửa tên/mô tả dùng chung tại trang **7 nhóm lỗi**. Cấu hình được lưu trong Firestore (`settings/errorCategories`) và cập nhật trực tiếp tới học sinh, giáo viên trên các thiết bị. Tài liệu tham khảo mã lỗi được lưu riêng theo tài khoản giáo viên (`errorDocs/{id}`), đồng bộ giữa thiết bị của giáo viên đó. Luồng nạp tài liệu trích xuất văn bản và cho giáo viên rà soát; PDF scan cần OCR trước.

Giáo viên có thể xem hồ sơ và lượt làm của toàn bộ học sinh. Học sinh chỉ đọc hồ sơ và lượt làm của chính tài khoản mình theo Firestore Security Rules.

## Bật Firebase Authentication

1. Dự án Firebase `toan-199ee` đã được chọn trong `.firebaserc` và cấu hình Web app từ Firebase Console đã được đặt trong `firebase-config.js`. Ảnh Console xác nhận Email/Password và Google đang bật trong Authentication.
2. Trong **Authentication → Sign-in method**, bật cả **Email/Password** lẫn **Google**. Trong **Authentication → Settings → Authorized domains**, thêm domain Hosting và `localhost` khi thử trên máy tính. Dùng `http://localhost:4173` thay vì `127.0.0.1`, nếu cổng Live Server của bạn là 4173. Tạo Firestore Database. Không cần bật Cloud Storage cho chế độ Spark; Firebase Web API key là cấu hình phía trình duyệt, không phải mật khẩu; hãy giới hạn API key theo API và domain trong Google Cloud Console.
3. Tạo tài khoản chủ sở hữu bằng Email/Password. Trong Firestore Console, tạo/sửa `users/{UID}` tương ứng tài khoản của bạn và đặt `role: "owner"`, `displayName`, `email`. Đây là bước bootstrap một lần; không cấp vai trò này từ giao diện đăng ký.
4. Cài Firebase CLI (`npm install -g firebase-tools`) và đăng nhập tài khoản có quyền trên project (`firebase login`). Để chạy chế độ Spark miễn phí, triển khai bằng `firebase deploy --only firestore:rules,firestore:indexes,hosting --project toan-199ee`. Không triển khai Cloud Functions ở chế độ này. Nếu nâng cấp Blaze sau này và muốn bật Gemini AI/xóa tài khoản theo lịch, hãy làm theo các bước cấu hình Functions bên dưới.
5. Email đặt lại mật khẩu dùng mẫu mặc định Firebase Authentication; kiểm tra Authentication → Templates → Password reset, đúng project `toan-199ee`. Khi màn hình báo Firebase đã nhận yêu cầu, hãy đợi vài phút và kiểm tra Inbox, Spam/Thư rác, Quảng cáo và Tất cả thư của đúng địa chỉ đã nhập. Firebase không cung cấp xác nhận Gmail đã chuyển phát. Tài khoản chỉ đăng nhập bằng Google cần dùng nút Google thay vì đặt lại mật khẩu Toán học.
6. Mục **Học sinh** cho phép giáo viên khóa truy cập hoặc mở khóa lại tài khoản. Thao tác này giữ hồ sơ và dữ liệu, không xóa tài khoản Authentication. Khóa truy cập dựa trên Firestore Security Rules và không cần Cloud Functions.
7. Hosting xuất bản ứng dụng tĩnh. Ở Spark, không có backend Cloud Functions nên xóa tài khoản Authentication từ xa và AI Gemini phía máy chủ không khả dụng.

### Tạo tài khoản bằng email của bạn

1. Trong Firebase Console, mở **Authentication → Sign-in method → Email/Password** và bật phương thức này. Trong **Firestore Database**, tạo database nếu chưa có.
2. Mở website, chọn **Học sinh**, nhập `tandungnguyen2312009@gmail.com` cùng mật khẩu bạn tự đặt cho Toán học, rồi bấm **Tạo tài khoản học sinh**. Mật khẩu Firebase do bạn tự chọn; không gửi mật khẩu cho người khác.
3. Để cấp quyền giáo viên, triển khai rules mới bằng `firebase deploy --only firestore:rules --project toan-199ee`, đăng nhập bằng tài khoản `owner`, mở **Học sinh**, rồi chọn **Cấp giáo viên** bên cạnh tài khoản. Rules chỉ cho phép chủ sở hữu đổi vai trò `student` thành `teacher`; giáo viên thường không thể tự cấp quyền.
4. Trong mục **Học sinh**, chọn **Khóa truy cập** để chặn học sinh đăng nhập; phiên đang mở sẽ bị đăng xuất khi thay đổi được đồng bộ. Chọn **Mở khóa** để khôi phục quyền truy cập. Tài khoản Authentication vẫn còn nguyên.
5. Giáo viên và học sinh có thể dùng **Quên mật khẩu?** ở màn hình đăng nhập; Firebase gửi liên kết đặt lại mật khẩu đến email. Đây không phải mã OTP sáu chữ số.

Google SSO dùng cửa sổ Google; mật khẩu Gmail không được gửi cho Toán học. Mật khẩu Email/Password là mật khẩu riêng của Toán học. Nếu email đã có tài khoản mật khẩu, bấm **Đăng nhập bằng Google**, nhập mật khẩu Toán học rồi bấm **Đăng nhập** để liên kết Google với đúng tài khoản đó; về sau có thể dùng cả hai cách mà vẫn cùng UID và dữ liệu.

Nếu website báo email đã được đăng ký, tài khoản đã tồn tại trong Authentication: chọn **Đăng nhập**, không tạo tài khoản lại. Nếu Firebase Auth tạo tài khoản nhưng chưa lưu hồ sơ do Firestore chưa sẵn sàng, sau khi tạo Firestore và Publish `firestore.rules`, lần đăng nhập học sinh tiếp theo sẽ thử tạo hồ sơ `student` còn thiếu. Tạo database theo đường dẫn **Firestore Database → Create database** trong đúng project `toan-199ee`.

## Nhập tài liệu và giới hạn

- Bước rà soát mở rộng gần toàn màn hình và đánh dấu nổi bật câu cần kiểm tra. Với PDF, mỗi câu dùng ảnh chứa nguyên nội dung và các phương án; giáo viên có thể căn lại hoặc vẽ khung cắt từ ảnh trang gốc. Nội dung phương án không bị chép lại riêng nên tránh sai công thức.
- Nhập `.docx`, `.pdf` và `.txt`. DOCX dùng Mammoth để trích nội dung/ảnh và chuyển Office Math (OMML/Equation) sang MathML; TeX dạng `$...$`, `\(...\)` và công thức hiển thị được render bằng MathJax.
- PDF có lớp chữ dùng PDF.js để trích xuất văn bản và hình; PDF scan cần OCR Gemini (không khả dụng ở Spark nếu chưa có backend Blaze). Khi lưu bộ câu hỏi Firebase, chỉ câu hỏi và ảnh nhúng đã nén được lưu trong Firestore để dùng trên thiết bị khác; tệp gốc `.docx`/`.pdf`/`.txt` không được tải lên đám mây. Mỗi câu hỏi phải nhỏ hơn giới hạn an toàn 850 KiB; ảnh quá lớn sẽ được nén, nếu câu vẫn vượt giới hạn cần giảm/bỏ ảnh.
- Bộ nhận diện cục bộ hỗ trợ nhãn `Câu n`/`Bài n`, tiêu đề Phần I/II/III, lựa chọn A–D nằm cùng dòng hoặc khác đoạn, và câu trả lời ngắn. Gemini AI có thể trả cấu trúc câu hỏi, phương án, công thức LaTeX và mã hình có sẵn; đáp án AI luôn bị ép thành `null`, không tự giải. Word giữ nguyên HTML/hình ảnh/công thức gốc, đồng thời gửi văn bản/MathML đã trích xuất để phân tích. Nếu AI chưa được triển khai hoặc lỗi, giao diện báo rõ rồi dùng nhận diện cục bộ với tài liệu có lớp văn bản. Giáo viên cần rà soát kết quả; OCR/AI không thể đảm bảo chính xác tuyệt đối với mọi bố cục, ảnh mờ, công thức phức tạp hoặc tài liệu lỗi.
- Tài khoản tải đề phải có vai trò giáo viên/chủ sở hữu; Gemini API key chỉ được lưu trong Firebase Secret Manager. Cloud Functions yêu cầu gói Firebase Blaze và dịch vụ Gemini có giới hạn/chi phí riêng theo cấu hình tài khoản. Câu trả lời AI gốc theo JSON có các trường `total_questions`, `question_number`, `type`, `content`, `options`, `image_ids` và `correct_answer: null`; ứng dụng chuyển chúng sang cấu trúc nội bộ kho đề mà vẫn giữ thông tin đó.
- Chỉ chấm tự động câu đã có đáp án được giáo viên xác nhận. Câu thiếu đáp án vẫn ghi nhận câu trả lời và thời gian làm nhưng hiển thị “Chưa chấm”.
- Trong **Đề ôn tập**, giáo viên có thể xóa đề đã tạo; thao tác chỉ gỡ đề khỏi danh sách giao và không xóa lịch sử làm bài đã lưu.
- Khi tạo đề giao, giáo viên chọn học sinh nhận đề. Nội dung đề được ghi vào Firestore để học sinh đăng nhập đúng tài khoản thấy trong mục **Đề ôn tập**; nếu tài liệu vượt giới hạn an toàn 850 KB, cần giảm số câu hoặc dung lượng ảnh. Phần **So sánh tiến bộ** của học sinh chỉ tính các lượt tự luyện.
