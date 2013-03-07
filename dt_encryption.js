DT.has_valid_encryption_key = function()
{
  return(DT.encryption_key && DT.encryption_key.length > 0);
};

DT.should_encrypt = function()
{
  return(DT.has_valid_encryption_key() && DT.encryption_enabled);
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
  DT.store_encryption_key(DT.encryption_key);
  
  return(true);
};

DT.encrypt = function(plaintext)
{
  var iv = "", key = DT.encryption_key, adata = "", aes, rp = {}, ct, p;
  p = {
    adata: adata,
    iter: 2048,
    mode: "ccm",
    ts: 128,
    ks: 256,
  };
  
  ct = sjcl.encrypt(key, plaintext, p, rp).replace(/,/g,",\n");
  
  return(ct);
};

DT.decrypt = function(pkg)
{
  var rp = {};
  var plaintext = sjcl.decrypt(DT.encryption_key, pkg, {}, rp);
  
  return(plaintext);
};
