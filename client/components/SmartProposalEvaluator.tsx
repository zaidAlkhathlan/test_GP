import React, { useState } from 'react';

interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  score: number | null;
  maxScore: number;
  details: string[];
  status: 'not-evaluated' | 'evaluating' | 'completed';
}

interface SmartProposalEvaluatorProps {
  proposalId: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartProposalEvaluator({ 
  proposalId, 
  companyName, 
  isOpen, 
  onClose 
}: SmartProposalEvaluatorProps) {
  const [evaluationStatus, setEvaluationStatus] = useState<'not-started' | 'evaluating' | 'completed'>('not-started');
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>([
    {
      id: 'technical',
      name: 'التقييم الفني',
      weight: 40,
      score: null,
      maxScore: 100,
      details: [],
      status: 'not-evaluated'
    },
    {
      id: 'financial',
      name: 'التقييم المالي',
      weight: 35,
      score: null,
      maxScore: 100,
      details: [],
      status: 'not-evaluated'
    },
    {
      id: 'experience',
      name: 'الخبرة والمؤهلات',
      weight: 15,
      score: null,
      maxScore: 100,
      details: [],
      status: 'not-evaluated'
    },
    {
      id: 'timeline',
      name: 'الجدولة الزمنية',
      weight: 10,
      score: null,
      maxScore: 100,
      details: [],
      status: 'not-evaluated'
    }
  ]);

  const startEvaluation = async () => {
    setEvaluationStatus('evaluating');
    
    // Simulate API call for AI evaluation
    // In real implementation, this would call your AI evaluation service
    setTimeout(() => {
      const mockEvaluationResults: EvaluationCriteria[] = [
        {
          id: 'technical',
          name: 'التقييم الفني',
          weight: 40,
          score: 85,
          maxScore: 100,
          details: [
            'المواصفات التقنية تتوافق مع متطلبات المناقصة',
            'الحلول المقترحة مبتكرة وقابلة للتطبيق',
            'يحتاج إلى توضيح أكثر في بعض النقاط التقنية'
          ],
          status: 'completed'
        },
        {
          id: 'financial',
          name: 'التقييم المالي',
          weight: 35,
          score: 78,
          maxScore: 100,
          details: [
            'السعر المقترح ضمن النطاق المتوقع',
            'تفاصيل التكلفة واضحة ومفصلة',
            'يمكن تحسين بعض بنود التسعير'
          ],
          status: 'completed'
        },
        {
          id: 'experience',
          name: 'الخبرة والمؤهلات',
          weight: 15,
          score: 92,
          maxScore: 100,
          details: [
            'الشركة لديها خبرة واسعة في مجال المناقصة',
            'المراجع المقدمة ممتازة',
            'فريق العمل مؤهل ومناسب للمشروع'
          ],
          status: 'completed'
        },
        {
          id: 'timeline',
          name: 'الجدولة الزمنية',
          weight: 10,
          score: 75,
          maxScore: 100,
          details: [
            'الجدول الزمني المقترح منطقي',
            'يحتاج إلى تعديل طفيف في بعض المراحل',
            'مراحل التسليم واضحة'
          ],
          status: 'completed'
        }
      ];

      setCriteria(mockEvaluationResults);
      setEvaluationStatus('completed');
    }, 3000);
  };

  const calculateOverallScore = () => {
    if (evaluationStatus !== 'completed') return 0;
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    criteria.forEach(criterion => {
      if (criterion.score !== null) {
        totalWeightedScore += (criterion.score * criterion.weight) / 100;
        totalWeight += criterion.weight;
      }
    });
    
    return totalWeight > 0 ? Math.round(totalWeightedScore) : 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      {/* Side Panel */}
      <div className="relative bg-white h-full w-full max-w-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white" dir="rtl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">مقيم العروض الذكي</h3>
                <p className="text-purple-100 text-sm">{companyName}</p>
              </div>
            </div>
            <button 
              className="p-2 hover:bg-white/20 rounded-lg transition-colors" 
              onClick={onClose}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20" dir="rtl">
          
          {/* Overall Score Card - Only show when completed */}
          {evaluationStatus === 'completed' && (
            <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full text-white text-2xl font-bold mb-4">
                  {calculateOverallScore()}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">النتيجة الإجمالية</h4>
                <p className="text-gray-600">من 100 درجة</p>
                
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    calculateOverallScore() >= 85 ? 'bg-green-100 text-green-800' :
                    calculateOverallScore() >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {calculateOverallScore() >= 85 ? 'ممتاز' :
                     calculateOverallScore() >= 70 ? 'جيد' : 'يحتاج تحسين'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Evaluation Status */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">حالة التقييم</h4>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                evaluationStatus === 'not-started' ? 'bg-gray-100 text-gray-700' :
                evaluationStatus === 'evaluating' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {evaluationStatus === 'not-started' ? 'لم يبدأ' :
                 evaluationStatus === 'evaluating' ? 'جاري التقييم...' :
                 'مكتمل'}
              </div>
            </div>

            {evaluationStatus === 'not-started' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h5 className="text-lg font-semibold text-gray-900 mb-2">جاهز للتقييم</h5>
                <p className="text-gray-600 mb-6">اضغط على "بدء التقييم" لتحليل العرض باستخدام الذكاء الاصطناعي</p>
                <button 
                  onClick={startEvaluation}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  بدء التقييم
                </button>
              </div>
            )}

            {evaluationStatus === 'evaluating' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h5 className="text-lg font-semibold text-gray-900 mb-2">جاري التحليل...</h5>
                <p className="text-gray-600">يتم تحليل العرض باستخدام الذكاء الاصطناعي</p>
              </div>
            )}
          </div>

          {/* Evaluation Criteria */}
          {evaluationStatus !== 'not-started' && (
            <div className="p-6">
              <h4 className="text-lg font-semibold mb-6">معايير التقييم</h4>
              
              <div className="space-y-6">
                {criteria.map((criterion, index) => (
                  <div key={criterion.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    
                    {/* Criterion Header */}
                    <div className="bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            criterion.status === 'completed' ? 'bg-green-100' :
                            criterion.status === 'evaluating' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}>
                            {criterion.status === 'completed' ? (
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : criterion.status === 'evaluating' ? (
                              <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <span className="text-gray-400 font-bold">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <h5 className="font-semibold">{criterion.name}</h5>
                            <p className="text-sm text-gray-500">وزن: {criterion.weight}%</p>
                          </div>
                        </div>
                        
                        {criterion.score !== null && (
                          <div className="text-left">
                            <div className={`text-2xl font-bold ${
                              criterion.score >= 85 ? 'text-green-600' :
                              criterion.score >= 70 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {criterion.score}
                            </div>
                            <p className="text-sm text-gray-500">من {criterion.maxScore}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Criterion Details */}
                    {criterion.status === 'completed' && criterion.details.length > 0 && (
                      <div className="p-4 bg-white">
                        <h6 className="font-medium text-gray-900 mb-3">تفاصيل التقييم:</h6>
                        <div className="space-y-2">
                          {criterion.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              </div>
                              <span className="text-gray-700 text-sm">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    {criterion.score !== null && (
                      <div className="px-4 pb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              criterion.score >= 85 ? 'bg-green-500' :
                              criterion.score >= 70 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${criterion.score}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights Section - Only show when completed */}
          {evaluationStatus === 'completed' && (
            <div className="p-6 border-t bg-blue-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-blue-900">رؤى الذكاء الاصطناعي</h4>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">هذا العرض يحتوي على حلول تقنية مبتكرة ومناسبة للمشروع</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">يُنصح بمراجعة التفاصيل المالية للحصول على أفضل قيمة</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">خبرة الشركة الواسعة تجعلها خياراً موثوقاً لتنفيذ المشروع</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}