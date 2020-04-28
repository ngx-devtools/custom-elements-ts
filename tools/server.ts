import * as express from 'express'

import { AddressInfo } from 'net'
import { createServer } from 'http'
import { resolve } from 'path'

const app = express()

export interface ServerOptions {
  port?: number
  rootDir?: string
  folders?: string[]
}

export function startServer(options?: ServerOptions) {
  const port = options?.port ?? 3000
  const rootDir = options?.rootDir ?? 'dist' 
  const folders = options?.folders ?? []

  app.use(`/`, express.static(resolve(rootDir)))
  app.use(`/node_modules`, express.static(resolve('node_modules')))

  folders.forEach(folder => {
    app.use(`/${folder}`, express.static(resolve(folder)))
  })

  app.all('/*', function(req: express.Request, res: express.Response) {
    res.sendFile('index.html', { root: resolve(rootDir) })
  })

  const server = createServer(app)
  server.listen(port, `localhost`)
    .on('listening', function() {
      const { port, address } = server.address() as AddressInfo;
      console.log(`Express server started on port ${port} at ${address}.`); 
    })
}