import en from './en.js';
import he from './he.js';

const DEFAULT_LANG = 'en';
const LANGUAGES = {
  en,
  he
}

export function currentLang() {
  ensureLanguageSelection();
  return localStorage.getItem('lang');
}

export function getLang() {
  return currentLang();
} 

export function setLang(lang) {
  const langSupported = LANGUAGES.hasOwnProperty(lang);
  if (langSupported) {
    localStorage.setItem('lang', lang);
  } else {
    console.error(`Language ${lang} not supported.`);
  }
}

export function ensureLanguageSelection() {
  if (!localStorage.getItem('lang')) {
    console.log(`No language selected. Setting default language to ${DEFAULT_LANG}.`);
    setLang(DEFAULT_LANG);
  }
}

export function isRTL() {
  return LANGUAGES[currentLang()].isRTL;
}

export function t(key, vars = {}) {
  const strings = LANGUAGES[currentLang()].translations;

  if (!strings.hasOwnProperty(key)) {
    console.error(`Translation key ${key} not found for language ${currentLang()}.`);
    return key;
  }

  let str = strings[key];
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replace(`{${k}}`, v);
  });
  return str;
}

export function alphabetStartingCode() {
  return LANGUAGES[currentLang()].alphabetStartingCode;
}