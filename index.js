
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
    var errored = false;

    stream.once('error', error);
    function error(err){
      errored = true;
      done(err);
    }

    if (stream.write(chunk)) {
      stream.removeListener('error', error);
      if (errored) return;
      done(null, stream.writable);
    } else {
      stream.once('drain', next);
      stream.once('finish', next);

      function next(){
        stream.removeListener('error', error);
        stream.removeListener('drain', next);
        stream.removeListener('finish', next);
        done(null, stream.writable);
      }
    }
  }
};

