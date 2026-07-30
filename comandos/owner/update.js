import { exec } from 'child_process'

export default {
  ejecutar: async (sock, jid, texto, message) => {
    if (texto === '.up' || texto === '#up' || texto === '.update' || texto === '#update') {
      await sock.sendMessage(jid, { text: '🔄 Ejecutando git pull, espera un momento...' })

      exec('git pull', async (error, stdout, stderr) => {
        let response = ''
        if (error) {
          response = `❌ Error al actualizar:\n\`\`\`${error.message}\`\`\``
        } else if (stderr) {
          response = `⚠️ Advertencia:\n\`\`\`${stderr}\`\`\``
        } else {
          response = `✅ Actualización completada:\n\`\`\`${stdout}\`\`\``
        }

        await sock.sendMessage(jid, { text: response })
      })
    }
  }
}