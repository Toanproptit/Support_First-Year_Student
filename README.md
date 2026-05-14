# 🎓 Support First-Year Student

Hệ thống hỗ trợ sinh viên năm nhất được phát triển nhằm giúp sinh viên dễ dàng tiếp cận các thông tin học tập, hoạt động và đời sống sinh viên thông qua một nền tảng web tập trung.

## 📌 Giới thiệu

Support First-Year Student là một ứng dụng web hỗ trợ sinh viên năm nhất trong việc:

- Tra cứu lịch học, lịch thi
- Xem thông tin khoa, ngành học, môn học
- Theo dõi hoạt động ngoại khóa và câu lạc bộ
- Đọc cẩm nang sinh viên
- Gửi phản hồi, bình luận và tương tác với bài viết
- Đăng ký lớp học phần

Ngoài ra, hệ thống còn hỗ trợ quản trị viên quản lý dữ liệu và nội dung tập trung thông qua trang Admin.

---

# 🚀 Công nghệ sử dụng

## Frontend
- ReactJS
- Vite
- React Router DOM
- Axios
- CSS / TailwindCSS

## Backend
- Java Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- Lombok

## Database & Other
- MySQL
- Redis
- Docker Compose
- Git & GitHub

---

# 🔐 Chức năng chính

## 👨‍🎓 Sinh viên
- Đăng nhập / Đăng ký
- Xem thông tin cá nhân
- Tra cứu lịch học và lịch thi
- Đăng ký lớp học phần
- Xem bài viết và cẩm nang sinh viên
- Bình luận và thả cảm xúc bài viết
- Tham gia hoạt động ngoại khóa
- Gửi phản hồi

## 👨‍💼 Admin
- Quản lý sinh viên
- Quản lý bài viết
- Quản lý danh mục
- Quản lý khoa và ngành học
- Quản lý hoạt động ngoại khóa
- Quản lý lớp học phần
- Quản lý học kỳ
- Quản lý phản hồi

---

# 🗂️ Cấu trúc hệ thống

```bash
project/
│
├── back-end/     # Spring Boot API
├── front-end/    # ReactJS Client
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Cài đặt dự án

## 1️⃣ Clone project

```bash
git clone https://github.com/your-username/Support_First-Year_Student.git
```

---

## 2️⃣ Backend

### Di chuyển vào thư mục backend

```bash
cd back-end
```

### Cấu hình `.env`

```env
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
```

### Chạy project

```bash
./mvnw spring-boot:run
```

---

## 3️⃣ Frontend

### Di chuyển vào thư mục frontend

```bash
cd front-end
```

### Cài dependencies

```bash
npm install
```

### Chạy project

```bash
npm run dev
```

---

# 🐳 Chạy bằng Docker

```bash
docker-compose up --build
```

---

# 🛡️ Authentication & Security

- JWT Authentication
- Role-based Authorization (Admin / Student)
- Password Encryption
- OAuth2 Login (Google, GitHub)

---

# 🗄️ Database

Hệ thống sử dụng MySQL với các module chính:

- Users
- Posts
- Comments
- Feedbacks
- Activities
- Clubs
- Faculties
- Majors
- Subjects
- Course Sections
- Exam Schedules
- Class Schedules

---

# 👥 Thành viên nhóm

| Họ và tên | Vai trò |
|---|---|
| Nguyễn Trọng Toàn | Frontend & Backend |
| Hà Huy Hoàng | Frontend & Backend |
| Vũ Duy Thái | Frontend & Backend |

---

# 📷 Giao diện

## Student
- Dashboard
- Hồ sơ cá nhân
- Hỏi đáp
- Hoạt động ngoại khóa
- Lớp tín chỉ

## Admin
- Dashboard quản trị
- Quản lý sinh viên
- Quản lý bài viết
- Quản lý khoa/ngành
- Quản lý hoạt động

---

# 📈 Định hướng phát triển

- Thống kê trực quan bằng biểu đồ
- Notification realtime
- Mobile App
- CI/CD
- Tối ưu UX/UI
- Phân quyền nâng cao

---

# 📄 License

Project được phát triển phục vụ mục đích học tập và nghiên cứu.