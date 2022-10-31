import fs from "fs";
import tty from "tty";
import assert from "assert";

// Based on https://github.com/TooTallNate/ttys/blob/master/index.js
export const ttys: {
  stdin?: NodeJS.ReadStream;
  stdout?: NodeJS.WriteStream;
} = {};

if (tty.isatty(0)) {
  ttys.stdin = process.stdin;
} else {
  try {
    let ttyFd = fs.openSync("/dev/tty", "r");
    assert(tty.isatty(ttyFd));
    ttys.stdin = new tty.ReadStream(ttyFd);
  } catch {
    ttys.stdin = process.stdin;
  }
}

if (tty.isatty(1)) {
  ttys.stdout = process.stdout;
} else {
  try {
    let ttyFd = fs.openSync("/dev/tty", "w");
    assert(tty.isatty(ttyFd));
    ttys.stdout = new tty.WriteStream(ttyFd);
  } catch {
    ttys.stdout = process.stdout;
  }
}
