const fs = require("fs")
const path = require("path")

module.exports = function fonttrick() {
  // Path to the /tmp directory
  const tempFontPath = path.join("/tmp", "Roboto-Regular.ttf")

  // Construct the path to the font file relative to index.js
  const sourceFontPath = path.resolve(__dirname, "fonts/Poppins-Regular.ttf")

  console.log("Debug: Current directory:", __dirname)
  console.log("Debug: Source font path:", sourceFontPath)
  console.log("Debug: Temp font path:", tempFontPath)

  try {
    console.log(
      "Debug: Checking if source font exists:",
      fs.existsSync(sourceFontPath)
    )
    console.log(
      "Debug: Checking if temp font exists:",
      fs.existsSync(tempFontPath)
    )

    if (!fs.existsSync(tempFontPath)) {
      console.log("Copying font to /tmp directory...")

      // Check if the source directory exists
      const sourceDir = path.dirname(sourceFontPath)
      console.log(
        "Debug: Checking if source directory exists:",
        fs.existsSync(sourceDir)
      )

      // List contents of the source directory
      console.log(
        "Debug: Contents of source directory:",
        fs.readdirSync(sourceDir)
      )

      fs.copyFileSync(
        sourceFontPath,
        tempFontPath,
        fs.constants.COPYFILE_FICLONE | fs.constants.COPYFILE_EXCL
      )
      console.log("Font copied successfully!")
    } else {
      console.log("Font already exists in /tmp directory.")
    }

    // Verify the file was copied
    console.log(
      "Debug: Checking if temp font exists after copy:",
      fs.existsSync(tempFontPath)
    )

    // Try to read the contents of the temp file
    const tempFileContents = fs.readFileSync(tempFontPath)
    console.log("Debug: Temp file size:", tempFileContents.length, "bytes")
  } catch (err) {
    console.error("Error while handling the font file:", err)
    console.error("Debug: Error stack trace:", err.stack)
  }

  return tempFontPath
}
