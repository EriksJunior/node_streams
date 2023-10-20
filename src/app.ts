import "dotenv/config"
import path from "path"
import express from "express"
import cors from "cors"
import { Request, Response } from "express"
import { createReadStream, createWriteStream, existsSync } from "fs"

const app = express()

app.use(cors())
app.use(express.json())
app.disable('x-powered-by')

app.get('/video', (req: Request, res: Response) => {
  const { filename } = req.query

  const filePath = path.resolve(__dirname, `${filename}.mp4`)
  if (!existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" })
  }

  const stream = createReadStream(filePath)

  res.setHeader('content-type', 'video/mp4')
  // res.setHeader('content-disposition', 'attachment; filename=teste.mp4') // Available for download

  stream.on('error', err => {
    console.log(err)
    res.status(500).json({ message: err })
  })

  stream.pipe(res)

  stream.on('end', () => {
    res.end() // Finished
  })
})

app.get('/video/copy', (req: Request, res: Response) => {
  const { filename } = req.query
  const filePath = path.resolve(__dirname, `${filename}.mp4`)
  if (!existsSync(filePath)) {
    return res.status(404).json({ message: "Arquivo não encontrado" })
  }

  const fileStream = createReadStream(filePath)

  const copyFilePath = path.resolve(__dirname, `copy_${filename}.mp4`)
  const copyFileStream = createWriteStream(copyFilePath)

  res.setHeader('content-type', 'video/mp4')
  res.setHeader('content-disposition', 'attachment; filename=teste.mp4')

  fileStream.pipe(copyFileStream)

  fileStream.pipe(res)

  copyFileStream.on('finish', () => {
    res.end()
  })
})

export { app }