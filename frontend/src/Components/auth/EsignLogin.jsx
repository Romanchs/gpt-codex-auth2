// src/features/login/EsignLogin.jsx

import React, { useEffect, useRef, useState } from 'react';
import { eusign } from '../../services/eusign';
// Логика входа через сервер не используется
import { BlueButton } from '../Theme/Buttons/BlueButton';

const MODES = {
  file: 'FILE',
  token: 'TOKEN',
  cloud: 'CLOUD'
};

export default function EsignLogin() {
  // --- 1) Вид вкладки: FILE | TOKEN | CLOUD ---
  const [mode, setMode] = useState(MODES.file);

  // --- 2) Общие для всех режимов ---
  const [password, setPassword] = useState('');

  // --- 3) Данные для FILE (ACCK / "Дія") ---
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState('');

  // 3.1) Список CA-провайдеров (из CAs.json)
  const [caList, setCaList] = useState([]); // [{ id: 'AcskCSD', name: 'Дія' }, …]
  const [selectedCaId, setSelectedCaId] = useState('');
  const [detectAutoCa, setDetectAutoCa] = useState(false);

  // --- 4) Данные для TOKEN ---
  const [tokenIndex, setTokenIndex] = useState(0);
  const [tokenProviders, setTokenProviders] = useState([]);

  // --- 5) Данные для CLOUD ---
  const [cloudProviders, setCloudProviders] = useState([{ id: 'iit-cloud', name: 'ІІТ – хмарний підпис (2)' }]);
  const [cloudProviderId, setCloudProviderId] = useState('iit-cloud');
  const [clientId, setClientId] = useState('');

  // --- 6) Для отладки храним данные сертификата ---
  const [certInfo, setCertInfo] = useState(null);

  // ========== Загрузка CA-списка при входе в режим FILE или TOKEN ==========
  useEffect(() => {
    if (mode === MODES.file || mode === MODES.token) {
      (async () => {
        try {
          // 7.1) Получаем JSON-файл: предполагаем, что он лежит по пути /public/eusign/data/CAs.json
          const resp = await fetch('/eusign/data/CAs.json');
          if (!resp.ok) throw new Error(`Ошибка ${resp.status} при загрузке CAs.json`);

          const json = await resp.json();
          const list = Array.isArray(json)
            ? json.map((entry) => {
                // Вытаскиваем первый элемент issuerCNs, если он есть и не пустой
                const firstCN =
                  Array.isArray(entry.issuerCNs) && entry.issuerCNs.length > 0 ? entry.issuerCNs[0] : null;
                // В качестве id возьмём "address" (можно заменить на codeEDRPOU, если бэкенд требует именно его)
                const id = entry.address || entry.codeEDRPOU || '';
                const name = firstCN || id;
                return { id, name };
              })
            : [];

          setCaList(list);
          if (list.length) {
            // По умолчанию выбираем первый элемент
            setSelectedCaId(list[0].id);
          }
        } catch (err) {
          console.error('Не удалось загрузить список CA из CAs.json:', err);
          setCaList([]);
        }
      })();
    }

    if (mode === MODES.token) {
      (async () => {
        try {
          const list = await eusign.listTokenProviders();
          setTokenProviders(list);
          if (list.length) setTokenIndex(list[0].index);
        } catch (err) {
          console.error('Не удалось получить список токенов:', err);
          setTokenProviders([]);
        }
      })();
    }
  }, [mode]);

  // Загрузка списка cloud-провайдеров при выборе вкладки CLOUD
  useEffect(() => {
    if (mode === MODES.cloud) {
      (async () => {
        try {
          const resp = await fetch('/eusign/data/Clouds.json');
          if (resp.ok) {
            const json = await resp.json();
            if (Array.isArray(json) && json.length) {
              setCloudProviders(json.map((p) => ({ id: p.id, name: p.name })));
              setCloudProviderId(json[0].id);
            }
          }
        } catch (err) {
          console.error('Не удалось загрузить список cloud провайдеров:', err);
        }
      })();
    }
  }, [mode]);

  // ========== Обработчик кнопки "Увійти КЕП" ==========
  const handleSubmit = async () => {
    try {
      if (mode === MODES.file) {
        const file = fileRef.current?.files?.[0];
        if (!file) {
          return alert("Будь ласка, виберіть файл із приватним ключем (.pfx, .dat, .zs2).");
        }
        await eusign.readPrivateKeyFile(file, password, selectedCaId, detectAutoCa);
      } else if (mode === MODES.token) {
        await eusign.selectTokenProvider(tokenIndex, password, selectedCaId, detectAutoCa);
      } else if (mode === MODES.cloud) {
        if (!clientId) {
          return alert("Будь ласка, введіть Client ID для CLOUD-провайдера.");
        }
        await eusign.selectCloudProvider(cloudProviderId, clientId);
      }
      const info = await eusign.getUserInfo();
      setCertInfo(info);
      console.log("EUSign user info:", info);
    } catch (err) {
      console.error("Помилка входу через КЕП:", err);
      alert("Помилка входу через КЕП. Перевірте налаштування та спробуйте ще раз.");
    }
  };

  // ========== UI: РЕНДЕРИНГ ВКЛАДОК ==========

  /** Вкладка FILE (ACCK / "Дія") */
  const renderFileTab = () => (
    <div style={{ marginTop: 12 }}>
      {/* Поле CA + Detect automatically */}
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>ACCK:</label>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <input
            type="checkbox"
            id="autoDetectCa"
            checked={detectAutoCa}
            onChange={(e) => setDetectAutoCa(e.target.checked)}
          />
          <label htmlFor="autoDetectCa" style={{ marginLeft: 4 }}>
            Detect automatically
          </label>
        </div>

        {!detectAutoCa && (
          <select
            value={selectedCaId}
            onChange={(e) => setSelectedCaId(e.target.value)}
            style={{ width: '100%', padding: '6px', marginBottom: 8 }}
          >
            {caList.map((ca) => (
              <option key={ca.id} value={ca.id}>
                {ca.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Поле с файлом приватного ключа */}
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Personal key (PFX / DAT / ZS2):</label>
        <input
          type="file"
          ref={fileRef}
          accept=".pfx,.dat,.zs2"
          onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
          style={{ width: '100%' }}
        />
        {fileName && (
          <div style={{ marginTop: 4, fontSize: 12 }}>{fileName}</div>
        )}
      </div>

      {/* Поле с паролем */}
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '6px' }}
        />
      </div>
    </div>
  );

  /** Вкладка TOKEN */
  const renderTokenTab = () => (
    <div style={{ marginTop: 12 }}>
      <label style={{ display: 'block', marginBottom: 4 }}>ACCK:</label>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <input
          type="checkbox"
          id="autoDetectCa"
          checked={detectAutoCa}
          onChange={(e) => setDetectAutoCa(e.target.checked)}
        />
        <label htmlFor="autoDetectCa" style={{ marginLeft: 4 }}>
          Detect automatically
        </label>
      </div>
      <select
        value={selectedCaId}
        onChange={(e) => setSelectedCaId(e.target.value)}
        style={{ width: '100%', padding: '6px', marginBottom: 8 }}
      >
        {caList.map((ca) => (
          <option key={ca.id} value={ca.id}>
            {ca.name}
          </option>
        ))}
      </select>

      {/* Выбор токен-провайдера */}
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Token provider:</label>
        <select
          value={tokenIndex}
          onChange={(e) => setTokenIndex(Number(e.target.value))}
          style={{ width: '100%', padding: '6px' }}
        >
          {tokenProviders.length ? (
            tokenProviders.map((tp) => (
              <option key={tp.index} value={tp.index}>
                {tp.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No tokens detected
            </option>
          )}
        </select>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '6px' }}
        />
      </div>
    </div>
  );

  /** Вкладка CLOUD */
  const renderCloudTab = () => (
    <div style={{ marginTop: 12 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Cloud provider:</label>
        <select
          value={cloudProviderId}
          onChange={(e) => setCloudProviderId(e.target.value)}
          style={{ width: '100%', padding: '6px' }}
        >
          {cloudProviders.map((cp) => (
            <option key={cp.id} value={cp.id}>
              {cp.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Client ID:</label>
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          style={{ width: '100%', padding: '6px' }}
        />
      </div>
    </div>
  );

  // ========== Основной JSX ==========

  return (
    <div style={{ marginTop: 24, border: '1px solid #CCC', padding: 16, borderRadius: 8 }}>
      {/* Выбор режима: FILE | TOKEN | CLOUD */}
      <fieldset style={{ border: 0, padding: 0 }}>
        <legend style={{ fontWeight: 'bold' }}>Select private key media type:</legend>
        {Object.entries(MODES).map(([key, val]) => (
          <label key={key} style={{ marginRight: 12 }}>
            <input
              type="radio"
              name="media"
              checked={mode === val}
              onChange={() => {
                setMode(val);
                // Сбрасываем специфичные поля
                setPassword('');
                setDetectAutoCa(false);
                setSelectedCaId('');
                setTokenIndex(0);
                setClientId('');
                setFileName('');
              }}
            />{' '}
            {val}
          </label>
        ))}
      </fieldset>

      {/* Вставляем соответствующую вкладку */}
      {mode === MODES.file && renderFileTab()}
      {mode === MODES.token && renderTokenTab()}
      {mode === MODES.cloud && renderCloudTab()}

      {/* Кнопка «Увійти КЕП» */}
      <BlueButton style={{ marginTop: 16 }} onClick={handleSubmit}>
        Увійти КЕП
      </BlueButton>
    </div>
  );
}
