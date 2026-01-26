"use server";
import prisma from "@/lib/prisma"; // Pastikan path ini benar sesuai projectmu

export async function getDashboardData() {
  // 1. Ambil 5 Transaksi Terakhir
  const transaksiTerbaru = await prisma.tb_transaksi.findMany({
    take: 5, 
    orderBy: {
      waktu_masuk: 'desc', 
    },
    include: {
      tb_user: true, // Untuk ambil nama petugas
      tb_tarif: true // Untuk ambil jenis kendaraan
    }
  });

  // 2. Ambil Statistik (Hitung-hitungan sederhana)
  // Menghitung total pendapatan
  const totalPendapatan = await prisma.tb_transaksi.aggregate({
    _sum: { biaya_total: true }
  });

  // Menghitung jumlah kendaraan yang statusnya masih 'masuk'
  const kendaraanMasuk = await prisma.tb_transaksi.count({
    where: { status: 'masuk' }
  });
  
  // Menghitung total petugas
  const totalPetugas = await prisma.tb_user.count({
    where: { role: 'petugas' }
  });

  return {
    transaksi: transaksiTerbaru,
    stats: {
      pendapatan: totalPendapatan._sum.biaya_total || 0,
      kendaraanMasuk,
      sisaSlot: 112, // Angka statis dulu (nanti kita bikin dinamis)
      totalPetugas
    }
  };
}