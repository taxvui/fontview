# Google Fonts Studio - Realtime Typography Previewer

Ứng dụng web hiện đại giúp bạn khám phá, tìm kiếm và xem trước toàn bộ Google Fonts trong thời gian thực với kích thước tùy biến, các biến thể font-weight thực tế và điều khiển Variable Font axes.

---

## Tính năng nổi bật

1. **Xem trước thời gian thực (Real-time Preview)**
   - Nhập bất kỳ văn bản nào (hoặc chọn văn bản mẫu / pangram tiếng Việt, tiếng Anh, tiếng Trung, bảng chữ cái alphabet).
   - Thanh trượt + ô nhập số cỡ chữ từ **8px đến 200px** với các preset nhanh (16, 24, 36, 48, 64, 72, 96px).
   - Tinh chỉnh khoảng cách dòng (Line height), khoảng cách ký tự (Letter spacing), căn lề (Left, Center, Right, Justify), chuyển đổi hoa/thường, màu chữ và màu nền.
   - Cập nhật tức thời cho toàn bộ 20 font hiển thị trên trang hiện tại.

2. **Phân trang chính xác 20 Font mỗi trang**
   - Chỉ tải và hiển thị đúng 20 font mỗi trang, tối ưu hóa bộ nhớ và tốc độ mạng.
   - Tự động cuộn mượt về đầu danh sách khi chuyển trang.
   - Hiển thị thông số `Showing 1–20 of X fonts`, điều hướng trang trước/sau, danh sách số trang có dấu ba chấm và ô nhảy nhanh tới số trang bất kỳ.
   - Khi tìm kiếm hoặc đổi bộ lọc, phân trang tự động reset về trang 1.

3. **Chỉ hiển thị các Font-Weight & Styles thực tế**
   - Không giả lập các weight mà font không hỗ trợ. Chỉ hiển thị các biến thể thực sự có trên Google Fonts (Thin 100, ExtraLight 200, Light 300, Regular 400, Medium 500, SemiBold 600, Bold 700, ExtraBold 800, Black 900 và các biến thể Italic).
   - Xem nhanh từng weight ngay dưới card, hoặc nhấn **Inspect all** để mở danh sách mẫu văn bản của từng weight.

4. **Hỗ trợ Variable Fonts chuyên sâu**
   - Tự động nhận diện Variable Fonts với huy hiệu riêng.
   - Cung cấp thanh trượt điều chỉnh các trục biến thiên trong thời gian thực (`wght`, `wdth`, `slnt`, `opsz`, `SOFT`, `WONK`...).

5. **Bộ lọc & Tìm kiếm thông minh**
   - Tìm kiếm debounce theo tên font, thể loại, tác giả.
   - Lọc theo danh mục: *Sans Serif, Serif, Display, Handwriting, Monospace*.
   - Lọc theo đặc tính: *Variable Fonts, Có Italic, Nhiều Weights (3+), Yêu thích (Favorites)*.
   - Lọc theo bảng mã ký tự (*Latin, Vietnamese, Cyrillic, Devanagari, Japanese, Chinese, Arabic*).
   - Sắp xếp: *Phổ biến nhất, A → Z, Z → A, Nhiều kiểu dáng nhất, Mới cập nhật*.

6. **Sao chép CSS & Nhúng mã nguồn dễ dàng**
   - 1-click sao chép CSS `font-family: 'Roboto', sans-serif;` với thông báo Toast tiện lợi.
   - Modal chi tiết cung cấp mã nhúng `<link>` và `@import` chuẩn của Google Fonts.

7. **Đa ngôn ngữ & Giao diện Liquid Glass**
   - Hỗ trợ 3 ngôn ngữ: **Tiếng Việt, English, 中文**.
   - Hỗ trợ **Light Mode, Dark Mode** và chế độ Hệ thống.
   - 6 bảng màu điểm nhấn (Accent Themes): *Sapphire Indigo, Emerald Jade, Crimson Rose, Amber Sunset, Cyan Sky, Amethyst Violet*.
   - Lưu trữ danh sách yêu thích và tùy chọn vào `localStorage`.

8. **Tích hợp Google Fonts API linh hoạt**
   - Sẵn sàng hoạt động ngay lập tức mà không bắt buộc có API key.
   - Tùy chọn cấu hình `GOOGLE_FONTS_API_KEY` qua UI hoặc file `.env` để đồng bộ dữ liệu thời gian thực từ Google. Có cơ chế cache 24h để tiết kiệm số lần gọi API.

---

## Cấu trúc thư mục

```
/
├── index.html                  # File HTML chính với thẻ preconnect Google Fonts
├── metadata.json               # Cấu hình applet
├── package.json                # Dependencies & scripts
├── tsconfig.json               # Cấu hình TypeScript
├── vite.config.ts              # Cấu hình Vite & Tailwind v4
├── .env.example                # Mẫu biến môi trường
└── src/
    ├── main.tsx                # Entry point
    ├── App.tsx                 # Điều phối state chính, filter, pagination
    ├── index.css               # Tailwind CSS v4, hiệu ứng Liquid Glass
    ├── types/
    │   └── font.ts             # Định nghĩa Type cho Google Fonts, Axes, Settings
    ├── data/
    │   └── googleFontsData.ts  # Catalog Google Fonts metadata với weights & axes chuẩn
    ├── services/
    │   └── googleFontsService.ts # Service xử lý Google Fonts API, link builder, cache, favorites
    ├── hooks/
    │   └── useFontLoader.ts    # Custom hook lazy-load Google Fonts theo trang
    ├── context/
    │   ├── ThemeContext.tsx    # Quản lý Light/Dark mode & 6 màu accent
    │   └── LanguageContext.tsx # Quản lý đa ngôn ngữ (Tiếng Việt, Anh, Trung)
    ├── i18n/
    │   └── translations.ts     # Từ điển ngôn ngữ vi, en, zh
    └── components/
        ├── Header.tsx              # Top bar (thương hiệu, theme, ngôn ngữ, accent)
        ├── PreviewControls.tsx     # Thanh điều khiển text, cỡ chữ, căn lề, khoảng cách
        ├── FontFilters.tsx         # Tìm kiếm, phân loại, lọc subsets, sắp xếp
        ├── FontGrid.tsx            # Lưới hiển thị 20 font responsive
        ├── FontCard.tsx            # Card từng font với preview thật, copy, favorite
        ├── FontWeightPreview.tsx   # Danh sách và xem thử các weight/style thực tế
        ├── VariableAxesControl.tsx # Điều khiển trục Variable Font
        ├── Pagination.tsx          # Điều hướng phân trang 20 font/trang
        ├── FontDetailModal.tsx     # Modal xem chi tiết font & lấy mã nhúng HTML/CSS
        ├── ApiSettingsModal.tsx    # Modal cấu hình Google Fonts API Key
        └── Toast.tsx               # Hệ thống thông báo toast
```

---

## Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy môi trường phát triển (Local Development)
```bash
npm run dev
```
Mở trình duyệt tại địa chỉ `http://localhost:3000`.

### 3. Kiểm tra kiểu dữ liệu (Type check)
```bash
npm run lint
```

### 4. Build Production
```bash
npm run build
```
Thư mục `dist/` sẽ được tạo chứa toàn bộ static assets tối ưu sẵn sàng deploy lên Vercel, Netlify, Cloud Run hoặc bất kỳ static web host nào.

---

## Cấu hình Google Fonts API Key (Tùy chọn)

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Kích hoạt **Google Fonts Developer API**.
3. Tạo API Key tại mục **Credentials**.
4. Bạn có 2 cách thêm API Key vào ứng dụng:
   - **Cách 1 (Qua giao diện)**: Nhấn vào biểu tượng chìa khóa 🔑 ở góc trên bên phải thanh Header của ứng dụng, nhập key của bạn rồi chọn **Save API Key**. Hệ thống sẽ tự động kiểm tra và đồng bộ.
   - **Cách 2 (Qua biến môi trường)**: Đặt vào file `.env`:
     ```env
     VITE_GOOGLE_FONTS_API_KEY=YOUR_ACTUAL_API_KEY
     ```
