const crypto = require('crypto');

  
const ENCRYPTION_KEY = crypto.randomBytes(32); // 256 bits
const IV = crypto.randomBytes(16); // 128 bits

// Encrypt the password
const encryptPassword = (password) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
  let encrypted = cipher.update(password, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Decrypt the password
const decryptPassword = (encryptedPassword) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
  let decrypted = decipher.update(encryptedPassword, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};


module.exports={encryptPassword,decryptPassword}
