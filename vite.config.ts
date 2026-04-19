import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'

function devApiPlugin(): Plugin {
  return {
    name: 'pacey-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/generate-plan', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const body = await readJsonBody(req)
        const { default: handler } = await server.ssrLoadModule('/api/generate-plan.ts')

        const vercelReq = Object.assign(req, { body })
        const vercelRes = makeVercelRes(res)

        try {
          await handler(vercelReq, vercelRes)
        } catch (err) {
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                error: err instanceof Error ? err.message : 'Unknown error',
              }),
            )
          }
        }
      })
    },
  }
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(chunk as Buffer))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function makeVercelRes(res: ServerResponse) {
  const wrapped = res as ServerResponse & {
    status: (code: number) => typeof wrapped
    json: (body: unknown) => typeof wrapped
  }
  wrapped.status = (code: number) => {
    res.statusCode = code
    return wrapped
  }
  wrapped.json = (body: unknown) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(body))
    return wrapped
  }
  return wrapped
}

export default defineConfig({
  plugins: [react(), devApiPlugin()],
})
