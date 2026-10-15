# EDA dữ liệu IBM AML

Notebook: `notebooks/ibm_aml_hi_small_eda.ipynb`.
Nguồn: [IBM Transactions for Anti Money Laundering (AML)](https://www.kaggle.com/datasets/ealtman2019/ibm-transactions-for-anti-money-laundering-aml), file `HI-Small_Trans.csv`.
Đây là dữ liệu tổng hợp, nhãn `Is Laundering` là nhãn của bộ dữ liệu.

## Chạy lại

```bash
python -m venv .venv
.venv/bin/python -m pip install -r requirements-eda.txt
.venv/bin/python scripts/download_aml.py
.venv/bin/python -m ipykernel install --prefix .venv --name python3
```

Mở notebook bằng VS Code hoặc Jupyter và chọn Python trong `.venv`.
Notebook tự tìm thư mục dự án khi mở từ thư mục gốc hoặc `notebooks/`.
File CSV được giữ ở `data/raw/` và không đưa vào Git vì kích thước lớn.
Manifest ghi nguồn, kích thước và SHA-256 để đối chiếu dữ liệu.
Notebook đọc toàn bộ file bằng kiểu dữ liệu tiết kiệm bộ nhớ, nên cần khoảng 3 GB RAM trống; dung lượng thực tế phụ thuộc phiên bản pandas.
Chỉ biểu đồ phân phối số tiền dùng mẫu ngẫu nhiên tối đa 200.000 dòng cho mỗi cặp nhãn và tiền tệ được chọn, với seed cố định.
Các bảng thống kê, tỷ lệ nhãn và thống kê đồ thị sử dụng toàn bộ dữ liệu.

## Nội dung

- Schema, dữ liệu thiếu, timestamp không hợp lệ, giá trị âm/không hữu hạn và dòng trùng.
- Mất cân bằng nhãn, phân tích thời gian, phương thức thanh toán và tiền tệ.
- Phân phối số tiền riêng theo tiền tệ và nhãn, tương quan trên các giao dịch cùng tiền tệ.
- Đồ thị có hướng: khóa tài khoản gồm ngân hàng và mã tài khoản, self-loop, cạnh lặp, bậc theo giao dịch và số láng giềng khác nhau.
- Gợi ý chuẩn bị dữ liệu cho GraphFrames và giới hạn diễn giải.

Các bảng, biểu đồ PNG và kết luận tính từ dữ liệu được xuất vào `reports/` khi chạy notebook.
EDA không chạy PageRank, motif hay community detection; các thuật toán này thuộc bước GraphFrames tiếp theo của đề tài.
