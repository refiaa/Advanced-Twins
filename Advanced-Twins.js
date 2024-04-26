// ==UserScript==
// @name         Advanced Twins for University of Tsukuba
// @namespace    https://github.com/refiaa
// @version      240426.1707
// @description  Provide Advanced function for Twins (University of Tsukuba)
// @author       refiaa
// @match        https://twins.tsukuba.ac.jp/campusweb/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    class KeyObserver {
        constructor(targetSelector) {
            this.targetSelector = targetSelector;
            this.currentKey = '';
            this.latestKey = '';
            this.displayElement = null;
            this.logElement = null;
            this.inputField = null;
            this.addButton = null;
            this.targetIframe = null;
            this.init();

            this.initSessionStorage();
            this.logAnalyzer = new LogAnalyzer();
        }

        init() {
            this.findTargetIframe();
            if (this.targetIframe) {
                this.initObserver();
                this.initUIComponents();
            }
        }

        // SESSION STORAGE LOGIC

        initSessionStorage() {
            const logKey = 'flowExecutionLogs';
            if (!sessionStorage.getItem(logKey)) {
                sessionStorage.setItem(logKey, JSON.stringify([]));
            }
        }

        addLog(type, key, error = null) {
            const logKey = 'flowExecutionLogs';
            const currentLogs = JSON.parse(sessionStorage.getItem(logKey));

            const log = {
                type: type,
                key: key,
                timestamp: new Date().toISOString(),
                error: error
            };

            currentLogs.push(log);
            sessionStorage.setItem(logKey, JSON.stringify(currentLogs));
        }

        // END OF SESSION STORAGE LOGIC

        findTargetIframe() {
            const iframes = document.getElementsByTagName('iframe');
            for (const iframe of iframes) {
                if (iframe.src.includes('campussquare.do?_flowId=RSW0001000-flow')) {
                    this.targetIframe = iframe;
                    console.log('Target iframe found:', this.targetIframe);
                    break;
                }
            }
            if (!this.targetIframe) {
                console.warn('Target iframe not found');
            }
        }

        initObserver() {
            if (!this.targetIframe) {
                console.error('Target iframe not found');
                return;
            }

            try {
                const targetDocument = this.targetIframe.contentDocument || this.targetIframe.contentWindow.document;
                const targetNode = targetDocument.querySelector(this.targetSelector);
                if (!targetNode) {
                    console.error('Target element not found in the iframe');
                    return;
                }

                const config = { attributes: true, childList: true, subtree: true };
                const observer = new MutationObserver(mutations => this.handleMutations(mutations));
                observer.observe(targetNode, config);
            } catch (error) {
                console.error('Error accessing iframe:', error);
            }
        }

        handleMutations(mutations) {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    this.handleMutation(mutation);
                }
            });
        }

        handleMutation(mutation) {
            try {
                const targetDocument = this.targetIframe.contentDocument || this.targetIframe.contentWindow.document;
                const target = targetDocument.querySelector('input[name="_flowExecutionKey"]');
                if (target && target.value !== this.currentKey) {
                    this.currentKey = target.value;
                    this.latestKey = this.currentKey;

                    this.addLog('childList', this.currentKey);
                }
            } catch (error) {
                this.addLog('error', 'handleMutation', error.message);
                console.error('Error handling mutation:', error);
            }
        }

        initUIComponents() {
            this.createDisplay();
            this.setupInputField();
            this.setupButtons();
        }

        createDisplay() {
            try {
                const targetDocument = this.targetIframe.contentDocument || this.targetIframe.contentWindow.document;
                const uiPanel = targetDocument.createElement('div');
                uiPanel.id = 'keyObserverUI';
                uiPanel.classList.add('key-observer-panel');

                const targetParagraph = targetDocument.querySelector('table[border="0"][cellspacing="1"][cellpadding="1"] + p');
                if (targetParagraph) {
                    targetParagraph.parentNode.insertBefore(uiPanel, targetParagraph);
                    console.log('UI panel created:', uiPanel);
                } else {
                    console.warn('Target paragraph not found, appending UI panel to body');
                    targetDocument.body.appendChild(uiPanel);
                }

                this.displayElement = uiPanel;
                this.logElement = targetDocument.createElement('div');
                this.logElement.classList.add('key-observer-log');
                this.displayElement.appendChild(this.logElement);
            } catch (error) {
                console.error('Error creating display:', error);
            }
        }

        setupInputField() {
            try {
                const targetDocument = this.targetIframe.contentDocument || this.targetIframe.contentWindow.document;
                this.inputField = targetDocument.createElement('input');
                this.inputField.id = 'jikanwariCodeInput';
                this.inputField.type = 'text';
                this.inputField.placeholder = '時間割コード';
                this.inputField.classList.add('jikanwari-code-input');
                this.displayElement.appendChild(this.inputField);
            } catch (error) {
                console.error('Error setting up input field:', error);
            }
        }

        setupButtons() {
            const actions = ['Add'];
            actions.forEach(action => this.createButton(action));
        }

        createButton(action) {
            try {
                const targetDocument = this.targetIframe.contentDocument || this.targetIframe.contentWindow.document;
                const button = targetDocument.createElement('button');
                button.textContent = action;
                button.classList.add('key-observer-button');
                button.addEventListener('click', () => this.executeCommand(action));
                this.displayElement.appendChild(button);

                if (action === 'Add') {
                    this.addButton = button;
                }
            } catch (error) {
                console.error('Error creating button:', error);
            }
        }

        executeCommand(action, jikanwariShozokuCode, yobi, jigen, jikanwariCode) {
            if (action === 'Add') {
                jikanwariCode = this.inputField.value.trim();
                if (!jikanwariCode) {
                    alert('時間割コードを入力してください。');
                    return;
                }
            }

            const config = this.getButtonConfig(action, jikanwariShozokuCode, yobi, jigen);

            const finalizeAction = () => {
                this.sendRequest('back', this.getButtonConfig('back'))
                    .then(() => {
                        this.refreshTimetable();
                        if (action === 'Add') {
                            this.clearInputField();
                        }
                    })
                    .catch(error => {
                        console.error('Error during finalization:', error);
                    });
            };

            if (action === 'Add') {
                this.sendRequest('input', { ...config.inputParams, jikanwariCode })
                    .then(() => {
                        this.sendRequest('insert', { nendo: new Date().getFullYear().toString(), jikanwariCode })
                            .then(finalizeAction)
                            .catch(error => {
                                console.error('Error during the insert process:', error);
                                finalizeAction();
                            });
                    })
                    .catch(error => {
                        console.error('Error during the first request in insert with input:', error);
                        finalizeAction();
                    });
            } else if (action === 'delete') {
                this.sendRequest('delete', { ...config, jikanwariCode })
                    .then(() => {
                        this.sendRequest('delete', { _flowExecutionKey: this.latestKey || this.currentKey })
                            .then(finalizeAction)
                            .catch(error => {
                                console.error('Error during the delete process:', error);
                                finalizeAction();
                            });
                    })
                    .catch(error => {
                        console.error('Error during the delete process:', error);
                        finalizeAction();
                    });
            }
        }

        clearInputField() {
            this.inputField.value = '';
        }

        getButtonConfig(action, jikanwariShozokuCode, yobi, jigen) {
            const configs = {
                add: { inputParams: { yobi: 9, jigen: 0 } },
                delete: { nendo: new Date().getFullYear().toString(), jikanwariShozokuCode, yobi, jigen },
                back: {}
            };
            return configs[action] || {};
        }

        sendRequest(eventId, params) {
            const keyToUse = this.latestKey || this.currentKey;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: this.encodeParams({ ...params, _flowExecutionKey: keyToUse, _eventId: eventId })
            };

            return fetch(`/campusweb/campussquare.do`, requestOptions)
                .then((response) => response.text())
                .then((html) => {
                    this.handleResponse(html, eventId);

                    this.logAnalyzer.analyzeLogs();
                })
                .catch((error) => {
                    console.error('Error with AJAX request:', error);
                });
        }

        handleResponse(html, eventId) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newKey = doc.querySelector('input[name="_flowExecutionKey"]')?.value;

            if (newKey) {
                this.latestKey = newKey;
                this.addLog(eventId, newKey);
            } else {
                throw new Error('Failed to fetch new key');
            }
        }

        encodeParams(params) {
            return Object.keys(params)
                .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
                .join('&');
        }

        refreshTimetable()   {
            return new Promise((resolve, reject) => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: this.encodeParams({ _flowExecutionKey: this.latestKey || this.currentKey })
                };

                fetch(`/campusweb/campussquare.do?_flowId=RSW0001000-flow`, requestOptions)
                    .then(response => response.text())
                    .then(html => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const newTimetable = doc.querySelector('table.rishu-koma');
                        if (newTimetable) {
                            const targetDocument = this.targetIframe.contentDocument || this.targetIframe.contentWindow.document;
                            const currentTimetable = targetDocument.querySelector('table.rishu-koma');
                            if (currentTimetable) {
                                currentTimetable.parentNode.replaceChild(newTimetable, currentTimetable);
                                resolve();
                            } else {
                                reject('Current timetable not found');
                            }
                        } else {
                            reject('New timetable not found');
                        }
                    })
                    .catch(error => {
                        console.error('Error refreshing timetable:', error);
                        reject(error);
                    });
            });
        }
    }

    class AdvancedSyllabus {
        constructor(keyObserver) {
            this.keyObserver = keyObserver;
            this.targetIframe = keyObserver.targetIframe;
            this.init();
        }

        init() {
            this.injectStyles();
            this.observePageChanges();
        }

        injectStyles() {
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .syllabus-link {
                    color: blue !important;
                    cursor: pointer !important;
                    text-decoration: underline !important;
                    margin-left: 5px;
                }
                .delete-button {
                    background-color: transparent;
                    font-weight: bold;
                    color: #333;
                    border: none;
                    border-radius: 0;
                    width: 24px;
                    height: 24px;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    transform: translate(50%, -50%);
                    cursor: pointer;
                    z-index: 1;
                }

                .delete-button:hover {
                    color: #ff0000;
                    text-decoration: none;
                }

                .delete-button::before {
                    content: "科目を削除";
                    visibility: hidden;
                    color: #fff;
                    background-color: #555;
                    padding: 5px 10px;
                    border-radius: 6px;
                    position: absolute;
                    z-index: 1000;
                    left: 120%;
                    top: -75%;
                    transform: translate(-50%, -50%);
                    white-space: nowrap;
                    font-size: 12px;
                    box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
                    transition: visibility 0.2s, opacity 0.2s ease;
                    opacity: 0;
                }

                .delete-button:hover::before {
                    visibility: visible;
                    opacity: 1;
                }
            `;

            try {
                const targetDocument = this.targetIframe.contentDocument || this.targetIframe.contentWindow.document;
                targetDocument.head.appendChild(styleElement);
            } catch (error) {
                console.error('Error injecting styles:', error);
            }
        }

        observePageChanges() {
            const targetNode = document.body;
            const observerOptions = {
                childList: true,
                subtree: true
            };

            const observer = new MutationObserver(mutationsList => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        this.addLinksToTimetable();
                    }
                }
            });

            observer.observe(targetNode, observerOptions);
        }

        addLinksToTimetable() {
            if (!this.targetIframe) {
                console.warn('Target iframe not found, skipping adding links to timetable');
                return;
            }

            try {
                const targetDocument = this.targetIframe.contentDocument || this.targetIframe.contentWindow.document;
                const timetableCells = targetDocument.querySelectorAll('td[bgcolor="#ffcc99"], td[bgcolor="#ffffcc"]');
                timetableCells.forEach(cell => {
                    this.addLinkToCell(cell, false);
                    this.addDeleteButton(cell);
                });

                const concentratedRows = targetDocument.querySelectorAll('table.rishu-etc tr[bgcolor="#ffcc99"]');
                concentratedRows.forEach(row => {
                    const syllabusCell = row.children[4];
                    if (syllabusCell) {
                        this.addLinkToCell(syllabusCell, true);
                        this.addDeleteButton(syllabusCell);
                    }
                });
            } catch (error) {
                console.error('Error adding links to timetable:', error);
            }
        }

        addLinkToCell(cell, isSyllabus) {
            if (cell.querySelector('.syllabus-link')) return;

            const courseCodeElement = cell.querySelector('a');
            if (!courseCodeElement && !isSyllabus) return;

            const courseCode = isSyllabus ? cell.parentElement.querySelector('a')?.textContent.trim() : courseCodeElement?.textContent.trim();
            if (!courseCode) return;

            const link = document.createElement('a');
            link.className = 'syllabus-link';
            link.textContent = 'シラバス';
            link.href = `https://kdb.tsukuba.ac.jp/syllabi/${new Date().getFullYear()}/${courseCode}/jpn`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.addEventListener('click', function (event) {
                event.preventDefault();
                window.open(this.href, 'syllabusWindow', 'width=800,height=600,resizable=yes,scrollbars=yes');
            });

            const linkContainer = document.createElement('div');
            linkContainer.classList.add('syllabus-link-container');
            linkContainer.appendChild(link);
            cell.appendChild(linkContainer);
        }

        addDeleteButton(cell) {
            if (cell.querySelector('.delete-button')) return;

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.innerHTML = '&#10005;';
            deleteButton.addEventListener('click', () => {
                const deleteLink = cell.querySelector('a[onclick^="return DeleteCallA"]');
                if (deleteLink) {
                    const onclickArgs = deleteLink.getAttribute('onclick').match(/'(.*?)'/g);
                    if (onclickArgs && onclickArgs.length === 5) {
                        const [nendo, jikanwariShozokuCode, jikanwariCode, yobi, jigen] = onclickArgs.map(arg => arg.replace(/'/g, ''));
                        const confirmDelete = window.confirm('本当にこの科目を削除しますか？');
                        if (confirmDelete) {
                            this.keyObserver.executeCommand('delete', jikanwariShozokuCode, yobi, jigen, jikanwariCode);
                        }
                    }
                }
            });

            const deleteButtonContainer = document.createElement('div');
            deleteButtonContainer.classList.add('delete-button-container');
            deleteButtonContainer.appendChild(deleteButton);

            cell.style.position = 'relative';
            cell.appendChild(deleteButtonContainer);
        }
    }

    class kdb_Displayer {
        constructor(urls, keyObserver) {
            this.urls = urls;

            this.keyObserver = keyObserver;
            if (!this.keyObserver) {
                console.error('KeyObserver not initialized');
                return;
            }

            this.displayElement = null;
            this.toggleButton = null;
            this.searchContainer = null;
            this.sortContainer = null;
            this.tableContainer = null;
            this.jsonData = null;
            this.indexedData = null;
            this.filteredData = null;
            this.dayOfWeekSelect = null;
            this.periodSelect = null;
            this.currentPage = 1;
            this.pageSize = 20;
            this.currentUrlIndex = 0;

            this.init();
        }

        async init() {
            try {
                const targetIframe = await this.waitForTargetIframe();
                if (targetIframe && this.keyObserver) {
                    const jsonData = await this.fetchJsonData(this.urls[this.currentUrlIndex]);
                    this.createUI();
                    this.displayJsonData(jsonData);
                } else {
                    console.warn('KeyObserver not initialized or target iframe not found');
                }
            } catch (error) {
                console.error('JSON Error', error);
            }
        }

        async waitForTargetIframe(maxRetries = 10, retryDelay = 1000) {
            let retries = 0;
            return new Promise((resolve, reject) => {
                const checkIframe = () => {
                    const targetIframe = document.querySelector('iframe[src*="campussquare.do?_flowId=RSW0001000-flow"]');
                    if (targetIframe) {
                        resolve(targetIframe);
                    } else {
                        retries++;
                        if (retries < maxRetries) {
                            setTimeout(checkIframe, retryDelay);
                        } else {
                            resolve(null);
                        }
                    }
                };
                checkIframe();
            });
        }

        async fetchJsonData(url) {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            return await response.json();
        }

        createUI() {
            const existingElement = document.getElementById('kdb_Displayer');
            const existingToggleButton = document.getElementById('jsonToggleButton');

            if (existingElement) {
                this.displayElement = existingElement;
                this.toggleButton = existingToggleButton;
                this.searchContainer = document.getElementById('searchContainer');
                this.sortContainer = document.getElementById('sortContainer');
                this.tableContainer = document.getElementById('tableContainer');
            } else {
                this.displayElement = document.createElement('div');
                this.displayElement.id = 'kdb_Displayer';
                this.displayElement.style.position = 'fixed';
                this.displayElement.style.bottom = '2vh';
                this.displayElement.style.right = '2vw';
                this.displayElement.style.width = '40vw';
                this.displayElement.style.maxHeight = '60vh';
                this.displayElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                this.displayElement.style.color = 'black';
                this.displayElement.style.padding = '1vw';
                this.displayElement.style.zIndex = '9999';
                this.displayElement.style.overflowY = 'auto';
                this.displayElement.style.border = '1px solid #ccc';
                this.displayElement.style.borderRadius = '5px';
                this.displayElement.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                this.displayElement.style.display = 'none';

                // Header
                const headerDiv = document.createElement('div');
                headerDiv.style.display = 'flex';
                headerDiv.style.alignItems = 'center';
                headerDiv.style.marginBottom = '10px';

                const mainHeaderText = document.createElement('span');
                mainHeaderText.style.fontWeight = 'bold';
                mainHeaderText.style.fontSize = '25px';
                mainHeaderText.textContent = 'KDB Searcher';

                const subHeaderText = document.createElement('span');
                subHeaderText.style.fontSize = '14px';
                subHeaderText.style.marginLeft = '10px';

                const subHeaderTextNode = document.createTextNode('Source code is available on ');
                subHeaderText.appendChild(subHeaderTextNode);

                const githubLink = document.createElement('a');
                githubLink.href = 'https://github.com/refiaa';
                githubLink.target = '_blank';
                githubLink.textContent = 'Github';

                subHeaderText.appendChild(githubLink);

                headerDiv.appendChild(mainHeaderText);
                headerDiv.appendChild(subHeaderText);
                this.displayElement.appendChild(headerDiv);

                this.toggleButton = document.createElement('button');
                this.toggleButton.id = 'jsonToggleButton';
                this.toggleButton.textContent = 'kdbを開く';
                this.toggleButton.style.position = 'fixed';
                this.toggleButton.style.bottom = '20px';
                this.toggleButton.style.right = '20px';
                this.toggleButton.style.padding = '5px 10px';
                this.toggleButton.style.zIndex = '9999';
                this.toggleButton.style.cursor = 'pointer';

                this.toggleButton.addEventListener('click', this.toggleDisplay.bind(this));

                this.searchContainer = document.createElement('div');
                this.searchContainer.id = 'searchContainer';
                this.sortContainer = document.createElement('div');
                this.sortContainer.id = 'sortContainer';
                this.tableContainer = document.createElement('div');
                this.tableContainer.id = 'tableContainer';

                this.createSearchUI();
                this.createSortUI();
                this.createUrlSwitchUI();

                const spacerDiv1 = document.createElement('div');
                spacerDiv1.style.marginBottom = '15px';
                this.displayElement.appendChild(spacerDiv1);

                this.displayElement.appendChild(this.searchContainer);
                this.displayElement.appendChild(this.sortContainer);
                this.displayElement.appendChild(this.tableContainer);

                // レファレンス
                const descriptionDiv = document.createElement('div');
                descriptionDiv.style.marginTop = '20px';
                descriptionDiv.style.fontSize = '14px';
                descriptionDiv.style.color = '#666';

                const descriptionTextNode1 = document.createTextNode('Using ');
                descriptionDiv.appendChild(descriptionTextNode1);

                const kdbLink = document.createElement('a');
                kdbLink.href = 'https://github.com/Make-IT-TSUKUBA/alternative-tsukuba-kdb';
                kdbLink.target = '_blank';
                kdbLink.textContent = 'alternative-tsukuba-kdb';
                descriptionDiv.appendChild(kdbLink);

                const descriptionTextNode2 = document.createTextNode(' for kdb data.');
                descriptionDiv.appendChild(descriptionTextNode2);

                this.displayElement.appendChild(descriptionDiv);

                document.body.appendChild(this.displayElement);
                document.body.appendChild(this.toggleButton);
            }
        }

        createSearchUI() {
            const searchUIContainer = document.createElement('div');
            searchUIContainer.style.marginBottom = '20px';

            const subjectSearchRow = document.createElement('div');
            subjectSearchRow.classList.add('row')

            const subjectCodeInput = document.createElement('input');
            subjectCodeInput.type = 'text';
            subjectCodeInput.placeholder = '科目番号で検索';
            subjectCodeInput.style.marginRight = '10px';
            subjectCodeInput.addEventListener('input', this.filterData.bind(this));
            subjectSearchRow.appendChild(subjectCodeInput);

            const subjectNameInput = document.createElement('input');
            subjectNameInput.type = 'text';
            subjectNameInput.placeholder = '科目名で検索';
            subjectNameInput.style.marginRight = '10px';
            subjectNameInput.addEventListener('input', this.filterData.bind(this));
            subjectSearchRow.appendChild(subjectNameInput);

            this.searchContainer.appendChild(subjectSearchRow);

            const dayTimeRow = document.createElement('div');
            dayTimeRow.classList.add('row');

            const daysOfWeekOptions = ['月', '火', '水', '木', '金', '土', '日'];
            this.dayOfWeekSelect = document.createElement('select');

            const daysOfWeekPlaceholderOption = document.createElement('option');
            daysOfWeekPlaceholderOption.value = '';
            daysOfWeekPlaceholderOption.textContent = '曜日';
            daysOfWeekPlaceholderOption.disabled = true;
            daysOfWeekPlaceholderOption.selected = true;
            this.dayOfWeekSelect.appendChild(daysOfWeekPlaceholderOption);

            for (const option of daysOfWeekOptions) {
                const daysOfWeekOption = document.createElement('option');
                daysOfWeekOption.value = option;
                daysOfWeekOption.textContent = option;
                this.dayOfWeekSelect.appendChild(daysOfWeekOption);
            }

            this.dayOfWeekSelect.addEventListener('change', this.filterData.bind(this));
            dayTimeRow.appendChild(this.dayOfWeekSelect);

            this.dayOfWeekSelect.addEventListener('change', this.filterData.bind(this));
            dayTimeRow.appendChild(this.dayOfWeekSelect);

            const periodsOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];
            this.periodSelect = document.createElement('select');

            const periodPlaceholderOption = document.createElement('option');
            periodPlaceholderOption.value = '';
            periodPlaceholderOption.textContent = '時限';
            periodPlaceholderOption.disabled = true;
            periodPlaceholderOption.selected = true;
            this.periodSelect.appendChild(periodPlaceholderOption);

            for (const option of periodsOptions) {
                const periodsOption = document.createElement('option');
                periodsOption.value = option;
                periodsOption.textContent = option;
                this.periodSelect.appendChild(periodsOption);
            }

            this.periodSelect.addEventListener('change', this.filterData.bind(this));
            dayTimeRow.appendChild(this.periodSelect);

            this.searchContainer.appendChild(dayTimeRow);

            const filterRow = document.createElement('div');
            filterRow.classList.add('row');

            const semesterContainer = document.createElement('div');
            const semesterOptions = ['春', '秋', 'A', 'B', 'C'];
            for (const option of semesterOptions) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = option;
                checkbox.id = `semester-${option}`;
                checkbox.style.marginRight = '5px';
                checkbox.addEventListener('change', this.filterData.bind(this));
                semesterContainer.appendChild(checkbox);

                const label = document.createElement('label');
                label.htmlFor = `semester-${option}`;
                label.textContent = option;
                semesterContainer.appendChild(label);
            }

            filterRow.appendChild(semesterContainer);

            const onlineOfflineContainer = document.createElement('div');
            const onlineOfflineOptions = ['オンライン', '対面'];
            for (const option of onlineOfflineOptions) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = option;
                checkbox.id = `format-${option}`;
                checkbox.style.marginRight = '5px';
                checkbox.addEventListener('change', this.filterData.bind(this));
                onlineOfflineContainer.appendChild(checkbox);

                const label = document.createElement('label');
                label.htmlFor = `format-${option}`;
                label.textContent = option;
                onlineOfflineContainer.appendChild(label);
            }

            filterRow.appendChild(onlineOfflineContainer);

            const resetButton = document.createElement('button');
            resetButton.textContent = '検索結果をリセット';
            resetButton.style.marginLeft = '80px';
            resetButton.addEventListener('click', this.resetSearchOptions.bind(this));
            onlineOfflineContainer.appendChild(resetButton);

            this.searchContainer.appendChild(filterRow);

            const style = document.createElement('style');
            style.textContent = `.row {margin-bottom: 10px;}`;
            document.head.appendChild(style);
        }

        resetSearchOptions() {
            const subjectCodeInput = this.displayElement.querySelector('input[placeholder="科目番号で検索"]');
            const subjectNameInput = this.displayElement.querySelector('input[placeholder="科目名で検索"]');
            const semesterCheckboxes = this.displayElement.querySelectorAll('input[id^="semester-"]');
            const onlineOfflineCheckboxes = this.displayElement.querySelectorAll('input[id^="format-"]');

            subjectCodeInput.value = '';
            subjectNameInput.value = '';
            this.dayOfWeekSelect.selectedIndex = 0;
            this.periodSelect.selectedIndex = 0;
            semesterCheckboxes.forEach(checkbox => checkbox.checked = false);
            onlineOfflineCheckboxes.forEach(checkbox => checkbox.checked = false);

            this.filterData();
        }

        createSortUI() {
            const sortLabel = document.createElement('label');
            sortLabel.textContent = '並び変え: ';
            this.sortContainer.appendChild(sortLabel);

            const sortSelect = document.createElement('select');
            sortSelect.style.marginRight = '10px';
            const sortOptions = [
                {value: 'subjectCode', label: '科目番号'},
                {value: 'subjectName', label: '科目名'},
            ];
            for (const option of sortOptions) {
                const sortOption = document.createElement('option');
                sortOption.value = option.value;
                sortOption.textContent = option.label;
                sortSelect.appendChild(sortOption);
            }
            sortSelect.addEventListener('change', this.sortData.bind(this));
            this.sortContainer.appendChild(sortSelect);

            const sortOrderSelect = document.createElement('select');
            const sortOrderOptions = [
                {value: 'asc', label: '昇順'},
                {value: 'desc', label: '降順'},
            ];
            for (const option of sortOrderOptions) {
                const sortOrderOption = document.createElement('option');
                sortOrderOption.value = option.value;
                sortOrderOption.textContent = option.label;
                sortOrderSelect.appendChild(sortOrderOption);
            }
            sortOrderSelect.addEventListener('change', this.sortData.bind(this));

            this.sortContainer.style.marginBottom = '15px'
            this.sortContainer.appendChild(sortOrderSelect);
        }

        toggleDisplay() {
            if (this.displayElement.style.display === 'none') {
                this.displayElement.style.display = 'block';
            } else {
                this.displayElement.style.display = 'none';
            }
        }

        createUrlSwitchUI() {
            const urlSwitchContainer = document.createElement('div');
            urlSwitchContainer.style.marginTop = '10px';
            urlSwitchContainer.style.display = 'flex';
            urlSwitchContainer.style.alignItems = 'center';

            const toggleSwitch = document.createElement('div');
            toggleSwitch.style.position = 'relative';
            toggleSwitch.style.display = 'inline-block';
            toggleSwitch.style.width = '40px';
            toggleSwitch.style.height = '20px';
            toggleSwitch.style.borderRadius = '20px';
            toggleSwitch.style.backgroundColor = '#ccc';
            toggleSwitch.style.cursor = 'pointer';
            toggleSwitch.style.transition = 'background-color 0.3s';

            const toggleIndicator = document.createElement('div');
            toggleIndicator.style.position = 'absolute';
            toggleIndicator.style.top = '2px';
            toggleIndicator.style.left = '2px';
            toggleIndicator.style.width = '16px';
            toggleIndicator.style.height = '16px';
            toggleIndicator.style.borderRadius = '50%';
            toggleIndicator.style.backgroundColor = 'white';
            toggleIndicator.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.2)';
            toggleIndicator.style.transition = 'transform 0.3s';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.display = 'none';

            checkbox.addEventListener('change', () => {
                this.currentUrlIndex = checkbox.checked ? 1 : 0;

                this.resetSearchOptions();

                this.fetchJsonData(this.urls[this.currentUrlIndex]).then((jsonData) => {
                    this.displayJsonData(jsonData);
                });

                toggleIndicator.style.transform = checkbox.checked ? 'translateX(20px)' : 'translateX(0)';
                toggleSwitch.style.backgroundColor = checkbox.checked ? '#2196F3' : '#ccc';
            });

            toggleSwitch.appendChild(checkbox);
            toggleSwitch.appendChild(toggleIndicator);

            const labelUrl1 = document.createElement('span');
            labelUrl1.textContent = '学類';
            labelUrl1.style.marginRight = '5px';
            labelUrl1.style.fontSize = '14px';

            const labelUrl2 = document.createElement('span');
            labelUrl2.textContent = '大学院';
            labelUrl2.style.marginLeft = '5px';
            labelUrl2.style.fontSize = '14px';

            urlSwitchContainer.appendChild(labelUrl1);
            urlSwitchContainer.appendChild(toggleSwitch);
            urlSwitchContainer.appendChild(labelUrl2);

            toggleSwitch.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            });

            this.displayElement.appendChild(urlSwitchContainer);
        }

        async displayJsonData(jsonData) {
            this.jsonData = jsonData;
            this.indexData(jsonData.subject);
            this.filteredData = jsonData.subject;
            this.renderTable();
        }

        indexData(data) {
            this.indexedData = {
                subjectCode: {},
                subjectName: {},
                semester: {},
                format: {},
                dayOfWeek: {},
                period: {},
            };

            data.forEach((subject, index) => {
                const subjectCode = subject[0];
                const subjectName = subject[1];
                const semester = subject[5];
                const format = subject[10];
                const timetable = subject[6];
                const dayOfWeek = timetable.slice(0, 1);
                const period = timetable.slice(1);

                if (!this.indexedData.subjectCode[subjectCode]) {
                    this.indexedData.subjectCode[subjectCode] = [];
                }
                this.indexedData.subjectCode[subjectCode].push(index);

                if (!this.indexedData.subjectName[subjectName]) {
                    this.indexedData.subjectName[subjectName] = [];
                }
                this.indexedData.subjectName[subjectName].push(index);

                if (!this.indexedData.semester[semester]) {
                    this.indexedData.semester[semester] = [];
                }
                this.indexedData.semester[semester].push(index);

                if (!this.indexedData.format[format]) {
                    this.indexedData.format[format] = [];
                }
                this.indexedData.format[format].push(index);

                if (!this.indexedData.dayOfWeek[dayOfWeek]) {
                    this.indexedData.dayOfWeek[dayOfWeek] = [];
                }
                this.indexedData.dayOfWeek[dayOfWeek].push(index);

                if (!this.indexedData.period[period]) {
                    this.indexedData.period[period] = [];
                }
                this.indexedData.period[period].push(index);
            });
        }

        renderTable() {
            const tableHeaders = ['　　', '科目番号', '科目名', '単位', '年次', '開講時期', '時間割', '教室', '担当教員', '概要', '備考'];

            let tableHtml = `
            <table style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        ${tableHeaders.map(header => `<th style="border: 1px solid #ddd; padding: 12px; text-align: left;">${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            const paginatedData = this.filteredData.slice(startIndex, endIndex);

            if (paginatedData.length === 0) {
                tableHtml += `
                <tr>
                    <td colspan="${tableHeaders.length}" style="text-align: center; padding: 8px;">検索結果がありません</td>
                </tr>
            `;
            } else {
                paginatedData.forEach((subject, index) => {
                    const rowStyle = index % 2 === 0 ? 'background-color: #f9f9f9;' : '';
                    tableHtml += `
                    <tr style="${rowStyle}">
                        <td style="border: 1px solid #ddd; padding: 8px;">
                        <button class="subject-button syllabus" data-subject-code="${subject[0]}" style="width: 80px;">シラバス</button>
                        <button class="subject-button add" data-subject-code="${subject[0]}" style="width: 80px;">科目を追加</button>
                        </td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${subject[0]}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${subject[1]}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${subject[3]}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${subject[4]}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${subject[5]}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${subject[6]}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${subject[7]}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${subject[8]}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${subject[9]}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${subject[10]}</td>
                    </tr>
                `;
                });
            }

            tableHtml += `
                </tbody>
            </table>
        `;

            const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
            const paginationHtml = `
            <div style="margin-top: 10px;">
                <button id="prevPage" style="margin-right: 5px;">前</button>
                <span>ページ ${this.currentPage} / ${totalPages}</span>
                <button id="nextPage" style="margin-left: 5px;">次</button>
            </div>
        `;

            this.tableContainer.innerHTML = tableHtml + paginationHtml;

            const prevPageButton = this.tableContainer.querySelector('#prevPage');
            const nextPageButton = this.tableContainer.querySelector('#nextPage');

            prevPageButton.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderTable();
                }
            });

            nextPageButton.addEventListener('click', () => {
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderTable();
                }
            });

            this.addSubjectButtonListeners();
        }

        addSubjectButtonListeners() {
            const addButtons = this.tableContainer.querySelectorAll('.subject-button.add');
            addButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const subjectCode = button.dataset.subjectCode;
                    const subjectName = button.closest('tr').querySelector('td:nth-child(3)').textContent.trim();

                    const confirmAdd = window.confirm(`科目名 ${subjectName} (科目番号 : ${subjectCode}) を追加しますか？`);
                    if (confirmAdd) {
                        this.handleSubjectButtonClick(subjectCode, subjectName, 'add');
                    }
                });
            });

            const syllabusButtons = this.tableContainer.querySelectorAll('.subject-button.syllabus');
            syllabusButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const subjectCode = button.dataset.subjectCode;
                    this.handleSubjectButtonClick(subjectCode, '', 'syllabus');
                });
            });
        }

        handleSubjectButtonClick(subjectCode, subjectName, action) {
            if (!this.keyObserver) {
                console.error('KeyObserver or its required properties are not initialized');
                return;
            }

            if (action === 'add') {
                try {
                    this.keyObserver.inputField.value = subjectCode;
                    this.keyObserver.addButton.click();
                } catch (error) {
                    console.error('Error adding subject:', error);
                    alert('科目の追加中にエラーが発生しました。');
                }
            } else if (action === 'syllabus') {
                const syllabusUrl = `https://kdb.tsukuba.ac.jp/syllabi/${new Date().getFullYear()}/${subjectCode}/jpn`;
                window.open(syllabusUrl, '_blank', 'width=800,height=600,resizable=yes,scrollbars=yes');
            }
        }

        filterData() {
            const subjectCodeInput = this.displayElement.querySelector('input[placeholder="科目番号で検索"]');
            const subjectNameInput = this.displayElement.querySelector('input[placeholder="科目名で検索"]');
            const semesterCheckboxes = this.displayElement.querySelectorAll('input[id^="semester-"]:checked');
            const onlineOfflineCheckboxes = this.displayElement.querySelectorAll('input[id^="format-"]:checked');

            const subjectCode = subjectCodeInput.value.toLowerCase();
            const subjectName = subjectNameInput.value.toLowerCase();
            const selectedDayOfWeek = this.dayOfWeekSelect.value;
            const selectedPeriod = this.periodSelect.value;
            const selectedSemesters = Array.from(semesterCheckboxes).map(checkbox => checkbox.value);
            const selectedFormats = Array.from(onlineOfflineCheckboxes).map(checkbox => checkbox.value);

            let filteredIndices = this.getIntersection(
                this.searchIndex(this.indexedData.subjectCode, subjectCode),
                this.searchIndex(this.indexedData.subjectName, subjectName),
                this.filterIndexByIncludingOptions(this.indexedData.dayOfWeek, [selectedDayOfWeek]),
                this.filterIndexByIncludingOptions(this.indexedData.period, [selectedPeriod]),
                this.filterIndexBySemesterModules(this.indexedData.semester, selectedSemesters),
                this.filterIndexByIncludingOptions(this.indexedData.format, selectedFormats)
            );

            this.filteredData = filteredIndices.map(index => this.jsonData.subject[index]);

            this.currentPage = 1;
            this.renderTable();
        }

        searchIndex(index, query) {
            if (query === '') {
                return Object.values(index).flat();
            }
            const matches = Object.entries(index).filter(([key]) => key.toLowerCase().includes(query));
            return matches.map(([_, indices]) => indices).flat();
        }

        /**
         * @param {Object} index - 検索対象のindex
         * @param {string[]} selectedOptions - 選択したoptionsの配列
         * @returns {number[]} - 選択したoptionsを含む項目のindex配列
         */

        filterIndexByIncludingOptions(index, selectedOptions) {
            if (selectedOptions.length === 0) {
                return Object.values(index).flat();
            }
            const matches = Object.entries(index).filter(([key, indices]) => selectedOptions.some(option => key.includes(option)));
            return matches.map(([_, indices]) => indices).flat();
        }

        filterIndexBySemesterModules(index, selectedSemesters) {
            if (selectedSemesters.length === 0) {
                return Object.values(index).flat();
            }

            const matches = Object.entries(index).filter(([key, indices]) => {
                return selectedSemesters.every(semester => key.includes(semester));
            });

            return matches.map(([_, indices]) => indices).flat();
        }

        getIntersection(...arrays) {
            return arrays.reduce((a, b) => a.filter(c => b.includes(c)));
        }

        sortData() {
            const sortSelect = this.displayElement.querySelector('select');
            const sortOrderSelect = sortSelect.nextElementSibling;
            const sortBy = sortSelect.value;
            const sortOrder = sortOrderSelect.value;

            const subjectIndex = sortBy === 'subjectCode' ? 0 : 1;

            this.filteredData.sort((a, b) => {
                const subjectA = a[subjectIndex].toLowerCase();
                const subjectB = b[subjectIndex].toLowerCase();

                if (subjectA < subjectB) return sortOrder === 'asc' ? -1 : 1;
                if (subjectA > subjectB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });

            this.currentPage = 1;
            this.renderTable();
        }
    }

    class LogAnalyzer {
        constructor() {
            this.logKey = 'flowExecutionLogs';
        }

        getLogs() {
            const logs = sessionStorage.getItem(this.logKey);
            return logs ? JSON.parse(logs) : [];
        }

        sortLogsByTimestamp(logs) {
            return logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        }

        cleanUpLogs() {
            const logs = this.getLogs();
            const maxLogs = 10;
            const minLogsToKeep = 5;

            if (logs.length > maxLogs) {
                const sortedLogs = this.sortLogsByTimestamp(logs);
                const logsToKeep = sortedLogs.slice(-minLogsToKeep);

                sessionStorage.setItem(this.logKey, JSON.stringify(logsToKeep));
            }
        }

        detectAbnormalPattern(logs) {
            const sortedLogs = this.sortLogsByTimestamp(logs);
            const validPattern = sortedLogs.slice(-3);

            const patternTypes = validPattern.map(log => log.type).join('-');
            return patternTypes === 'input-insert-back';
        }

        analyzeLogs() {
            this.cleanUpLogs();

            const logs = this.getLogs();
            const isAbnormal = this.detectAbnormalPattern(logs);

            if (isAbnormal) {
                alert("科目が追加されませんでした。時限・曜日を確認してください。");
            }
        }
    }

    // kdbっぽいなにか　https://github.com/Make-IT-TSUKUBA/alternative-tsukuba-kdb　から取ってきています。
    const jsonUrls = [
        'https://raw.githubusercontent.com/Make-IT-TSUKUBA/alternative-tsukuba-kdb/main/src/kdb.json', // 学類
        'https://raw.githubusercontent.com/Make-IT-TSUKUBA/alternative-tsukuba-kdb/main/src/kdb-grad.json' // 大学院
    ];
    new kdb_Displayer(jsonUrls);

    let keyObserver = null;
    let advancedSyllabus = null;

    function initializeEnhancer() {
        const targetIframe = document.querySelector('iframe[src*="campussquare.do?_flowId=RSW0001000-flow"]');
        if (targetIframe) {
            targetIframe.addEventListener('load', function () {
                try {
                    const iframeDocument = targetIframe.contentDocument || targetIframe.contentWindow.document;
                    if (iframeDocument.readyState === 'complete') {
                        keyObserver = new KeyObserver('body');
                        advancedSyllabus = new AdvancedSyllabus(keyObserver);

                        new kdb_Displayer(jsonUrls, keyObserver);
                    } else {
                        setTimeout(initializeEnhancer, 100);
                    }
                } catch (error) {
                    console.error('Error accessing iframe content:', error);
                    setTimeout(initializeEnhancer, 1000);
                }
            });
        } else {
            console.warn('Target iframe not found, retrying in 1 second');
            setTimeout(initializeEnhancer, 1000);
        }
    }

    function observePageChanges() {
        const observerOptions = {
            childList: true,
            subtree: true
        };

        const observer = new MutationObserver(function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const addedIframes = Array.from(mutation.addedNodes).filter(node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IFRAME');
                    if (addedIframes.length > 0) {
                        console.log('New iframe(s) added:', addedIframes);
                        initializeEnhancer();
                    }
                }
            }
        });

        observer.observe(document.body, observerOptions);
    }
    observePageChanges();

})();
