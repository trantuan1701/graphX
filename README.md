# PaySim Financial Network EDA

Exploratory analysis of the PaySim synthetic transaction dataset using transaction graphs to investigate financial hubs, money-flow paths, and trading communities.

The analysis is exploratory evidence for investigation hypotheses, not a validated money-laundering detection model.
PaySim's `isFraud` field is a simulated fraud label and should not be interpreted as confirmed money laundering.

## Notebook

Open [`paysim_financial_network_eda.ipynb`](paysim_financial_network_eda.ipynb) and run all cells with a Python kernel.
The notebook performs full-dataset EDA and builds a directed graph from `TRANSFER` transactions over a configurable simulation-step window.

The default graph window is simulation steps 1-24.
Change `GRAPH_START` and `GRAPH_END` in the notebook and rerun from the beginning to test sensitivity.

## Setup

Create an isolated Python environment and install the notebook dependencies:

```bash
python -m pip install pandas pyarrow numpy matplotlib nbformat nbclient ipykernel networkx pyspark==4.0.1 graphframes-py==0.12.2
```

GraphFrames also requires a compatible Java runtime, typically JDK 17 or 21, exposed through `JAVA_HOME`.
The first Spark startup may need internet access to download the GraphFrames package.

The full CSV analysis can require several gigabytes of RAM.

## Data and interpretation

The notebook uses the [PaySim dataset](https://www.kaggle.com/datasets/ealaxi/paysim1), based on the [PaySim simulator](https://github.com/EdgarLopezPhD/PaySim).

PaySim is synthetic and does not provide confirmed KYC, beneficial-ownership, device, geographic, or money-laundering labels.
Transaction amounts are analyzed as aggregate simulated values, without assuming a currency.
Graph edges are not selected using fraud labels.

## License

No project license has been specified yet.
