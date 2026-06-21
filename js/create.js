/**
 * 生日祝福工坊 — 创建页
 */
(function () {
  'use strict';

  let selectedTheme = THEMES[0];
  let blessingIndex = 0;
  let messageMode = 'preset';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  function init() {
    applyTheme(selectedTheme);
    renderThemePicker();
    showBlessing();
    bindEvents();
  }

  function renderThemePicker() {
    const picker = $('#themePicker');
    picker.innerHTML = THEMES.map(t => `
      <button type="button" class="theme-option${t.id === selectedTheme.id ? ' active' : ''}"
        data-theme="${t.id}" title="${t.name}">
        <div class="theme-swatch" style="background:${t.gradient}"></div>
        <span>${t.emoji} ${t.name}</span>
      </button>
    `).join('');
  }

  function showBlessing() {
    $('#messageDisplay').textContent = BLESSING_MESSAGES[blessingIndex];
  }

  function getMessage() {
    if (messageMode === 'custom') {
      return $('#customMessage').value.trim();
    }
    return BLESSING_MESSAGES[blessingIndex] || '';
  }

  function showToast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }

  function generateQR(url) {
    const box = $('#qrcode');
    box.innerHTML = '';
    new QRCode(box, {
      text: url,
      width: 160,
      height: 160,
      colorDark: selectedTheme.text,
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  function bindEvents() {
    $('#themePicker').addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-option');
      if (!btn) return;
      selectedTheme = getThemeById(btn.dataset.theme);
      applyTheme(selectedTheme);
      $$('.theme-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });

    $$('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        messageMode = btn.dataset.mode;
        $$('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $('#presetBox').classList.toggle('hidden', messageMode !== 'preset');
        $('#customBox').classList.toggle('hidden', messageMode !== 'custom');
      });
    });

    $('#swapBtn').addEventListener('click', () => {
      blessingIndex = getRandomBlessingIndex(blessingIndex);
      showBlessing();
    });

    $('#customMessage').addEventListener('input', () => {
      $('#customCharCount').textContent = $('#customMessage').value.length;
    });

    $('#birthday').addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });

    $('#blessingForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const recipient = $('#recipient').value.trim();
      const sender = $('#sender').value.trim();
      const birthday = BlessingUtils.validateBirthday($('#birthday').value);
      const message = getMessage();

      if (!recipient) { showToast('请填写寿星姓名～'); return; }
      if (!sender) { showToast('请填写你的姓名～'); return; }
      if (!birthday) { showToast('请填写正确的生日（4位数字，如0625）'); return; }
      if (!message) { showToast('请选择或填写祝福语～'); return; }

      const data = {
        recipient,
        sender,
        message,
        themeId: selectedTheme.id,
        birthday
      };

      const url = BlessingUtils.buildViewUrl(data);
      if (url.length > 8000) {
        showToast('祝福语太长了，请缩短一些～');
        return;
      }

      $('#resultRecipient').textContent = recipient;
      $('#resultPassword').textContent = birthday;
      $('#shareLink').value = url;
      $('#previewLink').href = url;
      generateQR(url);

      $('#formSection').classList.add('hidden');
      $('#resultSection').classList.remove('hidden');
      $('#resultSection').scrollIntoView({ behavior: 'smooth' });
      showToast('祝福生成成功啦 🎉');
    });

    $('#copyBtn').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText($('#shareLink').value);
        showToast('链接已复制 ✨');
      } catch {
        $('#shareLink').select();
        document.execCommand('copy');
        showToast('链接已复制 ✨');
      }
    });

    $('#resetBtn').addEventListener('click', () => {
      $('#resultSection').classList.add('hidden');
      $('#formSection').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
