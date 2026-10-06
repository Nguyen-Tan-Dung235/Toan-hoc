# Toán học

Ứng dụng web tiếng Việt dành cho luồng luyện tập Toán: đăng nhập học sinh/giáo viên, kho đề Word, tạo đề trộn, theo dõi tiến bộ, so sánh kết quả và bảy nhóm mã lỗi KT/TT/PP/DG/SU/QT/MH.

## Chạy thử

Mở thư mục bằng VS Code và chạy `index.html` qua tiện ích Live Server. Không mở trực tiếp bằng `file://`: trình duyệt cần HTTP để tải JavaScript module và bộ đọc `.docx`.

Firebase Authentication dùng Email/Password và gửi liên kết đặt lại mật khẩu qua email khi chọn **Quên mật khẩu?**. Hồ sơ vai trò đọc từ Firestore (`users/{uid}`); chủ sở hữu đăng nhập bằng lựa chọn **Giáo viên** và cấp quyền qua Cloud Function trong trang **Học sinh**. Kho câu hỏi là dữ liệu Firestore dùng chung giữa các thiết bị: giáo viên đăng nhập Firebase đọc kho chung, tải đề, ẩn/hiện đề với học sinh hoặc xóa bộ đề; học sinh chỉ thấy đề đã công bố và đang hiện, có thể xem trước/chọn để tự luyện. Để chạy ở gói Spark, ảnh nhúng được nén và lưu trực tiếp cùng nội dung câu hỏi trong Firestore; tệp gốc không được lưu trên đám mây. Đề giao cùng bản câu hỏi riêng được lưu trong Firestore và đồng bộ realtime tới đúng UID học sinh nhận đề. Giáo viên có thể đưa tài khoản học sinh vào danh sách chờ xóa; Cloud Function xóa Auth và hồ sơ Firestore sau 24 giờ, còn có thể khôi phục trước hạn. Bài làm/tiến độ vẫn lưu trong `localStorage` của trình duyệt, chưa đồng bộ giữa các thiết bị.

## Bật Firebase Authentication

1. Dự án Firebase `toan-199ee` đã được chọn trong `.firebaserc` và cấu hình Web app từ Firebase Console đã được đặt trong `firebase-config.js`. Ảnh Console xác nhận Email/Password và Google đang bật trong Authentication.
2. Trong **Authentication → Sign-in method**, bật cả **Email/Password** lẫn **Google**. Trong **Authentication → Settings → Authorized domains**, thêm domain Hosting và `localhost` khi thử trên máy tính. Dùng `http://localhost:4173` thay vì `127.0.0.1`, nếu cổng Live Server của bạn là 4173. Tạo Firestore Database. Không cần bật Cloud Storage cho chế độ Spark; Firebase Web API key là cấu hình phía trình duyệt, không phải mật khẩu; hãy giới hạn API key theo API và domain trong Google Cloud Console.
3. Tạo tài khoản chủ sở hữu bằng Email/Password. Trong Firestore Console, tạo/sửa `users/{UID}` tương ứng tài khoản của bạn và đặt `role: "owner"`, `displayName`, `email`. Đây là bước bootstrap một lần; không cấp vai trò này từ giao diện đăng ký.
4. Cài Firebase CLI (`npm install -g firebase-tools`) và đăng nhập tài khoản có quyền trên project (`firebase login`). Để chạy chế độ Spark miễn phí, triển khai bằng `firebase deploy --only firestore:rules,firestore:indexes,hosting --project toan-199ee`. Không triển khai Cloud Functions ở chế độ này. Nếu nâng cấp Blaze sau này và muốn bật Gemini AI/xóa tài khoản theo lịch, hãy làm theo các bước cấu hình Functions bên dưới.
5. Email đặt lại mật khẩu dùng mẫu mặc định Firebase Authentication; kiểm tra Authentication → Templates → Password reset, đúng project `toan-199ee`. Khi màn hình báo Firebase đã nhận yêu cầu, hãy đợi vài phút và kiểm tra Inbox, Spam/Thư rác, Quảng cáo và Tất cả thư của đúng địa chỉ đã nhập. Firebase không cung cấp xác nhận Gmail đã chuyển phát. Tài khoản chỉ đăng nhập bằng Google cần dùng nút Google thay vì đặt lại mật khẩu Toán học.
6. Xóa vĩnh viễn dùng Cloud Functions thế hệ 2 và Cloud Scheduler (quét mỗi 15 phút; không xóa trước khi đủ 24 giờ). Google Cloud yêu cầu bật billing Blaze cho việc triển khai/chạy scheduler và có thể tính phí theo mức sử dụng. Nếu chưa triển khai Functions, giao diện không thể xóa vĩnh viễn tài khoản.
7. Hosting xuất bản ứng dụng tĩnh. Kho đề, câu hỏi, ảnh đã nén và đề được giao đồng bộ bằng Firestore. Bài làm/tiến độ vẫn nằm trong `localStorage` của trình duyệt hiện tại. Ở Spark, không có backend Cloud Functions nên quản lý vai trò/xóa tài khoản theo lịch và AI Gemini phía máy chủ không khả dụng.

### Tạo tài khoản bằng email của bạn

1. Trong Firebase Console, mở **Authentication → Sign-in method → Email/Password** và bật phương thức này. Trong **Firestore Database**, tạo database nếu chưa có.
2. Mở website, chọn **Học sinh**, nhập `tandungnguyen2312009@gmail.com` cùng mật khẩu bạn tự đặt cho Toán học, rồi bấm **Tạo tài khoản học sinh**. Mật khẩu Firebase do bạn tự chọn; không gửi mật khẩu cho người khác.
3. Để cấp quyền giáo viên, triển khai rules mới bằng `firebase deploy --only firestore:rules --project toan-199ee`, đăng nhập bằng tài khoản `owner`, mở **Học sinh**, rồi chọn **Cấp giáo viên** bên cạnh tài khoản. Rules chỉ cho phép chủ sở hữu đổi vai trò `student` thành `teacher`; giáo viên thường không thể tự cấp quyền.
4. Trong mục **Học sinh**, chọn **Xóa sau 24 giờ** để đưa tài khoản vào khu **Đang chờ xóa** ở cuối trang. Chọn **Giữ tài khoản** trước hạn để khôi phục. Sau hạn, tác vụ chạy tối đa khoảng 15 phút mới xóa Auth và hồ sơ Firestore.
5. Giáo viên và học sinh có thể dùng **Quên mật khẩu?** ở màn hình đăng nhập; Firebase gửi liên kết đặt lại mật khẩu đến email. Đây không phải mã OTP sáu chữ số.

Google SSO dùng cửa sổ Google; mật khẩu Gmail không được gửi cho Toán học. Mật khẩu Email/Password là mật khẩu riêng của Toán học. Nếu email đã có tài khoản mật khẩu, bấm **Đăng nhập bằng Google**, nhập mật khẩu Toán học rồi bấm **Đăng nhập** để liên kết Google với đúng tài khoản đó; về sau có thể dùng cả hai cách mà vẫn cùng UID và dữ liệu.

Nếu website báo email đã được đăng ký, tài khoản đã tồn tại trong Authentication: chọn **Đăng nhập**, không tạo tài khoản lại. Nếu Firebase Auth tạo tài khoản nhưng chưa lưu hồ sơ do Firestore chưa sẵn sàng, sau khi tạo Firestore và Publish `firestore.rules`, lần đăng nhập học sinh tiếp theo sẽ thử tạo hồ sơ `student` còn thiếu. Tạo database theo đường dẫn **Firestore Database → Create database** trong đúng project `toan-199ee`.

## Nhập tài liệu và giới hạn

- Nhập `.docx`, `.pdf` và `.txt`. DOCX dùng Mammoth để trích nội dung/ảnh và chuyển Office Math (OMML/Equation) sang MathML; TeX dạng `$...$`, `\(...\)` và công thức hiển thị được render bằng MathJax.
- PDF có lớp chữ dùng PDF.js để trích xuất văn bản và hình; PDF scan cần OCR Gemini (không khả dụng ở Spark nếu chưa có backend Blaze). Khi lưu bộ câu hỏi Firebase, chỉ câu hỏi và ảnh nhúng đã nén được lưu trong Firestore để dùng trên thiết bị khác; tệp gốc `.docx`/`.pdf`/`.txt` không được tải lên đám mây. Mỗi câu hỏi phải nhỏ hơn giới hạn an toàn 850 KiB; ảnh quá lớn sẽ được nén, nếu câu vẫn vượt giới hạn cần giảm/bỏ ảnh.
- Bộ nhận diện cục bộ hỗ trợ nhãn `Câu n`/`Bài n`, tiêu đề Phần I/II/III, lựa chọn A–D nằm cùng dòng hoặc khác đoạn, và câu trả lời ngắn. Gemini AI có thể trả cấu trúc câu hỏi, phương án, công thức LaTeX và mã hình có sẵn; đáp án AI luôn bị ép thành `null`, không tự giải. Word giữ nguyên HTML/hình ảnh/công thức gốc, đồng thời gửi văn bản/MathML đã trích xuất để phân tích. Nếu AI chưa được triển khai hoặc lỗi, giao diện báo rõ rồi dùng nhận diện cục bộ với tài liệu có lớp văn bản. Giáo viên cần rà soát kết quả; OCR/AI không thể đảm bảo chính xác tuyệt đối với mọi bố cục, ảnh mờ, công thức phức tạp hoặc tài liệu lỗi.
- Tài khoản tải đề phải có vai trò giáo viên/chủ sở hữu; Gemini API key chỉ được lưu trong Firebase Secret Manager. Cloud Functions yêu cầu gói Firebase Blaze và dịch vụ Gemini có giới hạn/chi phí riêng theo cấu hình tài khoản. Câu trả lời AI gốc theo JSON có các trường `total_questions`, `question_number`, `type`, `content`, `options`, `image_ids` và `correct_answer: null`; ứng dụng chuyển chúng sang cấu trúc nội bộ kho đề mà vẫn giữ thông tin đó.
- Chỉ chấm tự động câu đã có đáp án được giáo viên xác nhận. Câu thiếu đáp án vẫn ghi nhận câu trả lời và thời gian làm nhưng hiển thị “Chưa chấm”.
- Trong **Đề ôn tập**, giáo viên có thể xóa đề đã tạo; thao tác chỉ gỡ đề khỏi danh sách giao và không xóa lịch sử làm bài đã lưu.
- Khi tạo đề giao, giáo viên chọn học sinh nhận đề. Nội dung đề được ghi vào Firestore để học sinh đăng nhập đúng tài khoản thấy trong mục **Đề ôn tập**; nếu tài liệu vượt giới hạn an toàn 850 KB, cần giảm số câu hoặc dung lượng ảnh. Phần **So sánh tiến bộ** của học sinh chỉ tính các lượt tự luyện.
