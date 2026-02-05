// ini artinya fungsi ini jalan di server, bukan di browser
"use server";

// import prisma = koneksi ke database
import prisma from "@/lib/database/prisma";

// revalidatePath = buat refresh data di halaman setelah ada perubahan
import { revalidatePath } from "next/cache";

// ===== FUNGSI-FUNGSI BUAT KELOLA USER (PETUGAS) =====

// fungsi bikin user baru
// dipanggil pas admin klik tombol "tambah user"
export async function createUser(formData) {
  // ambil data dari form
  const nama = formData.get("nama"); // nama lengkap
  const username = formData.get("username"); // username buat login
  const password = formData.get("password"); // password
  const role = formData.get("role"); // role (admin/petugas/owner)

  try {
    // masukin data ke tabel tb_user
    await prisma.tb_user.create({
      data: { nama_lengkap: nama, username, password, role }
    });

    // refresh halaman users biar data baru muncul
    revalidatePath("/dashboard/admin/users");
  } catch (e) {
    // kalo gagal, log error nya
    console.error("Gagal tambah user", e);
  }
}

// fungsi hapus user
// dipanggil pas admin klik tombol "hapus"
export async function deleteUser(formData) {
  // ambil id user yg mau dihapus
  const id = parseInt(formData.get("id_user"));

  // hapus dari database
  await prisma.tb_user.delete({ where: { id_user: id } });

  // refresh halaman
  revalidatePath("/dashboard/admin/users");
}

// ===== FUNGSI-FUNGSI BUAT KELOLA TARIF PARKIR =====

// fungsi bikin tarif baru
export async function createTarif(formData) {
  const jenis = formData.get("jenis"); // jenis kendaraan (motor/mobil/dll)
  const tarif = parseInt(formData.get("tarif")); // harga per jam

  // masukin ke tabel tb_tarif
  await prisma.tb_tarif.create({
    data: { jenis_kendaraan: jenis, tarif_per_jam: tarif }
  });

  // refresh halaman tarif
  revalidatePath("/dashboard/admin/tarif");
}

// fungsi hapus tarif
export async function deleteTarif(formData) {
  const id = parseInt(formData.get("id_tarif"));

  await prisma.tb_tarif.delete({ where: { id_tarif: id } });

  revalidatePath("/dashboard/admin/tarif");
}

// ===== FUNGSI AMBIL DATA BUAT DASHBOARD ADMIN =====

// fungsi ini dipanggil buat nampilin statistik di dashboard
export async function getDashboardData(params = {}) {
  // params = filter dari user (plat nomor, tanggal, jenis kendaraan)
  const { query, date, vehicle } = params;

  // siapkan filter query ke database
  const whereClause = {};

  // kalo ada pencarian plat nomor
  if (query) {
    whereClause.plat_nomor = { contains: query };
  }

  // kalo ada filter tanggal
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // mulai dari jam 00:00
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // sampe jam 23:59

    whereClause.waktu_masuk = {
      gte: startDate, // gte = greater than or equal (>=)
      lte: endDate // lte = less than or equal (<=)
    };
  }

  // kalo ada filter jenis kendaraan
  if (vehicle && vehicle !== 'Semua') {
    whereClause.tb_tarif = {
      jenis_kendaraan: vehicle
    };
  }

  // ambil 5 transaksi terbaru (dengan filter)
  const transaksiTerbaru = await prisma.tb_transaksi.findMany({
    where: whereClause,
    take: 5, // ambil 5 aja
    orderBy: {
      waktu_masuk: 'desc', // urutkan dari yg terbaru
    },
    include: {
      tb_user: true, // sekalian ambil data petugas
      tb_tarif: true // sekalian ambil data tarif
    }
  });

  // hitung total pendapatan (semua transaksi, ga difilter)
  const totalPendapatan = await prisma.tb_transaksi.aggregate({
    _sum: { biaya_total: true } // jumlahkan kolom biaya_total
  });

  // hitung berapa kendaraan yg lagi parkir (status = masuk)
  const kendaraanMasuk = await prisma.tb_transaksi.count({
    where: { status: 'masuk' }
  });

  // hitung total petugas
  const totalPetugas = await prisma.tb_user.count({
    where: { role: 'petugas' }
  });

  // hitung sisa slot parkir (kapasitas total - terisi)
  const areaData = await prisma.tb_area_parkir.aggregate({
    _sum: {
      kapasitas: true, // total slot semua area
      terisi: true // total slot yang terisi
    }
  });

  // sisa slot = kapasitas total - terisi
  const sisaSlot = (areaData._sum.kapasitas || 0) - (areaData._sum.terisi || 0);

  // return semua data buat ditampilin di dashboard
  return {
    transaksi: transaksiTerbaru,
    stats: {
      pendapatan: totalPendapatan._sum.biaya_total || 0,
      kendaraanMasuk,
      sisaSlot, // pake data real dari database
      totalPetugas
    }
  };
}