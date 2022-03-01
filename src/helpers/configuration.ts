import * as crypto from "crypto";

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
});

export function md5(data: string): string {
  return crypto.createHash('md5').update(data).digest("hex");
};
