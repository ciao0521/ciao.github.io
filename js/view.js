/**
 * 生日祝福工坊 — 展示页
 * 流程：开场动画 → 密码 → Hi+倒计时+蛋糕 → 四图翻页 → 专属祝福
 */
(function () {
  'use strict';

  const OPEN_ANIM = { s1: 2200, s2: 2500, s3: 2300 };
  const UNLOCK_ANIM = { hi: 1800, countdown: 3000, cake: 2800 };

  let data = null;
  let theme = null;
  let particles = [];
  let confettiBurst = [];
  let canvas, ctx, animId;
  let countdownTimer = null;

  function init() {
    const encoded = BlessingUtils.parseFromLocation();
    if (!encoded) return showError();

    data = BlessingUtils.decode(encoded);
    if (!data || !data.recipient) return showError();

    theme = getThemeById(data.themeId);
    applyTheme(theme, document.documentElement);

    document.title = `${data.recipient}，生日快乐 🎂`;
    document.getElementById('animName').textContent = `${data.recipient}，生日快乐！`;
    document.getElementById('animHappy').textContent = `${data.recipient}，生日快乐！`;
    document.getElementById('unlockName').textContent = data.recipient;
    document.getElementById('finalRecipient').textContent = `致 ${data.recipient}`;
    document.getElementById('finalMessage').textContent = data.message;
    document.getElementById('finalSender').textContent = data.sender || '匿名好友';

    initCanvas();
    bindEvents();
    runOpenAnimation();
  }

  function showError() {
    hideAllScreens();
    document.getElementById('screenError').classList.remove('hidden');
    document.getElementById('screenError').classList.add('active');
  }

  function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  }

  function showScreen(id) {
    hideAllScreens();
    const el = document.getElementById(id);
    el.classList.remove('hidden');
    el.classList.add('active');
  }

  function switchOpenScene(from, to) {
    document.getElementById(from).classList.remove('active');
    document.getElementById(to).classList.add('active');
  }

  function switchUnlockScene(from, to) {
    if (from) document.getElementById(from).classList.remove('active');
    document.getElementById(to).classList.add('active');
  }

  function resetUnlockScenes() {
    ['unlockHi', 'unlockCountdown', 'unlockCakeDrop'].forEach(id => {
      document.getElementById(id).classList.remove('active');
    });
    document.getElementById('unlockHi').classList.add('active');
    const cake = document.getElementById('fallingCake');
    cake.style.animation = 'none';
    cake.offsetHeight;
    cake.style.animation = '';
  }

  /* ===== 开场动画 ===== */
  function runOpenAnimation() {
    document.getElementById('animScene1').classList.add('active');
    document.getElementById('animScene2').classList.remove('active');
    document.getElementById('animScene3').classList.remove('active');
    document.getElementById('pwdInput').value = '';
    document.getElementById('pwdError').classList.add('hidden');

    showScreen('screenAnimate');
    startParticles();
    burstConfetti();

    setTimeout(() => switchOpenScene('animScene1', 'animScene2'), OPEN_ANIM.s1);

    setTimeout(() => {
      switchOpenScene('animScene2', 'animScene3');
      burstConfetti();
    }, OPEN_ANIM.s1 + OPEN_ANIM.s2);

    setTimeout(() => {
      stopParticles();
      showScreen('screenPassword');
      setTimeout(() => document.getElementById('pwdInput').focus(), 300);
    }, OPEN_ANIM.s1 + OPEN_ANIM.s2 + OPEN_ANIM.s3);
  }

  /* ===== 解锁后过渡动画 ===== */
  function runUnlockAnimation() {
    resetUnlockScenes();
    showScreen('screenUnlockAnim');

    setTimeout(() => {
      switchUnlockScene('unlockHi', 'unlockCountdown');
      startCountdown();
    }, UNLOCK_ANIM.hi);

    setTimeout(() => {
      if (countdownTimer) clearInterval(countdownTimer);
      switchUnlockScene('unlockCountdown', 'unlockCakeDrop');
    }, UNLOCK_ANIM.hi + UNLOCK_ANIM.countdown);

    setTimeout(() => {
      showGallery();
    }, UNLOCK_ANIM.hi + UNLOCK_ANIM.countdown + UNLOCK_ANIM.cake);
  }

  function startCountdown() {
    const el = document.getElementById('countdownNum');
    let n = 3;
    el.textContent = n;
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';

    countdownTimer = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        clearInterval(countdownTimer);
        return;
      }
      el.textContent = n;
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = 'countPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 1000);
  }

  function showGallery() {
    showScreen('screenGallery');
    document.getElementById('galleryScroll').scrollTop = 0;
  }

  function replayAll() {
    document.getElementById('galleryScroll').scrollTop = 0;
    confettiBurst = [];
    if (countdownTimer) clearInterval(countdownTimer);
    runOpenAnimation();
  }

  function bindEvents() {
    const pwdInput = document.getElementById('pwdInput');
    const pwdError = document.getElementById('pwdError');

    pwdInput.addEventListener('input', () => {
      pwdInput.value = pwdInput.value.replace(/\D/g, '').slice(0, 4);
      pwdError.classList.add('hidden');
    });

    function tryUnlock() {
      if (pwdInput.value.trim() === data.birthday) {
        pwdError.classList.add('hidden');
        runUnlockAnimation();
      } else {
        pwdError.classList.remove('hidden');
        pwdInput.classList.add('shake');
        setTimeout(() => pwdInput.classList.remove('shake'), 500);
      }
    }

    document.getElementById('pwdSubmit').addEventListener('click', tryUnlock);
    pwdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryUnlock();
    });

    document.getElementById('replayBtn').addEventListener('click', replayAll);
  }

  /* ===== Canvas 粒子 ===== */
  function initCanvas() {
    canvas = document.getElementById('animCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    const colors = [theme.primary, theme.primaryLight, theme.primaryDark, theme.accent, '#ffd700', '#fff'];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 1,
      dx: (Math.random() - 0.5) * 1.5,
      dy: (Math.random() - 0.5) * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2,
      type: Math.random() > 0.5 ? 'circle' : 'star'
    };
  }

  function burstConfetti() {
    const colors = [theme.primary, theme.primaryLight, theme.primaryDark, theme.accent, '#ffd700', '#fff'];
    for (let i = 0; i < 40; i++) {
      confettiBurst.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2,
        w: Math.random() * 8 + 4,
        h: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * -8 - 2,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        life: 1
      });
    }
  }

  function startParticles() {
    particles = Array.from({ length: 80 }, createParticle);
    drawParticles();
  }

  function stopParticles() {
    if (animId) cancelAnimationFrame(animId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiBurst = confettiBurst.filter(c => {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.15;
      c.rot += c.vr;
      c.life -= 0.012;
      if (c.life <= 0) return false;
      ctx.save();
      ctx.globalAlpha = c.life;
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot * Math.PI / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
      return true;
    });

    particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.type === 'circle') {
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Date.now() * 0.001);
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
      }
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(drawParticles);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
