export default {
  ejecutar: async (sock, jid, texto, message) => {
    try {
      const prefijo = texto.match(/^[.#]/)?.[0] || '.';
      const comando = texto.replace(/^[.#]/, '').trim().toLowerCase();

      const esMenu = ['menu', 'help', 'ayuda', 'hel'].includes(comando);

      if (!esMenu) return;

      const userJid = message.key.participant || message.key.remoteJid || jid;
      const userShortId = userJid.split('@')[0];

      const menuTexto = `¡Hola @${userShortId}! soy Naru *(main)*

╭────  🌻 𝐌̅𝐄꯭𝐍𝐔  🌼 ────╮

- 𝐶𝑜𝑚𝑎𝑛𝑑𝑜𝑠 𝑑𝑖𝑠𝑝𝑜𝑛𝑖𝑏𝑙𝑒𝑠

꒰🌕ᩚ꒱  ⣿   ☆  ${prefijo}𝗉𝗂𝗇𝗀  - Latencia del bot
꒰🌕ᩚ꒱  ⣿   ☆  ${prefijo}𝗆𝖾𝗇𝗎  -  Muestra este menú
꒰🌕ᩚ꒱  ⣿   ☆  ${prefijo}𝗂𝗇𝖿𝗈  -  información del 𝖻𝗈𝗍
꒰🌕ᩚ꒱  ⣿   ☆ ${prefijo}𝖺𝖽𝗆𝗂𝗇  -  Comandos de administración.

𝑝𝑟𝑜𝑛𝑡𝑜 𝑠𝑒 𝑖𝑚𝑝𝑙𝑒𝑚𝑒𝑛𝑡𝑎𝑟𝑎𝑛 𝑚𝑎́𝑠 𝑐𝑜𝑠𝑎𝑠

╰──── 🌼 𝐌̅𝐄꯭𝐍𝐔 🌻─────╯`;

      await sock.sendMessage(jid, {
        image: { url: 'https://files.evogb.win/lOuoMM.jpg' },
        caption: menuTexto,
        mentions: [userJid]
      }, { quoted: message });

    } catch (error) {
      console.error('Error en el menú:', error);
      await sock.sendMessage(jid, {
        text: '❌ Error al mostrar el menú.'
      }, { quoted: message });
    }
  }
}
