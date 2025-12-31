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
    const projectSubmenu = document.getElementById('projectSubmenu');
    const preContractItem = document.getElementById('preContractItem');
    const postContractItem = document.getElementById('postContractItem');
    const preContractSubmenu = document.getElementById('preContractSubmenu');
    const postContractSubmenu = document.getElementById('postContractSubmenu');
    
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
    
    // Toggle Project submenu on click
    if (projectIcon) {
        projectIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            projectSubmenu.classList.toggle('active');
            
            // Close nested submenus when main submenu closes
            if (!projectSubmenu.classList.contains('active')) {
                preContractSubmenu.classList.remove('active');
                postContractSubmenu.classList.remove('active');
            }
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
    if (preContractSubmenu) {
        preContractSubmenu.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
    }
    
    if (postContractSubmenu) {
        postContractSubmenu.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
    }
    
    // Close nested submenus when mouse leaves both the main menu and nested menu
    if (projectSubmenu) {
        projectSubmenu.addEventListener('mouseleave', function(e) {
            // Check if mouse is not entering a nested submenu
            const relatedTarget = e.relatedTarget;
            if (!relatedTarget || 
                (!relatedTarget.closest('#preContractSubmenu') && 
                 !relatedTarget.closest('#postContractSubmenu'))) {
                setTimeout(() => {
                    if (preContractSubmenu) preContractSubmenu.classList.remove('active');
                    if (postContractSubmenu) postContractSubmenu.classList.remove('active');
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
    
    // Close all menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.sidebar') && 
            !e.target.closest('.submenu-panel')) {
            if (projectSubmenu) projectSubmenu.classList.remove('active');
            if (preContractSubmenu) preContractSubmenu.classList.remove('active');
            if (postContractSubmenu) postContractSubmenu.classList.remove('active');
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
            // Example: 
            // if (itemName === 'CD') { loadCDPage(); }
            // if (itemName === "IPC's") { loadIPCPage(); }
        });
    });
    
    // ====================== //
    // TENDER ANALYSIS       //
    // ====================== //
    
    function showTenderUploadSection() {
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
        
        // Re-attach event listeners for the new elements
        setupTenderUploadListeners();
        
        // Clear previous files
        selectedFiles = [];
        if (filePreview) {
            filePreview.innerHTML = '';
        }
        
        // Close all menus
        if (projectSubmenu) projectSubmenu.classList.remove('active');
        if (preContractSubmenu) preContractSubmenu.classList.remove('active');
        if (postContractSubmenu) postContractSubmenu.classList.remove('active');
    }
    
    // Setup upload listeners (separate function to reuse)
    function setupTenderUploadListeners() {
        const newDragDropZone = document.getElementById('dragDropZone');
        
        if (newDragDropZone && fileInput) {
            // Click to browse files - USE THE SAME FILE INPUT AT BOTTOM
            newDragDropZone.addEventListener('click', function() {
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
                handleFileSelection(files);
            }, false);
        }
    }
    
    // UNIFIED file handling function for BOTH inputs
    function handleFileSelection(files) {
        const filesArray = Array.from(files);
        selectedFiles.push(...filesArray);
        displayFilePreview();
        
        // Enable send button if files are uploaded
        if (sendBtn && selectedFiles.length > 0) {
            sendBtn.disabled = false;
        }
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
    
    function handleTenderFiles(files) {
        const filesArray = Array.from(files);
        
        // UNCOMMENT BELOW TO ADD FILE SIZE LIMIT (e.g., 10MB per file)
        // const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        // const oversizedFiles = filesArray.filter(file => file.size > maxSize);
        // if (oversizedFiles.length > 0) {
        //     alert(`Some files exceed the 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
        //     return;
        // }
        
        // UNCOMMENT BELOW TO ADD FILE COUNT LIMIT (e.g., max 10 files)
        // const maxFiles = 10;
        // if (tenderFiles.length + filesArray.length > maxFiles) {
        //     alert(`You can only upload up to ${maxFiles} files at a time.`);
        //     return;
        // }
        
        // Add files to tender files array
        tenderFiles.push(...filesArray);
        
        // Display thumbnails in the upload section
        displayTenderFiles();
        
        // Keep upload section visible so user can type message
        // Enable send button if files are uploaded
        if (sendBtn && tenderFiles.length > 0) {
            sendBtn.disabled = false;
        }
        
        // Reset file input
        const input = document.getElementById('tenderFileInput');
        if (input) {
            input.value = '';
        }
    }
    
    function displayTenderFiles() {
        const grid = document.getElementById('uploadedFilesGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        tenderFiles.forEach((file, index) => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-thumbnail';
            
            // Check if file is an image
            const isImage = file.type.startsWith('image/');
            
            if (isImage) {
                // Create image thumbnail
                const reader = new FileReader();
                reader.onload = function(e) {
                    fileDiv.innerHTML = `
                        <img src="${e.target.result}" alt="${file.name}" class="file-thumbnail-image">
                        <div class="file-thumbnail-info">
                            <div class="file-thumbnail-name" title="${file.name}">${file.name}</div>
                            <div class="file-thumbnail-size">${formatFileSize(file.size)}</div>
                        </div>
                        <div class="file-thumbnail-remove" data-index="${index}">
                            <i class="bi bi-x"></i>
                        </div>
                    `;
                    
                    // Add remove functionality
                    fileDiv.querySelector('.file-thumbnail-remove').addEventListener('click', function(e) {
                        e.stopPropagation();
                        removeTenderFile(parseInt(this.getAttribute('data-index')));
                    });
                };
                reader.readAsDataURL(file);
            } else {
                // Create icon thumbnail for non-image files
                const icon = getFileIcon(file.name);
                fileDiv.innerHTML = `
                    <div class="file-thumbnail-icon">
                        <i class="bi ${icon}"></i>
                    </div>
                    <div class="file-thumbnail-info">
                        <div class="file-thumbnail-name" title="${file.name}">${file.name}</div>
                        <div class="file-thumbnail-size">${formatFileSize(file.size)}</div>
                    </div>
                    <div class="file-thumbnail-remove" data-index="${index}">
                        <i class="bi bi-x"></i>
                    </div>
                `;
                
                // Add remove functionality
                fileDiv.querySelector('.file-thumbnail-remove').addEventListener('click', function(e) {
                    e.stopPropagation();
                    removeTenderFile(parseInt(this.getAttribute('data-index')));
                });
            }
            
            grid.appendChild(fileDiv);
        });
    }
    
    function removeTenderFile(index) {
        tenderFiles.splice(index, 1);
        displayTenderFiles();
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
    
    // Handle file selection
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            selectedFiles = Array.from(e.target.files);
            displayFilePreview();
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
            
            // Enable/disable send button
            if (sendBtn) {
                sendBtn.disabled = selectedFiles.length === 0 && this.value.trim() === '';
            }
        });
        
        // Handle Enter key
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (selectedFiles.length > 0 || this.value.trim() !== '') {
                    fileUploadForm.dispatchEvent(new Event('submit'));
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
            // const isInTenderMode = uploadSection && uploadSection.style.display === 'block';
            
            // if (isInTenderMode) {
            //     // Handle tender analysis submission
            //     if (tenderFiles.length === 0 && message === '') {
            //         alert('Please upload at least one file or type a message');
            //         return;
            //     }
                
            //     // Hide upload section and reset chat area styling
            //     uploadSection.style.display = 'none';
            //     uploadSection.style.display = 'none';
            //     if (chatArea) {
            //         chatArea.style.justifyContent = 'flex-start';
            //         chatArea.style.alignItems = 'flex-start';
            //     }
                
            //     // Display user message with files in chat
            //     displayTenderMessage(tenderFiles, message);
                
            //     // Show loading indicator
            //     showLoadingIndicator();
                
            //     // Simulate server response (replace with actual server call)
            //     setTimeout(() => {
            //         hideLoadingIndicator();
            //         displayBotResponse('Thank you! I have received your tender documents and will analyze them shortly.');
            //     }, 2000);
                
            //     // Clear tender files
            //     tenderFiles = [];
                
            // }
            // Check if we're in tender analysis mode
            const uploadSectionElement = document.getElementById('uploadSection');
            const isInTenderMode = uploadSectionElement !== null; 
            if (isInTenderMode){
                // Handle tender analysis submission
                if (selectedFiles.length === 0 && message === '') {
                    alert('Please upload at least one file or type a message');
                    return;
                }
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
                displayUserMessage(selectedFiles, message);
                selectedFiles = [];
                // Scroll to bottom
                if (chatArea) {
                    chatArea.scrollTop = chatArea.scrollHeight;
                }
                    // Show loading indicator
                showLoadingIndicator();
                
                // Simulate server response
                setTimeout(() => {
                    hideLoadingIndicator();
                    const fileCount = selectedFiles.length;
                    const fileText = fileCount === 1 ? 'file' : 'files';
                    // displayBotResponse(`Thank you! I have received your ${fileCount} ${fileText} and will analyze them shortly.`);
                }, 2000);

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
    
    // Display tender analysis message with files
    function displayTenderMessage(files, text) {
        // This function is no longer needed - we use displayUserMessage instead
        // Keeping it for backward compatibility but redirecting to displayUserMessage
        displayUserMessage(files, text);
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
    
    // Helper functions
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
    
    // Initialize send button state
    if (sendBtn && messageInput) {
        sendBtn.disabled = messageInput.value.trim() === '';
    }
    
});