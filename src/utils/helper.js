import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faCircleUser, faQuestion  } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


export function formatHeaderString(str) {
    const words = str.split('_');
    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    const formattedStr = capitalizedWords.join(' ');
    return formattedStr;
}

export const formatDateTime = (str) => {
    if(str){
        const date = new Date(str);
        const monthYearFormatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });
        const monthYearStr = monthYearFormatter.format(date);
        const timeFormatter = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: true, minute: 'numeric' });
        const timeStr = timeFormatter.format(date);
        return `${monthYearStr} at ${timeStr}`;
    }
    return str
  };

export const formatTableData = (header, data) => {
    if(header === 'created' || header === 'edited') return formatDateTime(data)
    if(Array.isArray(data)) return data.join(' ,')
    if(header === 'icon'){
        if(data === 'human') return <FontAwesomeIcon icon={faRobot} />
        if(data === 'Droid') return <FontAwesomeIcon icon={faCircleUser} />
        return <FontAwesomeIcon icon={faQuestion} />
    }
    if(typeof data === 'object') return 'object'
    return data
  }

  export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  }

  export const makeApiCall = async (url, method = 'GET', data = null, headers = {}) => {
    try {
      const response = await axios({
        method,
        url,
        data,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(`API request failed: ${error.message}`);
    }
  };
  