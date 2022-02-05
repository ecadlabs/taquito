/* Copyright (c) 2014, Wei Lu <luwei.here@gmail.com> and Daniel Cousens <email@dcousens.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies. */

import pbkdf2 from 'pbkdf2';

export function mnemonicToSeedSync(mnemonic: string, password: string) {
  const mnemonicBuffer = Buffer.from(normalize(mnemonic), 'utf8');
  const saltBuffer = Buffer.from(salt(normalize(password)), 'utf8');
  return pbkdf2.pbkdf2Sync(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
}

function normalize(str: string) {
  return (str || '').normalize('NFKD');
}
function salt(password: string) {
  return 'mnemonic' + (password || '');
}
