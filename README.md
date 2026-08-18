# teaching-speakhieu — Gia sư tiếng Anh giao tiếp (Thanh Hiếu)

Trang một tệp, HTML/CSS/JS thuần. Đây là repo **tách riêng cho trang dạy học**,
deploy lên GitHub Pages với tên miền `teaching.speakhieu.pro`.
Trang MC nằm ở repo `hieu-portfolio` (tên miền dự kiến `mc.speakhieu.pro`).

```
index.html         toàn bộ trang — chữ nằm thẳng trong file này
css/teaching.css   giao diện "bản ghi cuộc trò chuyện" trên giấy
js/site.js         hiệu ứng cuộn + nút liên hệ + popup gọi điện (copy từ repo MC)
images/            2 ảnh: portrait (ảnh share mạng xã hội), moment-crowd (polaroid)
docs/kich-ban-video.md   kịch bản quay video 90 giây
```

## Sửa nội dung

- **Chữ / lời thoại**: sửa thẳng trong `index.html`.
- **Học phí**: tìm `pricecard` trong `index.html`; nếu đổi giá, sửa luôn khối
  JSON-LD ở đầu file (phần `offers`).
- **Số điện thoại / Zalo / email**: khối `CONTACT` đầu `js/site.js`.
  Lưu ý: repo MC có bản `site.js` riêng — đổi số thì sửa cả hai repo.

## Gắn video "nghe tôi nói thử" — việc quan trọng nhất

Kịch bản quay ở [docs/kich-ban-video.md](docs/kich-ban-video.md). Quay xong,
up YouTube (Unlisted được), rồi thay cả khối `<div class="video-slot">…</div>`
trong `index.html` bằng:

```html
<div class="video-frame">
  <iframe src="https://www.youtube.com/embed/MA-VIDEO-CUA-BAN"
          title="Thanh Hiếu nói tiếng Anh" allowfullscreen loading="lazy"></iframe>
</div>
```

Khung `.video-frame` đã có sẵn trong CSS, không phải thêm gì.

## Deploy + tên miền

1. Repo này → Settings → Pages → Deploy from a branch → `main` / root.
2. Mua `speakhieu.pro`, thêm DNS ở nhà đăng ký:
   - `CNAME` | `teaching` | `taibt-devops.github.io`
   - `CNAME` | `mc`       | `taibt-devops.github.io`  (cho repo MC)
   - Redirect tên trần `speakhieu.pro` → `https://teaching.speakhieu.pro`
3. Settings → Pages → Custom domain: `teaching.speakhieu.pro` → Save → chờ
   xác thực DNS → bật **Enforce HTTPS**.
4. Sau khi tên miền sống: trong `index.html` đổi 3 link `taibt-devops.github.io/hieu-portfolio`
   thành `https://mc.speakhieu.pro` (đã đánh dấu TODO sẵn trong file).
