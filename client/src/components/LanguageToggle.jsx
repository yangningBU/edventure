import { getLang, setLang } from '../i18n/t.js';
import './LanguageToggle.css';

export default function LanguageToggle() {
  const switchLanguage = (code) => {
    setLang(code);
    window.location.reload();
  }
  return (
    <div className="mt-2 sm:mt-0">
      <button
        className={`language-toggle px-3 py-1 rounded border ${getLang() === 'en' ? 'bg-blue-200' : 'bg-gray-300'} mr-2`}
        onClick={() => switchLanguage('en')}
      >
        EN
      </button>
      <button
        className={`language-toggle px-3 py-1 rounded border ${getLang() === 'he' ? 'bg-blue-200' : 'bg-gray-300'}`}
        onClick={() => switchLanguage('he')}
      >
        עב
      </button>
    </div>
  );
}