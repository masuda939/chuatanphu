# Chùa Tân Phú — Chùa Online

Một chánh điện online tiếng Việt để khách ghé thăm, dâng lễ và trò chuyện cùng nhau. Giao diện được dựng mới, lấy cảm hứng từ ý tưởng nghi lễ của [zane-tv/tiktok-live-temple-rpc](https://github.com/zane-tv/tiktok-live-temple-rpc); không sử dụng asset từ repo đó.

- Trang chạy: https://chuatanphu.vercel.app
- Mã nguồn: repository riêng `masuda939/chuatanphu`
- Team Vercel riêng: `chuatanphu` (project `chuatanphu`, domain `chuatanphu.vercel.app`)

## Trải nghiệm trong chánh điện

- Thắp hương, lạy Phật và thả hoa đăng với hoạt ảnh ngay trong khung chùa.
- Bấm vào chánh điện: đạo hữu áo lam đi vào sảnh, đảnh lễ Tam Bái trước Phật rồi quay ra.
- Xin quẻ ngẫu nhiên kèm một lời nhắc suy ngẫm (mang tính giải trí, không phải dự đoán).
- Gõ mõ theo nhịp và thỉnh chuông với âm thanh tổng hợp ngay trên thiết bị.
- Phòng trò chuyện chung theo thời gian thực: tin nhắn hiện với mọi người đang ghé chùa, kèm số người đang online.
- Tự đặt tên hiển thị, bật/tắt âm thanh, dùng tốt trên điện thoại.

## Chạy thử trên máy

Yêu cầu Node.js 20.19+ hoặc 22.12+.

```sh
npm install
npm run dev
```

Tạo `.env.local` từ `.env.example` nếu cần cấu hình Supabase riêng.

## Trò chuyện cộng đồng

Chat dùng **Supabase Realtime Broadcast + Presence**, không cần tạo bảng hay chạy SQL:

- `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` là thông tin client công khai, đặt trong `.env.local` khi chạy máy và trong Environment Variables của Vercel khi triển khai.
- Kênh dùng chung: `chuatanphu-community`.
- Tin nhắn không được lưu vào cơ sở dữ liệu; khách mới vào sẽ thấy lời chào mẫu và các tin nhắn phát sinh từ lúc họ tham gia.
- Nếu không cấu hình Supabase hoặc kết nối bị gián đoạn, tin nhắn chỉ lưu trên thiết bị hiện tại và giao diện báo đang kết nối lại.

Vì phòng chat công khai không yêu cầu đăng nhập, khi lượng truy cập tăng nên cân nhắc thêm moderation, giới hạn tần suất gửi phía máy chủ và cơ chế báo cáo tin nhắn.

## Build và triển khai

```sh
npm run build
npm run preview
```

`vercel.json` cấu hình Vite, build bằng `npm run build`, xuất thư mục `dist`. Triển khai production:

```sh
npx vercel deploy --prod
```
