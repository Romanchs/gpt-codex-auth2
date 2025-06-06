// src/services/eusign.js

class EUSignService {
  #eu = null;
  #ready = null;

  /**
   * Настраивает хранилище ключей в зависимости от выбранного ЦСК.
   * Если включён режим автоматического определения, вызывается
   * AutoSelectKeyStore/AutoDetectKeyStore (если они существуют).
   * В противном случае применяются настройки ЦСК по его идентификатору.
   */
  async configureKeyStore(autoDetect) {
    await this.init();

    if (autoDetect) {
      if (typeof this.#eu.AutoSelectKeyStore === 'function') {
        await this.#eu.AutoSelectKeyStore();
        return;
      }
      if (typeof this.#eu.AutoDetectKeyStore === 'function') {
        await this.#eu.AutoDetectKeyStore();
        return;
      }
    }
  }

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
      const fsSettings = this.#eu.CreateFileStoreSettings();
      fsSettings.SetSaveLoadedCerts(true);
      fsSettings.SetPath('/eusign/FileStore/');
      await this.#eu.SetFileStoreSettings(fsSettings);
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
  async readPrivateKeyFile(file, password, autoDetect = false) {
    await this.configureKeyStore(autoDetect);
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
  async selectTokenProvider(index, password, autoDetect = false) {
    await this.configureKeyStore(autoDetect);
    await this.#eu.SelectProtectedCMSProvider(index);
    await this.#eu.ReadPrivateKey(password);
  }

  /**
   * Возвращает список доступных токен-провайдеров.
   * Каждый элемент имеет форму { index: number, name: string }.
   */
  async listTokenProviders() {
    await this.init();
    try {
      const count = await this.#eu.GetProtectedCMSProvidersCount();
      const list = [];
      for (let i = 0; i < count; i++) {
        let name = `#${i}`;
        try {
          const info = await this.#eu.GetProtectedCMSProviderInfo(i);
          if (info?.GetName) name = info.GetName();
        } catch (e) {
          // ignore errors when fetching provider info
        }
        list.push({ index: i, name });
      }
      return list;
    } catch (err) {
      console.error('Failed to get token providers:', err);
      return [];
    }
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

  /** Возвращает информацию из сертификата прочитанного приватного ключа */
  async getUserInfo() {
    await this.init();
    const cert = await this.#eu.GetOwnCertificate(
      window.EU_CERT_KEY_TYPE_DSTU4145,
      window.EU_KEY_USAGE_DIGITAL_SIGNATURE
    );
    const info = cert.GetInfoEx();
    return {
      commonName: info.GetSubjCN(),
      fullName: info.GetSubjFullName(),
      edrpou: info.GetSubjEDRPOUCode(),
      drfo: info.GetSubjDRFOCode(),
      issuer: info.GetIssuerCN()
    };
  }
}

export const eusign = new EUSignService();
