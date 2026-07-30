export default {

  ejecutar: async (sock, jid, texto, message) => {

    if (texto === ".info") {
      await sock.sendMessage(jid, {
        text: `
╭━━━〔 🤖 INFO 〕━━━╮

📌 Nombre: Toji-Bot
👨‍💻 Creador: Naru-lix
💻 Lenguaje: JavaScript (Node.js)
📡 Estado: ✅ Conectado

╰━━━━━━━━━━━━━━╯
`
      })
    }

  }

}