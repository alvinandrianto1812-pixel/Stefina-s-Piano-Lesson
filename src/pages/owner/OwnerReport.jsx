// src/pages/owner/OwnerReport.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function OwnerReport() {
  const [filterBulan, setFilterBulan] = useState(
    () => new Date().toISOString().slice(0, 7) // "YYYY-MM"
  );

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    totalOmset: 0,
    totalPengeluaran: 0,
    keuntunganBersih: 0,
    transactions: [],
  });

  useEffect(() => {
    fetchReport();
  }, [filterBulan]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReport = async () => {
    setLoading(true);
    try {
      // Only run if filterBulan is exactly YYYY-MM
      if (!/^\d{4}-\d{2}$/.test(filterBulan)) {
        setLoading(false);
        return;
      }
      const [year, month] = filterBulan.split("-");
      const dateFrom = `${year}-${month}-01T00:00:00Z`;
      
      // Calculate next month's 1st date for "less than" boundary
      const dateToRaw = new Date(parseInt(year, 10), parseInt(month, 10), 1);
      const yTo = dateToRaw.getFullYear();
      const mTo = String(dateToRaw.getMonth() + 1).padStart(2, '0');
      const dateTo = `${yTo}-${mTo}-01T00:00:00Z`;

      // 1. Fetch Pemasukan (Payments verified)
      const { data: payments, error: errPay } = await supabase
        .from("payments")
        .select("id, amount, created_at, status")
        .eq("status", "verified")
        .gte("created_at", dateFrom)
        .lt("created_at", dateTo);
      if (errPay) throw errPay;

      // 2. Fetch Finance Records (income, outcome, salary)
      // record_date is just 'date', so we use string comparison.
      const dateFromDate = `${year}-${month}-01`;
      const dateToDate = new Date(+year, +month, 0).toISOString().slice(0, 10);
      const { data: records, error: errRec } = await supabase
        .from("finance_records")
        .select("id, type, amount, record_date, description")
        .gte("record_date", dateFromDate)
        .lte("record_date", dateToDate);
      if (errRec) throw errRec;

      // 3. Fetch Presensi for Salary (Rp 200.000 per hadir)
      const { data: presensi, error: errPres } = await supabase
        .from("presensi_guru")
        .select("id, tanggal, hadir, teachers(name)")
        .eq("hadir", true)
        .gte("tanggal", dateFromDate)
        .lte("tanggal", dateToDate);
      if (errPres) throw errPres;

      // Calculate Omset and Pengeluaran
      let sumOmset = 0;
      let sumPengeluaran = 0;
      const combinedTrans = [];

      // Process Payments as Income
      for (const p of payments || []) {
        const amt = parseFloat(p.amount || 0);
        sumOmset += amt;
        combinedTrans.push({
          id: p.id,
          date: new Date(p.created_at),
          type: "income",
          description: "Pembayaran Siswa (Verified)",
          amount: amt,
        });
      }

      // Process Finance Records
      for (const r of records || []) {
        const amt = parseFloat(r.amount || 0);
        if (r.type === "income") {
          sumOmset += amt;
          combinedTrans.push({
            id: r.id,
            date: new Date(r.record_date),
            type: "income",
            description: r.description || "Pemasukan Lainnya",
            amount: amt,
          });
        } else if (r.type === "outcome" || r.type === "salary") {
          sumPengeluaran += amt;
          combinedTrans.push({
            id: r.id,
            date: new Date(r.record_date),
            type: r.type,
            description: r.description || "Pengeluaran",
            amount: amt,
          });
        }
      }

      // Process Presensi as Salary
      for (const pr of presensi || []) {
        const amt = 200000; // Rp 200.000 / sesi ajar
        sumPengeluaran += amt;
        combinedTrans.push({
          id: `pr-${pr.id}`,
          date: new Date(pr.tanggal),
          type: "salary",
          description: `Gaji Ajar: ${pr.teachers?.name || "Guru"} (Presensi)`,
          amount: amt,
        });
      }

      // Sort combined descending by date
      combinedTrans.sort((a, b) => b.date - a.date);

      setReportData({
        totalOmset: sumOmset,
        totalPengeluaran: sumPengeluaran,
        keuntunganBersih: sumOmset - sumPengeluaran,
        transactions: combinedTrans,
      });

    } catch (err) {
      console.error("fetchReport error:", err);
      alert("Gagal memuat laporan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fmtRupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");
  const fmtDate = (d) => new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric"
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Financial Report</h1>
          <p className="text-slate-500 text-sm mt-1">Ringkasan Omset & Pengeluaran Khusus Owner</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm w-fit">
          <span className="text-sm font-medium text-slate-600">Bulan:</span>
          <input
            type="month"
            value={filterBulan}
            onChange={(e) => setFilterBulan(e.target.value)}
            className="px-2 py-1 border-none focus:ring-0 text-sm font-semibold text-[#272925] bg-transparent cursor-pointer"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-pulse flex items-center space-x-2 text-slate-400">
            <div className="w-4 h-4 rounded-full bg-slate-300"></div>
            <div className="w-4 h-4 rounded-full bg-slate-300"></div>
            <div className="w-4 h-4 rounded-full bg-slate-300"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {/* Omset */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-green-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.7c.09 1.28 1.07 1.67 2.18 1.67 1.2 0 2.03-.49 2.03-1.45 0-.74-.46-1.22-1.91-1.55-1.73-.4-3.32-1.11-3.32-3.03 0-1.7 1.36-2.59 2.6-2.87V5.5h2.67v1.88c1.5.3 2.68 1.16 2.8 2.87h-1.68c-.1-1.15-.97-1.51-2.08-1.51-1 0-1.91.43-1.91 1.34 0 .7.42 1.13 1.8 1.45 1.83.43 3.44 1.15 3.44 3.14 0 1.95-1.48 2.76-2.88 3.01z"/></svg>
              </div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Total Pemasukan (Omset)</p>
              <h2 className="text-3xl font-bold text-green-600 tracking-tight relative z-10">{fmtRupiah(reportData.totalOmset)}</h2>
            </div>
            
            {/* Pengeluaran */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-red-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.7c.09 1.28 1.07 1.67 2.18 1.67 1.2 0 2.03-.49 2.03-1.45 0-.74-.46-1.22-1.91-1.55-1.73-.4-3.32-1.11-3.32-3.03 0-1.7 1.36-2.59 2.6-2.87V5.5h2.67v1.88c1.5.3 2.68 1.16 2.8 2.87h-1.68c-.1-1.15-.97-1.51-2.08-1.51-1 0-1.91.43-1.91 1.34 0 .7.42 1.13 1.8 1.45 1.83.43 3.44 1.15 3.44 3.14 0 1.95-1.48 2.76-2.88 3.01z"/></svg>
              </div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Total Pengeluaran</p>
              <h2 className="text-3xl font-bold text-red-500 tracking-tight relative z-10">{fmtRupiah(reportData.totalPengeluaran)}</h2>
            </div>
            
            {/* Laba Bersih */}
            <div className="bg-gradient-to-br from-[#272925] to-[#50553C] rounded-2xl p-5 shadow-[0_8px_30px_-4px_rgba(39,41,37,0.4)] border border-[#272925] relative overflow-hidden group">
              <div className="absolute -bottom-6 -right-6 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500 pointer-events-none">
                <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </div>
              <p className="text-sm font-medium text-[#D1A799] uppercase tracking-wider mb-2 relative z-10">Keuntungan Bersih</p>
              <h2 className={`text-3xl font-bold tracking-tight relative z-10 ${reportData.keuntunganBersih < 0 ? 'text-red-300' : 'text-[#F8F6ED]'}`}>
                {fmtRupiah(reportData.keuntunganBersih)}
              </h2>
            </div>
          </div>

          {/* Transactions Ledger */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-semibold text-slate-800">Buku Besar Transaksi</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#F8F6ED] text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wide">Tanggal</th>
                    <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wide">Tipe</th>
                    <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wide">Deskripsi</th>
                    <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wide text-right">Debit (Masuk)</th>
                    <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wide text-right">Kredit (Keluar)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportData.transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        Tidak ada transaksi di bulan ini.
                      </td>
                    </tr>
                  ) : (
                    reportData.transactions.map((t, idx) => {
                      const isIncome = t.type === "income";
                      return (
                        <tr key={`${t.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-3 whitespace-nowrap text-slate-500 font-medium">
                            {fmtDate(t.date)}
                          </td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isIncome ? "bg-green-50 text-green-600 border border-green-100" :
                              t.type === "salary" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                              "bg-red-50 text-red-600 border border-red-100"
                            }`}>
                              {t.type}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-slate-800">
                            {t.description}
                          </td>
                          <td className="px-6 py-3 text-right font-semibold text-green-600">
                            {isIncome ? fmtRupiah(t.amount) : "—"}
                          </td>
                          <td className="px-6 py-3 text-right font-semibold text-red-500">
                            {!isIncome ? fmtRupiah(t.amount) : "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
