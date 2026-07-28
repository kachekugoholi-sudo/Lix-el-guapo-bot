import admin from "./comandos/admin/admin.js"
import { makeWASocket, delay, DisconnectReason, useMultiFileAuthState } from '@itsliaaa/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'

const myPhoneNumber = '522464722709'

const logger = pino({ level: 'silent' })

const connectToWhatsApp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('session')

  const sock = makeWASocket({
    logger,
    auth: state
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'connecting' && !sock.authState.creds.registered) {
      await delay(1500)
      const code = await sock.requestPairingCode(myPhoneNumber)
      console.log('🔗 Código de vinculación:', code)
    } else if (connection === 'close') {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut

      console.log('⚠️ Conexión cerrada. Reconectando:', shouldReconnect)

      if (shouldReconnect) {
        connectToWhatsApp()
      }                                                                                                   } else if (connection === 'open') {
     console.log('✅ Conectado a WhatsApp')                                                               }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const message of messages) {
      if (!message.message) continue
     const texto =
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      ""
     const jid = message.key.remoteJid

    await admin.ejecutar(sock, jid, texto, message)

     console.log('📩 Mensaje recibido')

      if (texto.toLowerCase() === "hola") {
      await sock.sendMessage(jid,
 {
        text: '¿Un saludo? Qué pérdida de tiempo...'

        })
      }

     if (texto === ".menu") {
      await sock.sendMessage(jid, {
        text: `📋 MENÚ

.hola
.info
.ping`
      })
    }

    if (texto === ".ping") {
      await sock.sendMessage(jid,
 {
        text: "🏓 Pong!"
        })
      }
    }
  })
}

connectToWhatsApp()
