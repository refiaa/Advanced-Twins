

import './styles.css';

export default class KdbDisplayerUI {
  constructor(kdbDisplayer) {
    this.kdbDisplayer = kdbDisplayer;
    this.initUI();
  }
  
    initUI() {
      this.createUI();
    }
  
    createUI() {
      const existingElement = document.getElementById('kdbDisplayer');
      const existingToggleButton = document.getElementById('jsonToggleButton');
  
      if (existingElement) {
        this.kdbDisplayer.displayElement = existingElement;
        this.kdbDisplayer.toggleButton = existingToggleButton;
        this.kdbDisplayer.searchContainer = document.getElementById('searchContainer');
        this.kdbDisplayer.sortContainer = document.getElementById('sortContainer');
        this.kdbDisplayer.tableContainer = document.getElementById('tableContainer');
      } else {
        this.kdbDisplayer.displayElement = document.createElement('div');
        this.kdbDisplayer.displayElement.id = 'kdbDisplayer';
        this.kdbDisplayer.displayElement.classList.add('kdb-displayer');
  
        this.createHeader();
        this.createToggleButton();
        this.createSearchContainer();
        this.createSortContainer();
        this.createTableContainer();
        this.createFooter();
  
        document.body.appendChild(this.kdbDisplayer.displayElement);
        document.body.appendChild(this.kdbDisplayer.toggleButton);
      }
    }
  
    createHeader() {
      const headerDiv = document.createElement('div');
      headerDiv.classList.add('header');
  
      const mainHeaderText = document.createElement('span');
      mainHeaderText.classList.add('main-header-text');
      mainHeaderText.textContent = 'KDB Searcher';
  
      const subHeaderText = document.createElement('span');
      subHeaderText.classList.add('sub-header-text');
  
      const subHeaderTextNode = document.createTextNode('Source code is available on ');
      subHeaderText.appendChild(subHeaderTextNode);
  
      const githubLink = document.createElement('a');
      githubLink.href = 'https://github.com/refiaa';
      githubLink.target = '_blank';
      githubLink.textContent = 'Github';
  
      subHeaderText.appendChild(githubLink);
  
      headerDiv.appendChild(mainHeaderText);
      headerDiv.appendChild(subHeaderText);
      this.kdbDisplayer.displayElement.appendChild(headerDiv);
    }
  
    createToggleButton() {
      this.kdbDisplayer.toggleButton = document.createElement('button');
      this.kdbDisplayer.toggleButton.id = 'jsonToggleButton';
      this.kdbDisplayer.toggleButton.textContent = 'kdbを開く';
      this.kdbDisplayer.toggleButton.classList.add('toggle-button');
      this.kdbDisplayer.toggleButton.addEventListener('click', () => this.kdbDisplayer.toggleDisplay());
    }
  
    createSearchContainer() {
      this.kdbDisplayer.searchContainer = document.createElement('div');
      this.kdbDisplayer.searchContainer.id = 'searchContainer';
      this.kdbDisplayer.searchContainer.classList.add('search-container');
      this.kdbDisplayer.displayElement.appendChild(this.kdbDisplayer.searchContainer);
  
      this.createSearchUI();
    }
  
    createSortContainer() {
      this.kdbDisplayer.sortContainer = document.createElement('div');
      this.kdbDisplayer.sortContainer.id = 'sortContainer';
      this.kdbDisplayer.sortContainer.classList.add('sort-container');
      this.kdbDisplayer.displayElement.appendChild(this.kdbDisplayer.sortContainer);
  
      this.createSortUI();
    }
  
    createTableContainer() {
      this.kdbDisplayer.tableContainer = document.createElement('div');
      this.kdbDisplayer.tableContainer.id = 'tableContainer';
      this.kdbDisplayer.tableContainer.classList.add('table-container');
      this.kdbDisplayer.displayElement.appendChild(this.kdbDisplayer.tableContainer);
    }
  
    createFooter() {
      const descriptionDiv = document.createElement('div');
      descriptionDiv.classList.add('footer');
  
      const descriptionTextNode1 = document.createTextNode('Using ');
      descriptionDiv.appendChild(descriptionTextNode1);
  
      const kdbLink = document.createElement('a');
      kdbLink.href = 'https://github.com/Make-IT-TSUKUBA/alternative-tsukuba-kdb';
      kdbLink.target = '_blank';
      kdbLink.textContent = 'alternative-tsukuba-kdb';
      descriptionDiv.appendChild(kdbLink);
  
      const descriptionTextNode2 = document.createTextNode(' for kdb data.');
      descriptionDiv.appendChild(descriptionTextNode2);
  
      this.kdbDisplayer.displayElement.appendChild(descriptionDiv);
    }
  
    createSearchUI() {
        const searchUIContainer = document.createElement('div');
        searchUIContainer.classList.add('search-ui-container');
    
        const subjectSearchRow = document.createElement('div');
        subjectSearchRow.classList.add('row');
    
        const subjectCodeInput = document.createElement('input');
        subjectCodeInput.type = 'text';
        subjectCodeInput.placeholder = '科目番号で検索';
        subjectCodeInput.classList.add('subject-code-input');
        subjectCodeInput.addEventListener('input', () => this.kdbDisplayer.filterData());
        subjectSearchRow.appendChild(subjectCodeInput);
    
        const subjectNameInput = document.createElement('input');
        subjectNameInput.type = 'text';
        subjectNameInput.placeholder = '科目名で検索';
        subjectNameInput.classList.add('subject-name-input');
        subjectNameInput.addEventListener('input', () => this.kdbDisplayer.filterData());
        subjectSearchRow.appendChild(subjectNameInput);
    
        searchUIContainer.appendChild(subjectSearchRow);
    
        const dayTimeRow = document.createElement('div');
        dayTimeRow.classList.add('row');
    
        const daysOfWeekOptions = ['月', '火', '水', '木', '金', '土', '日'];
        this.kdbDisplayer.dayOfWeekSelect = document.createElement('select');
        this.kdbDisplayer.dayOfWeekSelect.classList.add('day-of-week-select');
    
        const daysOfWeekPlaceholderOption = document.createElement('option');
        daysOfWeekPlaceholderOption.value = '';
        daysOfWeekPlaceholderOption.textContent = '曜日';
        daysOfWeekPlaceholderOption.disabled = true;
        daysOfWeekPlaceholderOption.selected = true;
        this.kdbDisplayer.dayOfWeekSelect.appendChild(daysOfWeekPlaceholderOption);
    
        for (const option of daysOfWeekOptions) {
            const daysOfWeekOption = document.createElement('option');
            daysOfWeekOption.value = option;
            daysOfWeekOption.textContent = option;
            this.kdbDisplayer.dayOfWeekSelect.appendChild(daysOfWeekOption);
        }
    
        this.kdbDisplayer.dayOfWeekSelect.addEventListener('change', () => this.kdbDisplayer.filterData());
        dayTimeRow.appendChild(this.kdbDisplayer.dayOfWeekSelect);
    
        const periodsOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];
        this.kdbDisplayer.periodSelect = document.createElement('select');
        this.kdbDisplayer.periodSelect.classList.add('period-select');
    
        const periodPlaceholderOption = document.createElement('option');
        periodPlaceholderOption.value = '';
        periodPlaceholderOption.textContent = '時限';
        periodPlaceholderOption.disabled = true;
        periodPlaceholderOption.selected = true;
        this.kdbDisplayer.periodSelect.appendChild(periodPlaceholderOption);
    
        for (const option of periodsOptions) {
            const periodsOption = document.createElement('option');
            periodsOption.value = option;
            periodsOption.textContent = option;
            this.kdbDisplayer.periodSelect.appendChild(periodsOption);
        }
    
        this.kdbDisplayer.periodSelect.addEventListener('change', () => this.kdbDisplayer.filterData());
        dayTimeRow.appendChild(this.kdbDisplayer.periodSelect);
    
        searchUIContainer.appendChild(dayTimeRow);
    
        const filterRow = document.createElement('div');
        filterRow.classList.add('row');
    
        const semesterContainer = document.createElement('div');
        semesterContainer.classList.add('semester-container');
        const semesterOptions = ['春', '秋', 'A', 'B', 'C'];
        for (const option of semesterOptions) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = option;
            checkbox.id = `semester-${option}`;
            checkbox.classList.add('semester-checkbox');
            checkbox.addEventListener('change', () => this.kdbDisplayer.filterData());
            semesterContainer.appendChild(checkbox);
        
            const label = document.createElement('label');
            label.htmlFor = `semester-${option}`;
            label.textContent = option;
            semesterContainer.appendChild(label);
        }
    
        filterRow.appendChild(semesterContainer);
    
        const onlineOfflineContainer = document.createElement('div');
        onlineOfflineContainer.classList.add('online-offline-container');
        const onlineOfflineOptions = ['オンライン', '対面'];
        for (const option of onlineOfflineOptions) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = option;
            checkbox.id = `format-${option}`;
            checkbox.classList.add('format-checkbox');
            checkbox.addEventListener('change', () => this.kdbDisplayer.filterData());
            onlineOfflineContainer.appendChild(checkbox);
        
            const label = document.createElement('label');
            label.htmlFor = `format-${option}`;
            label.textContent = option;
            onlineOfflineContainer.appendChild(label);
        }
    
        filterRow.appendChild(onlineOfflineContainer);
    
        const resetButton = document.createElement('button');
        resetButton.textContent = '検索結果をリセット';
        resetButton.classList.add('reset-button');
        resetButton.addEventListener('click', () => this.resetSearchOptions());
        onlineOfflineContainer.appendChild(resetButton);
    
        searchUIContainer.appendChild(filterRow);
    
        this.kdbDisplayer.searchContainer.appendChild(searchUIContainer);
      }
    
  
      createSortUI() {
        const sortLabel = document.createElement('label');
        sortLabel.textContent = '並び変え: ';
        this.kdbDisplayer.sortContainer.appendChild(sortLabel);
    
        const sortSelect = document.createElement('select');
        sortSelect.classList.add('sort-select');
        const sortOptions = [
            { value: 'subjectCode', label: '科目番号' },
            { value: 'subjectName', label: '科目名' },
        ];
        for (const option of sortOptions) {
            const sortOption = document.createElement('option');
            sortOption.value = option.value;
            sortOption.textContent = option.label;
            sortSelect.appendChild(sortOption);
        }
        sortSelect.addEventListener('change', () => this.kdbDisplayer.sortData());
        this.kdbDisplayer.sortContainer.appendChild(sortSelect);
    
        const sortOrderSelect = document.createElement('select');
        sortOrderSelect.classList.add('sort-order-select');
        const sortOrderOptions = [
            { value: 'asc', label: '昇順' },
            { value: 'desc', label: '降順' },
        ];
        for (const option of sortOrderOptions) {
            const sortOrderOption = document.createElement('option');
            sortOrderOption.value = option.value;
            sortOrderOption.textContent = option.label;
            sortOrderSelect.appendChild(sortOrderOption);
        }
        sortOrderSelect.addEventListener('change', () => this.kdbDisplayer.sortData());
        this.kdbDisplayer.sortContainer.appendChild(sortOrderSelect);
      }
    
      resetSearchOptions() {
        const subjectCodeInput = this.kdbDisplayer.displayElement.querySelector('input.subject-code-input');
        const subjectNameInput = this.kdbDisplayer.displayElement.querySelector('input.subject-name-input');
        const semesterCheckboxes = this.kdbDisplayer.displayElement.querySelectorAll('input.semester-checkbox');
        const onlineOfflineCheckboxes = this.kdbDisplayer.displayElement.querySelectorAll('input.format-checkbox');
    
        subjectCodeInput.value = '';
        subjectNameInput.value = '';
        this.kdbDisplayer.dayOfWeekSelect.selectedIndex = 0;
        this.kdbDisplayer.periodSelect.selectedIndex = 0;
        semesterCheckboxes.forEach(checkbox => checkbox.checked = false);
        onlineOfflineCheckboxes.forEach(checkbox => checkbox.checked = false);
    
        this.kdbDisplayer.filterData();
      }
    
      addSubjectButtonListeners() {
        const addButtons = this.kdbDisplayer.tableContainer.querySelectorAll('.subject-button.add');
        addButtons.forEach((button) => {
            button.addEventListener('click', async () => {
            const subjectCode = button.dataset.subjectCode;
            const subjectName = button.closest('tr').querySelector('td:nth-child(3)').textContent.trim();
    
            const confirmAdd = window.confirm(`科目名 ${subjectName} (科目番号 : ${subjectCode}) を追加しますか？`);
            if (confirmAdd) {
                await this.kdbDisplayer.handleSubjectButtonClick(subjectCode, subjectName, 'add');
                }
            });
        });
    
        const syllabusButtons = this.kdbDisplayer.tableContainer.querySelectorAll('.subject-button.syllabus');
        syllabusButtons.forEach((button) => {
            button.addEventListener('click', async () => {
                const subjectCode = button.dataset.subjectCode;
                await this.kdbDisplayer.handleSubjectButtonClick(subjectCode, '', 'syllabus');
            });
        });
    }
}
  

