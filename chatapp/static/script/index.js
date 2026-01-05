// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
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
    const addNew = document.getElementById('addNew');
    const yearSubmenu = document.getElementById('yearSubmenu');
    // const projectSubmenuHeader = projectSubmenu.querySelector('.submenu-header');
    // const project1Item = document.getElementById('project1Item');
    // const project2Item = document.getElementById('project2Item');
    // const projectWrapper = document.getElementById('projectWrapper');
    const projectSubmenu = document.getElementById('projectSubmenu');
    const projectSubmenuHeader =projectSubmenu?.querySelector('.submenu-header');
    const preContractItem = document.getElementById('preContractItem');
    const postContractItem = document.getElementById('postContractItem');
    const preContractSubmenu = document.getElementById('preContractSubmenu');
    const postContractSubmenu = document.getElementById('postContractSubmenu');
    const addProjectBtn = document.getElementById('addProjectBtn');

    const accountIcon = document.getElementById('accountIcon');
    const accountSubmenu = document.getElementById('accountSubmenu');

    // Tender Analysis Upload elements
    const uploadSection = document.getElementById('uploadSection');
    const dragDropZone = document.getElementById('dragDropZone');
    const tenderFileInput = document.getElementById('tenderFileInput');
    const uploadedFilesGrid = document.getElementById('uploadedFilesGrid');
    
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
            
            // Close nested submenus when main submenu closes
            if (!projectMainmenu.classList.contains('active')) {
                yearSubmenu.classList.remove('active');
                projectSubmenu.classList.remove('active');
                preContractSubmenu.classList.remove('active');
                postContractSubmenu.classList.remove('active');
            }
        });
    }

    // Show Year Submenu (2026) on HOVER over "2026"
    if (folderByYear) {
        folderByYear.addEventListener('mouseenter', function(e) {
            yearSubmenu.classList.add('active');
        });
    }

    // Keep year submenu open when hovering over it
    if (yearSubmenu) {
        yearSubmenu.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
    }
    // Handle ANY project item
    document.querySelectorAll('#yearSubmenu .submenu-item.has-nested')
    .forEach(projectItem => {

        const openProject = () => {
            const projectName =
                projectItem.dataset.projectName ||
                projectItem.querySelector('span')?.textContent ||
                'Project';

            projectSubmenu.classList.add('active');
            preContractSubmenu.classList.remove('active');
            postContractSubmenu.classList.remove('active');
            projectSubmenuHeader.textContent = projectName;
        };

        projectItem.addEventListener('mouseenter', openProject);
        projectItem.addEventListener('click', openProject);
    });
    // Show Project Submenu on HOVER over Project 1
    // if (project1Item) {
    //     project1Item.addEventListener('mouseenter', function(e) {
    //         projectSubmenu.classList.add('active');
    //         preContractSubmenu.classList.remove('active');
    //         postContractSubmenu.classList.remove('active');
    //     });
    // }

    // // Show Project Submenu on HOVER over Project 2
    // if (project2Item) {
    //     project2Item.addEventListener('mouseenter', function(e) {
    //         projectSubmenu.classList.add('active');
    //         preContractSubmenu.classList.remove('active');
    //         postContractSubmenu.classList.remove('active');
    //     });
    // }

    // Keep project submenu open when hovering over it
    if (projectSubmenu) {
        projectSubmenu.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
    }
  
    // Show Pre-Contract nested submenu on HOVER
    if (preContractItem) {
        preContractItem.addEventListener('mouseenter', function(e) {
            preContractSubmenu.classList.add('active');
            postContractSubmenu.classList.remove('active');
        });
    }
    
    // Show Post-Contract nested submenu on HOVER
    if (postContractItem) {
        postContractItem.addEventListener('mouseenter', function(e) {
            postContractSubmenu.classList.add('active');
            preContractSubmenu.classList.remove('active');
        });
    }
    
    // Keep nested submenus open when hovering over them
    // if (preContractSubmenu) {
    //     preContractSubmenu.addEventListener('mouseenter', function() {
    //         this.classList.add('active');
    //     });
    // }
    
    // if (postContractSubmenu) {
    //     postContractSubmenu.addEventListener('mouseenter', function() {
    //         this.classList.add('active');
    //     });
    // }
    
    // Close year submenu when mouse leaves
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
 

    // Close year submenu and its children when mouse leaves
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

    // Close project submenu and its children when mouse leaves
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
    
    // Close nested submenus when mouse leaves them
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

    // Handle Add Project Button Click
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('Add New Project functionality will be implemented here');
            // You can add your project creation logic here
        });
    }

    // Toggle Account submenu on click
    accountIcon.addEventListener('click', () => {
        const iconRect = accountIcon.getBoundingClientRect();

        // Disable top positioning from CSS
        accountSubmenu.style.top = 'auto';

        // Calculate bottom position relative to icon
        let bottomOffset = window.innerHeight - iconRect.bottom - 10;

        // Safety: prevent off-screen
        if (bottomOffset < 20) bottomOffset = 20;

        accountSubmenu.style.bottom = bottomOffset + 'px';

        accountSubmenu.classList.toggle('active');

        // Close other submenus
        projectMainmenu.classList.remove('active');
        yearSubmenu.classList.remove('active');
        projectSubmenu.classList.remove('active');
        preContractSubmenu.classList.remove('active');
        postContractSubmenu.classList.remove('active');
    });
    
    // Close all menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.sidebar') && 
            !e.target.closest('.submenu-panel')) {
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
            // Don't handle clicks on items that have nested submenus
            if (this.classList.contains('has-nested')) {
                return;
            }
            
            // Remove active class from all items
            document.querySelectorAll('.submenu-item').forEach(i => {
                if (!i.classList.contains('has-nested')) {
                    i.classList.remove('active');
                }
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the text content of the clicked item
            const itemName = this.querySelector('span').textContent;
            console.log('Selected:', itemName);
            
            // Handle Tender Analysis click
            if (itemName === 'Tender Analysis') {
                showTenderUploadSection();
            }
            
            // Add your functionality here for other menu items
        });
    });
    
    // ====================== //
    // TENDER ANALYSIS       //
    // ====================== //
    
    function showTenderUploadSection() {
        console.log('=== Showing Tender Upload Section ===');
        
        // Hide center greeting
        if (centerGreeting) {
            centerGreeting.classList.add('hidden');
        }
        
        // Clear chat area completely and reset styling
        if (chatArea) {
            chatArea.innerHTML = '';
            chatArea.style.justifyContent = 'center';
            chatArea.style.alignItems = 'center';
        }
        
        // Create fresh upload section
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
        
        console.log('Upload section created. Checking if it exists:', document.getElementById('uploadSection') !== null);
        
        // Re-attach event listeners for the new elements
        setupTenderUploadListeners();
        
        // Clear previous files
        selectedFiles = [];
        if (filePreview) {
            filePreview.innerHTML = '';
        }
        
        // IMPORTANT: Update send button state to disabled after clearing files
        if (sendBtn) {
            sendBtn.disabled = true;
            console.log('Send button disabled after clearing files');
        }
        
        // Close all menus
        if (projectMainmenu) projectMainmenu.classList.remove('active');
        if (yearSubmenu) yearSubmenu.classList.remove('active');
        if (projectSubmenu) projectSubmenu.classList.remove('active');
        if (preContractSubmenu) preContractSubmenu.classList.remove('active');
        if (postContractSubmenu) postContractSubmenu.classList.remove('active');
    }
    
    // Setup upload listeners (separate function to reuse)
    function setupTenderUploadListeners() {
        const newDragDropZone = document.getElementById('dragDropZone');
        
        if (newDragDropZone && fileInput) {
            console.log('Setting up tender upload listeners');
            
            // Click to browse files - USE THE SAME FILE INPUT AT BOTTOM
            newDragDropZone.addEventListener('click', function() {
                console.log('Drag zone clicked, opening file browser');
                fileInput.click();
            });
            
            // Prevent default drag behaviors
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                newDragDropZone.addEventListener(eventName, preventDefaults, false);
            });
            
            // Highlight drop zone when item is dragged over it
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
            
            // Handle dropped files - USE SAME HANDLER
            newDragDropZone.addEventListener('drop', function(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                console.log('Files dropped:', files.length);
                handleFileSelection(files);
            }, false);
        }
    }
    
    // UNIFIED file handling function for BOTH inputs
    function handleFileSelection(files) {
        console.log('=== handleFileSelection called ===');
        console.log('Files received:', files.length);
        
        const filesArray = Array.from(files);
        selectedFiles.push(...filesArray);
        displayFilePreview();
        
        console.log('Total selected files:', selectedFiles.length);
        
        // Check if we're in tender analysis mode
        const uploadSectionElement = document.getElementById('uploadSection');
        const isInTenderMode = uploadSectionElement !== null;
        
        console.log('Is in Tender Mode:', isInTenderMode);
        console.log('Send button exists:', sendBtn !== null);
        
        // Enable send button if files are uploaded
        if (sendBtn && selectedFiles.length > 0) {
            sendBtn.disabled = false;
            console.log('✓ Send button ENABLED - Files:', selectedFiles.length);
        } else if (sendBtn) {
            console.log('✗ Send button NOT enabled - Files:', selectedFiles.length);
        } else {
            console.log('✗ Send button element not found!');
        }
        
        console.log('=== handleFileSelection end ===');
    }
    
    // Drag and Drop functionality - Initial setup
    setupInitialTenderUploadListeners();
    
    function setupInitialTenderUploadListeners() {
        const zone = document.getElementById('dragDropZone');
        
        if (!zone || !fileInput) return;
        
        // Click to browse files - use same input
        zone.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            zone.addEventListener(eventName, function() {
                zone.classList.add('drag-over');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, function() {
                zone.classList.remove('drag-over');
            }, false);
        });
        
        // Handle dropped files
        zone.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFileSelection(files);
        }, false);
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
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
    
    // Make sidebar icons active on click
    document.querySelectorAll('.sidebar-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            // Remove active class from all icons except those with submenus
            if (!this.classList.contains('has-submenu')) {
                document.querySelectorAll('.sidebar-icon').forEach(i => {
                    i.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // ====================== //
    // FILE HANDLING         //
    // ====================== //
    
    // Handle file selection from the main file input
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            console.log('=== File input changed ===');
            console.log('Files selected:', e.target.files.length);
            
            selectedFiles = Array.from(e.target.files);
            displayFilePreview();
            
            // Check if in tender mode and update button accordingly
            const uploadSectionElement = document.getElementById('uploadSection');
            const isInTenderMode = uploadSectionElement !== null;
            
            console.log('Is in Tender Mode:', isInTenderMode);
            console.log('File count:', selectedFiles.length);
            
            if (sendBtn) {
                if (isInTenderMode && selectedFiles.length > 0) {
                    sendBtn.disabled = false;
                    console.log('✓ Send button ENABLED (Tender mode with files)');
                } else if (!isInTenderMode && selectedFiles.length > 0) {
                    sendBtn.disabled = false;
                    console.log('✓ Send button ENABLED (Normal mode with files)');
                } else {
                    console.log('Send button state unchanged');
                }
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
            
            // Add click event to remove button
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
        
        // Update send button state after removing file
        const uploadSectionElement = document.getElementById('uploadSection');
        const isInTenderMode = uploadSectionElement !== null;
        
        if (sendBtn) {
            if (isInTenderMode) {
                sendBtn.disabled = selectedFiles.length === 0;
            } else {
                sendBtn.disabled = selectedFiles.length === 0 && messageInput.value.trim() === '';
            }
        }
        
        // Reset file input
        if (fileInput) {
            fileInput.value = '';
        }
    }
    
    // ====================== //
    // MESSAGE HANDLING      //
    // ====================== //
    
    // Auto-resize textarea
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            
            // Check if we're in tender analysis mode
            const uploadSectionElement = document.getElementById('uploadSection');
            const isInTenderMode = uploadSectionElement !== null;
            
            console.log('Message input - Tender mode:', isInTenderMode, 'Files:', selectedFiles.length, 'Message:', this.value.trim().length);
            
            // Enable/disable send button
            if (sendBtn) {
                if (isInTenderMode) {
                    // In tender mode, enable if files are uploaded (regardless of message)
                    sendBtn.disabled = selectedFiles.length === 0;
                } else {
                    // In normal mode, enable if files OR message exists
                    sendBtn.disabled = selectedFiles.length === 0 && this.value.trim() === '';
                }
                console.log('Send button disabled:', sendBtn.disabled);
            }
        });
        
        // Handle Enter key
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                
                // Check if we're in tender analysis mode
                const uploadSectionElement = document.getElementById('uploadSection');
                const isInTenderMode = uploadSectionElement !== null;
                
                if (isInTenderMode) {
                    // In tender mode, allow submit if files are uploaded
                    if (selectedFiles.length > 0) {
                        fileUploadForm.dispatchEvent(new Event('submit'));
                    }
                } else {
                    // In normal mode, require files OR message
                    if (selectedFiles.length > 0 || this.value.trim() !== '') {
                        fileUploadForm.dispatchEvent(new Event('submit'));
                    }
                }
            }
        });
    }
    
    // Handle form submission (send message + files)
    if (fileUploadForm) {
        fileUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const message = messageInput.value.trim();
            
            // Check if we're in tender analysis mode
            const uploadSectionElement = document.getElementById('uploadSection');
            const isInTenderMode = uploadSectionElement !== null; 
            
            console.log('=== Form Submit ===');
            console.log('Tender mode:', isInTenderMode);
            console.log('Files:', selectedFiles.length);
            console.log('Message:', message);
            
            if (isInTenderMode){
                // Handle tender analysis submission
                if (selectedFiles.length === 0 && message === '') {
                    alert('Please upload at least one file or type a message');
                    return;
                }
                
                // Use automatic message if no message is typed
                const finalMessage = message || 'Tender Analysis';
                
                console.log('Final message:', finalMessage);
                
                // IMMEDIATELY remove upload section from DOM
                if (uploadSectionElement && uploadSectionElement.parentNode) {
                    uploadSectionElement.parentNode.removeChild(uploadSectionElement);
                }
                
                // Reset chat area styling
                if (chatArea) {
                    chatArea.style.justifyContent = 'flex-start';
                    chatArea.style.alignItems = 'flex-start';
                }
                
                // Display user message with files in chat
                displayUserMessage(selectedFiles, finalMessage);
                
                // Scroll to bottom
                if (chatArea) {
                    chatArea.scrollTop = chatArea.scrollHeight;
                }
                
                // Show loading indicator
                showLoadingIndicator();
                
                // SEND TO SERVER FOR TENDER ANALYSIS
                const formData = new FormData();
                formData.append('message', finalMessage);
                formData.append('upload_source', 'tender_analysis');
                
                selectedFiles.forEach(file => {
                    formData.append('files', file);
                });
                
                // Get CSRF token
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
                    
                // Send to server
                fetch("", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "X-CSRFToken": csrfToken ? csrfToken.value : ''
                    }
                })
                .then(res => res.json())
                .then(data => {
                    console.log('Tender analysis upload successful:', data);
                    hideLoadingIndicator();
                    
                    // Display bot response
                    if (data.response) {
                        displayBotResponse(data.response);
                    } else {
                        displayBotResponse('Thank you! I have received your files and will analyze them shortly.');
                    }
                })
                .catch(err => {
                    console.error('Error:', err);
                    hideLoadingIndicator();
                    displayBotResponse('Error uploading files. Please try again.');
                });
                
                // Clear files
                selectedFiles = [];
            }
            else {
                // Handle regular message submission
                if (message === '' && selectedFiles.length === 0) {
                    return;
                }
                
                // Hide center greeting
                if (centerGreeting) {
                    centerGreeting.classList.add('hidden');
                }
                
                // Display user message in chat
                if (chatArea && (message !== '' || selectedFiles.length > 0)) {
                    displayUserMessage(selectedFiles, message);
                    
                    // Scroll to bottom
                    chatArea.scrollTop = chatArea.scrollHeight;
                }
                
                // Prepare form data for server
                const formData = new FormData();
                formData.append('message', message);
                
                selectedFiles.forEach(file => {
                    formData.append('files', file);
                });
                
                // Get CSRF token
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
                
                // Send to server
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
            }
            
            // Clear input & preview
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
        });
    }
    
    // Display regular user message
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
    
    // Display bot response
    function displayBotResponse(text) {
        if (!chatArea) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.innerHTML = `<div class="message-text">${text}</div>`;
        chatArea.appendChild(messageDiv);
        
        // Scroll to bottom
        chatArea.scrollTop = chatArea.scrollHeight;
    }
    
    // Show loading indicator
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
        
        // Scroll to bottom
        chatArea.scrollTop = chatArea.scrollHeight;
    }
    
    // Hide loading indicator
    function hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }
    
    // Initialize send button state
    if (sendBtn && messageInput) {
        sendBtn.disabled = messageInput.value.trim() === '';
    }
});