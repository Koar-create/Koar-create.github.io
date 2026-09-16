export type Locale = 'en' | 'zh';

export const siteConfig = {
  title: "Zhixian Yang's Academic Homepage",
  description: "Zhixian Yang's personal website, showcasing his research focus.",
  author: 'Zhixian Yang',
  email: 'zyang248@connect.hkust-gz.edu.cn',
  footer: '© 2026 Zhixian Yang | All rights reserved.',
  googleSiteVerification: '8w6lfu4dDeDjStoCmhWVGrgMo685KX02pq8Y1LscXeY',
  social: {
    linkedin: 'https://www.linkedin.com/in/zhixian-yang-45ba71241/',
    github: 'https://www.github.com/Koar-create/',
    orcid: 'https://orcid.org/0009-0002-8477-4304',
    scholarSupervisor: 'https://scholar.google.com/citations?user=7c9k148AAAAJ',
    scholarJi: 'https://scholar.google.com/citations?user=JSpKN3sAAAAJ&hl=en',
    rbmProgram: 'https://cft.hkust-gz.edu.cn/department/red-bird-mphil/',
  },
} as const;

export const ui = {
  en: {
    nav: {
      home: 'Home',
      research: 'Research',
      ideas: 'Ideas',
      blog: 'Blog',
      education: 'Education',
      rbmRecruit: 'RBM recruit',
      cafe: 'Cafe',
    },
    sidebar: {
      name: 'Zhixian Yang',
      mailingAddress: 'Mailing Address:',
      address:
        'No. 1 Duxue Road, Nansha District, Guangzhou City, Guangdong Province, P. R. China (P.C.: 511453)',
      workplace: 'My workplace:',
      workplaceValue: 'E1-4F-218',
    },
    home: {
      title: 'Bio',
      contact: 'Please feel free to contact me if you are interested in my research.',
      role: 'MPhil · Urban wind · Low-altitude economy',
      tagline: 'Building-resolving wind downscaling for UAV corridors',
      bioLabel: 'About',
      featuredLabel: 'Featured Research',
      featuredLink: 'View all',
      recentLabel: 'Recent Writing',
      recentLink: 'All posts',
      contactLabel: 'Get in touch',
      scroll: 'Scroll',
    },
    education: {
      title: 'Education and Experience',
      cv: 'Curriculum Vitae (PDF)',
    },
    research: {
      title: 'Research',
      intro:
        'My current work is an offline WRF–OpenFOAM pipeline for building-resolving urban winds over downtown Guangzhou, evaluated against urban Doppler LiDAR in September 2025. A related study tests WRF on the record-breaking Greater Bay Area rainfall of 7–8 September 2023: most of 270-odd parameterization experiments still underestimated the peak, using CMA station records.',
    },
    ideas: {
      title: 'Research Ideas',
      intro: 'Exploratory directions and early-stage research concepts.',
    },
    blog: {
      title: 'Blog',
      intro: 'Notes, updates, and reflections.',
    },
    rbm: {
      title: 'RBM Project',
    },
    comments: {
      title: 'Comments',
      signIn: 'Sign in to leave a comment',
      emailPlaceholder: 'your@email.com',
      sendMagicLink: 'Send magic link',
      signInGoogle: 'Sign in with Google',
      signOut: 'Sign out',
      placeholder: 'Write your comment…',
      submit: 'Post comment',
      empty: 'No comments yet. Be the first to share your thoughts.',
      loading: 'Loading comments…',
      error: 'Something went wrong. Please try again.',
      displayName: 'Display name (optional)',
    },
    langToggle: '中',
    themeToggle: 'Toggle theme',
    sideProject: 'Side project',
    cafeMenu: '☕ Cafe Menu',
    cafeAbout: 'About',
    cafeEvents: 'Events',
    status: {
      preparing: 'In preparation',
      active: 'Active',
      published: 'Published',
      seed: 'Seed idea',
      exploring: 'Exploring',
      parked: 'Parked',
    },
  },
  zh: {
    nav: {
      home: '首页',
      research: '研究',
      ideas: '设想',
      blog: '博客',
      education: '教育',
      rbmRecruit: '红鸟招募',
      cafe: '咖啡角',
    },
    sidebar: {
      name: '杨智贤',
      mailingAddress: '邮寄地址：',
      address: '笃学路1号，南沙区，广州市，广东省，中华人民共和国（邮政编码：511453）',
      workplace: '我的工位：',
      workplaceValue: 'E1-4F-218',
    },
    home: {
      title: '个人简介',
      contact: '若有同好垂询研趣，不妨遣鲤传书。',
      role: '哲学硕士 · 大气模拟 · 计算流体',
      tagline: '城市风场降尺度',
      bioLabel: '简介',
      featuredLabel: '精选研究',
      featuredLink: '查看全部',
      recentLabel: '近期文章',
      recentLink: '全部文章',
      contactLabel: '联络',
      scroll: '向下',
    },
    education: {
      title: '教育与经历',
      cv: '履历具载于斯（然书以西番英吉利文字）',
    },
    research: {
      title: '研究',
      intro:
        '今所治者，广州城区低空风场：以公里级嵌套WRF单向驱动OpenFOAM，于乙巳(2025)年九月对照城区Doppler LiDAR。另考WRF重演癸卯(2023)岁仲秋粤港澳破纪暴雨之能，二百七十余试泰半未逮雨峰，据天官监当日仪象。',
    },
    ideas: {
      title: '研究设想',
      intro: '探索中的方向与早期研究构想。',
    },
    blog: {
      title: '博客',
      intro: '笔记、更新与随想。',
    },
    rbm: {
      title: '红鸟项目',
    },
    comments: {
      title: '留言',
      signIn: '登录后即可留言',
      emailPlaceholder: 'your@email.com',
      sendMagicLink: '发送魔法链接',
      signInGoogle: '使用 Google 登录',
      signOut: '退出登录',
      placeholder: '写下你的留言…',
      submit: '发表留言',
      empty: '暂无留言，欢迎率先分享。',
      loading: '加载留言中…',
      error: '出错了，请稍后再试。',
      displayName: '显示名称（可选）',
    },
    langToggle: 'EN',
    themeToggle: '切换主题',
    sideProject: 'Side project',
    cafeMenu: '☕ Cafe Menu',
    cafeAbout: 'About',
    cafeEvents: 'Events',
    status: {
      preparing: '撰写中',
      active: '进行中',
      published: '已发表',
      seed: '种子设想',
      exploring: '探索中',
      parked: '暂缓',
    },
  },
} as const;

export function getLocaleFromUrl(url: URL): Locale {
  const segments = url.pathname.split('/').filter(Boolean);
  return segments[0] === 'zh' ? 'zh' : 'en';
}

export function localePath(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') return normalized === '/' ? '/' : normalized;
  if (normalized === '/') return '/zh/';
  return `/zh${normalized}`;
}

export function switchLocalePath(currentPath: string, target: Locale): string {
  const isZh = currentPath.startsWith('/zh');
  const stripped = isZh ? currentPath.replace(/^\/zh/, '') || '/' : currentPath;
  return localePath(target, stripped);
}

export function t(locale: Locale) {
  return ui[locale];
}

export const navItems = [
  { key: 'home' as const, path: '/' },
  { key: 'research' as const, path: '/research' },
  { key: 'education' as const, path: '/education' },
  { key: 'cafe' as const, path: '/cafe/menu.html', fixed: true },
];
