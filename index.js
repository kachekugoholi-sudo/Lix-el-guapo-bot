import { makeWASocket, delay, DisconnectReason, useMultiFileAuthState } from 'todleys'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import fs from 'fs'
import path from 'path'
import config from './config.js'

const myPhoneNumber = '522464722709'
const logger = pino({ level: 'silent' })

const connectToWhatsApp = async () => {
  let muteados = JSON.parse(fs.readFileSync("./database/mute.json"))
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const sock = makeWASocket({ logger, auth: state })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'connecting' && !sock.authState.creds.registered) {
      await delay(1500)
      const code = await sock.requestPairingCode(myPhoneNumber)
      console.log('🔗 Código de vinculación:', code)
    } else if (connection === 'close') {
      const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('⚠️ Conexión cerrada. Reconectando:', shouldReconnect)
      if (shouldReconnect) connectToWhatsApp()
    } else if (connection === 'open') {
      console.log('✅ Conectado a WhatsApp')
      try {
        if (config.photo && config.photo.startsWith('http')) {
          const response = await fetch(config.photo)
          const buffer = await response.arrayBuffer()
          await sock.updateProfilePicture(sock.user.id, Buffer.from(buffer))
          console.log('📸 Foto de perfil actualizada')
        }
      } catch (e) {
        console.log('⚠️ No se pudo actualizar la foto:', e.message)
      }
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const message of messages) {
      if (!message.message) continue

      const texto = message.message.conversation ||
                    message.message.extendedTextMessage?.text ||
                    ""
      const jid = message.key.remoteJid
      const autor = message.key.participant || message.key.remoteJid

      if (muteados.includes(autor) && !message.key.fromMe) {
        await sock.sendMessage(jid, {
          delete: message.key
        })
        return
      }

      if (texto.startsWith(".mute")) {
        const mencionado = message.message.extendedTextMessage?.contextInfo?.mentionedJid
        if (!mencionado || mencionado.length === 0) {
          return sock.sendMessage(jid, {
            text: "❌ Usa: .mute @usuario"
          })
        }
        if (!muteados.includes(mencionado[0])) {
          muteados.push(mencionado[0])
          fs.writeFileSync("./database/mute.json", JSON.stringify(muteados, null, 2))
        }
        await sock.sendMessage(jid, {
          text: "🔇 Usuario muteado.",
          mentions: mencionado
        })
        continue
      }

      if (texto.startsWith(".unmute")) {
        const mencionado = message.message.extendedTextMessage?.contextInfo?.mentionedJid
        if (!mencionado || mencionado.length === 0) {
          return sock.sendMessage(jid, {
            text: "❌ Usa: .unmute @usuario"
          })
        }
        muteados = muteados.filter(id => id !== mencionado[0])
        fs.writeFileSync("./database/mute.json", JSON.stringify(muteados, null, 2))
        await sock.sendMessage(jid, {
          text: "🔊 Usuario desmuteado.",
          mentions: mencionado
        })
        continue
      }

      console.log('📩 Mensaje recibido:', texto)

      const commandFolders = ['main', 'admin', 'economy', 'fun']

      for (const folder of commandFolders) {
        const folderPath = `./comandos/${folder}`
        if (!fs.existsSync(folderPath)) continue

        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'))

        for (const file of commandFiles) {
          try {
            const command = await import(`./comandos/${folder}/${file}`)
            if (command.default && command.default.ejecutar) {
              await command.default.ejecutar(sock, jid, texto, message)
            }
          } catch (error) {
            console.error(`Error al ejecutar comando ${file}:`, error)
          }
        }
      }
    }
  })
}

connectToWhatsApp()
