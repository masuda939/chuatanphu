# Chùa Tân Phú — Chùa Online

Một chánh điện online tiếng Việt để khách ghé thăm, dâng lễ và trò chuyện cùng nhau. Giao diện được dựng mới, lấy cảm hứng từ ý tưởng nghi lễ của [zane-tv/tiktok-live-temple-rpc](https://github.com/zane-tv/tiktok-live-temple-rpc). Tượng Phật trong chánh điện được render từ mô hình [gilt-bronze Buddha CC0 (Zenodo record 10337923)](https://zenodo.org/records/10337923) — cùng nguồn CC0 mà repo tham khảo sử dụng, đã xác minh md5.

- Trang chạy: https://chuatanphu.vercel.app
- Mã nguồn: repository riêng `masuda939/chuatanphu`
- Team Vercel riêng: `chuatanphu` (project `chuatanphu`, domain `chuatanphu.vercel.app`)
- Repo đã nối Git với project: mỗi lần push nhánh `main`, Vercel tự build và deploy production.

## Trải nghiệm trong chánh điện

- Thắp hương, lạy Phật và thả hoa đăng với hoạt ảnh ngay trong khung chùa.
- Nhân vật đạo hữu di chuyển tự do bằng phím WASD/mũi tên hoặc bấm vào nền sân chùa; bấm vào chánh điện để đi vào đảnh lễ Tam Bái; phím cách lạy Phật khi đứng trước bàn thờ.
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
