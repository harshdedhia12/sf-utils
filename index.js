import { decode, encode } from "msgpack-decorators";
const encryptionLevel = process.env.ENCRYPTION_LEVEL || 0

class CommonRequest {
  constructor() {
    this.objArr = [];
  }
}

exports.deserializeUserApi = async (req, res, next) => {
  if (encryptionLevel === 0) return next();
  const buffer = await readBodyAsBuffer(req);
  const decodedRequest = decode(buffer, CommonRequest);
  req.decodedRequest = decodedRequest;
  return next();
};

async function readBodyAsBuffer(req) {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0)
    req.on("data", (chunk) => (buffer = Buffer.concat([buffer, chunk])))
    req.on("end", () => resolve(buffer))
    req.on("error", reject)
  })
}
