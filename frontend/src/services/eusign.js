// src/services/eusign.js

class EUSignService {
  #eu = null;
  #ready = null;
  #libReady = null;

  /**
   * Настраивает хранилище ключей в зависимости от выбранного ЦСК.
   * Если включён режим автоматического определения, вызывается
   * AutoSelectKeyStore/AutoDetectKeyStore (если они существуют).
   * В противном случае применяются настройки ЦСК по его идентификатору.
   */
  async configureKeyStore(caId, autoDetect) {
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

    if (!caId) return;

    try {
      const resp = await fetch('/eusign/data/CAs.json');
      const list = await resp.json();
      const ca = list.find(
        (c) => c.address === caId || c.codeEDRPOU === caId
      );
      if (ca && typeof this.#eu.SetCASettings === 'function') {
        // Используем общие CA-файлы, но устанавливаем прямые адреса сервера
        await this.#eu.SetCASettings('/eusign/data/', '/eusign/data/CACertificates.p7b');
        if (this.#eu.SetOCSPSettings) {
          const ocsp = this.#eu.CreateOCSPSettings();
          ocsp.SetUseOCSP(true);
          ocsp.SetBeforeStore(true);
          ocsp.SetAddress(ca.ocspAccessPointAddress || '');
          ocsp.SetPort(ca.ocspAccessPointPort || '80');
          await this.#eu.SetOCSPSettings(ocsp);
        }
        if (this.#eu.SetCMPSettings) {
          const cmp = this.#eu.CreateCMPSettings();
          cmp.SetUseCMP(true);
          cmp.SetAddress(ca.cmpAddress || '');
          cmp.SetPort('80');
          await this.#eu.SetCMPSettings(cmp);
        }
        if (this.#eu.SetTSPSettings) {
          const tsp = this.#eu.CreateTSPSettings();
          tsp.SetGetStamps(true);
          tsp.SetAddress(ca.tspAddress || '');
          tsp.SetPort(ca.tspAddressPort || '80');
          await this.#eu.SetTSPSettings(tsp);
        }
      }
    } catch (e) {
      console.error('Failed to configure CA settings:', e);
    }
  }

  /** 1) Подгружаем euscpt.js, euscpm.js, euscp.js из /public/eusign/js/ */
  async loadLib() {
    if (this.#libReady) return this.#libReady;

    this.#libReady = new Promise((resolve, reject) => {
      window.EUSignCPModuleInitialized = (ok) =>
        ok ? resolve() : reject(new Error('EUSign init failed'));

      const add = (filename) =>
        new Promise((res, rej) => {
          const script = document.createElement('script');
          script.src = `/eusign/js/${filename}`;
          script.onload = res;
          script.onerror = rej;
          document.body.appendChild(script);
        });

      (async () => {
        try {
          for (const f of ['euscpt.js', 'euscpm.js', 'euscp.js']) {
            await add(f);
          }
        } catch (e) {
          reject(e);
        }
      })();
    });

    return this.#libReady;
  }

  /** 2) Инициализируем EUSignJS (EndUser), proxy, CA-файлы и (по желанию) файловое хранилище */
  async init() {
    if (this.#ready) return this.#ready;

    this.#ready = (async () => {
      await this.loadLib();
      // В разных сборках библиотека экспортирует либо EndUser, либо EUSignCP
      if (typeof window.EndUser === 'function') {
        this.#eu = new window.EndUser();
      } else if (typeof window.EUSignCP === 'function') {
        this.#eu = window.EUSignCP();
      } else {
        throw new Error('EUSign library not loaded');
      }
      await this.#eu.Initialize();

      // 2.1) Базовые параметры
      this.#eu.SetCharset('UTF-8');
      this.#eu.SetJavaStringCompliant(true);

      // 2.2) CA-файлы
      if (typeof this.#eu.SetCASettings === 'function') {
        await this.#eu.SetCASettings('/eusign/data/', '/eusign/data/CACertificates.p7b');
      }
      try {
        const resp = await fetch('/eusign/data/CACertificates.p7b');
        if (resp.ok) {
          const buf = new Uint8Array(await resp.arrayBuffer());
          await this.#eu.SaveCertificates(buf);
        }
      } catch (err) {
        // Preloading CA certificates is optional; log and continue if it fails
        console.warn('Failed to preload CA certificates:', err);
      }

      // 2.3) Режим офлайн
      const modeSettings = this.#eu.CreateModeSettings();
      modeSettings.SetOfflineMode(true);
      await this.#eu.SetModeSettings(modeSettings);

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
  async readPrivateKeyFile(file, password, caId, autoDetect = false) {
    await this.configureKeyStore(caId, autoDetect);
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
  async selectTokenProvider(index, password, caId, autoDetect = false) {
    await this.configureKeyStore(caId, autoDetect);
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
