export default {

  ejecutar: async (sock, jid, texto, message) => {


    if (texto === ".admin") {
      await sock.sendMessage(jid, {
        text: `
╭━━━〔 👑 ADMIN 〕━━━╮

🛡️ .admins
📢 .tagall
❌ .kick @usuario

╰━━━━━━━━━━━━━━╯
`
      })
    }


    if (texto === ".admins") {

      if (!jid.endsWith("@g.us")) {
        return sock.sendMessage(jid, {
          text: "❌ Este comando solo funciona en grupos."
        })
      }

      const metadata = await sock.groupMetadata(jid)

      const admins = metadata.participants
        .filter(p => p.admin)
        .map(p => `👑 @${p.id.split("@")[0]}`)
        .join("\n")

      await sock.sendMessage(jid, {
        text: `👑 *Administradores del grupo:*\n\n${admins}`,
        mentions: metadata.participants
          .filter(p => p.admin)
          .map(p => p.id)
      })
    }


    if (texto === ".tagall") {

      if (!jid.endsWith("@g.us")) {
        return sock.sendMessage(jid, {
          text: "❌ Este comando solo funciona en grupos."
        })
      }

      const metadata = await sock.groupMetadata(jid)

      const menciones = metadata.participants.map(p => p.id)

      const mensaje = metadata.participants
        .map(p => `👤 @${p.id.split("@")[0]}`)
        .join("\n")

      await sock.sendMessage(jid, {
        text: `📢 *Mención general:*\n\n${mensaje}`,
        mentions: menciones
      })
    }


    if (texto.startsWith(".kick")) {

      if (!jid.endsWith("@g.us")) {
        return sock.sendMessage(jid, {
          text: "❌ Este comando solo funciona en grupos."
        })
      }

      const mencionado = message.message.extendedTextMessage?.contextInfo?.mentionedJid

      if (!mencionado || mencionado.length === 0) {
        return sock.sendMessage(jid, {
          text: "❌ Menciona al usuario que quieres expulsar.\nEjemplo: .kick @usuario"
        })
      }

      try {

        await sock.groupParticipantsUpdate(
          jid,
          [mencionado[0]],
          "remove"
        )

        await sock.sendMessage(jid, {
          text: "👢 Usuario expulsado correctamente.",
          mentions: mencionado
        })

      } catch (error) {

        console.log(error)

        await sock.sendMessage(jid, {
          text: "❌ No pude expulsar al usuario. Revisa que el bot sea administrador."
        })

      }

    }


  }

        }
