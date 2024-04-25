

export default class KeyObserverUI {
    constructor(keyObserver) {
      this.keyObserver = keyObserver;
      this.initUI();
    }
  
    initUI() {
      this.createDisplay();
      this.setupInputField();
      this.setupButtons();
    }
  
    createDisplay() {
      try {
        const targetDocument = this.keyObserver.targetIframe.contentDocument || this.keyObserver.targetIframe.contentWindow.document;
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
  
        this.keyObserver.displayElement = uiPanel;
        this.keyObserver.logElement = targetDocument.createElement('div');
        this.keyObserver.logElement.classList.add('key-observer-log');
        this.keyObserver.displayElement.appendChild(this.keyObserver.logElement);
      } catch (error) {
        console.error('Error creating display:', error);
      }
    }
  
    setupInputField() {
      try {
        const targetDocument = this.keyObserver.targetIframe.contentDocument || this.keyObserver.targetIframe.contentWindow.document;
        this.keyObserver.inputField = targetDocument.createElement('input');
        this.keyObserver.inputField.id = 'jikanwariCodeInput';
        this.keyObserver.inputField.type = 'text';
        this.keyObserver.inputField.placeholder = '時間割コード';
        this.keyObserver.inputField.classList.add('jikanwari-code-input');
        this.keyObserver.displayElement.appendChild(this.keyObserver.inputField);
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
        const targetDocument = this.keyObserver.targetIframe.contentDocument || this.keyObserver.targetIframe.contentWindow.document;
        const button = targetDocument.createElement('button');
        button.textContent = action;
        button.classList.add('key-observer-button');
        button.addEventListener('click', async () => {
            await this.keyObserver.executeCommand(action);
        });
        this.keyObserver.displayElement.appendChild(button);
  
        if (action === 'Add') {
          this.keyObserver.addButton = button;
        }
        } catch (error) {
            console.error('Error creating button:', error);
        }
    }
  }