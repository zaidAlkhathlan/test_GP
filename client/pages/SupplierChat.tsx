import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';

interface ChatMessage {
  id: string;
  sender: 'supplier' | 'buyer';
  message: string;
  timestamp: string;
  senderName: string;
}

export default function SupplierChat() {
  const { id } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'buyer',
      message: 'مرحباً، يمكنك طرح أي استفسارات حول المناقصة هنا',
      timestamp: '10:00 AM',
      senderName: 'منسق المناقصة'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [supplierName, setSupplierName] = useState('');

  useEffect(() => {
    // Get supplier name from localStorage
    const supplierSession = localStorage.getItem('currentSupplier') || localStorage.getItem('supplierSession');
    if (supplierSession) {
      try {
        const supplierData = JSON.parse(supplierSession);
        setSupplierName(supplierData.company_name || supplierData.account_name || 'مورد');
      } catch (error) {
        setSupplierName('مورد');
      }
    }
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `m${Date.now()}`,
      sender: 'supplier',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      senderName: supplierName
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header userType="supplier" />
      <div className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">استفسارات المناقصة</h1>
              <p className="text-gray-600 mt-1">تواصل مباشر مع منسق المناقصة #{id}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to={`/tender/${id}`} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                العودة للتفاصيل
              </Link>
              <Link 
                to={`/tender/${id}/quires`} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                الاستفسارات العامة
              </Link>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
          
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-tawreed-green rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-gray-900">منسق المناقصة</h3>
                <p className="text-sm text-green-600">متصل الآن</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'supplier' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'supplier'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-tawreed-green text-white'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'supplier' ? 'text-gray-500' : 'text-green-100'
                    }`}
                  >
                    {message.senderName} • {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-tawreed-green text-white rounded-lg hover:bg-green-600 flex-shrink-0"
              >
                إرسال
              </button>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب استفسارك هنا..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent resize-none"
                rows={2}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">
              اضغط Enter للإرسال أو Shift+Enter لسطر جديد
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}