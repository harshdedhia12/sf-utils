import { decode, encode } from "msgpack-decorators";
import { plainToInstance } from "class-transformer";

const encryptionLevel = process.env.ENCRYPTION_LEVEL || 0;

class CommonRequest {
  constructor() {
    this.objArr = [];
  }
}

const deserializeApi = async (req, res, next) => {
  if (encryptionLevel === 0) return next();
  const buffer = await readBodyAsBuffer(req);
  const decodedRequest = decode(buffer, CommonRequest);
  req.decodedRequest = decodedRequest;
  return next();
};

const serializeApi = (reqObj, classRef) => {
  if (encryptionLevel === 0) return reqObj;
  const classObj = plainToInstance(classRef, reqObj, { exposeUnsetFields: false });
  const encodes = encode(classObj, classRef);
  return Buffer.from(encodes);
};

async function readBodyAsBuffer(req) {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    req.on("data", (chunk) => (buffer = Buffer.concat([buffer, chunk])));
    req.on("end", () => resolve(buffer));
    req.on("error", reject);
  })
}

const utils = { deserializeApi, serializeApi };
export default utils;
