
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const chatArea = document.getElementById('chatArea');
        const fileInput = document.getElementById('fileInput');
        const filePreview = document.getElementById('filePreview');
        const centerGreeting = document.getElementById('centerGreeting');
        let selectedFiles = [];

        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            
            // Enable/disable send button
            sendBtn.disabled = this.value.trim() === '';
        });

        // Handle Enter key
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (this.value.trim() !== '') {
                    sendMessage();
                }
            }
        });

        // Send message
        sendBtn.addEventListener('click', sendMessage);

        function sendMessage() {
            const message = messageInput.value.trim();
            if (message === '') return;

            // Hide center greeting
            centerGreeting.classList.add('hidden');

            // Add message to chat
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message';
            messageDiv.textContent = message;
            chatArea.appendChild(messageDiv);

            // Clear input
            messageInput.value = '';
            messageInput.style.height = 'auto';
            sendBtn.disabled = true;

            // Clear files
            selectedFiles = [];
            filePreview.innerHTML = '';

            // Scroll to bottom
            chatArea.scrollTop = chatArea.scrollHeight;
        }

        // Handle file selection
        fileInput.addEventListener('change', function(e) {
            selectedFiles = Array.from(e.target.files);
            displayFilePreview();
        });

        function displayFilePreview() {
            filePreview.innerHTML = '';
            selectedFiles.forEach((file, index) => {
                const chip = document.createElement('div');
                chip.className = 'file-chip';
                chip.innerHTML = `
                    <i class="bi bi-paperclip"></i>
                    <span>${file.name}</span>
                    <span class="remove" onclick="removeFile(${index})">
                        <i class="bi bi-x"></i>
                    </span>
                `;
                filePreview.appendChild(chip);
            });
        }

        function removeFile(index) {
            selectedFiles.splice(index, 1);
            displayFilePreview();
        }

        // Sidebar icon click handlers
        document.querySelectorAll('.sidebar-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                document.querySelectorAll('.sidebar-icon').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
    