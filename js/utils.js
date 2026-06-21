/**
 * 祝福数据编解码工具
 */
const BlessingUtils = {
  encode(data) {
    const json = JSON.stringify({
      r: data.recipient,
      s: data.sender,
      m: data.message,
      t: data.themeId,
      p: data.birthday
    });
    if (typeof LZString !== 'undefined') {
      return LZString.compressToEncodedURIComponent(json);
    }
    return btoa(unescape(encodeURIComponent(json)));
  },

  decode(str) {
    try {
      let json;
      if (typeof LZString !== 'undefined') {
        json = LZString.decompressFromEncodedURIComponent(str);
        if (!json) {
          json = decodeURIComponent(escape(atob(str)));
        }
      } else {
        json = decodeURIComponent(escape(atob(str)));
      }
      const data = JSON.parse(json);
      return {
        recipient: data.r || '',
        sender: data.s || '',
        message: data.m || '',
        themeId: data.t || 'sakura',
        birthday: data.p || ''
      };
    } catch {
      return null;
    }
  },

  buildViewUrl(data) {
    const encoded = this.encode(data);
    const base = window.location.href.replace(/[#?].*$/, '').replace(/[^/]*$/, '');
    return `${base}view.html#d=${encoded}`;
  },

  parseFromLocation() {
    const hash = window.location.hash;
    if (hash.startsWith('#d=')) return hash.slice(3);
    const params = new URLSearchParams(window.location.search);
    return params.get('d');
  },

  validateBirthday(value) {
    const v = value.replace(/\D/g, '');
    if (v.length !== 4) return false;
    const month = parseInt(v.slice(0, 2), 10);
    const day = parseInt(v.slice(2, 4), 10);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    return v;
  }
};
