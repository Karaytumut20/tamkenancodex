"use client";

import { useState } from "react";
import { Clock, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { AppointmentModal } from "../modals/AppointmentModal";



export function TodayProgramList({
  todayProgram,
  customers,
  employees
}: { todayProgram: any[], customers: any[], employees: any[] }) {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (app: any) => {
    setSelectedAppointment(app);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  return (
    <>
      <section className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Clock className="h-5 w-5 text-rose-500" /> Bugünün Programı
          </h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{todayProgram.length} İş</span>
        </div>

        {todayProgram.length === 0 ? (
          <div className="py-8 text-center text-sm font-semibold text-slate-400">
            Bugün için planlanmış randevu bulunmamaktadır.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {todayProgram.map((app) => (
              <div 
                key={app.id} 
                onClick={() => openModal(app)}
                className="py-3 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors px-2 rounded-lg -mx-2"
              >
                <div>
                  <p className="font-extrabold text-sm text-slate-800">{app.customer?.name}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {app.service_type} &bull; {app.start_time.substring(0, 5)} - {app.end_time.substring(0, 5)}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appointment={selectedAppointment}
          customers={customers}
          employees={employees}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}

export function UpcomingAppointmentsList({
  upcomingAppointments,
  customers,
  employees
}: { upcomingAppointments: any[], customers: any[], employees: any[] }) {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (app: any) => {
    setSelectedAppointment(app);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  return (
    <>
      <section className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-cyan-600" /> Yaklaşan Randevular
          </h3>
          <Link href="/admin/calendar" className="text-xs font-black text-cyan-600 hover:text-cyan-700">Takvim →</Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="py-8 text-center text-sm font-semibold text-slate-400">
            Gelecek günlerde planlanmış randevu bulunmamaktadır.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {upcomingAppointments.map((app) => (
              <div 
                key={app.id} 
                onClick={() => openModal(app)}
                className="py-3 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors px-2 rounded-lg -mx-2"
              >
                <div>
                  <p className="font-extrabold text-sm text-slate-800">{app.customer?.name}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {app.service_type} - {app.appointment_date} @ {app.start_time.substring(0, 5)}
                  </p>
                </div>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  app.priority === 'acil' ? 'bg-red-50 text-red-600 border border-red-200' :
                  app.priority === 'önemli' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                  'bg-slate-50 text-slate-600 border border-slate-200'
                } shrink-0`}>
                  {app.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appointment={selectedAppointment}
          customers={customers}
          employees={employees}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}

export function DelayedJobsList({
  delayedJobs,
  customers,
  employees
}: { delayedJobs: any[], customers: any[], employees: any[] }) {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (app: any) => {
    setSelectedAppointment(app);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  return (
    <>
      <section className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" /> Geciken İşler
          </h3>
          <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">{delayedJobs.length} Geciken</span>
        </div>

        {delayedJobs.length === 0 ? (
          <div className="py-8 text-center text-sm font-semibold text-slate-400">
            Günü geçmiş açık randevu veya tamamlanmamış iş bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {delayedJobs.map((app) => (
              <div 
                key={app.id} 
                onClick={() => openModal(app)}
                className="py-3 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors px-2 rounded-lg -mx-2"
              >
                <div>
                  <p className="font-extrabold text-sm text-slate-800">{app.customer?.name}</p>
                  <p className="text-xs font-semibold text-red-500 mt-0.5">
                    Tarih: {app.appointment_date} @ {app.start_time.substring(0, 5)}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appointment={selectedAppointment}
          customers={customers}
          employees={employees}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
