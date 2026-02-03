"use server";

// import prisma = koneksi ke database kita
import prisma from "@/lib/prisma";
// revalidatePath = buat refresh data di halaman setelah ada perubahan
import { revalidatePath } from "next/cache";

// ===== FUNGSI UNTUK PROSES KENDARAAN MASUK (CHECK-IN) =====

export async function checkInKendaraan(formData) {
  // ambil data dari form input petugas
  const plat = formData.get("plat_nomor").toUpperCase(); // plat nomor (pastiin uppercase)
  const idTarif = parseInt(formData.get("id_tarif")); // jenis kendaraan & tarifnya
  const idArea = parseInt(formData.get("id_area")); // area parkir yg dipilih
  const idUser = parseInt(formData.get("id_user")); // ID Petugas yg lagi tugas

  // validasi: pastiin semua data terisi
  if (!plat || !idTarif || !idArea) {
    return { success: false, error: "Data tidak lengkap! Mohon isi semua field." };
  }

  try {
    // 1. Simpan data transaksi baru ke database (tb_transaksi)
    await prisma.tb_transaksi.create({
      data: {
        plat_nomor: plat,
        id_tarif: idTarif,
        id_area: idArea,
        id_user: idUser,
        status: "masuk",         // kendaraan baru masuk
        waktu_masuk: new Date(), // catat waktu pas dia masuk
      },
    });

    // 2. Update slot parkir di area tsb (tambah 1 yg terisi)
    await prisma.tb_area_parkir.update({
      where: { id_area: idArea },
      data: { terisi: { increment: 1 } },
    });

    // refresh halaman dashboard petugas biar list terbaru muncul
    revalidatePath("/dashboard/petugas");

    return { success: true };

  } catch (error) {
    // kalo gagal, catat errornya buat debug
    console.error("Kesalahan sistem saat Check-In:", error);
    return { success: false, error: "Gagal memproses check-in. Coba lagi." };
  }
}

// ===== FUNGSI UNTUK CARI KENDARAAN YG SEDANG PARKIR =====

export async function searchKendaraanMasuk(plat) {
  try {
    // cari kendaraan yg statusnya 'masuk' berdasarkan plat nomor
    const data = await prisma.tb_transaksi.findFirst({
      where: {
        plat_nomor: {
          contains: plat.toUpperCase()
        },
        status: 'masuk'
      },
      include: {
        tb_tarif: true, // ambil info biaya per jam
        tb_area_parkir: true // ambil info lokasinya
      }
    });

    // kalo ga ketemu plat nomor yg statusnya masih parkir
    if (!data) {
      return { success: false, error: "Kendaraan tidak ditemukan atau sudah keluar." };
    }

    // KONVERSI DATA: Prisma Decimal ke Javascript Number
    // Penting! Supaya data bisa dikirim dari Server Component ke Client Component
    const safeData = {
      ...data,
      tb_tarif: {
        ...data.tb_tarif,
        tarif_per_jam: parseInt(data.tb_tarif.tarif_per_jam)
      }
    };

    return { success: true, data: safeData };

  } catch (error) {
    console.error("Kesalahan sistem saat mencari kendaraan:", error);
    return { success: false, error: "Terjadi kesalahan server." };
  }
}

// ===== FUNGSI UNTUK PROSES KELOAR (CHECKOUT) =====

export async function checkoutKendaraan(id_parkir, total_bayar, id_area) {
  try {
    // 1. Update data transaksi: set waktu keluar, biaya, & status jadi 'keluar'
    await prisma.tb_transaksi.update({
      where: { id_parkir: parseInt(id_parkir) },
      data: {
        waktu_keluar: new Date(),
        biaya_total: total_bayar,
        status: 'keluar'
      }
    });

    // 2. Update area parkir: kurangi slot terisi (slot kosong lagi)
    await prisma.tb_area_parkir.update({
      where: { id_area: parseInt(id_area) },
      data: {
        terisi: { decrement: 1 }
      }
    });

    // refresh halaman checkout petugas
    revalidatePath("/dashboard/petugas/keluar");
    return { success: true };

  } catch (error) {
    console.error("Kesalahan sistem saat Checkout:", error);
    return { success: false, error: "Gagal memproses checkout." };
  }
}

// ===== FUNGSI AMBIL SEMUA KENDARAAN YG SEDANG PARKIR =====

export async function getParkedVehicles() {
  try {
    // ambil semua kendaraan yg statusnya 'masuk'
    const data = await prisma.tb_transaksi.findMany({
      where: { status: 'masuk' },
      include: {
        tb_tarif: true,
        tb_area_parkir: true
      },
      orderBy: { waktu_masuk: 'desc' } // urutkan dari yg paling baru masuk
    });

    // konversi semua data Decimal ke Number biar aman buat client
    const safeData = data.map(item => ({
      ...item,
      tb_tarif: {
        ...item.tb_tarif,
        tarif_per_jam: Number(item.tb_tarif.tarif_per_jam)
      }
    }));

    return { success: true, data: safeData };
  } catch (error) {
    console.error("Gagal mengambil daftar kendaraan parkir:", error);
    return { success: false, error: "Gagal mengambil data dari server." };
  }
}