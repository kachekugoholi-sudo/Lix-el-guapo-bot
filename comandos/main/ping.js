export default {

  ejecutar: async (sock, jid, texto, message) => {

    if (texto === ".ping" || texto === ".pong") {
      await sock.sendMessage(jid, {
        text: "🏓 Pong!"
      })
    }

  }

}