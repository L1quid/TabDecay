DT.has_valid_encryption_key = function()
{
  return(DT.encryption_key && DT.encryption_key.length > 0);
};

DT.set_encryption_key = function(password)
{
  var iv = "", key = "", adata = "", aes, plaintext = "", rp = {}, ct, p;
  p = {
    adata: adata,
    iter: 2048,
    mode: "ccm",
    ts: 128,
    ks: 256,
  };
  
  ct = sjcl.encrypt(password, plaintext, p, rp).replace(/,/g,",\n");
  
  if (rp.key.length == 0)
    return(false);
  
  DT.encryption_key = rp.key;
  
  return(true);
};

DT.encrypt = function(msg)
{
  /*
  var v = form.get(), iv = v.iv, password = v.password, key = v.key, adata = v.adata, aes, plaintext=v.plaintext, rp = {}, ct, p;
  
  if (plaintext === '' && v.ciphertext.length) { return; }
  if (key.length == 0 && password.length == 0) {
    error("need a password or key!");
    return;
  }
  
  p = { adata:v.adata,
        iter:v.iter,
        mode:v.mode,
        ts:parseInt(v.tag),
        ks:parseInt(v.keysize) };
  if (!v.freshiv || !usedIvs[v.iv]) { p.iv = v.iv; }
  if (!v.freshsalt || !usedSalts[v.salt]) { p.salt = v.salt; }
  ct = sjcl.encrypt(password || key, plaintext, p, rp).replace(/,/g,",\n");

  v.iv = rp.iv;
  usedIvs[rp.iv] = 1;
  if (rp.salt) {
    v.salt = rp.salt;
    usedSalts[rp.salt] = 1;
  }
  v.key = rp.key;
  
  if (v.json) {
    v.ciphertext = ct;
    v.adata = '';
  } else {
    v.ciphertext = ct.match(/"ct":"([^"]*)"/)[1]; //"
  }
  
  v.plaintext = '';
  */
};
