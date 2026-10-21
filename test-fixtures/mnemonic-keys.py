from pathlib import Path
import hashlib, hmac, json, re, unicodedata
from cryptography.hazmat.primitives.asymmetric import ec, ed25519
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

r=Path(__file__).resolve().parent.parent
mnemonic='abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
alphabet='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
def b58(prefix, data):
 raw=bytes(prefix)+data
 raw+=hashlib.sha256(hashlib.sha256(raw).digest()).digest()[:4]
 n=int.from_bytes(raw,'big'); out=''
 while n:n,rem=divmod(n,58);out=alphabet[rem]+out
 return '1'*(len(raw)-len(raw.lstrip(b'\0')))+out
def public(curve,key):
 if curve=='ed25519':return ed25519.Ed25519PrivateKey.from_private_bytes(key).public_key().public_bytes(Encoding.Raw,PublicFormat.Raw)
 c=ec.SECP256K1() if curve=='secp256k1' else ec.SECP256R1()
 return ec.derive_private_key(int.from_bytes(key,'big'),c).public_key().public_bytes(Encoding.X962,PublicFormat.CompressedPoint)
prefixes={
 'ed25519':([43,246,78,7],[13,15,37,217],[6,161,159],b'ed25519 seed',None),
 'secp256k1':([17,162,224,201],[3,254,226,86],[6,161,161],b'Bitcoin seed',int('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141',16)),
 'p256':([16,81,238,189],[3,178,139,127],[6,161,164],b'Nist256p1 seed',int('FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551',16)),
}
def derive(params):
 curve=params.get('curve','ed25519'); path=params.get('derivationPath',"44'/1729'/0'/0'")
 password=unicodedata.normalize('NFKD',params.get('password',''))
 seed=hashlib.pbkdf2_hmac('sha512',unicodedata.normalize('NFKD',params['mnemonic']).encode(),('mnemonic'+password).encode(),2048)
 skpre,pkpre,hpre,label,order=prefixes[curve]
 digest=hmac.digest(label,seed,'sha512');key,chain=digest[:32],digest[32:]
 assert order is None or 0<int.from_bytes(key,'big')<order
 parts=path.split('/') if path else []
 if parts and parts[0]=='m':parts=parts[1:]
 for part in parts:
  hard=part[-1:] in ("'",'h','H'); number=int(re.match(r'\d+',part)[0]);index=number+(0x80000000 if hard else 0)
  data=(b'\0'+key) if hard else public(curve,key)
  digest=hmac.digest(chain,data+index.to_bytes(4,'big'),'sha512')
  child=int.from_bytes(digest[:32],'big');chain=digest[32:]
  if curve=='ed25519':assert hard;key=digest[:32]
  else:
   assert child<order
   child=(child+int.from_bytes(key,'big'))%order
   assert child!=0
   key=child.to_bytes(32,'big')
 pk=public(curve,key)
 return {'publicKey':b58(pkpre,pk),'publicKeyHash':b58(hpre,hashlib.blake2b(pk,digest_size=20).digest()),'secretKey':b58(skpre,key+pk if curve=='ed25519' else key)}
cases=[('defaults',{}),('account one',{'derivationPath':"44'/1729'/1'/0'"}),('alternate hardened notation',{'derivationPath':'m/44h/1729H/0h/0h'}),('legacy numeric-prefix notation',{'derivationPath':'44junkh/1729h/0h/0h'}),('root',{'derivationPath':'m'}),('empty path',{'derivationPath':''}),('Unicode password',{'password':'caf\u00e9'}),('normalized password',{'password':'cafe\u0301'})]
for curve in ['secp256k1','p256']:
 cases.extend([(curve+' hardened',{'curve':curve}),(curve+' nonhardened',{'curve':curve,'derivationPath':"44'/1729'/0/0"}),(curve+' password',{'curve':curve,'password':'TREZOR'}),(curve+' root',{'curve':curve,'derivationPath':'m'})])
vectors=[]
for label,opts in cases:
 params={'mnemonic':mnemonic,**opts};vectors.append({'label':label,'params':params,'expected':derive(params)})
p=r/'test-fixtures/mnemonic-keys.json';p.write_text(json.dumps(vectors,indent=2)+'\n');p.chmod(0o644)
print('Wrote',len(vectors),'independent key tuples')
