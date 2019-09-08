const io = require('socket.io')();
const SSHClient = require('ssh2').Client;
const conn = new SSHClient();


io.on('connection', function(client) {
    client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
        conn.on('ready', function() {
            const successMessage = '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n';
            console.log(successMessage)
            client.emit('data', successMessage);

            conn.shell(function(err, stream) {
                if (err)
                    return client.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
                client.on('message', function(data) {
                    console.log('sent message: ' + data.toString('binary'));
                    stream.write(data + '\n');
                });
                // process.stdin.setRawMode(true);
                // process.stdin.pipe(stream);
                // stream.pipe(process.stdout);
                // stream.stderr.pipe(process.stderr);

                // stream.setWindow(process.stdout.rows, process.stdout.columns);
                // process.stdout.on('resize', () => {
                //     stream.setWindow(process.stdout.rows, process.stdout.columns);
                // });

                stream.on('data', function(d) {
                    console.log('received message: ' + d);
                    client.emit('data', d.toString('binary'));
                }).on('close', function() {
                    conn.end();
                }).stderr.on('data', function(data) {
                    console.log('STDERR: ' + data);
                });
                // stream.end('ls -l\nexit\n');
            });

            /*conn.exec('ls', function(err, stream) {
                if (err) throw err;
                stream.on('close', function(code, signal) {
                    console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                    conn.end();
                }).on('message', function(data) {
                    console.log('sent message: ' + data.toString('binary'));
                    stream.write(data);
                }).on('data', function(data) {
                    console.log('STDOUT: ' + data);
                }).stderr.on('data', function(data) {
                    console.log('STDERR: ' + data);
                });
            });*/
        }).on('close', function() {
            const closedMessage = '\r\n*** SSH CONNECTION CLOSED ***\r\n';
            console.log(closedMessage);
            client.emit('data', closedMessage);
        }).on('error', function(err) {
            const errorMessage = '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n';
            console.log(errorMessage);
            client.emit('data', errorMessage);
        }).connect({
            host: 'host_or_ip',
            username: 'user_name',
            password: 'pass_word',

        });
    });

});



const port = 8000;
io.listen(port);
console.log('listening on port ', port);