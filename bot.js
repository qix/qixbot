#!/usr/local/bin/node
var config = require('./config'),
    fs = require('fs');

var argv = process.argv;
const xmpp = require('node-xmpp');
const sys = require('sys');

const jid = config.get('jid');
const password = config.get('password');
const to = config.get('friend');

// Establish a connection
const conn = new xmpp.Client({
    jid         : jid,
    password    : password,
    host        : 'jabber.org', //'talk.google.com',
    port        : 5222
});

conn.on('online', function(){
    console.log('[JABBER] Online.');

    conn.send(
      new xmpp.Element('presence')
        .c('show').t('chat').up()
        .c('status').t('Available').up());

    config.get('files').forEach(function(f) {
      var position = fs.lstatSync(f)['size'];
      fs.watchFile(f, function() {
        var fd = fs.openSync(f, 'r');
        var buffer = new Buffer(4096);
        var length = fs.readSync(fd, buffer, 0, 4096, position);
        fs.closeSync(fd);
        position += length;
        conn.send(new xmpp.Element('message',
            { to: to, // to
                type: 'chat'}).
                c('body').
                t(buffer.toString('utf8', 0, length).trim()));
      });
    });
});

conn.on('error', function(e) {
    sys.puts(e);
});

