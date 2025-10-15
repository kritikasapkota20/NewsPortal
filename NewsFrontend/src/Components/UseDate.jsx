import { useState, useEffect } from 'react';
import NepaliDateConverter from 'nepali-date-converter';

const nepaliMonths = {
  'Baisakh': 'बैशाख',
  'Jestha': 'जेठ',
  'Ashadh': 'असार',
  'Shrawan': 'साउन',
  'Bhadra': 'भदौ',
  'Ashwin': 'असोज',
  'Kartik': 'कार्तिक',
  'Mangsir': 'मंसिर',
  'Poush': 'पुष',
  'Magh': 'माघ',
  'Falgun': 'फाल्गुन',
  'Chaitra': 'चैत',
};

const nepaliDays = {
  'Sunday': 'आइतबार',
  'Monday': 'सोमबार',
  'Tuesday': 'मंगलबार',
  'Wednesday': 'बुधबार',
  'Thursday': 'बिहिबार',
  'Friday': 'शुक्रबार',
  'Saturday': 'शनिबार',
};

const nepaliNumerals = {
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
};

const convertToNepaliNumerals = (text) => {
  return text.split('').map(char => nepaliNumerals[char] || char).join('');
};

const UseDate= () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [nepaliDate, setNepaliDate] = useState('');
  const [englishDate, setEnglishDate] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(now);

      // Nepali date conversion
      const nepaliDateObj = new NepaliDateConverter(now);
      const formattedDate = nepaliDateObj.format('YYYY MMMM DD');
      const [year, month, day] = formattedDate.split(' ');
      const dayOfWeekEnglish = now.toLocaleDateString('en-US', { weekday: 'long' });
      
      const nepaliDateStr = `${convertToNepaliNumerals(day)} ${nepaliMonths[month]} ${convertToNepaliNumerals(year)}, ${nepaliDays[dayOfWeekEnglish]}`;
      setNepaliDate(nepaliDateStr);

      // English date
      setEnglishDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }));

    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return { nepaliDate, englishDate, currentTime: currentDate.toLocaleTimeString() };
};

export default UseDate;