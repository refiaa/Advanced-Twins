

export default class ApiClient {
    static async fetchJsonData(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching JSON data:', error);
        throw error;
      }
    }
  
    static async sendRequest(url, method, data = null) {
      try {
        const options = {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          }
        };
  
        if (data) {
          options.body = JSON.stringify(data);
        }
  
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          return await response.text();
        }
      } catch (error) {
        console.error('Error sending request:', error);
        throw error;
      }
    }
  }