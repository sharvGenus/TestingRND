const crypto = require("node:crypto");

class Encryption {

    static iv = "c1b3cb1fc86cd57a";

    /**
     * Returns encrypted string.
     *
     * @since      1.0.0
     * @access     public
     *
     * @alias    comparePassword
     * @memberof EncryptionClass
     *
     * @return {string} encrypted string
     * @param {string} password to encrypt
     * @param {string} salt used to encrypt the password
    */
    static encryptPassword(password, usersalt = "") {
        return crypto.scryptSync(password, usersalt, 64, { N: 1024, r: 8, p: 16 }).toString("hex");
    }

    static makeUserSalt(length) {
        return crypto.randomBytes(length).toString("hex").slice(0, length);
    }

    /**
    * Function to encrypt any text using given salt
    * @param {String} text plain text to encrypt
    * @param {String} salt 
    * @returns {String}
    */
    static encryptText(text, salt) {
        const cipher = crypto.createCipheriv("aes-256-cbc", salt, this.iv);
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
    }

    /**
    * Function to decrypt any encrypted text using given salt
    * @param {String} encryptedText decrypt encrypted text using given salt
    * @param {String} salt 
    * @returns {String}
    */
    static decryptText(encryptedText, salt) {
        const decipher = crypto.createDecipheriv("aes-256-cbc", salt, this.iv);
        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
}

module.exports = {
    Encryption
};
