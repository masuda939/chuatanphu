# An Lạc — Chùa Online

Một web experience tiếng Việt lấy cảm hứng từ các nghi lễ trong dự án [zane-tv/tiktok-live-temple-rpc](https://github.com/zane-tv/tiktok-live-temple-rpc), thiết kế như một chánh điện để khách cùng tham quan trong trình duyệt. Giao diện được dựng mới, không chép asset từ repo tham khảo.

## Trải nghiệm trong chánh điện

- Thắp hương, lạy Phật và thả hoa đăng với hoạt ảnh trong không gian chùa.
- Xin quẻ ngẫu nhiên với một lời nhắc suy ngẫm (mang tính giải trí, không phải dự đoán).
- Gõ mõ theo nhịp; thỉnh chuông với âm thanh tổng hợp trên thiết bị.
- Phật tử cùng trò chuyện trong một khung cộng đồng.
- Tự đặt tên hiển thị, chọn bật/tắt âm thanh và dùng được trên màn hình nhỏ.

## Chạy thử trên máy

Yêu cầu Node.js 20.19+ hoặc 22.12+.

```sh
npm install
npm run dev
```

## Bật chat dùng chung cho tất cả khách

Nếu chưa cấu hình Supabase, trang chạy ở chế độ xem thử: các tin nhắn gửi đi chỉ được lưu trong trình duyệt hiện tại; những người dùng khác không nhìn thấy.

1. Tạo một project tại [Supabase](https://supabase.com/dashboard), chọn region phù hợp và đặt mật khẩu cơ sở dữ liệu mạnh.
2. Mở **SQL Editor** trong project và chạy nội dung `supabase/schema.sql` để tạo bảng, quyền đọc/ghi giới hạn và Realtime publication.
3. Trong phần project settings/API của Supabase, lấy **Project URL** và **publishable/anon key**. Đây là thông tin client công khai; tuyệt đối không đưa `service_role` key vào website.
4. Tạo file `.env.local` ở thư mục gốc, điền:

   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
   ```

5. Khởi động lại `npm run dev`. Với Vercel, khai báo hai biến trên ở **Project → Settings → Environment Variables** rồi deploy lại.

SQL bật chính sách RLS để ai cũng có thể đọc tin nhắn mới trong 7 ngày và gửi tin giới hạn 220 ký tự. Vì chat công khai không yêu cầu đăng nhập, nếu mở cho lượng truy cập lớn thì nên thêm CAPTCHA/Edge Function hoặc dịch vụ moderation, rate limit phía máy chủ và cơ chế report/xóa tin nhắn.

## Build

```sh
npm run build
npm run preview
```

Vercel build bằng `npm run build` và phục vụ thư mục `dist` (đã cấu hình trong `vercel.json`).
