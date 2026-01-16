from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
import ollama
from .boq_merger import BOQMerger
from . import qs_config

# Store conversation history (in production, use database or session)
# Format: {session_id: [messages]}
conversation_memory = {}


def index(request):
    """
    Main page - handles both GET (display) and POST (chat with Ollama)
    """
    if request.method == "POST":
        # Handle chat on the index page
        return chat(request)
    return render(request, 'chatapp/index.html')


def chat(request):
    """
    Handle regular chat messages with Ollama with conversation memory
    """
    if request.method == "POST":
        message = request.POST.get("message", "").strip()
        files = request.FILES.getlist("files")
        
        # Get or create session ID (using session framework)
        if not request.session.session_key:
            request.session.create()
        session_id = request.session.session_key
        
        print(f"\n{'='*60}")
        print(f"💬 CHAT REQUEST RECEIVED")
        print(f"{'='*60}")
        print(f"Session ID: {session_id}")
        print(f"Message: '{message}'")
        print(f"Files: {len(files)}")
        
        # Handle file uploads if present
        uploaded_files_info = []
        if files:
            upload_dir = os.path.join(settings.MEDIA_ROOT, 'chat_uploads')
            os.makedirs(upload_dir, exist_ok=True)
            fs = FileSystemStorage(location=upload_dir)
            
            for file in files:
                filename = fs.save(file.name, file)
                uploaded_files_info.append({
                    'name': file.name,
                    'size': file.size,
                    'url': f'/media/chat_uploads/{filename}'
                })
                print(f"  ✓ Uploaded: {file.name}")
        
        # Prepare context for Ollama
        if uploaded_files_info:
            file_context = f"\n\nUser uploaded {len(uploaded_files_info)} file(s): " + \
                          ", ".join([f['name'] for f in uploaded_files_info])
            full_message = message + file_context if message else f"I uploaded these files: {file_context}"
        else:
            full_message = message
        
        if not full_message:
            print("❌ No message provided")
            return JsonResponse({
                "success": False,
                "response": "Please provide a message or upload files."
            })
        
        try:
            # Initialize conversation history for this session
            if session_id not in conversation_memory:
                conversation_memory[session_id] = []
            
            # Get conversation history
            history = conversation_memory[session_id]
            
            # Build messages array with system prompt and history
            messages = [
                {
                    'role': 'system',
                    'content': qs_config.QS_SYSTEM_PROMPT,
                }
            ]
            
            # Add conversation history (limited to MAX_CONVERSATION_HISTORY)
            max_history = qs_config.MAX_CONVERSATION_HISTORY
            if len(history) > max_history:
                history = history[-max_history:]
            
            messages.extend(history)
            
            # Add current user message
            messages.append({
                'role': 'user',
                'content': full_message,
            })
            
            print(f"\n🤖 Calling Ollama (Model: {qs_config.OLLAMA_MODEL})...")
            print(f"Conversation history: {len(history)} messages")
            print(f"Current message: {full_message[:200]}...")
            
            # Call Ollama API
            response = ollama.chat(
                model=qs_config.OLLAMA_MODEL,
                messages=messages,
                options=qs_config.OLLAMA_OPTIONS
            )
            
            bot_response = response['message']['content']
            
            # Save to conversation history
            conversation_memory[session_id].append({
                'role': 'user',
                'content': full_message
            })
            conversation_memory[session_id].append({
                'role': 'assistant',
                'content': bot_response
            })
            
            print(f"✅ Ollama Response received (length: {len(bot_response)})")
            print(f"Response preview: {bot_response[:200]}...")
            print(f"Total messages in history: {len(conversation_memory[session_id])}")
            print(f"{'='*60}\n")
            
            return JsonResponse({
                "success": True,
                "response": bot_response,
                "uploaded_files": uploaded_files_info,
                "conversation_length": len(conversation_memory[session_id])
            })
            
        except Exception as e:
            print(f"❌ Ollama Error: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            import traceback
            traceback.print_exc()
            
            return JsonResponse({
                "success": False,
                "response": f"Sorry, I encountered an error: {str(e)}\n\nMake sure Ollama is running: ollama serve"
            }, status=500)
    
    return render(request, 'chatapp/chat.html')


def clear_chat_history(request):
    """
    Clear conversation history for current session
    """
    if request.session.session_key in conversation_memory:
        del conversation_memory[request.session.session_key]
    return JsonResponse({"success": True, "message": "Chat history cleared"})


def Login(request):
    return render(request, 'chatapp/login.html')


def tender_analysis(request):
    """
    Handle tender analysis file uploads
    Expects 3 files: Template, BOQ1, BOQ2
    """
    if request.method == "GET":
        return render(request, "chatapp/index.html")

    if request.method == "POST":
        print("\n" + "="*60)
        print("📥 TENDER ANALYSIS REQUEST RECEIVED")
        print("="*60)
        
        message = request.POST.get("message", "")
        upload_source = request.POST.get("upload_source")
        files = request.FILES.getlist("files")
        
        print(f"Message: {message}")
        print(f"Upload Source: {upload_source}")
        print(f"Files Received: {len(files)}")
        
        # Validate file count
        if len(files) != 3:
            return JsonResponse({
                "success": False,
                "error": f"Expected 3 files (Template, BOQ1, BOQ2), but received {len(files)} files.",
                "response": "❌ Please upload exactly 3 Excel files: Template, BOQ1, and BOQ2"
            }, status=400)
        
        # Setup file storage
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'tender_uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        fs = FileSystemStorage(location=upload_dir)
        saved_paths = []
        
        # Save all uploaded files
        for idx, file in enumerate(files):
            filename = fs.save(file.name, file)
            full_path = os.path.join(upload_dir, filename)
            saved_paths.append(full_path)
            print(f"  ✓ File {idx+1}: {file.name} ({file.size} bytes)")
        
        # Assign files (assuming order: Template, BOQ1, BOQ2)
        template_file = saved_paths[0]
        boq1_file = saved_paths[1]
        boq2_file = saved_paths[2]
        
        # Generate output filename
        output_filename = 'Merged_BOQ_Output.xlsx'
        output_path = os.path.join(upload_dir, output_filename)
        
        print("\n🔧 Starting BOQ Merge Process...")
        print(f"  Template: {os.path.basename(template_file)}")
        print(f"  BOQ 1: {os.path.basename(boq1_file)}")
        print(f"  BOQ 2: {os.path.basename(boq2_file)}")
        
        try:
            # Initialize BOQ Merger
            merger = BOQMerger(template_file)
            
            # Perform merge
            merger.merge_two_boqs(boq1_file, boq2_file)
            
            # Save output
            merger.save(output_path)
            
            # Generate download URL
            output_url = '/media/tender_uploads/' + output_filename
            
            print(f"\n📁 Output saved to: {output_path}")
            print(f"🔗 Download URL: {output_url}")
            print("\n" + "="*60)
            print("✅ BOQ MERGE SUCCESSFUL!")
            print("="*60)
            
            return JsonResponse({
                "success": True,
                "response": "✅ BOQ files merged successfully! Click below to download the comparison file.",
                "message": message,
                "upload_source": upload_source,
                "files": [output_url],
                "output_file": output_filename
            })
            
        except Exception as e:
            print(f"\n❌ ERROR during merge: {str(e)}")
            import traceback
            traceback.print_exc()
            
            return JsonResponse({
                "success": False,
                "error": str(e),
                "response": f"❌ Error during merge: {str(e)}"
            }, status=500)