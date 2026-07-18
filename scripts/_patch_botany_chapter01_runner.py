#!/usr/bin/env python3
from pathlib import Path
import base64,lzma
ROOT=Path('.').resolve()
code_path=ROOT/'scripts/_patch_botany_chapter01_code.lzma.b64'
code=lzma.decompress(base64.b64decode(''.join(code_path.read_text(encoding='ascii').split()))).decode('utf-8')
exec(compile(code,str(code_path),'exec'),{'__name__':'__main__','__file__':str(code_path)})
