"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { GripVertical, Plus, Save, Trash2, Edit2, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

type Tab = {
  id: string;
  title: string;
  sort_order: number;
};

type Service = {
  id: string;
  tab_id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  sort_order: number;
};

export function ServicesEditor({
  initialTabs,
  initialServices
}: {
  initialTabs: Tab[];
  initialServices: Service[];
}) {
  const router = useRouter();
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [activeTabId, setActiveTabId] = useState<string | null>(initialTabs.length > 0 ? initialTabs[0].id : null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal State for adding/editing a Service
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Tab Ekleme State'i
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState("");

  const confirmAddTab = () => {
    if (!newTabTitle.trim()) {
      setIsAddingTab(false);
      return;
    }
    const newId = generateUUID();
    setTabs([...tabs, { id: newId, title: newTabTitle, sort_order: tabs.length }]);
    setActiveTabId(newId);
    setNewTabTitle("");
    setIsAddingTab(false);
  };

  const addTab = () => {
    setIsAddingTab(true);
  };

  const removeTab = (id: string) => {
    if (!confirm("Bu sekmeyi ve içindeki tüm kartları silmek istediğinize emin misiniz?")) return;
    setTabs(tabs.filter(t => t.id !== id));
    setServices(services.filter(s => s.tab_id !== id));
    if (activeTabId === id) setActiveTabId(tabs[0]?.id || null);
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/homepage/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabs, services })
      });
      if (!res.ok) throw new Error("Kaydetme başarısız");
      router.refresh();
      alert("Başarıyla kaydedildi!");
    } catch (err) {
      alert("Hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const openServiceModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
    } else {
      if (!activeTabId) return alert("Önce bir sekme seçin veya oluşturun.");
      setEditingService({
        id: generateUUID(),
        tab_id: activeTabId,
        title: "",
        description: "",
        image: "/images/kamera-sistemi.svg",
        link: "",
        sort_order: services.filter(s => s.tab_id === activeTabId).length
      });
    }
  };

  const saveServiceModal = () => {
    if (!editingService) return;
    if (!editingService.title) return alert("Başlık zorunludur.");
    
    setServices(prev => {
      const exists = prev.find(s => s.id === editingService.id);
      if (exists) {
        return prev.map(s => s.id === editingService.id ? editingService : s);
      } else {
        return [...prev, editingService];
      }
    });
    setEditingService(null);
  };

  const removeService = (id: string) => {
    if (window.confirm("Bu hizmet kartını silmek istediğinize emin misiniz? (Kaydet butonuna basana kadar kalıcı olarak silinmez)")) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const activeServices = services.filter(s => s.tab_id === activeTabId).sort((a, b) => a.sort_order - b.sort_order);

  // Drag and drop for tabs
  const handleTabDrop = (e: React.DragEvent, index: number) => {
    const fromIndex = parseInt(e.dataTransfer.getData("tabIndex"));
    if (isNaN(fromIndex) || fromIndex === index) return;
    const newTabs = [...tabs];
    const [moved] = newTabs.splice(fromIndex, 1);
    newTabs.splice(index, 0, moved);
    newTabs.forEach((t, i) => t.sort_order = i);
    setTabs(newTabs);
  };

  // Drag and drop for services
  const handleServiceDrop = (e: React.DragEvent, index: number) => {
    const fromId = e.dataTransfer.getData("serviceId");
    if (!fromId) return;
    
    const newServices = [...services];
    const fromIndex = newServices.findIndex(s => s.id === fromId);
    if (fromIndex === -1) return;
    
    // We only reorder within the active tab visually, but we need to update global state
    const tabServices = newServices.filter(s => s.tab_id === activeTabId).sort((a, b) => a.sort_order - b.sort_order);
    const itemToMove = tabServices.find(s => s.id === fromId);
    if (!itemToMove) return;
    
    const currentList = tabServices.filter(s => s.id !== fromId);
    currentList.splice(index, 0, itemToMove);
    
    currentList.forEach((s, i) => {
      const globalIndex = newServices.findIndex(ns => ns.id === s.id);
      newServices[globalIndex].sort_order = i;
    });
    
    setServices(newServices);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500 font-semibold">Ana sayfa hizmetler bölümündeki kategorileri ve kartları yönetin.</p>
        <button
          onClick={saveChanges}
          disabled={isSaving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black transition-colors disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Değişiklikleri Kaydet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl border-2 border-slate-200 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-black text-slate-800">Sekmeler</h3>
            <button onClick={addTab} className="p-1.5 bg-cyan-100 text-cyan-700 hover:bg-cyan-200 rounded-md transition-colors" title="Sekme Ekle">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isAddingTab && (
              <div className="p-3 border-2 border-cyan-400 bg-cyan-50 rounded-xl flex gap-2">
                <input 
                  autoFocus
                  type="text" 
                  value={newTabTitle}
                  onChange={e => setNewTabTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && confirmAddTab()}
                  placeholder="Sekme Adı" 
                  className="w-full bg-white border border-cyan-200 rounded text-sm px-2 py-1 outline-none focus:border-cyan-500"
                />
                <button onClick={confirmAddTab} className="bg-cyan-600 text-white px-3 py-1 rounded font-bold text-xs hover:bg-cyan-700">Ekle</button>
              </div>
            )}
            {[...tabs].sort((a,b) => a.sort_order - b.sort_order).map((tab, index) => (
              <div
                key={tab.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("tabIndex", index.toString())}
                onDrop={(e) => handleTabDrop(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => setActiveTabId(tab.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${activeTabId === tab.id ? "bg-cyan-50 border-cyan-200 border-2" : "hover:bg-slate-50 border-2 border-transparent"}`}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-slate-300 cursor-move" />
                  <span className="font-bold text-slate-700 text-sm">{tab.title}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeTab(tab.id); }} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cards Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border-2 border-slate-200 overflow-hidden flex flex-col h-[600px]">
          {activeTabId ? (
            <>
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-black text-slate-800">
                  {tabs.find(t => t.id === activeTabId)?.title} - Hizmet Kartları ({activeServices.length})
                </h3>
                <button
                  onClick={() => openServiceModal()}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Kart Ekle
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {activeServices.length === 0 && (
                  <p className="text-center text-slate-500 py-12">Bu sekmede henüz kart yok.</p>
                )}
                {activeServices.map((service, index) => (
                  <div
                    key={service.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("serviceId", service.id)}
                    onDrop={(e) => handleServiceDrop(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex items-start gap-4 bg-white border border-slate-200 p-4 rounded-xl cursor-move hover:border-cyan-400 transition-colors"
                  >
                    <div className="text-slate-300 mt-2">
                      <GripVertical className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800 text-base">{service.title}</p>
                      <p className="text-sm text-slate-500 line-clamp-2 mt-1">{service.description}</p>

                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => openServiceModal(service)} className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button onClick={() => removeService(service.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Sol taraftan bir sekme seçin.
            </div>
          )}
        </div>
      </div>

      {/* Service Modal */}
      {editingService && (
        <div className="fixed inset-0 lg:left-72 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-black text-slate-800 mb-6">Hizmet Kartı Düzenle</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Başlık</label>
                  <input
                    type="text"
                    value={editingService.title}
                    onChange={e => setEditingService({...editingService, title: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:border-cyan-500 outline-none"
                    placeholder="CCTV Kamera"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Açıklama</label>
                  <textarea
                    value={editingService.description}
                    onChange={e => setEditingService({...editingService, description: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:border-cyan-500 outline-none resize-none h-24"
                    placeholder="Yüksek çözünürlüklü kamera sistemleri..."
                  />
                </div>


              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end">
              <button
                onClick={() => setEditingService(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={saveServiceModal}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
