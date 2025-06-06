// src/services/eusign.js

class EUSignService {
  #eu = null;
  #ready = null;

  /** 1) Подгружаем euscpt.js, euscpm.js, euscp.js из /public/eusign/js/ */
  loadLib() {
    const add = (filename) =>
      new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `/eusign/js/${filename}`;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    return Promise.all(['euscpt.js', 'euscpm.js', 'euscp.js'].map(add));
  }

  /** 2) Инициализируем EUSignJS (EndUser), proxy, CA-файлы и (по желанию) файловое хранилище */
  async init() {
    if (this.#ready) return this.#ready;

    this.#ready = (async () => {
      await this.loadLib();
      // В monolithic-версии воркер создаётся внутри EndUser()
      this.#eu = new window.EndUser();
      await this.#eu.Initialize();

      // 2.1) Proxy-сервис
      await this.#eu.SetXMLHTTPProxyService('/eu.proxy');

      // 2.2) CA-файлы
      await this.#eu.SetCASettings('/eusign/data/', '/eusign/data/CACertificates.p7b');

      // 2.3) (опционально) Локальное файловое хранилище для сертификатов
      await this.#eu.SetFileStoreSettings(true, '/eusign/FileStore/');
    })();

    return this.#ready;
  }

  // ======================================
  // 3) Методы для вкладки «FILE» (ACCK / «Дія»)
  // ======================================

  /**
   * Читает приватный ключ из PFX/DAT/ZS2-ArrayBuffer и устанавливает пароль.
   * (EndUser.ReadPrivateKey() умеет работать сразу, если перед этим вызвана SelectKeyStore или AutoDetectKeyStore,
   * но в нашей логике мы просто загружаем файл и передаём его напрямую)
   */
  async readPrivateKeyFile(file, password) {
    await this.init();
    const buf = await file.arrayBuffer();
    await this.#eu.ReadPrivateKeyBinary(password, new Uint8Array(buf));
  }

  // ======================================
  // 4) Методы для вкладки «TOKEN»
  // ======================================

  /**
   * Выбирает токен (index) и читает приватный ключ по паролю.
   * Если те методы в вашей библиотеке называются иначе — замените на эквивалент.
   */
  async selectTokenProvider(index, password) {
    await this.init();
    await this.#eu.SelectProtectedCMSProvider(index);
    await this.#eu.ReadPrivateKey(password);
  }

  // ======================================
  // 5) Методы для вкладки «CLOUD»
  // ======================================

  /**
   * Выбирает сертификат из «хмары» по providerId и clientId.
   */
  async selectCloudProvider(providerId, clientId) {
    await this.init();
    await this.#eu.SelectCertInfoFromCloud(providerId, clientId);
  }

  // ======================================
  // 6) Универсальный метод «MakeCMS» (подпись challenge)
  // ======================================

  /**
   * Принимает Uint8Array (challenge), возвращает Promise<string> с Base64-подписанным CMS.
   */
  async sign(challengeUint8) {
    await this.init();
    const cmsBase64 = await this.#eu.MakeCMS(challengeUint8, true);
    return cmsBase64;
  }
}

export const eusign = new EUSignService();
