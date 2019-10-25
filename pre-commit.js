const { exec } = require('child_process')

exec('git diff --cached --name-only --diff-filter=ACM', (err, stdout, stderr) => {
    if (err) {
      console.error('error:', err);
      return;
    }

    const matchFilesUnderServer = /server\/(.+\.js)/g

    if (matchFilesUnderServer.test(stdout)) {
        console.log('hey this guy changed so will copy this!')
        const matched = stdout.match(matchFilesUnderServer)

        for (const source of matched) {
            const dest = source.replace('server/', 'client/')
            exec(`cp ${source} ${dest}`, (err, stdout, stderr) => {
                if (err) {
                    console.log('failed to copy!', err)
                    return;
                }
                exec(`git add ${dest}`, (err, stdout, stderr) => {
                    if (err) {
                        console.log('failed to add file', err)
                        return;
                    }
                })
            })
        }
    }
});
