var streamWrite = require('stream-write');

/**
 * Write `chunk` to `stream`, respecting backpressure.
 *
 * @param {Stream} stream
 * @param {Mixed} chunk
 * @return {Function}
 * @api public
 */

module.exports = function write(stream, chunk){
  return function(done){
    streamWrite(stream, chunk, done);
  }
};

