

export default class LogAnalyzer {
    constructor() {
      this.logKey = 'flowExecutionLogs';
    }
  
    getLogs() {
      const logs = sessionStorage.getItem(this.logKey);
      return logs ? JSON.parse(logs) : [];
    }
  
    addLog(type, key, error = null) {
      const currentLogs = this.getLogs();
  
      const log = {
        type: type,
        key: key,
        timestamp: new Date().toISOString(),
        error: error
      };
  
      currentLogs.push(log);
      sessionStorage.setItem(this.logKey, JSON.stringify(currentLogs));
    }
  
    clearLogs() {
      sessionStorage.removeItem(this.logKey);
    }
  
    sortLogsByTimestamp(logs) {
      return logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
  
    getLogsByType(type) {
      const logs = this.getLogs();
      return logs.filter(log => log.type === type);
    }
  
    getLatestLog() {
      const logs = this.getLogs();
      const sortedLogs = this.sortLogsByTimestamp(logs);
      return sortedLogs[sortedLogs.length - 1];
    }
  
    getLogCountByType(type) {
      const logs = this.getLogsByType(type);
      return logs.length;
    }
  
    detectAbnormalPattern(logs) {
      const sortedLogs = this.sortLogsByTimestamp(logs);
      const validPattern = sortedLogs.slice(-3);
  
      const patternTypes = validPattern.map(log => log.type).join('-');
      return patternTypes !== 'input-insert-back';
    }
  
    async analyzeLogs() {
      const logs = this.getLogs();
      const isAbnormal = this.detectAbnormalPattern(logs);
  
      if (isAbnormal) {
        console.warn('Abnormal pattern detected in logs.');
      }
    }
  }