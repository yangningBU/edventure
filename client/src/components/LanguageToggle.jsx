import { getLang, setLang } from '../i18n/t.js';

export default function LanguageToggle() {
  const switchLanguage = (code) => {
    setLang(code);
    window.location.reload();
  }
  return (
    <div className="mt-2 sm:mt-0">
      <button
        className={`px-3 py-1 rounded border ${getLang() === 'en' ? 'bg-blue-100' : 'bg-gray-100'} mr-2`}
        onClick={() => switchLanguage('en')}
      >
        EN
      </button>
      <button
        className={`px-3 py-1 rounded border ${getLang() === 'he' ? 'bg-blue-100' : 'bg-gray-100'}`}
        onClick={() => switchLanguage('he')}
      >
        עב
      </button>
    </div>
  );
}