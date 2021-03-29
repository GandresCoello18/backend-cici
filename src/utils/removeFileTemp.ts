const fs = require('fs').promises
const path = require('path')
const FOLDER_TO_REMOVE = './public/uploads'

export const RemoveFilesTemp = () => {
  fs.readdir(FOLDER_TO_REMOVE)
  .then((files: any[]) => {
    const unlinkPromises = files.map(file => {
      const filePath = path.join(FOLDER_TO_REMOVE, file)
      return fs.unlink(filePath)
    })

    return Promise.all(unlinkPromises)
  }).catch((err: { message: any; }) => {
    console.error(`Something wrong happened removing files of ${FOLDER_TO_REMOVE}: ${err.message}`)
  })
}