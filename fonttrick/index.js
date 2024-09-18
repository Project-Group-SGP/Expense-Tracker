const fs = require("fs")
const path = require("path")

module.exports = function fonttrick() {
  const tempFontPath = path.join("/tmp", "Roboto-Regular.ttf")
  const sourceFontPath = require.resolve("./fonts/Poppins-Regular.ttf")

  try {
    if (!fs.existsSync(tempFontPath)) {
      console.log("Copying font to /tmp directory...")
      fs.copyFileSync(
        sourceFontPath,
        tempFontPath,
        fs.constants.COPYFILE_FICLONE | fs.constants.COPYFILE_EXCL
      )
      console.log("Font copied successfully!")
    } else {
      console.log("Font already exists in /tmp directory.")
    }
  } catch (err) {
    console.error("Error while handling the font file:", err)
  }

  return tempFontPath
}
