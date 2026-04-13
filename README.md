# Teencare LMS Mini-App (Fullstack NestJS + ReactJS)

Bài kiểm tra kỹ thuật - Vị trí Product Builder.

## 🌟 Công nghệ sử dụng
- **Backend:** NestJS, TypeORM, PostgreSQL.
- **Frontend:** ReactJS (Vite), Tailwind CSS, TypeScript.
- **DevOps:** Docker & Docker Compose.

## 🎯 Chức năng nổi bật (Nghiệp vụ cốt lõi)
1. **Chống Overbooking Lớp Học:** Sử dụng Pessimistic Locking (Khóa bi quan DB) để tránh lỗi đếm ảo sĩ số lớp. 
2. **Kiểm tra Trùng Lịch tự động:** Chuyển đổi khung giờ String thành minutes để check giao thoa lịch học sinh.
3. **Logic Hủy Lớp Tinh Tế:** Tự động hoàn buổi vào gói nếu hủy trước > 24h.

## 🚀 Hướng dẫn chạy tự động chuẩn CI/CD (Docker Compose)
1. Cài đặt Docker trên máy.
2. Từ thư mục dự án gốc (Thư mục chứa `docker-compose.yml`), chạy:
   ```bash
   docker-compose up --build
   ```
3. Truy cập Front-end: `http://localhost:3003`

---

## 📊 Database Schema (PostgreSQL)

Dự án sử dụng Relational Database với cấu trúc tối ưu cho logic quản lý lớp học. Sơ đồ thực thể (ERD):

```mermaid
erDiagram
    PARENTS ||--o{ STUDENTS : "giám hộ"
    STUDENTS ||--o{ SUBSCRIPTIONS : "sở hữu"
    STUDENTS ||--o{ REGISTRATIONS : "đăng ký"
    CLASSES ||--o{ REGISTRATIONS : "chứa"

    PARENTS {
        uuid id
        string name
        string phone
        string email
    }
    STUDENTS {
        uuid id
        string name
        date dob
        string gender
        int current_grade
        uuid parent_id
    }
    CLASSES {
        uuid id
        string name
        string subject
        string day_of_week
        string time_slot
        int max_students
    }
    SUBSCRIPTIONS {
        uuid id
        uuid student_id
        string package_name
        date start_date
        date end_date
        int total_sessions
        int used_sessions
    }
```

---

## 🛠️ Danh sách API chính & Ví dụ truy vấn

### 1. Phụ huynh & Học sinh
- **Tạo Phụ huynh:** `POST /api/parents`
- **Tạo Học sinh:** `POST /api/students`
- **Xem chi tiết:** `GET /api/students/{id}` (Kèm thông tin Parent)

### 2. Lớp học & Đăng ký
- **Lấy danh sách theo ngày:** `GET /api/classes?day=Chủ Nhật`
- **Đăng ký vào lớp:** `POST /api/classes/{class_id}/register` (Kiểm tra: Lớp đầy, Trùng lịch, Gói học).
- **Hủy lịch:** `DELETE /api/registrations/{id}` (Hoàn buổi nếu > 24h).

---

## 🧪 Dữ liệu mẫu (Seed Data)
Frontend có sẵn nút **"Bơm Test Data"** để nạp:
- 2 phụ huynh mẫu.
- 3 học sinh liên kết.
- 3 lớp học với các khung giờ chồng lấn.
- 3 gói Subscriptions với trạng thái khác nhau.

---

## 🛠️ (Tùy chọn) Chạy cục bộ
### 1. Backend (3000): `cd backend && npm install && npm run start:dev`
### 2. Frontend (5173): `cd frontend && npm install && npm run dev`
