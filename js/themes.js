/**
 * 8 种可爱主题配色
 */
const THEMES = [
  {
    id: 'sakura',
    name: '樱花粉',
    emoji: '🌸',
    primary: '#ff8fab',
    primaryLight: '#ffb3c6',
    primaryDark: '#fb6f92',
    accent: '#ffc2d1',
    bg: '#fff0f3',
    bgDeep: '#ffccd5',
    text: '#590d22',
    gradient: 'linear-gradient(135deg, #fff0f3, #ffccd5, #ffb3c6)'
  },
  {
    id: 'mint',
    name: '薄荷绿',
    emoji: '🍃',
    primary: '#52b788',
    primaryLight: '#95d5b2',
    primaryDark: '#40916c',
    accent: '#b7e4c7',
    bg: '#f0fff4',
    bgDeep: '#d8f3dc',
    text: '#1b4332',
    gradient: 'linear-gradient(135deg, #f0fff4, #d8f3dc, #b7e4c7)'
  },
  {
    id: 'sky',
    name: '天空蓝',
    emoji: '☁️',
    primary: '#64b5f6',
    primaryLight: '#90caf9',
    primaryDark: '#42a5f5',
    accent: '#bbdefb',
    bg: '#e3f2fd',
    bgDeep: '#bbdefb',
    text: '#0d47a1',
    gradient: 'linear-gradient(135deg, #e3f2fd, #bbdefb, #90caf9)'
  },
  {
    id: 'lemon',
    name: '柠檬黄',
    emoji: '🍋',
    primary: '#ffd54f',
    primaryLight: '#ffe082',
    primaryDark: '#ffca28',
    accent: '#fff9c4',
    bg: '#fffde7',
    bgDeep: '#fff9c4',
    text: '#f57f17',
    gradient: 'linear-gradient(135deg, #fffde7, #fff9c4, #ffe082)'
  },
  {
    id: 'lavender',
    name: '香芋紫',
    emoji: '💜',
    primary: '#b39ddb',
    primaryLight: '#d1c4e9',
    primaryDark: '#9575cd',
    accent: '#e1bee7',
    bg: '#f3e5f5',
    bgDeep: '#e1bee7',
    text: '#4a148c',
    gradient: 'linear-gradient(135deg, #f3e5f5, #e1bee7, #d1c4e9)'
  },
  {
    id: 'peach',
    name: '蜜桃橙',
    emoji: '🍑',
    primary: '#ffab91',
    primaryLight: '#ffccbc',
    primaryDark: '#ff8a65',
    accent: '#ffe0b2',
    bg: '#fff3e0',
    bgDeep: '#ffe0b2',
    text: '#bf360c',
    gradient: 'linear-gradient(135deg, #fff3e0, #ffe0b2, #ffccbc)'
  },
  {
    id: 'ocean',
    name: '海洋蓝',
    emoji: '🐬',
    primary: '#4dd0e1',
    primaryLight: '#80deea',
    primaryDark: '#26c6da',
    accent: '#b2ebf2',
    bg: '#e0f7fa',
    bgDeep: '#b2ebf2',
    text: '#006064',
    gradient: 'linear-gradient(135deg, #e0f7fa, #b2ebf2, #80deea)'
  },
  {
    id: 'strawberry',
    name: '草莓红',
    emoji: '🍓',
    primary: '#ef5350',
    primaryLight: '#e57373',
    primaryDark: '#e53935',
    accent: '#ffcdd2',
    bg: '#ffebee',
    bgDeep: '#ffcdd2',
    text: '#b71c1c',
    gradient: 'linear-gradient(135deg, #ffebee, #ffcdd2, #ef9a9a)'
  }
];

function getThemeById(id) {
  return THEMES.find(t => t.id === id) || THEMES[0];
}

function applyTheme(theme, root) {
  const el = root || document.documentElement;
  el.style.setProperty('--theme-primary', theme.primary);
  el.style.setProperty('--theme-primary-light', theme.primaryLight);
  el.style.setProperty('--theme-primary-dark', theme.primaryDark);
  el.style.setProperty('--theme-accent', theme.accent);
  el.style.setProperty('--theme-bg', theme.bg);
  el.style.setProperty('--theme-bg-deep', theme.bgDeep);
  el.style.setProperty('--theme-text', theme.text);
  el.style.setProperty('--theme-gradient', theme.gradient);
  el.dataset.theme = theme.id;
}
