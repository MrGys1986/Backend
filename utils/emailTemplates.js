// utils/emailTemplates.js (puedes tenerlo separado)
const getRecoveryEmailTemplate = (code) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://i.ibb.co/nMzX7fZc/m-removebg-preview.png" alt="Logo" style="max-width: 120px;" />
    </div>
    <h2 style="text-align: center; color: #007BFF;">Recuperación de Contraseña</h2>
    <p>Hola,</p>
    <p>Tu código de recuperación es:</p>
    <div style="text-align: center; margin: 30px;">
      <span style="font-size: 32px; font-weight: bold; background: #e9ecef; padding: 10px 20px; border-radius: 8px; letter-spacing: 6px;">
        ${code}
      </span>
    </div>
    <p style="text-align: center; color: #888;">Este código es válido por 15 minutos.</p>
    <p style="margin-top: 32px;">Si no solicitaste esta recuperación, ignora este mensaje.</p>
    <p>— Equipo de Soporte</p>
  </div>
`;

module.exports = { getRecoveryEmailTemplate };
