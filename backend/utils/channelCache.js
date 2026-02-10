/**
 * In-memory channel list cache.
 * - Loading: fetched once on first getChannels() or warm() call.
 * - Invalidate: called after channel create/update/delete, next getChannels() will fetch from DB again.
 */

const Channel = require('../models/Channel');

let channelsPromise = null;

function invalidate() {
  channelsPromise = null;
}

function getChannels() {
  if (!channelsPromise) {
    channelsPromise = Channel.find().lean().exec();
  }
  return channelsPromise;
}

/** Load channels once when application starts (optional). */
function warm() {
  return getChannels();
}

module.exports = {
  getChannels,
  invalidate,
  warm,
};
