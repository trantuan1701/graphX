// Snapshot of measured runs. Charts use median with min/max. No fetch required.
window.BENCHMARK = {
  "run": "preprocessed_1793157792545",
  "environment": "spark=3.5.7\nscala=2.12.18\njava=17.0.20.1\nmaster=local[2]\nvertices=422734\nedges=4487124\npartitions=4\niterations=5\ndamping=0.85\nseed=42\nrepeats=3\nwarmups=1\nheap_max_bytes=6442450944\ninput=upstream transaction edges\nno sampling or pre-aggregation\ngraphframes=0.10.0\nos=Linux amd64\navailable_processors=16\nmemory_sampling_ms=100\nmemory_scope=shared local JVM, sampled peak, no forced GC\ncheckpoint_retention=deleted after each run outside timing\nexecution=03_preprocessed_graph_benchmark.ipynb\n\n",
  "manifest": {
    "source_dir": "/home/tuanta/BigData/graphX/data/processed",
    "id_encoding": "1-based index of sorted upstream IDs; source_id preserved",
    "vertices_path": "/home/tuanta/BigData/graphX/data/benchmark/preprocessed_1793157792545/vertices",
    "sha256": {
      "edges.parquet": "4fa5d64ddcd198aba9b64b26337885d49cca5f07f7ce23f63aca53fa33806c20",
      "preprocess_summary.json": "14e80d629646ddae1e541a7597ef6dc9fc1c5b5a94ea93fc50233f4eea44274a",
      "vertices.parquet": "39c62ac8e2b58eb4d2aaafcacd3dbb6da37acdc6d48cfefbf42e9452a65346cf"
    },
    "upstream_commit": "4b74d035ab6792e6337b5236d42992c970b15081",
    "edge_view": "transactions",
    "edges_path": "/home/tuanta/BigData/graphX/data/benchmark/preprocessed_1793157792545/edges",
    "amount_column": "upstream amount (USD)",
    "edges": 4487124,
    "sampling": "none",
    "upstream_repository": "https://github.com/MinhGioChai/Draft-for-BigData",
    "vertices": 422734
  },
  "framework": [
    {
      "framework": "GraphFrames",
      "phase": "aggregate",
      "time_s": {
        "median": 2.039674287,
        "min": 1.925444645,
        "max": 2.048228982
      },
      "read_MiB": {
        "median": 38.089012145996094,
        "min": 38.089012145996094,
        "max": 38.089012145996094
      },
      "write_MiB": {
        "median": 38.089012145996094,
        "min": 38.089012145996094,
        "max": 38.089012145996094
      },
      "cache_MiB": {
        "median": 105.36597442626953,
        "min": 105.36597442626953,
        "max": 105.36597442626953
      },
      "tasks": {
        "median": 19.0,
        "min": 19.0,
        "max": 19.0
      }
    },
    {
      "framework": "GraphFrames",
      "phase": "build",
      "time_s": {
        "median": 1.440418333,
        "min": 1.386881226,
        "max": 1.450636352
      },
      "read_MiB": {
        "median": 79.24645519256592,
        "min": 79.24645519256592,
        "max": 79.24645519256592
      },
      "write_MiB": {
        "median": 79.24645519256592,
        "min": 79.24645519256592,
        "max": 79.24645519256592
      },
      "cache_MiB": {
        "median": 109.3631362915039,
        "min": 109.3631362915039,
        "max": 109.3631362915039
      },
      "tasks": {
        "median": 14.0,
        "min": 14.0,
        "max": 14.0
      }
    },
    {
      "framework": "GraphFrames",
      "phase": "pr_iteration",
      "time_s": {
        "median": 23.216977188,
        "min": 21.344415409999996,
        "max": 23.378701392000004
      },
      "read_MiB": {
        "median": 197.5354585647583,
        "min": 197.5354585647583,
        "max": 197.5354585647583
      },
      "write_MiB": {
        "median": 131.69143104553223,
        "min": 131.69143104553223,
        "max": 131.69143104553223
      },
      "cache_MiB": {
        "median": 158.1572036743164,
        "min": 158.1572036743164,
        "max": 158.1572036743164
      },
      "tasks": {
        "median": 135.0,
        "min": 135.0,
        "max": 135.0
      }
    },
    {
      "framework": "GraphFrames",
      "phase": "pr_setup",
      "time_s": {
        "median": 6.239716474,
        "min": 5.022052221,
        "max": 6.253176892000001
      },
      "read_MiB": {
        "median": 2.099058151245117,
        "min": 2.099058151245117,
        "max": 2.099058151245117
      },
      "write_MiB": {
        "median": 2.099058151245117,
        "min": 2.099058151245117,
        "max": 2.099058151245117
      },
      "cache_MiB": {
        "median": 158.1572036743164,
        "min": 158.1572036743164,
        "max": 158.1572036743164
      },
      "tasks": {
        "median": 20.0,
        "min": 20.0,
        "max": 20.0
      }
    },
    {
      "framework": "GraphFrames",
      "phase": "pr_total",
      "time_s": {
        "median": 29.47015408,
        "min": 26.366467631,
        "max": 29.618417866
      },
      "read_MiB": {
        "median": 199.63451671600342,
        "min": 199.63451671600342,
        "max": 199.63451671600342
      },
      "write_MiB": {
        "median": 133.79048919677734,
        "min": 133.79048919677734,
        "max": 133.79048919677734
      },
      "cache_MiB": {
        "median": 158.1572036743164,
        "min": 158.1572036743164,
        "max": 158.1572036743164
      },
      "tasks": {
        "median": 155.0,
        "min": 155.0,
        "max": 155.0
      }
    },
    {
      "framework": "GraphFrames",
      "phase": "total",
      "time_s": {
        "median": 32.896709593,
        "min": 29.742548628,
        "max": 33.107065180999996
      },
      "read_MiB": {
        "median": 316.96998405456543,
        "min": 316.96998405456543,
        "max": 316.96998405456543
      },
      "write_MiB": {
        "median": 251.12595653533936,
        "min": 251.12595653533936,
        "max": 251.12595653533936
      },
      "cache_MiB": {
        "median": 158.1572036743164,
        "min": 158.1572036743164,
        "max": 158.1572036743164
      },
      "tasks": {
        "median": 188.0,
        "min": 188.0,
        "max": 188.0
      }
    },
    {
      "framework": "GraphX",
      "phase": "aggregate",
      "time_s": {
        "median": 0.138565982,
        "min": 0.127086428,
        "max": 0.14804309000000002
      },
      "read_MiB": {
        "median": 5.032157897949219,
        "min": 5.032157897949219,
        "max": 5.032157897949219
      },
      "write_MiB": {
        "median": 5.032157897949219,
        "min": 5.032157897949219,
        "max": 5.032157897949219
      },
      "cache_MiB": {
        "median": 298.02384185791016,
        "min": 298.02384185791016,
        "max": 298.02384185791016
      },
      "tasks": {
        "median": 8.0,
        "min": 8.0,
        "max": 8.0
      }
    },
    {
      "framework": "GraphX",
      "phase": "build",
      "time_s": {
        "median": 5.726162055,
        "min": 5.684996248,
        "max": 5.750241165
      },
      "read_MiB": {
        "median": 51.339670181274414,
        "min": 51.339670181274414,
        "max": 51.339670181274414
      },
      "write_MiB": {
        "median": 51.339670181274414,
        "min": 51.339670181274414,
        "max": 51.339670181274414
      },
      "cache_MiB": {
        "median": 276.2405319213867,
        "min": 276.2405319213867,
        "max": 276.2405319213867
      },
      "tasks": {
        "median": 16.0,
        "min": 16.0,
        "max": 16.0
      }
    },
    {
      "framework": "GraphX",
      "phase": "pr_iteration",
      "time_s": {
        "median": 1.4254651280000001,
        "min": 1.358801973,
        "max": 1.4370762849999998
      },
      "read_MiB": {
        "median": 63.5286283493042,
        "min": 63.5286283493042,
        "max": 63.5286283493042
      },
      "write_MiB": {
        "median": 36.93349075317383,
        "min": 36.93349075317383,
        "max": 36.93349075317383
      },
      "cache_MiB": {
        "median": 555.6806716918945,
        "min": 555.6806716918945,
        "max": 555.6806716918945
      },
      "tasks": {
        "median": 60.0,
        "min": 60.0,
        "max": 60.0
      }
    },
    {
      "framework": "GraphX",
      "phase": "pr_setup",
      "time_s": {
        "median": 0.34090593,
        "min": 0.33320470999999996,
        "max": 0.414113732
      },
      "read_MiB": {
        "median": 4.940034866333008,
        "min": 4.940034866333008,
        "max": 4.940034866333008
      },
      "write_MiB": {
        "median": 4.940034866333008,
        "min": 4.940034866333008,
        "max": 4.940034866333008
      },
      "cache_MiB": {
        "median": 555.6806716918945,
        "min": 555.6806716918945,
        "max": 555.6806716918945
      },
      "tasks": {
        "median": 22.0,
        "min": 22.0,
        "max": 22.0
      }
    },
    {
      "framework": "GraphX",
      "phase": "pr_total",
      "time_s": {
        "median": 1.766371058,
        "min": 1.692006683,
        "max": 1.851190017
      },
      "read_MiB": {
        "median": 68.4686632156372,
        "min": 68.4686632156372,
        "max": 68.4686632156372
      },
      "write_MiB": {
        "median": 41.873525619506836,
        "min": 41.873525619506836,
        "max": 41.873525619506836
      },
      "cache_MiB": {
        "median": 555.6806716918945,
        "min": 555.6806716918945,
        "max": 555.6806716918945
      },
      "tasks": {
        "median": 82.0,
        "min": 82.0,
        "max": 82.0
      }
    },
    {
      "framework": "GraphX",
      "phase": "total",
      "time_s": {
        "median": 7.589933288,
        "min": 7.566211828,
        "max": 7.72851761
      },
      "read_MiB": {
        "median": 124.84049129486084,
        "min": 124.84049129486084,
        "max": 124.84049129486084
      },
      "write_MiB": {
        "median": 98.24535369873047,
        "min": 98.24535369873047,
        "max": 98.24535369873047
      },
      "cache_MiB": {
        "median": 555.6806716918945,
        "min": 555.6806716918945,
        "max": 555.6806716918945
      },
      "tasks": {
        "median": 106.0,
        "min": 106.0,
        "max": 106.0
      }
    }
  ],
  "partition": [
    {
      "partitions": 4,
      "strategy": "EdgePartition1D",
      "build_s": {
        "median": 5.955953065,
        "min": 5.783506666999999,
        "max": 6.3757970450000006
      },
      "pr_total_s": {
        "median": 1.75253725,
        "min": 1.720552651,
        "max": 1.762695694
      },
      "total_s": {
        "median": 7.676505715999999,
        "min": 7.536043917,
        "max": 8.138492739
      },
      "iteration_s": {
        "median": 1.41114284,
        "min": 1.409028076,
        "max": 1.423208557
      },
      "read_MiB": {
        "median": 57.835262298583984,
        "min": 57.835262298583984,
        "max": 57.835262298583984
      },
      "write_MiB": {
        "median": 37.16054344177246,
        "min": 37.16054344177246,
        "max": 37.16054344177246
      },
      "replication_factor": {
        "median": 1.7067919779341143,
        "min": 1.7067919779341143,
        "max": 1.7067919779341143
      },
      "load_max_over_mean": {
        "median": 1.095555193036787,
        "min": 1.095555193036787,
        "max": 1.095555193036787
      }
    },
    {
      "partitions": 4,
      "strategy": "EdgePartition2D",
      "build_s": {
        "median": 5.78947221,
        "min": 5.559267622999999,
        "max": 5.970468659
      },
      "pr_total_s": {
        "median": 1.779957741,
        "min": 1.706381242,
        "max": 1.826119659
      },
      "total_s": {
        "median": 7.615591868999999,
        "min": 7.265648864999999,
        "max": 7.7504264
      },
      "iteration_s": {
        "median": 1.464110455,
        "min": 1.403007052,
        "max": 1.504247199
      },
      "read_MiB": {
        "median": 63.5286283493042,
        "min": 63.5286283493042,
        "max": 63.5286283493042
      },
      "write_MiB": {
        "median": 36.93349075317383,
        "min": 36.93349075317383,
        "max": 36.93349075317383
      },
      "replication_factor": {
        "median": 1.663192456722194,
        "min": 1.663192456722194,
        "max": 1.663192456722194
      },
      "load_max_over_mean": {
        "median": 1.0217119027689006,
        "min": 1.0217119027689006,
        "max": 1.0217119027689006
      }
    },
    {
      "partitions": 4,
      "strategy": "RandomVertexCut",
      "build_s": {
        "median": 5.850156752,
        "min": 5.798233217,
        "max": 6.016846252000001
      },
      "pr_total_s": {
        "median": 1.930108504,
        "min": 1.879397539,
        "max": 1.939054668
      },
      "total_s": {
        "median": 7.78921142,
        "min": 7.728341721,
        "max": 7.896243791
      },
      "iteration_s": {
        "median": 1.55935897,
        "min": 1.525069775,
        "max": 1.591782272
      },
      "read_MiB": {
        "median": 76.7541332244873,
        "min": 76.7541332244873,
        "max": 76.7541332244873
      },
      "write_MiB": {
        "median": 44.58586502075195,
        "min": 44.58586502075195,
        "max": 44.58586502075195
      },
      "replication_factor": {
        "median": 1.937554112042088,
        "min": 1.937554112042088,
        "max": 1.937554112042088
      },
      "load_max_over_mean": {
        "median": 1.006087640992315,
        "min": 1.006087640992315,
        "max": 1.006087640992315
      }
    },
    {
      "partitions": 16,
      "strategy": "EdgePartition1D",
      "build_s": {
        "median": 5.910878084,
        "min": 5.506791408,
        "max": 5.92354676
      },
      "pr_total_s": {
        "median": 2.161403907,
        "min": 2.1560583550000003,
        "max": 2.202908009
      },
      "total_s": {
        "median": 8.072281991,
        "min": 7.709699416999999,
        "max": 8.079605115
      },
      "iteration_s": {
        "median": 1.729400446,
        "min": 1.677205915,
        "max": 1.760058667
      },
      "read_MiB": {
        "median": 61.61959171295166,
        "min": 61.61959171295166,
        "max": 61.61959171295166
      },
      "write_MiB": {
        "median": 40.90248775482178,
        "min": 40.90248775482178,
        "max": 40.90248775482178
      },
      "replication_factor": {
        "median": 2.055689866440835,
        "min": 2.055689866440835,
        "max": 2.055689866440835
      },
      "load_max_over_mean": {
        "median": 1.5076489974424598,
        "min": 1.5076489974424598,
        "max": 1.5076489974424598
      }
    },
    {
      "partitions": 16,
      "strategy": "EdgePartition2D",
      "build_s": {
        "median": 5.864495347,
        "min": 5.719402599,
        "max": 5.88102308
      },
      "pr_total_s": {
        "median": 2.193518488,
        "min": 2.099059514,
        "max": 2.263002865
      },
      "total_s": {
        "median": 8.074541567999999,
        "min": 7.818462113000001,
        "max": 8.127498212
      },
      "iteration_s": {
        "median": 1.689186809,
        "min": 1.658654669,
        "max": 1.712505118
      },
      "read_MiB": {
        "median": 76.41912937164307,
        "min": 76.41912937164307,
        "max": 76.41912937164307
      },
      "write_MiB": {
        "median": 44.25985622406006,
        "min": 44.25985622406006,
        "max": 44.25985622406006
      },
      "replication_factor": {
        "median": 2.156571271769008,
        "min": 2.156571271769008,
        "max": 2.156571271769008
      },
      "load_max_over_mean": {
        "median": 1.1103521988694762,
        "min": 1.1103521988694762,
        "max": 1.1103521988694762
      }
    },
    {
      "partitions": 16,
      "strategy": "RandomVertexCut",
      "build_s": {
        "median": 6.0998465070000005,
        "min": 5.50817723,
        "max": 6.2365117
      },
      "pr_total_s": {
        "median": 2.470974887,
        "min": 2.345439724,
        "max": 2.552058674
      },
      "total_s": {
        "median": 8.570821394000001,
        "min": 7.853616954,
        "max": 8.788570373999999
      },
      "iteration_s": {
        "median": 1.940848845,
        "min": 1.883753315,
        "max": 2.026152166
      },
      "read_MiB": {
        "median": 93.7178144454956,
        "min": 93.7178144454956,
        "max": 93.7178144454956
      },
      "write_MiB": {
        "median": 53.83302021026611,
        "min": 53.83302021026611,
        "max": 53.83302021026611
      },
      "replication_factor": {
        "median": 2.589297288602289,
        "min": 2.589297288602289,
        "max": 2.589297288602289
      },
      "load_max_over_mean": {
        "median": 1.010204309040713,
        "min": 1.010204309040713,
        "max": 1.010204309040713
      }
    }
  ],
  "correctness": {
    "framework": 16,
    "partition": 24
  }
};
