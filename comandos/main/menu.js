export default {
  ejecutar: async (sock, jid, texto, message) => {
    try {
      const prefijo = texto.match(/^[.#]/)?.[0] || '.';
      const comando = texto.replace(/^[.#]/, '').trim().toLowerCase();

      const esMenu = ['menu', 'help', 'ayuda', 'hel'].includes(comando);

      if (!esMenu) return;

      const userJid = message.key.participant || message.key.remoteJid || jid;
      const userShortId = userJid.split('@')[0];

      const menuTexto = `¡Hola @${userShortId}! soy Toji-bot *(main)*

╭────  🪾𝐌̅𝐄꯭𝐍𝐔🍂 ────╮

꒰🌕ᩚ꒱  ⣿   ☆  .𝗉𝗂𝗇𝗀
> ✨ Latencia del bot.
꒰🌕ᩚ꒱  ⣿   ☆  .𝗆𝖾𝗇𝗎
> ✨ Muestra este menú.
꒰🌕ᩚ꒱  ⣿   ☆  .𝗂𝗇𝖿𝗈
> ✨ información del 𝖻𝗈𝗍


╭────  🍂𝐀𝐃𝐌𝐈𝐍𝐒🪾 ────╮
꒰🌕ᩚ꒱  ⣿   ☆  .𝖺𝖽𝗆𝗂𝗇𝗌
> ✨ Menciona a los administradores
꒰🌕ᩚ꒱  ⣿   ☆   .𝗍𝖺𝗀𝖺𝗅𝗅
> ✨ 𝖬𝖾𝗇𝖼𝗂𝗈𝗇𝖺 𝖺 𝗅𝗈𝗌 𝗆𝗂𝖾𝗆𝖻𝗋𝗈𝗌
꒰🌕ᩚ꒱  ⣿   ☆   .𝗄𝗂𝖼𝗄 @usuario
> ✨ 𝖤𝗑𝗉𝗎𝗅𝗌𝖺 𝖺 𝖺𝗅𝗀𝗎𝗂𝖾𝗇
꒰🌕ᩚ꒱  ⣿   ☆   .𝖼𝗅𝗈𝗌𝖾
> ✨ 𝖢𝗂𝖾𝗋𝗋𝖺 𝖾𝗅 𝗀𝗋𝗎𝗉𝗈
꒰🌕ᩚ꒱  ⣿   ☆   .𝗈𝗉𝖾𝗇
> ✨ 𝖠𝖻𝗋𝖾 𝖾𝗅 𝗀𝗋𝗎𝗉𝗈
꒰🌕ᩚ꒱  ⣿   ☆   .𝗉𝗋𝗈𝗆𝗈𝗍𝖾 @usuario
> ✨ 𝖣𝖺 𝖺𝖽𝗆𝗂𝗇𝗂𝗌𝗍𝗋𝖺𝖽𝗈𝗋
꒰🌕ᩚ꒱  ⣿   ☆   .𝖽𝖾𝗆𝗈𝗍𝖾 @usuario
> ✨ 𝖰𝗎𝗂𝗍𝖺 𝖺𝖽𝗆𝗂𝗇𝗂𝗌𝗍𝗋𝖺𝖽𝗈𝗋
꒰🌕ᩚ꒱  ⣿   ☆   .𝗆𝗎𝗍𝖾 @usuario
> ✨ 𝖲𝗂𝗅𝖾𝗇𝖼𝗂𝖺 𝗎𝗌𝗎𝖺𝗋𝗂𝗈
꒰🌕ᩚ꒱  ⣿   ☆   .𝗎𝗇𝗆𝗎𝗍𝖾 @usuario
> ✨ 𝖰𝗎𝗂𝗍𝖺 𝗌𝗂𝗅𝖾𝗇𝖼𝗂𝗈`;

      await sock.sendMessage(jid, {
        image: { url: 'https://files.evogb.win/jwmu5N.jpg' },
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
