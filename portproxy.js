const {exec} = require('child_process');

exec('wsl hostname -I', (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  const ip = String(stdout).trim().split(/\s+/)[0];
  if (!ip) {
    console.log('Unknown wsl hostname');
    return;
  }
  const cmd = `netsh interface portproxy add v4tov4 listenport=7001 connectport=7001 connectaddress=${ip}`;
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`Update proxy ip: ${ip}`);
  });
});