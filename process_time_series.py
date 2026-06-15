"""
Production‑ready module for processing time‑series JSON data.

This module defines a simple schema for a time‑series data structure and
provides utilities to validate and aggregate the data. It is designed
with robustness in mind: all public functions include type hints, clear
docstrings, and error handling. Logging is used instead of print
statements so that callers can configure log levels depending on their
environment.

Example usage:

>>> import json
>>> from process_time_series import parse_time_series, aggregate_counts
>>> raw = '[{"calculation": "count", "aggregates": [{"value": 0, "interval": 0, "sampleInterval": 0, "count": 0}], "series": [{"time": "2026-06-15T01:07:43.000Z", "data": []}]}]'
>>> data = parse_time_series(json.loads(raw))
>>> summary = aggregate_counts(data)
>>> summary['total_count']
0

If run as a script, this module will read a JSON file specified on
the command line and output a summary of the data.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)


@dataclass
class Aggregate:
    """Represents an aggregation summary for a time series.

    Attributes:
        value: The aggregated value (e.g., count or sum) over the interval.
        interval: The length of the aggregation interval in seconds.
        sample_interval: The sampling interval of the data in seconds.
        count: The number of data points aggregated.
    """

    value: float
    interval: float
    sample_interval: float
    count: int


@dataclass
class SeriesEntry:
    """Represents a single time series entry.

    Attributes:
        time: A timestamp string in ISO‑8601 format.
        data: A list of numeric data points associated with the timestamp.
    """

    time: str
    data: List[float] = field(default_factory=list)

    def to_datetime(self) -> datetime:
        """Convert the ISO‑8601 time string to a datetime object.

        Returns:
            datetime: The parsed datetime. If parsing fails, a ValueError
                is raised.
        """
        try:
            return datetime.fromisoformat(self.time.replace("Z", "+00:00"))
        except ValueError as exc:
            logger.error("Invalid ISO‑8601 timestamp: %s", self.time)
            raise


@dataclass
class TimeSeries:
    """Represents the root structure of the JSON document.

    Attributes:
        calculation: The calculation type, e.g., "count" or "sum".
        aggregates: A list of Aggregate summaries.
        series: A list of SeriesEntry objects representing the time series.
    """

    calculation: str
    aggregates: List[Aggregate]
    series: List[SeriesEntry]


def parse_time_series(obj: Any) -> List[TimeSeries]:
    """Validate and convert raw JSON into a list of TimeSeries objects.

    Args:
        obj: The raw JSON data, typically loaded via json.load or json.loads.

    Returns:
        List[TimeSeries]: A list of parsed and validated TimeSeries.

    Raises:
        ValueError: If the JSON structure does not match the expected schema.
    """
    if not isinstance(obj, list):
        raise ValueError(f"Expected a list at the root of the JSON document, got {type(obj).__name__}")

    result: List[TimeSeries] = []
    for idx, item in enumerate(obj):
        if not isinstance(item, dict):
            raise ValueError(f"Expected a dict for time series item at index {idx}, got {type(item).__name__}")
        calculation = item.get("calculation")
        if calculation is None:
            raise ValueError(f"Missing 'calculation' in item at index {idx}")
        if not isinstance(calculation, str):
            raise ValueError(f"'calculation' must be a string in item at index {idx}")

        raw_aggregates = item.get("aggregates", [])
        aggregates: List[Aggregate] = []
        for agg_idx, agg in enumerate(raw_aggregates):
            if not isinstance(agg, dict):
                raise ValueError(f"Aggregate at index {agg_idx} in series {idx} must be a dict")
            try:
                aggregates.append(
                    Aggregate(
                        value=float(agg.get("value", 0)),
                        interval=float(agg.get("interval", 0)),
                        sample_interval=float(agg.get("sampleInterval", 0)),
                        count=int(agg.get("count", 0)),
                    )
                )
            except (TypeError, ValueError) as exc:
                logger.error("Invalid aggregate data at index %s in series %s: %s", agg_idx, idx, exc)
                raise

        raw_series = item.get("series", [])
        series_list: List[SeriesEntry] = []
        for s_idx, s_item in enumerate(raw_series):
            if not isinstance(s_item, dict):
                raise ValueError(f"Series entry at index {s_idx} in series {idx} must be a dict")
            time = s_item.get("time")
            data = s_item.get("data", [])
            if time is None:
                raise ValueError(f"Missing 'time' in series entry at index {s_idx} in series {idx}")
            if not isinstance(time, str):
                raise ValueError(f"'time' must be a string in series entry at index {s_idx} in series {idx}")
            if not isinstance(data, list):
                raise ValueError(f"'data' must be a list in series entry at index {s_idx} in series {idx}")
            try:
                # Cast all numeric data to float; ignore non‑numeric values
                numeric_data = [float(x) for x in data if isinstance(x, (int, float))]
            except (TypeError, ValueError) as exc:
                logger.error(
                    "Non‑numeric data in 'data' field at series %s, entry %s: %s", idx, s_idx, exc
                )
                raise
            series_list.append(SeriesEntry(time=time, data=numeric_data))

        result.append(TimeSeries(calculation=calculation, aggregates=aggregates, series=series_list))

    return result


def aggregate_counts(series_list: List[TimeSeries]) -> Dict[str, Any]:
    """Aggregate counts across a list of TimeSeries objects.

    This function sums the count of data points in each series entry and
    combines it with any provided aggregate summaries. It returns a
    dictionary containing both the total count and a breakdown by
    timestamp.

    Args:
        series_list: A list of TimeSeries objects to aggregate.

    Returns:
        Dict[str, Any]: A dictionary with the total count and a per‑timestamp
        count breakdown.
    """
    total_count = 0
    timestamp_counts: Dict[str, int] = {}
    for ts_index, ts in enumerate(series_list):
        # Use provided aggregate counts if present
        for agg in ts.aggregates:
            total_count += agg.count
        # Sum data lengths
        for entry in ts.series:
            count = len(entry.data)
            total_count += count
            timestamp_counts[entry.time] = timestamp_counts.get(entry.time, 0) + count
    return {"total_count": total_count, "timestamp_counts": timestamp_counts}


def main() -> None:
    """Entry point for command‑line execution.

    Reads a JSON file specified as the first command‑line argument,
    processes it, and prints a summary of counts. If no argument is
    provided, it reads from standard input.
    """
    import argparse

    parser = argparse.ArgumentParser(description="Process time series JSON and output counts.")
    parser.add_argument(
        "file",
        nargs="?",
        help="Path to the JSON file. If omitted, read from stdin.",
    )
    args = parser.parse_args()

    if args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        # Read JSON from stdin
        data = json.load(sys.stdin)

    try:
        series = parse_time_series(data)
    except ValueError as exc:
        logger.error("Failed to parse time series: %s", exc)
        return
    summary = aggregate_counts(series)
    json.dump(summary, sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    import sys

    main()