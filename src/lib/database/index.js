/**
 * ============================================================================
 * DATABASE BARREL EXPORT - src/lib/database/index.js
 * ============================================================================
 * File barrel untuk meng-export koneksi database Prisma dari satu tempat.
 * 
 * Dengan file ini, import bisa dilakukan dari folder:
 *   import { prisma } from '@/lib/database'
 * Tapi kebanyakan file langsung import dari prisma.js:
 *   import prisma from '@/lib/database/prisma'
 * 
 * @module DatabaseBarrel
 * ============================================================================
 */

// re-export default export prisma sebagai named export
export { default as prisma } from './prisma.js';
