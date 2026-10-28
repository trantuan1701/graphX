# GraphX vs GraphFrames - HTML slide deck

Mở [index.html](index.html) trực tiếp trên Chrome, Firefox hoặc Edge.
Deck chạy offline, không cần server, thư viện bên ngoài hoặc build step.
Có đúng 12 slide, tiêu đề tiếng Anh và nội dung thuyết trình tiếng Việt.

## Điều khiển

- Phím mũi tên, Space hoặc PageUp/PageDown: đổi slide.
- Home / End: slide đầu / cuối.
- F: fullscreen.
- N: bật hoặc tắt ghi chú thuyết trình, phạm vi kết luận và nguồn.
- P: mở hộp thoại in hoặc lưu PDF.
- Mở index.html#7 để đi thẳng tới slide 7.

Khi lưu PDF, chọn tất cả trang, bật background graphics và tắt header/footer của trình duyệt.
CSS khai báo trang 16:9 và ngắt trang sau mỗi slide.
Ghi chú và thanh điều hướng không xuất hiện trong bản in.

## Chỉnh sửa

| Nội dung | File |
| --- | --- |
| Tiêu đề, câu chuyện, Scala snippets, speaker notes | index.html |
| Font, màu, khoảng cách, canvas 1600 × 900 | styles.css |
| Loại biểu đồ, metric, điều hướng, syntax highlighting | script.js |
| Dữ liệu median/min/max dùng để vẽ biểu đồ | assets/data.js |
| Bằng chứng CSV và cấu hình từng lượt | assets/data/ |

Mỗi section.slide tương ứng một slide.
Text và code nằm trực tiếp trong HTML, code dùng escape &lt; và &amp; khi cần.
Biểu đồ là SVG sinh từ số liệu, không phải ảnh raster.
Màu framework và strategy được định nghĩa trong CSS và object colors của script.js.
Khi cập nhật kết quả, thay snapshot assets/data.js và kiểm tra lại các câu nhận xét, tỷ lệ và giá trị viết trực tiếp trong HTML.
Các tỷ lệ lớn ở slide 4, 6 và 8 tự tính lại từ dữ liệu.

## Nguồn và cách tổng hợp

Đọc implementation trong ../notebooks/03_preprocessed_graph_benchmark.ipynb và cách phân tích trong ../notebooks/04_preprocessed_graph_results.ipynb.
Dùng thống nhất run preprocessed_1793157792545 cho cả framework và partition benchmark.
Output lưu ở các cell cũ của notebook 04 có thể thuộc run trước, deck lấy CSV của run được ghi trong footer.
Snapshot này cố định để slide vẫn hoạt động khi latest_preprocessed_run.json thay đổi hoặc khi chuyển sang máy khác.

Loại warmup, cộng phase trong từng lượt rồi mới tính median, min và max trên 3 lượt đo.
Thanh sai số biểu diễn min/max, không phải khoảng tin cậy.
PR total = setup + 5 vòng.
Framework total = build + aggregate + PR total.
Partition total = build + PR total, không có aggregation.
Shuffle ở slide 8 và 11 chỉ cộng 5 vòng, không gồm build và setup.
Cache cuối build trừ cache input chung, không phải peak RAM.
Replication factor = tổng endpoint phân biệt theo từng edge partition / số vertex có cạnh.
Độ lệch tải = số cạnh lớn nhất / trung bình trên các edge partition.

Thí nghiệm dùng local[2], nên shuffle read gồm local + remote và chưa chứng minh giảm network giữa các máy.
Các kết luận phù hợp workload và cấu hình này, không xếp hạng mọi thuật toán hoặc mọi môi trường.
Giải thích kiến trúc được đối chiếu với plan thực và tài liệu GraphX, không khẳng định đã cô lập nguyên nhân bằng ablation.

Tài liệu đối chiếu:

- [Spark 3.5.7 GraphX programming guide](https://spark.apache.org/docs/3.5.7/graphx-programming-guide.html)
- [Spark 3.5.7 PartitionStrategy source](https://github.com/apache/spark/blob/v3.5.7/graphx/src/main/scala/org/apache/spark/graphx/PartitionStrategy.scala)


Bản PDF đã xuất sẵn: [slides.pdf](slides.pdf).
