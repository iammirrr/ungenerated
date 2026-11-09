#!/bin/sh
# Real screens from an iOS app on the simulator, for the phones in the screenshots:
#   capture-ios.sh <simulator udid> <bundle id> <out folder> "<name> <launch args…>" ["<name> <launch args…>" …]
# Each entry relaunches the app with its arguments (use the app's own switches to open a screen with real content and
# no debug overlays), waits for it to settle and saves <out>/<name>.png at the phone's pixels. The status bar is set to
# 9:41, full battery and signal. Use one simulator; never a person's own device.
set -e
UDID="$1"; BUNDLE="$2"; OUT="$3"; shift 3
mkdir -p "$OUT"
xcrun simctl boot "$UDID" 2>/dev/null || true
xcrun simctl bootstatus "$UDID" -b >/dev/null
xcrun simctl status_bar "$UDID" override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3 || true
for entry in "$@"; do
  name="${entry%% *}"; rest="${entry#"$name"}"
  xcrun simctl terminate "$UDID" "$BUNDLE" >/dev/null 2>&1 || true
  # shellcheck disable=SC2086
  xcrun simctl launch "$UDID" "$BUNDLE" $rest >/dev/null
  sleep "${SETTLE:-6}"
  xcrun simctl io "$UDID" screenshot "$OUT/$name.png" >/dev/null
  echo "$OUT/$name.png"
done
