// src/data/searchIndex.js

export const searchIndex = [
  {
    id: 'home',
    titleKey: 'searchData.homeTitle',
    descKey: 'searchData.homeDesc',
    categoryKey: 'searchData.categories.page',
    path: '/',
    keywords: ['pdpa', 'home', 'หน้าหลัก'] 
  },
  {
    id: 'dpo',
    titleKey: 'searchData.dpoTitle',
    descKey: 'searchData.dpoDesc',
    categoryKey: 'searchData.categories.page',
    path: '/about/dpo',
    keywords: ['officer', 'team', 'เจ้าหน้าที่', 'คณะทำงาน']
  },
  {
    id: 'privacy',
    titleKey: 'searchData.privacyTitle',
    descKey: 'searchData.privacyDesc',
    categoryKey: 'searchData.categories.policy',
    path: '/policy/privacy',
    keywords: ['security', 'protect', 'คุ้มครอง', 'ความปลอดภัย']
  },
  {
    id: 'doc-1',
    titleKey: 'searchData.docTitle',
    descKey: 'searchData.docDesc',
    categoryKey: 'searchData.categories.document',
    path: '/about/documents',
    keywords: ['law', 'act', 'กฎหมาย', 'พ.ร.บ.', 'pdpa'] 
  },
  {
    id: 'ropa',
    titleKey: 'searchData.ropaTitle',
    descKey: 'searchData.ropaDesc',
    categoryKey: 'searchData.categories.service',
    path: '/services/ropa',
    keywords: ['record', 'processing', 'ประมวลผล', 'กิจกรรม']
  }
];