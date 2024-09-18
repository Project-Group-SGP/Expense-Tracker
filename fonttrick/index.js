const fs = require("fs")
const path = require("path")

module.exports = function fonttrick() {
  const tempFontPath = path.join("/tmp", "Roboto-Regular.ttf")
  const sourceFontPath = require.resolve("./fonts/Poppins-Regular.ttf")

  console.log(`Source font path: ${sourceFontPath}`)
  console.log(`Temporary font path: ${tempFontPath}`)

  try {
    if (!fs.existsSync(tempFontPath)) {
      console.log("Copying font to /tmp directory...")

      // Check if sourceFontPath is a string
      if (typeof sourceFontPath !== "string") {
        throw new TypeError(
          `Expected sourceFontPath to be a string, got ${typeof sourceFontPath}`
        )
      }

      // Ensure the source file exists
      if (!fs.existsSync(sourceFontPath)) {
        throw new Error(`Source font file does not exist: ${sourceFontPath}`)
      }

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
