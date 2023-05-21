import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Hono!'))

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
})
