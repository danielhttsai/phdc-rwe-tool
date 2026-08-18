# -*- coding: utf-8 -*-
"""Encrypt the two study-note plaintexts into frontend/books/*.enc and stamp a
fresh BOOK_VER into frontend/app.js.

The version matters: the blob is fetched with an HTTP cache hint and the
decrypted HTML is kept in sessionStorage, so without a new version string a
reader who already opened a book keeps seeing the previous edition.
"""
import hashlib
import io
import os
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
APP = os.path.join(ROOT, "frontend", "app.js")
BOOKS = os.path.join(ROOT, "frontend", "books")

NODE = r"""
const fs = require('fs');
async function enc(pw, txt) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations:100000, hash:'SHA-256'},
                                            base, {name:'AES-GCM', length:256}, false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM', iv}, key,
                                                        new TextEncoder().encode(txt)));
  const out = new Uint8Array(28 + ct.length);
  out.set(salt, 0); out.set(iv, 16); out.set(ct, 28);
  return Buffer.from(out).toString('base64');
}
(async () => {
  const [,, src, dst, pw] = process.argv;
  const b64 = await enc(pw, fs.readFileSync(src, 'utf8'));
  fs.writeFileSync(dst, b64);
  console.log(dst + ' ' + (b64.length / 1048576).toFixed(2) + ' MB');
})().catch(e => { console.error(e); process.exit(1); });
"""


def encrypt(src, name, password):
    os.makedirs(BOOKS, exist_ok=True)
    dst = os.path.join(BOOKS, name + ".enc")
    js = os.path.join(HERE, "_enc_tmp.js")
    io.open(js, "w", encoding="utf-8").write(NODE)
    try:
        subprocess.run(["node", js, src, dst, password], check=True)
    finally:
        os.remove(js)
    return dst


def stamp_version():
    """BOOK_VER = short hash of the blobs, so it changes exactly when they do."""
    h = hashlib.sha256()
    for name in sorted(os.listdir(BOOKS)):
        if name.endswith(".enc"):
            with open(os.path.join(BOOKS, name), "rb") as fh:
                h.update(fh.read())
    ver = h.hexdigest()[:10]
    s = io.open(APP, encoding="utf-8").read()
    import re
    new = re.sub(r'const BOOK_VER = "[^"]*";', 'const BOOK_VER = "%s";' % ver, s, count=1)
    if new == s:
        raise SystemExit("BOOK_VER placeholder not found in app.js")
    io.open(APP, "w", encoding="utf-8", newline="").write(new)
    return ver


if __name__ == "__main__":
    if len(sys.argv) >= 3:
        pairs = [(sys.argv[1], sys.argv[2], sys.argv[3])]
    else:
        raise SystemExit("usage: encrypt_books.py <plaintext.html> <cbook|sbook> <password>")
    for src, name, pw in pairs:
        print(encrypt(src, name, pw))
    print("BOOK_VER =", stamp_version())
