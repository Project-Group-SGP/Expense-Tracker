module.exports = function fonttrick() {
  const fs = require("fs")
  const path = require("path")
  const RobotoR = require.resolve("./fonts/Poppins-Regular.ttf")
  const { COPYFILE_EXCL } = fs.constants
  const { COPYFILE_FICLONE } = fs.constants

  //const pathToRoboto = path.join(process.cwd(), 'node_modules/fonttrick/Roboto-Regular.ttf')

  try {
    if (fs.existsSync("/tmp/Roboto-Regular.ttf")) {
      console.log("Roboto lives in tmp!!!!")
    } else {
      fs.copyFileSync(
        RobotoR,
        "/tmp/Roboto-Regular.ttf",
        COPYFILE_FICLONE | COPYFILE_EXCL
      )
    }
  } catch (err) {
    console.error(err)
  }

  return "/tmp/Roboto-Regular.ttf"
}
