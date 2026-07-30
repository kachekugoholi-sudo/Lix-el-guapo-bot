export default {

  ejecutar: async (sock, jid, texto, message) => {

    if (texto === ".admin") {
      return await sock.sendMessage(jid, {
        text: `
【 👑 𝗔𝗗𝗠𝗜𝗡 】

🍂 .admins - Menciona a todos los administradores.
🍂 .tagall - Menciona a todos los miembros.
🍂 .kick @usuario - Expulsa a alguien del grupo.
🍂 .close - Cierra el grupo.
🍂 .open - Abre el grupo.
🍂 .promote @usuario - Da administrador.
🍂 .demote @usuario - Quita administrador.
🍂 .mute @usuario - Silencia usuario.
🍂 .unmute @usuario - Quita silencio.

╰─────🕸─────╯
`
      })
    }


    if (!jid.endsWith("@g.us")) return


    const comandosAdmin = [
      ".admins",
      ".tagall",
      ".kick",
      ".promote",
      ".demote",
      ".close",
      ".open"
    ]


    const usaAdmin = comandosAdmin.some(cmd =>
      texto.startsWith(cmd)
    )

    if (!usaAdmin) return


    const metadata = await sock.groupMetadata(jid)

    const sender =
      message.key.participant || message.key.remoteJid


    const usuario = metadata.participants.find(
      p => p.id === sender
    )

    const botJid = sock.user.id.split(":")[0] + "@s.whatsapp.net"

const bot = metadata.participants.find(
  p => p.id === botJid
)

const usuarioEsAdmin =
  console.log("BOT:", bot)
console.log("USUARIO:", usuario)
  usuario?.admin === "admin" ||
  usuario?.admin === "superadmin"


    if (!usuarioEsAdmin) {
      return sock.sendMessage(jid, {
        text: "❌ Este comando solo puede usarlo un administrador."
      })
    }



    // ===== ADMINS =====

    if (texto === ".admins") {

      const admins = metadata.participants
        .filter(p => p.admin)
        .map(p => `👑 @${p.id.split("@")[0]}`)
        .join("\n")


      return sock.sendMessage(jid, {
        text: `👑 Administradores:\n\n${admins}`,
        mentions: metadata.participants
          .filter(p => p.admin)
          .map(p => p.id)
      })
    }



    // ===== TAGALL =====

    if (texto === ".tagall") {

      const miembros = metadata.participants

      return sock.sendMessage(jid, {
        text:
          "📢 Mención general:\n\n" +
          miembros.map(p =>
            `👤 @${p.id.split("@")[0]}`
          ).join("\n"),

        mentions: miembros.map(p => p.id)
      })
    }



    const mencionado =
      message.message?.extendedTextMessage
      ?.contextInfo?.mentionedJid



    // ===== KICK =====

    if (texto.startsWith(".kick")) {

      if (!botEsAdmin)
        return sock.sendMessage(jid,{
          text:"❌ Necesito ser administrador."
        })


      if (!mencionado)
        return sock.sendMessage(jid,{
          text:"❌ Usa: .kick @usuario"
        })


      try {

        await sock.groupParticipantsUpdate(
          jid,
          [mencionado[0]],
          "remove"
        )


        return sock.sendMessage(jid,{
          text:"👢 Usuario expulsado.",
          mentions:mencionado
        })


      } catch(error){

        console.log(error)

        return sock.sendMessage(jid,{
          text:"❌ No pude expulsarlo."
        })
      }
    }



    // ===== PROMOTE =====

    if (texto.startsWith(".promote")) {

      if (!botEsAdmin)
        return sock.sendMessage(jid,{
          text:"❌ Necesito ser administrador."
        })


      if (!mencionado)
        return sock.sendMessage(jid,{
          text:"❌ Usa: .promote @usuario"
        })


      try {

        await sock.groupParticipantsUpdate(
          jid,
          [mencionado[0]],
          "promote"
        )


        return sock.sendMessage(jid,{
          text:"👑 Usuario ahora es administrador.",
          mentions:mencionado
        })


      } catch(error){

        console.log(error)

        return sock.sendMessage(jid,{
          text:"❌ No pude darle administrador."
        })
      }
    }



    // ===== DEMOTE =====

    if (texto.startsWith(".demote")) {

      if (!botEsAdmin)
        return sock.sendMessage(jid,{
          text:"❌ Necesito ser administrador."
        })


      if (!mencionado)
        return sock.sendMessage(jid,{
          text:"❌ Usa: .demote @usuario"
        })


      try {

        await sock.groupParticipantsUpdate(
          jid,
          [mencionado[0]],
          "demote"
        )


        return sock.sendMessage(jid,{
          text:"⬇️ Administrador removido.",
          mentions:mencionado
        })


      } catch(error){

        console.log(error)

        return sock.sendMessage(jid,{
          text:"❌ No pude quitar administrador."
        })
      }
    }



    // ===== CLOSE =====

    if (texto === ".close") {

      if (!botEsAdmin)
        return sock.sendMessage(jid,{
          text:"❌ Necesito ser administrador."
        })


      try {

        await sock.groupSettingUpdate(
          jid,
          "announcement"
        )


        return sock.sendMessage(jid,{
          text:"🔒 Grupo cerrado."
        })


      } catch(error){

        console.log(error)

        return sock.sendMessage(jid,{
          text:"❌ No pude cerrar el grupo."
        })
      }
    }

   // ===== OPEN =====

    if (texto === ".open") {

      if (!botEsAdmin)
        return sock.sendMessage(jid,{
          text:"❌ Necesito ser administrador."
        })


      try {

        await sock.groupSettingUpdate(
          jid,
          "not_announcement"
        )


        return sock.sendMessage(jid,{
          text:"🔓 Grupo abierto."
        })


      } catch(error){

        console.log(error)

        return sock.sendMessage(jid,{
          text:"❌ No pude abrir el grupo."
        })
      }
    }

  }

    }
