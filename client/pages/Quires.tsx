import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';

interface Inquiry {
  id: string;
  supplier: string;
  message: string;
  time: string;
  answered?: boolean;
  answer?: string;
}

export default function Quires() {
  const { id } = useParams();
  const [inquiries, setInquiries] = useState<Inquiry[]>([
    { id: 'q1', supplier: 'شركة الفارس', message: 'هل يمكن تمديد الموعد أسبوعاً؟', time: '10:05 AM' },
    { id: 'q2', supplier: 'مؤسسة النور', message: 'هل تقبلون عروضاً بنظام الدفع على أقساط؟', time: '09:20 AM' },
    { id: 'q3', supplier: 'الورشة المتحدة', message: 'ما هو حجم الموقع المراد بناؤه؟', time: '08:12 AM' }
  ]);

  const [reply, setReply] = useState('');
  const [activeId, setActiveId] = useState<string | null>(inquiries[0]?.id ?? null);

  function sendAnswer() {
    if (!activeId) return;
    setInquiries((prev) => prev.map((iq) => (iq.id === activeId ? { ...iq, answered: true, answer: reply } : iq)));
    setReply('');
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header userType="buyer" />
      <div className="max-w-[1100px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">الاستفسارات {id ? `- #${id}` : ''}</h1>
            <p className="text-sm text-gray-500">قائمة الاستفسارات الواردة من الموردين للمناقصة. اجب عن الاستفسارات لتوضيح المتطلبات.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to={`/tender/${id ?? ''}`} className="px-3 py-2 border rounded">عودة للتفاصيل</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1 bg-white rounded shadow p-4">
            <h4 className="text-right font-semibold mb-3">قائمة الموردين</h4>
            <div className="space-y-2">
              {inquiries.map((iq) => (
                <button
                  key={iq.id}
                  onClick={() => setActiveId(iq.id)}
                  className={`w-full text-right px-3 py-2 rounded ${activeId === iq.id ? 'bg-tawreed-green text-white' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">{iq.supplier}</div>
                    <div className="text-xs text-gray-500">{iq.time}</div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <main className="lg:col-span-2">
            <div className="bg-white rounded shadow p-4 mb-4">
              <h4 className="text-right font-semibold">تفاصيل الاستفسار</h4>
              <div className="mt-4">
                {inquiries.map((iq) => (
                  <div key={iq.id} className={`${activeId === iq.id ? '' : 'hidden'}`}>
                    <div className="text-right text-sm text-gray-600">من: {iq.supplier} — {iq.time}</div>
                    <div className="mt-2 p-4 bg-gray-50 rounded text-right">{iq.message}</div>

                    {iq.answered && (
                      <div className="mt-3 p-4 bg-green-50 rounded text-right">
                        <div className="text-sm text-gray-700">إجابتك:</div>
                        <div className="mt-2 text-right">{iq.answer}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h5 className="text-right font-semibold">أجب على الاستفسار</h5>
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="أدخل إجابتك هنا" className="w-full mt-3 border rounded px-3 py-2" rows={4} />
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-500">سيتم إرسال الإجابة إلى المورد تلقائياً</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setReply('')} className="px-4 py-2 border rounded">مسح</button>
                  <button onClick={sendAnswer} className="px-4 py-2 bg-tawreed-green text-white rounded">إرسال الإجابة</button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
