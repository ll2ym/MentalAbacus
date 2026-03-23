import { useState, useRef } from "react";

const translations = {
  en: {
    title: 'Mental Abacus',
    subtitle: 'Solve equations visually with an interactive abacus',
    inputTitle: 'Input Equation',
    enterEquation: 'Enter your equation',
    placeholder: 'e.g., 1+13+46-41',
    useOps: 'Use +, -, *, /, and () for operations',
    invalidEq: 'Invalid equation. Please check your input.',
    solve: 'Solve',
    clear: 'Clear',
    howItWorks: 'How it works:',
    step1: 'Enter an equation and click Solve',
    step2: 'Watch the abacus beads move to show the result',
    step3: 'Or drag beads manually to see the value',
    visualAbacus: 'Visual Abacus',
    dragBeads: 'Drag beads on the rods to calculate values'
  },
  de: {
    title: 'Kopf-Abakus',
    subtitle: 'Lösen Sie Gleichungen visuell mit einem interaktiven Abakus',
    inputTitle: 'Gleichung eingeben',
    enterEquation: 'Geben Sie Ihre Gleichung ein',
    placeholder: 'z.B. 1+13+46-41',
    useOps: 'Verwenden Sie +, -, *, / und () für Operationen',
    invalidEq: 'Ungültige Gleichung. Bitte überprüfen Sie Ihre Eingabe.',
    solve: 'Lösen',
    clear: 'Löschen',
    howItWorks: 'Wie es funktioniert:',
    step1: 'Geben Sie eine Gleichung ein und klicken Sie auf Lösen',
    step2: 'Beobachten Sie, wie sich die Abakusperlen bewegen, um das Ergebnis zu zeigen',
    step3: 'Oder ziehen Sie Perlen manuell, um den Wert zu sehen',
    visualAbacus: 'Visueller Abakus',
    dragBeads: 'Ziehen Sie Perlen auf den Stäben, um Werte zu berechnen'
  },
  ru: {
    title: 'Ментальные счеты',
    subtitle: 'Решайте уравнения визуально с помощью интерактивных счетов',
    inputTitle: 'Ввод уравнения',
    enterEquation: 'Введите ваше уравнение',
    placeholder: 'напр., 1+13+46-41',
    useOps: 'Используйте +, -, *, /, и () для операций',
    invalidEq: 'Неверное уравнение. Пожалуйста, проверьте ваш ввод.',
    solve: 'Решить',
    clear: 'Очистить',
    howItWorks: 'Как это работает:',
    step1: 'Введите уравнение и нажмите Решить',
    step2: 'Смотрите, как движутся косточки, чтобы показать результат',
    step3: 'Или перемещайте косточки вручную, чтобы увидеть значение',
    visualAbacus: 'Визуальные счеты',
    dragBeads: 'Перемещайте косточки на стержнях для вычисления значений'
  },
  tr: {
    title: 'Zihinsel Abaküs',
    subtitle: 'Etkileşimli bir abaküs ile denklemleri görsel olarak çözün',
    inputTitle: 'Denklem Girişi',
    enterEquation: 'Denkleminizi girin',
    placeholder: 'örn., 1+13+46-41',
    useOps: 'İşlemler için +, -, *, / ve () kullanın',
    invalidEq: 'Geçersiz denklem. Lütfen girişinizi kontrol edin.',
    solve: 'Çöz',
    clear: 'Temizle',
    howItWorks: 'Nasıl çalışır:',
    step1: 'Bir denklem girin ve Çöz\'e tıklayın',
    step2: 'Sonucu görmek için abaküs boncuklarının hareketini izleyin',
    step3: 'Veya değeri görmek için boncukları manuel olarak sürükleyin',
    visualAbacus: 'Görsel Abaküs',
    dragBeads: 'Değerleri hesaplamak için boncukları çubuklarda sürükleyin'
  },
  ar: {
    title: 'المعداد العقلي',
    subtitle: 'حل المعادلات بصريًا باستخدام معداد تفاعلي',
    inputTitle: 'إدخال المعادلة',
    enterEquation: 'أدخل معادلتك',
    placeholder: 'مثال، 1+13+46-41',
    useOps: 'استخدم +، -، *، /، و () للعمليات',
    invalidEq: 'معادلة غير صالحة. يرجى التحقق من مدخلاتك.',
    solve: 'حل',
    clear: 'مسح',
    howItWorks: 'كيف يعمل:',
    step1: 'أدخل معادلة وانقر على حل',
    step2: 'شاهد خرزات المعداد تتحرك لإظهار النتيجة',
    step3: 'أو اسحب الخرزات يدويًا لرؤية القيمة',
    visualAbacus: 'المعداد البصري',
    dragBeads: 'اسحب الخرزات على القضبان لحساب القيم'
  },
  zh: {
    title: '珠心算',
    subtitle: '使用交互式算盘直观地解方程式',
    inputTitle: '输入方程式',
    enterEquation: '输入您的方程式',
    placeholder: '例如：1+13+46-41',
    useOps: '使用 +, -, *, /, 和 () 进行运算',
    invalidEq: '无效方程式。请检查您的输入。',
    solve: '解答',
    clear: '清除',
    howItWorks: '使用方法：',
    step1: '输入方程式并点击解答',
    step2: '观察算盘珠子移动以显示结果',
    step3: '或手动拖动珠子以查看数值',
    visualAbacus: '视觉算盘',
    dragBeads: '在拨杆上拖动珠子以计算数值'
  },
  fr: {
    title: 'Boulier Mental',
    subtitle: 'Résolvez des équations visuellement avec un boulier interactif',
    inputTitle: 'Entrée d\'équation',
    enterEquation: 'Entrez votre équation',
    placeholder: 'ex., 1+13+46-41',
    useOps: 'Utilisez +, -, *, /, et () pour les opérations',
    invalidEq: 'Équation invalide. Veuillez vérifier votre saisie.',
    solve: 'Résoudre',
    clear: 'Effacer',
    howItWorks: 'Comment ça marche:',
    step1: 'Entrez une équation et cliquez sur Résoudre',
    step2: 'Regardez les boules du boulier bouger pour montrer le résultat',
    step3: 'Ou faites glisser les boules manuellement pour voir la valeur',
    visualAbacus: 'Boulier Visuel',
    dragBeads: 'Faites glisser les boules sur les tiges pour calculer des valeurs'
  },
  es: {
    title: 'Ábaco Mental',
    subtitle: 'Resuelve ecuaciones visualmente con un ábaco interactivo',
    inputTitle: 'Entrada de Ecuación',
    enterEquation: 'Ingresa tu ecuación',
    placeholder: 'ej., 1+13+46-41',
    useOps: 'Usa +, -, *, /, y () para operaciones',
    invalidEq: 'Ecuación inválida. Por favor revisa tu entrada.',
    solve: 'Resolver',
    clear: 'Borrar',
    howItWorks: 'Cómo funciona:',
    step1: 'Ingresa una ecuación y haz clic en Resolver',
    step2: 'Observa cómo se mueven las cuentas del ábaco para mostrar el resultado',
    step3: 'O arrastra las cuentas manualmente para ver el valor',
    visualAbacus: 'Ábaco Visual',
    dragBeads: 'Arrastra las cuentas en las varillas para calcular valores'
  }
};

import { Abacus } from "@/components/Abacus";
import { parseEquation, validateEquationInput } from "@/lib/equation-parser";

export default function Index() {
  const [equation, setEquation] = useState("");
  const [abacusValue, setAbacusValue] = useState(0);
  const [solvedValue, setSolvedValue] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<keyof typeof translations>("en");
  const t = translations[lang];
  const abacusRef = useRef<HTMLDivElement>(null);

  const handleEquationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateEquationInput(value)) {
      setEquation(value);
      setError("");
    }
  };

  const handleSolveEquation = () => {
    const result = parseEquation(equation);
    if (result !== null) {
      setSolvedValue(result);
      setError("");
    } else {
      setError(t.invalidEq);
      setSolvedValue(null);
    }
  };

  const handleClear = () => {
    setEquation("");
    setSolvedValue(null);
    setAbacusValue(0);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSolveEquation();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50"><div className="absolute top-4 right-4 z-50">
        <div className="relative inline-block text-left">
          <select className="appearance-none bg-white/20 backdrop-blur-sm text-slate-800 md:text-white border border-slate-300 md:border-white/30 hover:bg-white/30 rounded-full px-4 py-2 pr-8 outline-none cursor-pointer font-medium transition-all text-lg md:text-sm transform scale-150 md:scale-100 translate-x-4 md:translate-x-0" value={lang} onChange={(e) => setLang(e.target.value as keyof typeof translations)}>
            <option value="en" className="text-black">
              🇬🇧 English
            </option>
            <option value="de" className="text-black">
              🇩🇪 Deutsch
            </option>
            <option value="ru" className="text-black">
              🇷🇺 Русский
            </option>
            <option value="tr" className="text-black">
              🇹🇷 Türkçe
            </option>
            <option value="ar" className="text-black">
              🇸🇦 العربية
            </option>
            <option value="zh" className="text-black">
              🇨🇳 中文
            </option>
            <option value="fr" className="text-black">
              🇫🇷 Français
            </option>
            <option value="es" className="text-black">
              🇪🇸 Español
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      {/* Header - Hidden on mobile */}
      <header className="hidden md:block bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-purple-100 text-lg">{t.subtitle}</p>
        </div>
      </header>
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Desktop: 2-column grid */}
        <div className="hidden md:grid grid-cols-2 gap-8 h-screen max-h-[calc(100vh-140px)]">
          {/* Left side - Equation Input */}
          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 h-full overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.inputTitle}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">{t.enterEquation}</label>
                  <input
                    type="text"
                    value={equation}
                    onChange={handleEquationChange}
                    onKeyDown={handleKeyDown}
                    placeholder={t.placeholder}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg font-mono transition-colors"
                  />
                  <p className="text-xs text-slate-500 mt-2">{t.useOps}</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSolveEquation}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >{t.solve}</button>
                  <button
                    onClick={handleClear}
                    className="flex-1 bg-slate-200 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-300 transition-all duration-200"
                  >{t.clear}</button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">{t.howItWorks}</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">1.</span>
                      <span>{t.step1}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">2.</span>
                      <span>{t.step2}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">3.</span>
                      <span>{t.step3}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Abacus */}
          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.visualAbacus}</h2>
              <div
                ref={abacusRef}
                className="flex justify-center flex-1 "
              >
                <Abacus
                  targetValue={solvedValue ?? undefined}
                  onValueChange={setAbacusValue}
                />
              </div>

              {solvedValue === null && (
                <div className="text-center py-4 text-slate-500 text-sm">
                  <p>{t.dragBeads}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Stacked layout */}
        <div className="md:hidden flex flex-col gap-4">
          {/* Top - Abacus */}
          <div className="p-4">
            <div
              ref={abacusRef}
              className="flex justify-center  mb-4"
            >
              <Abacus
                rods={8}
                targetValue={solvedValue ?? undefined}
                onValueChange={setAbacusValue}
              />
            </div>
          </div>

          {/* Bottom - Input */}
          <div className="p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">{t.enterEquation}</label>
                <input
                  type="text"
                  value={equation}
                  onChange={handleEquationChange}
                  onKeyDown={handleKeyDown}
                  placeholder={t.placeholder}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none text-base font-mono transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-xs">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSolveEquation}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 text-sm rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >{t.solve}</button>
                <button
                  onClick={handleClear}
                  className="flex-1 bg-slate-200 text-slate-700 font-semibold py-2 text-sm rounded-lg hover:bg-slate-300 transition-all duration-200"
                >{t.clear}</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full text-center py-6 mt-auto opacity-25 text-sm font-medium">
        &copy; 2026{" "}
        <a
          href="http://www.odinaev.de"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-blue-600"
        >
          Masrur Odinaev
        </a>
      </footer>
    </div>
  );
}
