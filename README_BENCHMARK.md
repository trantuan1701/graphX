# Scala benchmark và Python visualization

Chạy theo thứ tự hai notebook:

1. `notebooks/01_scala_graph_benchmark.ipynb`: chuẩn hóa input, chạy GraphX/GraphFrames và xuất metrics bằng Scala trực tiếp.
2. `notebooks/02_python_visualize.ipynb`: đọc lần chạy Scala thành công gần nhất, kiểm tra kết quả, vẽ biểu đồ và giải thích WHY.

Notebook EDA ban đầu nằm riêng ở `notebooks/ibm_aml_hi_small_eda.ipynb`.

## Chuẩn bị

Cần Java 17 tại `JAVA_HOME` hoặc `.tools/java`.
Môi trường benchmark được khóa ở Spark 3.5.7, Scala 2.12.18 và GraphFrames 0.10.0.
Cách viết GraphX theo [guide 4.0.2](https://spark.apache.org/docs/4.0.2/graphx-programming-guide.html); đây không phải phép đo trên Spark 4.0.2.

```bash
python -m venv .venv
.venv/bin/python -m pip install -r requirements-benchmark.txt
.venv/bin/python scripts/download_aml.py
.venv/bin/python scripts/setup_scala_kernel.py
```

Script cài kernel và dependency trong dự án, khóa compiler/reflect/runtime Scala về cùng 2.12.18.
Jupyter cần nhìn thấy `.venv/share/jupyter`; đặt `JUPYTER_PATH` thành đường dẫn tuyệt đối tới thư mục này khi mở Jupyter.
Chọn kernel `Scala 2.12.18 - GraphX benchmark` cho notebook 01 và Python trong `.venv` cho notebook 02.
Restart kernel Scala trước khi chạy lại notebook 01.

## Input và output

Notebook Scala đọc CSV gốc, lọc giao dịch nhận USD, chọn mẫu 50.000 cạnh và ánh xạ cặp ngân hàng/tài khoản thành ID Long.
Hai framework đọc cùng vertices và edges từ Parquet; self-loop và cạnh song song được giữ.
Mặc định chạy 8 cấu hình, mỗi cấu hình 1 warmup và 3 repeat, PageRank 5 vòng với cùng công thức và dangling redistribution.
Output mỗi run nằm dưới `reports/architecture/runs/scala_.../`.
`latest_run.json` chỉ được cập nhật khi cả benchmark thành công và Spark đã đóng event log.
Python xuất bảng và biểu đồ vào thư mục `analysis/` của đúng run đã chọn.

Đổi `sampleEdges = 0` để dùng toàn bộ nhóm USD và tăng heap bằng `scripts/setup_scala_kernel.py --heap 6g` nếu máy đủ RAM.
Số đo local không bao gồm network giữa các máy.
Durable checkpoint được tính trong timing; cache bytes không phải tổng RSS hoặc peak heap.
