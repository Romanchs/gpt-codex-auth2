import React, { useRef, useState } from 'react';
import { eusign } from '../../services/eusign';
import { BlueButton } from '../Theme/Buttons/BlueButton';

export default function EsignLogin() {
  const fileRef = useRef(null);
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const file = fileRef.current?.files?.[0];
      if (!file) {
        alert('Будь ласка, виберіть файл із приватним ключем.');
        return;
      }

      await eusign.readPrivateKeyFile(file, password);
      const info = await eusign.getUserInfo();
      console.log('EUSign user info:', info);
    } catch (err) {
      console.error('Помилка обробки КЕП:', err);
      alert('Помилка обробки КЕП. Перевірте дані і спробуйте ще раз.');
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>
          Personal key (PFX / DAT / ZS2):
        </label>
        <input type="file" ref={fileRef} accept=".pfx,.dat,.zs2" />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <BlueButton onClick={handleSubmit}>Зчитати КЕП</BlueButton>
    </div>
  );
}
