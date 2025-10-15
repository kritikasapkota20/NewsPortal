import React, { useState } from 'react';

const UnicodeConverter = () => {
  const [preetiText, setPreetiText] = useState('');
  const [unicodeText, setUnicodeText] = useState('');
  const [activeTab, setActiveTab] = useState('preetiToUnicode');

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 font-sans shadow-2xl bg-white rounded-lg">
        <div className='mb-6 text-center'>
            <div className='inline-block text-left'>
      <h1 className=" text-2xl  md:text-4xl font-bold mb-1 ">Preeti to Unicode Converter</h1>
  <div className='bg-black  w-[200px] border-b-[4px] border-secondary'></div>
  </div>
  </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-5 py-2 rounded-xl font-semibold transition-colors hover:bg-secondary hover:text-white duration-200 ${activeTab === 'preetiToUnicode' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('preetiToUnicode')}
        >
          Preeti to Unicode
        </button>
        <button
          className={`px-5 py-2 rounded-xl font-semibold transition-colors hover:bg-secondary hover:text-white duration-200 ${activeTab === 'romanisedNepali' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('romanisedNepali')}
        >
           Romanised Nepali
        </button>
        <button
          className={`px-5 py-2 rounded-xl font-semibold transition-colors hover:bg-secondary hover:text-white duration-200 ${activeTab === 'unicodeToPreeti' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('unicodeToPreeti')}
        >
          Unicode to Preeti
        </button>
      </div>
      {activeTab === 'preetiToUnicode' && (
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <div className="flex-1 min-w-[250px]  flex flex-col">
            <label className="mb-2 font-semibold">Write in Preeti</label>
            <textarea
              className="w-full min-h-[300px] p-3 border border-gray-300 rounded text-base resize-y mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={preetiText}
              onChange={e => setPreetiText(e.target.value)}
              placeholder="Type Preeti text here..."
            />
          </div>
          <div className="flex-1 min-w-[250px] flex flex-col">
            <label className="mb-2 font-semibold">Unicode Result</label>
            <textarea
              className="w-full min-h-[300px] p-3 border border-gray-300 rounded text-base resize-y bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={unicodeText}
              readOnly
              placeholder="Unicode output will appear here..."
            />
          </div>
         
        </div>
      )}
       {/* <p>प्रीति टु युनिकोड कन्वर्टर एक प्रसिद्ध र प्रभावकारी उपकरण हो, जुन विशेष रूपमा परम्परागत नेपाली प्रीति फन्टलाई युनिकोडमा परिवर्तन गर्नका लागि बनाइएको हो। सामान्यतया, जब हामी माइक्रोसफ्ट वर्डमा प्रीति फन्ट प्रयोग गरेर नेपाली टाइप गर्छौं, त्यो इन्टरनेटमा सिधै प्रयोग गर्न सकिंदैन किनकि त्यसका लागि युनिकोड नेपाली फन्ट आवश्यक पर्छ।

हाम्रो माथि उल्लेख गरिएको प्रीति टु युनिकोड कन्वर्टरको प्रयोग गरेर तपाईं सजिलै प्रीति फन्टमा लेखिएको नेपालीलाई युनिकोडमा रूपान्तरण गर्न सक्नुहुन्छ। रूपान्तरणपछि, उक्त नेपाली पाठलाई इन्टरनेटमा वा विभिन्न मोबाइल तथा डेस्कटप एप्लिकेसनहरूमा सजिलै प्रयोग गर्न सकिन्छ।
</p> */}
    </div>
  );
};

export default UnicodeConverter;