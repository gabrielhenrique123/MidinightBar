import {createCipheriv,createDecipheriv,randomBytes} from 'node:crypto';
function key(){const k=Buffer.from(process.env.ADDRESS_ENCRYPTION_KEY||'', 'base64');if(k.length!==32)throw new Error('ADDRESS_ENCRYPTION_KEY must be 32 bytes');return k}
export function encrypt(s:string){const iv=randomBytes(12),c=createCipheriv('aes-256-gcm',key(),iv);const encrypted=Buffer.concat([c.update(s,'utf8'),c.final()]);return Buffer.concat([iv,c.getAuthTag(),encrypted]).toString('base64')}
export function decrypt(s:string){const b=Buffer.from(s,'base64'),d=createDecipheriv('aes-256-gcm',key(),b.subarray(0,12));d.setAuthTag(b.subarray(12,28));return Buffer.concat([d.update(b.subarray(28)),d.final()]).toString('utf8')}
