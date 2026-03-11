/**
 * ============================================================================
 * TEST ROUTE PAGE - src/app/test-route/page.js
 * ============================================================================
 * Halaman ini dibuat khusus untuk testing routing Next.js.
 * Kalau halaman ini bisa dibuka di browser (localhost:3000/test-route),
 * berarti sistem routing Next.js berjalan dengan benar.
 * 
 * Halaman ini TIDAK dipakai di production, hanya untuk development/debugging.
 * 
 * @module TestPage
 * @path /test-route
 * ============================================================================
 */

/**
 * TestPage - Komponen Halaman Test Routing
 * 
 * Menampilkan pesan sederhana untuk mengonfirmasi bahwa routing berfungsi.
 * 
 * @returns {JSX.Element} - Div berisi heading dan paragraph konfirmasi
 */
export default function TestPage() {
    return (
        // container sederhana dengan padding 20px
        <div style={{ padding: '20px' }}>
            {/* judul untuk konfirmasi */}
            <h1>Testing Routing</h1>
            {/* pesan konfirmasi kalau routing berhasil */}
            <p>If you see this, routing is working.</p>
        </div>
    );
}
