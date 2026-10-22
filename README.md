# GraphX và GraphFrames

Repo chỉ benchmark GraphX và GraphFrames trên cùng dữ liệu IBM AML HI-Small đã được upstream preprocessing.
Notebook benchmark bắt đầu từ Parquet.
Script chuẩn bị dữ liệu gọi nguyên preprocessing upstream trong môi trường riêng và ghi manifest để tái lập.

```text
Upstream src/preprocess.py
  -> vertices.parquet + edges.parquet + preprocess_summary.json
  -> kiểm tra input + ánh xạ ID chung
  -> GraphX / GraphFrames
  -> correctness + timing + biểu đồ
```

## Input

Nguồn chuẩn là [Draft-for-BigData](https://github.com/MinhGioChai/Draft-for-BigData), khóa commit trong [upstream.json](upstream.json).
Chạy lại preprocessing theo hướng dẫn dưới đây để tạo output trong `data/processed/`, hoặc đặt biến môi trường `AML_PROCESSED_DIR` trỏ tới thư mục output ngoài repo.
Biến môi trường phải được đặt trước khi mở Jupyter.
Dữ liệu không được đưa vào Git.
`edges_agg.parquet` vẫn được upstream tạo nhưng không được notebook benchmark đọc.

Clone upstream ở thư mục riêng và khóa commit:

```bash
git clone https://github.com/MinhGioChai/Draft-for-BigData.git ../aml-preprocessing
git -C ../aml-preprocessing checkout 4b74d035ab6792e6337b5236d42992c970b15081
```

Tải `HI-Small_Trans.csv`, `HI-Small_accounts.csv` và `HI-Small_Patterns.txt` từ [Kaggle IBM AML](https://www.kaggle.com/datasets/ealtman2019/ibm-transactions-for-anti-money-laundering-aml) vào `../aml-preprocessing/data/raw/`.
Có thể dùng endpoint công khai sau:

```bash
mkdir -p ../aml-preprocessing/data/raw
for name in HI-Small_Trans.csv HI-Small_accounts.csv HI-Small_Patterns.txt; do
  curl -fL --retry 3 \
    "https://www.kaggle.com/api/v1/datasets/download/ealtman2019/ibm-transactions-for-anti-money-laundering-aml/$name" \
    -o "../aml-preprocessing/data/raw/$name"
done
```

Dùng môi trường Python 3.11 riêng với pandas 2.2.3, NumPy 1.26.4 và PyArrow 17.0.0; không cần Spark cho preprocessing.
Chạy từ thư mục repo benchmark:

```bash
python3.11 -m venv ../aml-preprocessing/.venv
../aml-preprocessing/.venv/bin/python -m pip install pandas==2.2.3 numpy==1.26.4 pyarrow==17.0.0
../aml-preprocessing/.venv/bin/python scripts/preprocess_data.py
```

Notebook kiểm tra ID chuỗi duy nhất, endpoint, amount hữu hạn, timestamp microsecond (TimestampType hoặc TimestampNTZType), không có self-loop và số dòng khớp summary.
Với HI-Small tại commit đã khóa, output được báo cáo là 422.734 vertices và 4.487.124 transaction edges.
Không tự sửa input khi kiểm tra thất bại.
Chuỗi ID upstream được ánh xạ sang Long theo thứ tự sắp xếp và dùng chung cho hai framework.
Benchmark giữ toàn bộ vertices và cạnh song song, không lấy mẫu hoặc lọc USD thêm.
Manifest của mỗi run ghi commit nguồn dự kiến, SHA-256 từng file input và đường dẫn hai bảng chung đã lưu.
`preprocess_manifest.json` ghi lệnh chạy, commit đã kiểm tra, phiên bản Python/package và SHA-256 của ba raw inputs cùng toàn bộ output.
Script từ chối commit khác hoặc source preprocessing bị sửa.
Với output do bên khác cung cấp, checksum chỉ định danh artifact, không tự chứng minh nguồn gốc.

## Chạy

Yêu cầu Java 17, Python có hỗ trợ Spark 3.5.7 (nên dùng Python 3.11 hoặc 3.12), và đủ RAM cho toàn bộ graph.
Kernel mặc định có heap 6 GB; cần chừa thêm RAM cho hệ điều hành và Jupyter.
Giữ Spark 3.5.7, Scala 2.12.18 và GraphFrames 0.10.0 cho benchmark, độc lập với môi trường upstream.

```bash
python -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
export JAVA_HOME=/path/to/java17
.venv/bin/python scripts/setup_scala_kernel.py
.venv/bin/python -m ipykernel install --prefix .venv --name python3
export JUPYTER_PATH="$PWD/.venv/share/jupyter"
```

Mở Jupyter hoặc VS Code với môi trường này.
Chạy lần lượt:

1. [03_preprocessed_graph_benchmark.ipynb](notebooks/03_preprocessed_graph_benchmark.ipynb), kernel `Scala 2.12.18 - GraphX benchmark`.
2. [04_preprocessed_graph_results.ipynb](notebooks/04_preprocessed_graph_results.ipynb), Python trong `.venv`.

Hai notebook 01 và 02 được giữ làm tài liệu tham khảo.
Có thể chạy từ terminal với kernel sạch và lưu outputs:

```bash
.venv/bin/python scripts/run_notebook.py notebooks/03_preprocessed_graph_benchmark.ipynb
.venv/bin/python scripts/run_notebook.py notebooks/04_preprocessed_graph_results.ipynb
```

Restart kernel Scala trước khi chạy lại notebook 03.
Chạy lại script setup nếu di chuyển thư mục dự án vì kernelspec lưu đường dẫn tuyệt đối.
Reference độc lập dùng bộ nhớ driver theo O(V + E), nằm ngoài timer và có thể cần tăng heap cho dataset lớn hơn HI-Small.

## Phạm vi phép đo

So sánh hai công việc: tổng tiền nhận bằng `aggregateMessages` và PageRank cùng công thức, damping, số vòng và xử lý dangling vertices.
Không đọc `total_received` có sẵn trong bảng vertices để thay phép tính tổng tiền.
GraphX dùng EdgePartition2D và GraphFrames repartition theo src; mặc định 4 partition, 5 vòng PageRank, một warmup và ba lần đo.
AQE và broadcast join tắt; thứ tự framework được trộn bằng seed cố định.
Đây là so sánh phép tính tương đương trên hai API, không phải so sánh hai hàm PageRank built-in.

| Phase | Bao gồm |
|---|---|
| `build` | Tạo representation, partition và materialize |
| `aggregate` | Gửi amount trên từng cạnh, cộng theo receiver và materialize |
| `pr_setup` | Degree, trọng số chuyển tiếp và checkpoint chuẩn bị |
| `pr_iteration` | Dangling reduction, message, cập nhật và checkpoint mỗi vòng |

Đọc input, kiểm tra, ID mapping, reference, correctness và xuất execution plan nằm ngoài timer.
Notebook chạy graph nhỏ có cạnh song song, dangling vertex, vertex không có cạnh vào và vertex cô lập trước khi đo.
Kiểm thử input sai gồm ID trùng, endpoint thiếu, amount không hữu hạn và summary sai.
Trên full dataset, mỗi kết quả được đối chiếu từng vertex với reference Scala độc lập, ngưỡng scaled error 1e-9 và tổng PageRank lệch 1 dưới 1e-9.
Mỗi framework có một warmup và ba lượt đo, tổng cộng tám lượt; warmup bị loại khi tổng hợp median/min/max.
`total` trong notebook 04 là tổng các phase đã đo, không phải thời gian toàn bộ pipeline từ Parquet.
Event log, plan, correctness và timing được ghi dưới `reports/runs/`; chỉ lần thành công mới cập nhật `reports/latest_preprocessed_run.json`.
Các bảng chung có ID Long được lưu dưới `data/benchmark/` theo từng run.
Không tái sử dụng kết quả benchmark USD cũ cho input upstream này.
Kết quả local không bao gồm network giữa các máy; checkpoint có chi phí I/O và cache bytes không phải peak RAM.

## Memory, shuffle và spill

Notebook 03 lấy mẫu heap đã dùng và RSS của JVM local mỗi 100 ms, kèm mẫu đầu và cuối phase.
RSS đọc từ Linux /proc/self/status; phép đo này cần môi trường Linux.
Cache cuối phase được báo cáo cả tổng Spark và phần vượt cache input chung đầu lượt.
Heap/RSS gồm cả kernel, input, reference và rác chưa GC; hai framework dùng chung JVM nên không dùng chúng để xếp hạng RAM tối thiểu độc lập.
Không ép GC giữa lượt; đỉnh lấy mẫu có thể bỏ lỡ các spike ngắn.

Sau khi Spark dừng, [extract_task_metrics.py](scripts/extract_task_metrics.py) đọc event log và tạo phase_task_metrics.csv.
Parser quy task về phase bằng spark.jobGroup.id, không đếm lại stage được tái sử dụng và loại job ngoài timer.
Các chỉ số gồm shuffle read/write, memory/disk spill, số task và peak execution memory lớn nhất của một task.
Shuffle read gồm local và remote; max task execution memory không phải peak RAM của chương trình và có thể bằng 0 với RDD operators.
Chỉ chấp nhận run có task metrics đầy đủ và không có task thất bại trong phase đo.

Notebook 04 xuất bảng bằng chứng, biểu đồ memory, shuffle và thời gian từng vòng PageRank trong thư mục analysis của run.
Mọi so sánh dùng cùng lần chạy có instrumentation; ba lượt đo cho median và min/max, không phải khoảng tin cậy.
Checkpoint được xóa sau mỗi lượt sau khi giải phóng cache riêng, ngoài timer, để giới hạn dung lượng đĩa.
Event log, input và kết quả số liệu được giữ lại.

## Có cần edges_agg không?

Không cần cho benchmark chính và repo không đọc file đó.
`edges_agg` gom các giao dịch cùng `(src, dst)` thành một cạnh, giảm từ 4.487.124 xuống 647.939 cạnh trong output upstream.
Đó là một workload khác, làm thay đổi số message, shuffle, bộ nhớ và có thể cả tỷ lệ tốc độ giữa hai framework.
Không thể suy ra thời gian giảm đúng tỷ lệ số cạnh.

Tính trước aggregation không làm mọi phép so sánh mất giá trị: nếu cả hai cùng nhận graph đã gom thì vẫn đo được tốc độ xử lý graph đó.
Tuy nhiên phép đo không bao gồm chi phí gom và không còn trả lời tốc độ trên từng giao dịch.
Nếu muốn so sánh chính bước gom, cần cho cả hai bắt đầu từ `edges.parquet` rồi đo bước gom riêng, bao gồm action materialize.

Ví dụ có hai giao dịch A -> B và một giao dịch A -> C.
PageRank đếm theo giao dịch gửi 2/3 contribution từ A tới B và 1/3 tới C.
Nếu gom thành hai cạnh rồi coi ngang nhau thì mỗi bên nhận 1/2.
Muốn giữ semantics cũ trên graph gom phải dùng `tx_count / sum(tx_count)` làm trọng số chuyển tiếp, không dùng degree của graph gom hoặc tổng USD thay thế.
Tổng tiền nhận vẫn có thể bảo toàn khi cộng amount theo cặp, nhưng đã tính trước một phần công việc.
Degree đếm giao dịch và motif theo thời gian cũng không được bảo toàn chỉ bằng một cạnh tổng hợp.

Vì mục tiêu hiện tại là đo GraphX và GraphFrames trên graph giao dịch, dùng `edges.parquet` là baseline duy nhất.
Thí nghiệm graph gom, nếu cần sau này, phải báo cáo riêng với semantics và ranh giới timer rõ ràng.
