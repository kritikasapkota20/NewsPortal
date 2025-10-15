import rastriyasava from "../assets/Homeimg/rastriya-sava.jpg";
// import rastriyasava from "../assets/Homeimg/rastriya-sava.jpg";
import samachar from "../assets/samachar.jpg";
import cricket from "../assets/img1.jpg";

const HomepageBody = () => {
  return (
    <div className="container mx-auto px-6 md:px-12 py-6  ">

      {/* Main Featured Story */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 relative">
          <img
            src={rastriyasava}
            alt="Main news"
            className="rounded-lg w-full h-96 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-6">
            <span className="text-white bg-[#F05922] px-3 py-1 rounded-full text-sm">प्रमुख समाचार</span>
            <h1 className="text-3xl font-bold text-white mt-3">
              नयाँ संविधान संशोधनको मस्यौदा सार्वजनिक
            </h1>
            <p className="text-gray-200 mt-2">राजनीतिक दलहरु बीच छलफल तीव्र</p>
          </div>
        </div>

        {/* Top Stories Sidebar */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold border-b-2 border-[#F05922] pb-2">आजको मुख्य समाचार</h2>
          <div className="space-y-4 mt-4">
            {topStories.map((story, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-[#F05922] transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{story.category}</p>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">{story.time}</span>
                </div>
                {index !== topStories.length - 1 && <hr className="my-3" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* News Categories Grid */}
      {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {categories.map((category) => (
          <div key={category.title} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-[#F05922] px-4 py-2">
              <h2 className="text-white font-bold">{category.title}</h2>
            </div>
            <div className="p-4">
              {category.news.map((news, index) => (
                <div key={index} className="mb-4 last:mb-0 group cursor-pointer">
                  <div className="flex">
                    <div className="flex-shrink-0 w-24 h-16">
                      <img
                        src={news.img}
                        alt={news.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="font-medium group-hover:text-red-600 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{news.time}</p>
                    </div>
                  </div>
                  {index !== category.news.length - 1 && <hr className="my-3" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div> */}

      {/* Multimedia Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">मल्टिमिडिया</h2>
          <div className="flex space-x-2">
            <button className="bg-white px-4 py-2 rounded-lg shadow">भिडियो</button>
            <button className="bg-white px-4 py-2 rounded-lg shadow">फोटो फिचर</button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <img
              src="https://source.unsplash.com/random/600x400?video"
              alt="Video"
              className="rounded-lg w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <button className="text-white text-4xl">▶</button>
            </div>
          </div>
          {/* Add more multimedia items */}
        </div>
      </div>
    </div>
  );
};

// Sample Data
const topStories = [
  { title: 'सरकारले घोषणा गर्यो नयाँ आर्थिक योजना', category: 'अर्थ', time: '15 मिनेट अगाडि' },
  { title: 'साकेतमा ठूलो सडक दुर्घटना', category: 'घटना', time: '1 घण्टा अगाडि', },
  { title: 'नयाँ एन्ड्रोइड अपडेटमा समस्या', category: 'प्रविधि', time: '3 घण्टा अगाडि' },
];

const categories = [
  {
    title: 'राजनीति',
    news: [
      { title: 'संसदको बैठकमा तनाव', time: '2 घण्टा अगाडि', img: samachar },
      { title: 'नयाँ मन्त्रिपरिषद गठन', time: '4 घण्टा अगाडि', img: rastriyasava },
    ]
  },
  {
    title: 'खेलकुद',
    news: [
      { title: 'नेपालले जित्यो SAFF च्याम्पियनसिप', time: '1 दिन अगाडि', img: cricket },
      { title: 'क्रिकेट लिगको नयाँ संस्करण', time: '3 दिन अगाडि', img: samachar },
    ]
  },
  // Add more categories
];

export default HomepageBody;