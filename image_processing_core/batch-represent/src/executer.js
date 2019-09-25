
var fs = require('fs')
const { spawn } = require('child_process')

try{
  fs.unlinkSync('../data/cache.t7')
}catch(exception){
  console.log(exception)
}

const luajit = spawn('luajit', [__dirname+'/main.lua'])

luajit.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
})

luajit.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
})

luajit.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
})
