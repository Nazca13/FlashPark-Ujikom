"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- USER ACTIONS ---
export async function createUser(formData) {
  const nama = formData.get("nama");
  const username = formData.get("username");
  const password = formData.get("password");
  const role = formData.get("role");

  try {
    await prisma.tb_user.create({
      data: { nama_lengkap: nama, username, password, role }
    });
    revalidatePath("/dashboard/admin/users");
  } catch (e) {
    console.error("Gagal tambah user", e);
  }
}

export async function deleteUser(formData) {
  const id = parseInt(formData.get("id_user"));
  await prisma.tb_user.delete({ where: { id_user: id } });
  revalidatePath("/dashboard/admin/users");
}

// --- TARIF ACTIONS ---
export async function createTarif(formData) {
  const jenis = formData.get("jenis");
  const tarif = parseInt(formData.get("tarif"));

  await prisma.tb_tarif.create({
    data: { jenis_kendaraan: jenis, tarif_per_jam: tarif }
  });
  revalidatePath("/dashboard/admin/tarif");
}

export async function deleteTarif(formData) {
  const id = parseInt(formData.get("id_tarif"));
  await prisma.tb_tarif.delete({ where: { id_tarif: id } });
  revalidatePath("/dashboard/admin/tarif");
}

// --- DASHBOARD DATA ---
export async function getDashboardData(params = {}) {
  const { query, date, vehicle } = params;

  // Build Filter
  const whereClause = {};

  if (query) {
    whereClause.plat_nomor = { contains: query };
  }

  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    whereClause.waktu_masuk = {
      gte: startDate,
      lte: endDate
    };
  }

  if (vehicle && vehicle !== 'Semua') {
    whereClause.tb_tarif = {
      jenis_kendaraan: vehicle
    };
  }

  // 1. Ambil 5 Transaksi Terakhir (Filtered)
  const transaksiTerbaru = await prisma.tb_transaksi.findMany({
    where: whereClause,
    take: 5,
    orderBy: {
      waktu_masuk: 'desc',
    },
    include: {
      tb_user: true, // Untuk ambil nama petugas
      tb_tarif: true // Untuk ambil jenis kendaraan
    }
  });

  // 2. Ambil Statistik (Global / Unfiltered)
  const totalPendapatan = await prisma.tb_transaksi.aggregate({
    _sum: { biaya_total: true }
  });

  const kendaraanMasuk = await prisma.tb_transaksi.count({
    where: { status: 'masuk' }
  });

  const totalPetugas = await prisma.tb_user.count({
    where: { role: 'petugas' }
  });

  return {
    transaksi: transaksiTerbaru,
    stats: {
      pendapatan: totalPendapatan._sum.biaya_total || 0,
      kendaraanMasuk,
      sisaSlot: 112, // Placeholder
      totalPetugas
    }
  };
}