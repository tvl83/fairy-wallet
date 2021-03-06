// @flow
const fcbuffer = require('fcbuffer');
const assert = require('assert');
const asn1 = require('asn1-ber');

export default function serialize(chainId, transaction, types) {
  const writter = new asn1.BerWriter();

  encode(writter, fcbuffer.toBuffer(types.checksum256(), chainId));
  encode(writter, fcbuffer.toBuffer(types.time(), transaction.expiration));
  encode(writter, fcbuffer.toBuffer(types.uint16(), transaction.ref_block_num));
  encode(
    writter,
    fcbuffer.toBuffer(types.uint32(), transaction.ref_block_prefix)
  );
  encode(
    writter,
    fcbuffer.toBuffer(types.unsigned_int(), transaction.max_net_usage_words)
  );
  encode(
    writter,
    fcbuffer.toBuffer(types.uint8(), transaction.max_cpu_usage_ms)
  );
  encode(
    writter,
    fcbuffer.toBuffer(types.unsigned_int(), transaction.delay_sec)
  );

  assert(transaction.context_free_actions.length === 0);
  encode(writter, fcbuffer.toBuffer(types.unsigned_int(), 0));

  assert(transaction.actions.length === 1);
  encode(writter, fcbuffer.toBuffer(types.unsigned_int(), 1));

  const action = transaction.actions[0];

  encode(writter, fcbuffer.toBuffer(types.account_name(), action.account));
  encode(writter, fcbuffer.toBuffer(types.action_name(), action.name));

  encode(
    writter,
    fcbuffer.toBuffer(types.unsigned_int(), action.authorization.length)
  );
  for (let i = 0; i < action.authorization.length; i += 1) {
    const authorization = action.authorization[i];

    encode(
      writter,
      fcbuffer.toBuffer(types.account_name(), authorization.actor)
    );
    encode(
      writter,
      fcbuffer.toBuffer(types.permission_name(), authorization.permission)
    );
  }

  const data = Buffer.from(action.data, 'hex');
  encode(writter, fcbuffer.toBuffer(types.unsigned_int(), data.length));
  encode(writter, data);

  assert(writter, transaction.transaction_extensions.length === 0);
  encode(writter, fcbuffer.toBuffer(types.unsigned_int(), 0));
  encode(writter, fcbuffer.toBuffer(types.checksum256(), Buffer.alloc(32, 0)));

  return writter.buffer;
}

function encode(writter, buffer) {
  writter.writeBuffer(buffer, asn1.Ber.OctetString);
}
