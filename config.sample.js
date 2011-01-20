var config = {
  'jid': '@jabber.org',
  'password': '',
  'friend': '@jabber.org',
  'files': ['error.log']
}

exports.get = function(v) {
  return config[v];
}
