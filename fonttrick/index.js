const fs = require("fs")
const path = require("path")

module.exports = function fonttrick() {
  const fontFileName = "Poppins-Regular.ttf"
  const tempFontPath = path.join("/tmp", fontFileName)
  const sourceFontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    fontFileName
  )

  console.log("Debug: Current directory:", process.cwd())
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
      if (fs.existsSync(sourceDir)) {
        console.log(
          "Debug: Contents of source directory:",
          fs.readdirSync(sourceDir)
        )
      } else {
        console.log("Debug: Source directory does not exist")
      }

      if (fs.existsSync(sourceFontPath)) {
        fs.copyFileSync(sourceFontPath, tempFontPath)
        console.log("Font copied successfully!")
      } else {
        throw new Error("Source font file does not exist")
      }
    } else {
      console.log("Font already exists in /tmp directory.")
    }

    // Verify the file was copied
    console.log(
      "Debug: Checking if temp font exists after copy:",
      fs.existsSync(tempFontPath)
    )

    if (fs.existsSync(tempFontPath)) {
      // Try to read the contents of the temp file
      const tempFileContents = fs.readFileSync(tempFontPath)
      console.log("Debug: Temp file size:", tempFileContents.length, "bytes")
    } else {
      console.log("Debug: Temp file was not created successfully")
    }
  } catch (err) {
    console.error("Error while handling the font file:", err)
    console.error("Debug: Error stack trace:", err.stack)
  }

  return tempFontPath
}
