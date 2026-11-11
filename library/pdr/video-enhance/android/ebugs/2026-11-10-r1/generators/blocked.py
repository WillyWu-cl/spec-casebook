"""Group the R1 Blocked cases by what would unblock them (used by review.py and the run's report.md)."""
import re


def group(r):
    n, a = r["Needs"], r["Actual"]
    if re.search(r"Pro test subscription ended", a):
        return "paid account (subscription lapsed)"
    if "server-failure" in n or "fault switch" in a:
        return "fault injection (no switch on Android)"
    if "purchase" in n:
        return "purchase (user go-ahead)"
    if "low-balance" in n:
        return "low balance"
    if "system-setting" in n:
        return "notification setting (user go-ahead)"
    if "old-task" in n:
        return "task 2 days old"
    if "no-videos" in n:
        return "empty gallery"
    if re.search(r"Demo page|OAuth|Google Drive", a):
        return "Demo page off / OAuth"
    return "other"
