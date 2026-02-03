import { getUserById, updateUser } from "../../actions"; // Import actions
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditForm } from "./EditForm"; // Kita pisah formnya biar rapi

export default async function EditPage({ params }) {
  // 1. Ambil ID dari URL
  const { id } = params;

  // 2. Ambil data user lama dari database
  const user = await getUserById(id);

  if (!user) {
    return <div>User tidak ditemukan!</div>;
  }

  // 3. Tampilkan Form dengan data user
  return (
    <DashboardLayout activePage="Data User">
      <div style={{ maxWidth: "600px", background: "white", padding: "30px", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
          Edit Pengguna
        </h2>
        {/* Kita lempar data user ke komponen form */}
        <EditForm user={user} />
      </div>
    </DashboardLayout>
  );
}