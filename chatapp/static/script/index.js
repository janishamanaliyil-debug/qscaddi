// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Get the tender analysis URL from Django template
    
    // ====================== //
    // ELEMENT REFERENCES    //
    // ====================== //
    
    // Form and file handling elements
    const fileUploadForm = document.getElementById('fileUploadForm');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatArea = document.getElementById('chatArea');
    const centerGreeting = document.getElementById('centerGreeting');
    
    // Sidebar menu elements
    const projectIcon = document.getElementById('projectIcon');
    const projectMainmenu = document.getElementById('projectMainmenu');
    const folderByYear = document.getElementById('folderByYear');
    const yearSubmenu = document.getElementById('yearSubmenu');
    const projectSubmenu = document.getElementById('projectSubmenu');
    const projectSubmenuHeader = projectSubmenu?.querySelector('.submenu-header');
    const preContractItem = document.getElementById('preContractItem');
    const postContractItem = document.getElementById('postContractItem');
    const preContractSubmenu = document.getElementById('preContractSubmenu');
    const postContractSubmenu = document.getElementById('postContractSubmenu');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const accountIcon = document.getElementById('accountIcon');
    const accountSubmenu = document.getElementById('accountSubmenu');
    
    // File storage - SINGLE array for both upload methods
    let selectedFiles = [];
    
    // ====================== //
    // SIDEBAR MENU HANDLING //
    // ====================== //
    
    // Toggle Project main menu on click
    if (projectIcon) {
        projectIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            projectMainmenu.classList.toggle('active');
            
            if (!projectMainmenu.classList.contains('active')) {
                yearSubmenu.classList.remove('active');
                projectSubmenu.classList.remove('active');
                preContractSubmenu.classList.remove('active');
                postContractSubmenu.classList.remove('active');
            }
        });
    }

    // Show Year Submenu on HOVER
    if (folderByYear) {
        folderByYear.addEventListener('mouseenter', function(e) {
            yearSubmenu.classList.add('active');
        });
    }

    if (yearSubmenu) {
        yearSubmenu.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
    }

    // Handle ANY project item
    document.querySelectorAll('#yearSubmenu .submenu-item.has-nested').forEach(projectItem => {
        const openProject = () => {
            const projectName = projectItem.dataset.projectName || 
                               projectItem.querySelector('span')?.textContent || 
                               'Project';

            projectSubmenu.classList.add('active');
            preContractSubmenu.classList.remove('active');
            postContractSubmenu.classList.remove('active');
            if (projectSubmenuHeader) {
                projectSubmenuHeader.textContent = projectName;
            }
        };

        projectItem.addEventListener('mouseenter', openProject);
        projectItem.addEventListener('click', openProject);
    });

    if (projectSubmenu) {
        projectSubmenu.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
    }

    if (preContractItem) {
        preContractItem.addEventListener('mouseenter', function(e) {
            preContractSubmenu.classList.add('active');
            postContractSubmenu.classList.remove('active');
        });
    }
    
    if (postContractItem) {
        postContractItem.addEventListener('mouseenter', function(e) {
            postContractSubmenu.classList.add('active');
            preContractSubmenu.classList.remove('active');
        });
    }
    
    // Mouse leave handlers
    if (projectMainmenu) {
        projectMainmenu.addEventListener('mouseleave', function(e) {
            const relatedTarget = e.relatedTarget;
            if (!relatedTarget || !relatedTarget.closest('#yearSubmenu')) {
                setTimeout(() => {
                    yearSubmenu.classList.remove('active');
                    projectSubmenu.classList.remove('active');
                    preContractSubmenu.classList.remove('active');
                    postContractSubmenu.classList.remove('active');
                }, 100);
            }
        });
    }

    if (yearSubmenu) {
        yearSubmenu.addEventListener('mouseleave', function(e) {
            const relatedTarget = e.relatedTarget;
            if (!relatedTarget || 
                (!relatedTarget.closest('#projectMainmenu') && 
                 !relatedTarget.closest('#projectSubmenu') &&
                 !relatedTarget.closest('#preContractSubmenu') && 
                 !relatedTarget.closest('#postContractSubmenu'))) {
                setTimeout(() => {
                    this.classList.remove('active');
                    projectSubmenu.classList.remove('active');
                    preContractSubmenu.classList.remove('active');
                    postContractSubmenu.classList.remove('active');
                }, 100);
            }
        });
    }

    if (projectSubmenu) {
        projectSubmenu.addEventListener('mouseleave', function(e) {
            const relatedTarget = e.relatedTarget;
            if (!relatedTarget || 
                (!relatedTarget.closest('#yearSubmenu') &&
                 !relatedTarget.closest('#preContractSubmenu') && 
                 !relatedTarget.closest('#postContractSubmenu'))) {
                setTimeout(() => {
                    this.classList.remove('active');
                    preContractSubmenu.classList.remove('active');
                    postContractSubmenu.classList.remove('active');
                }, 100);
            }
        });
    }
    
    if (preContractSubmenu) {
        preContractSubmenu.addEventListener('mouseleave', function(e) {
            const relatedTarget = e.relatedTarget;
            if (!relatedTarget || !relatedTarget.closest('#projectSubmenu')) {
                this.classList.remove('active');
            }
        });
    }
    
    if (postContractSubmenu) {
        postContractSubmenu.addEventListener('mouseleave', function(e) {
            const relatedTarget = e.relatedTarget;
            if (!relatedTarget || !relatedTarget.closest('#projectSubmenu')) {
                this.classList.remove('active');
            }
        });
    }

    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('Add New Project functionality will be implemented here');
        });
    }

    accountIcon.addEventListener('click', () => {
        const iconRect = accountIcon.getBoundingClientRect();
        accountSubmenu.style.top = 'auto';
        let bottomOffset = window.innerHeight - iconRect.bottom - 10;
        if (bottomOffset < 20) bottomOffset = 20;
        accountSubmenu.style.bottom = bottomOffset + 'px';
        accountSubmenu.classList.toggle('active');
        
        projectMainmenu.classList.remove('active');
        yearSubmenu.classList.remove('active');
        projectSubmenu.classList.remove('active');
        preContractSubmenu.classList.remove('active');
        postContractSubmenu.classList.remove('active');
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.sidebar') && !e.target.closest('.submenu-panel')) {
            if (projectMainmenu) projectMainmenu.classList.remove('active');
            if (yearSubmenu) yearSubmenu.classList.remove('active');
            if (projectSubmenu) projectSubmenu.classList.remove('active');
            if (preContractSubmenu) preContractSubmenu.classList.remove('active');
            if (postContractSubmenu) postContractSubmenu.classList.remove('active');
            if (accountSubmenu) accountSubmenu.classList.remove('active');
        }
    });
    
    // Handle clicks on submenu items
    document.querySelectorAll('.submenu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.classList.contains('has-nested')) {
                return;
            }
            
            document.querySelectorAll('.submenu-item').forEach(i => {
                if (!i.classList.contains('has-nested')) {
                    i.classList.remove('active');
                }
            });
            
            this.classList.add('active');
            const itemName = this.querySelector('span').textContent;
            console.log('Selected:', itemName);
            
            if (itemName === 'Tender Analysis') {
                showTenderUploadSection();
            }
        });
    });
    
    // ====================== //
    // TENDER ANALYSIS       //
    // ====================== //
    
    function showTenderUploadSection() {
        console.log('=== Showing Tender Upload Section ===');
        
        if (centerGreeting) {
            centerGreeting.classList.add('hidden');
        }
        
        if (chatArea) {
            chatArea.innerHTML = '';
            chatArea.style.justifyContent = 'center';
            chatArea.style.alignItems = 'center';
        }
        
        const newUploadSection = document.createElement('div');
        newUploadSection.className = 'upload-section';
        newUploadSection.id = 'uploadSection';
        newUploadSection.style.display = 'flex';
        newUploadSection.innerHTML = `
            <h3 class="upload-title">Upload Your Drawings</h3>
            <div class="drag-drop-zone" id="dragDropZone">
                <i class="bi bi-cloud-upload"></i>
                <p>Drag & Drop files here</p>
                <p class="upload-hint">or click to browse</p>
            </div>
            <div class="uploaded-files-preview" id="uploadedFilesPreview"></div>
        `;
        chatArea.appendChild(newUploadSection);
        
        console.log('Upload section created');
        setupTenderUploadListeners();
        
        selectedFiles = [];
        if (filePreview) {
            filePreview.innerHTML = '';
        }
        
        if (sendBtn) {
            sendBtn.disabled = true;
        }
        
        if (projectMainmenu) projectMainmenu.classList.remove('active');
        if (yearSubmenu) yearSubmenu.classList.remove('active');
        if (projectSubmenu) projectSubmenu.classList.remove('active');
        if (preContractSubmenu) preContractSubmenu.classList.remove('active');
        if (postContractSubmenu) postContractSubmenu.classList.remove('active');
    }
    
    function setupTenderUploadListeners() {
        const newDragDropZone = document.getElementById('dragDropZone');
        
        if (newDragDropZone && fileInput) {
            console.log('Setting up tender upload listeners');
            
            newDragDropZone.addEventListener('click', function() {
                console.log('Drag zone clicked');
                fileInput.click();
            });
            
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                newDragDropZone.addEventListener(eventName, preventDefaults, false);
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                newDragDropZone.addEventListener(eventName, function() {
                    newDragDropZone.classList.add('drag-over');
                }, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                newDragDropZone.addEventListener(eventName, function() {
                    newDragDropZone.classList.remove('drag-over');
                }, false);
            });
            
            newDragDropZone.addEventListener('drop', function(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                console.log('Files dropped:', files.length);
                handleFileSelection(files);
            }, false);
        }
    }
    
    function handleFileSelection(files) {
        console.log('=== handleFileSelection ===');
        console.log('Files received:', files.length);
        
        const filesArray = Array.from(files);
        selectedFiles.push(...filesArray);
        displayFilePreview();
        
        console.log('Total files:', selectedFiles.length);
        
        if (sendBtn && selectedFiles.length > 0) {
            sendBtn.disabled = false;
            console.log('✓ Send button ENABLED');
        }
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // ====================== //
    // FILE HANDLING         //
    // ====================== //
    
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            console.log('=== File input changed ===');
            console.log('Files selected:', e.target.files.length);
            
            selectedFiles = Array.from(e.target.files);
            displayFilePreview();
            
            const uploadSectionElement = document.getElementById('uploadSection');
            const isInTenderMode = uploadSectionElement !== null;
            
            if (sendBtn && selectedFiles.length > 0) {
                sendBtn.disabled = false;
                console.log('✓ Send button ENABLED');
            }
        });
    }
    
    function displayFilePreview() {
        if (!filePreview) return;
        
        filePreview.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const chip = document.createElement('div');
            chip.className = 'file-chip';
            chip.innerHTML = `
                <i class="bi bi-paperclip"></i>
                <span>${file.name}</span>
                <span class="remove" data-index="${index}">
                    <i class="bi bi-x"></i>
                </span>
            `;
            
            const removeBtn = chip.querySelector('.remove');
            removeBtn.addEventListener('click', function() {
                removeFile(parseInt(this.getAttribute('data-index')));
            });
            
            filePreview.appendChild(chip);
        });
    }
    
    function removeFile(index) {
        selectedFiles.splice(index, 1);
        displayFilePreview();
        
        const uploadSectionElement = document.getElementById('uploadSection');
        const isInTenderMode = uploadSectionElement !== null;
        
        if (sendBtn) {
            if (isInTenderMode) {
                sendBtn.disabled = selectedFiles.length === 0;
            } else {
                sendBtn.disabled = selectedFiles.length === 0 && messageInput.value.trim() === '';
            }
        }
        
        if (fileInput) {
            fileInput.value = '';
        }
    }
    
    function getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        switch(ext) {
            case 'pdf':
                return 'bi-file-pdf-fill';
            case 'xlsx':
            case 'xls':
                return 'bi-file-excel-fill';
            case 'doc':
            case 'docx':
                return 'bi-file-word-fill';
            default:
                return 'bi-file-earmark';
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    // ====================== //
    // MESSAGE HANDLING      //
    // ====================== //
    
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            
            const uploadSectionElement = document.getElementById('uploadSection');
            const isInTenderMode = uploadSectionElement !== null;
            
            if (sendBtn) {
                if (isInTenderMode) {
                    sendBtn.disabled = selectedFiles.length === 0;
                } else {
                    sendBtn.disabled = selectedFiles.length === 0 && this.value.trim() === '';
                }
            }
        });
        
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                
                const uploadSectionElement = document.getElementById('uploadSection');
                const isInTenderMode = uploadSectionElement !== null;
                
                if (isInTenderMode) {
                    if (selectedFiles.length > 0) {
                        fileUploadForm.dispatchEvent(new Event('submit'));
                    }
                } else {
                    if (selectedFiles.length > 0 || this.value.trim() !== '') {
                        fileUploadForm.dispatchEvent(new Event('submit'));
                    }
                }
            }
        });
    }
    
    // ====================== //
    // FORM SUBMISSION       //
    // ====================== //
    
    if (fileUploadForm) {
        fileUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const message = messageInput.value.trim();
            const uploadSectionElement = document.getElementById('uploadSection');
            const isInTenderMode = uploadSectionElement !== null;
            
            console.log('=== Form Submit ===');
            console.log('Tender mode:', isInTenderMode);
            console.log('Files:', selectedFiles.length);
            
            if (isInTenderMode) {
                handleTenderSubmission(message);
            } else {
                handleNormalSubmission(message);
            }
        });
    }
    
    function handleTenderSubmission(message) {
        console.log('=== Tender Analysis Submission ===');
        
        if (selectedFiles.length === 0) {
            alert('Please upload at least one file');
            return;
        }
        
        const finalMessage = message || 'Tender Analysis';
        
        // Remove upload section
        const uploadSectionElement = document.getElementById('uploadSection');
        if (uploadSectionElement && uploadSectionElement.parentNode) {
            uploadSectionElement.parentNode.removeChild(uploadSectionElement);
        }
        
        // Reset chat area styling
        if (chatArea) {
            chatArea.style.justifyContent = 'flex-start';
            chatArea.style.alignItems = 'flex-start';
        }
        
        // Display user message
        displayUserMessage(selectedFiles, finalMessage);
        
        if (chatArea) {
            chatArea.scrollTop = chatArea.scrollHeight;
        }
        
        showLoadingIndicator();
        
        // ⭐ SEND TO TENDER_ANALYSIS VIEW
        const formData = new FormData();
        formData.append('message', finalMessage);
        formData.append('upload_source', 'tender_analysis');
        
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });
        
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
        
        console.log('Sending to:', TENDER_ANALYSIS_URL);
        
        fetch(TENDER_ANALYSIS_URL, {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": csrfToken ? csrfToken.value : ''
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Tender analysis response:', data);
            hideLoadingIndicator();
            
            if (data.response) {
                displayBotResponse(data.response);
            }
            
            // Display download links if files returned
            if (data.files && data.files.length > 0) {
                data.files.forEach(fileUrl => {
                    displayDownloadLink(fileUrl);
                });
            }
        })
        .catch(err => {
            console.error('Error:', err);
            hideLoadingIndicator();
            displayBotResponse('Error uploading files. Please try again.');
        });
        
        // Clear
        selectedFiles = [];
        clearForm();
    }
    
    function handleNormalSubmission(message) {
        if (message === '' && selectedFiles.length === 0) {
            return;
        }
        
        if (centerGreeting) {
            centerGreeting.classList.add('hidden');
        }
        
        if (chatArea && (message !== '' || selectedFiles.length > 0)) {
            displayUserMessage(selectedFiles, message);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
        
        const formData = new FormData();
        formData.append('message', message);
        
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });
        
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
        
        fetch("", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": csrfToken ? csrfToken.value : ''
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Upload successful:', data);
        })
        .catch(err => {
            console.error('Error:', err);
        });
        
        selectedFiles = [];
        clearForm();
    }
    
    function clearForm() {
        if (messageInput) {
            messageInput.value = '';
            messageInput.style.height = 'auto';
        }
        
        if (sendBtn) {
            sendBtn.disabled = true;
        }
        
        if (filePreview) {
            filePreview.innerHTML = '';
        }
        
        if (fileInput) {
            fileInput.value = '';
        }
    }
    
    function displayUserMessage(files, text) {
        if (!chatArea) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user-message';
        
        let filesHtml = '';
        if (files.length > 0) {
            filesHtml = '<div class="message-files">';
            files.forEach(file => {
                const icon = getFileIcon(file.name);
                filesHtml += `
                    <div class="message-file-item">
                        <i class="bi ${icon}"></i>
                        <div class="file-info">
                            <span class="file-name">${file.name}</span>
                            <span class="file-size">${formatFileSize(file.size)}</span>
                        </div>
                    </div>
                `;
            });
            filesHtml += '</div>';
        }
        
        const textHtml = text ? `<div class="message-text">${text}</div>` : '';
        messageDiv.innerHTML = filesHtml + textHtml;
        chatArea.appendChild(messageDiv);
    }
    
    function displayBotResponse(text) {
        if (!chatArea) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.innerHTML = `<div class="message-text">${text}</div>`;
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }
    
    function displayDownloadLink(fileUrl) {
        if (!chatArea) return;
        
        const linkDiv = document.createElement('div');
        linkDiv.className = 'chat-message';
        linkDiv.innerHTML = `
            <div class="message-text">
                <a href="${fileUrl}" download class="download-link">
                    <i class="bi bi-download"></i> Download File
                </a>
            </div>
        `;
        chatArea.appendChild(linkDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }
    
    function showLoadingIndicator() {
        if (!chatArea) return;
        
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-indicator';
        loadingDiv.id = 'loadingIndicator';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <span class="loading-text">Analyzing...</span>
        `;
        chatArea.appendChild(loadingDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }
    
    function hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }
    
    // Initialize
    if (sendBtn && messageInput) {
        sendBtn.disabled = messageInput.value.trim() === '';
    }
});