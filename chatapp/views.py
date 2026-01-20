
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
import ollama
from .boq_merger import BOQMerger
from . import qs_config  # Import configuration


def index(request):
    """
    Main page - handles both GET (display) and POST (chat with Ollama)
    """
    if request.method == "POST":
        return chat(request)
    return render(request, 'chatapp/index.html')


def chat(request):
    """
    Handle chat messages with Ollama - OPTIMIZED FOR SPEED
    """
    if request.method == "POST":
        message = request.POST.get("message", "").strip()
        files = request.FILES.getlist("files")
        
        print(f"\n{'='*60}")
        print(f"💬 CHAT REQUEST")
        print(f"{'='*60}")
        print(f"Message: '{message}'")
        print(f"Files: {len(files)}")
        
        # Handle file uploads
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
        
        # Prepare message
        if uploaded_files_info:
            file_context = f"\n\nUser uploaded {len(uploaded_files_info)} file(s): " + \
                          ", ".join([f['name'] for f in uploaded_files_info])
            full_message = message + file_context if message else file_context
        else:
            full_message = message
        
        if not full_message:
            return JsonResponse({
                "success": False,
                "response": "Please provide a message or upload files."
            })
        
        try:
            # Call Ollama with FAST settings
            print(f"🤖 Calling Ollama (Model: {qs_config.OLLAMA_MODEL})...")
            
            response = ollama.chat(
                model=qs_config.OLLAMA_MODEL,
                messages=[
                    {
                        'role': 'system',
                        'content': qs_config.QS_SYSTEM_PROMPT,  # Uses FAST prompt
                    },
                    {
                        'role': 'user',
                        'content': full_message,
                    },
                ],
                options=qs_config.OLLAMA_OPTIONS  # Speed optimizations
            )
            
            bot_response = response['message']['content']
            
            print(f"✅ Response received ({len(bot_response)} chars)")
            print(f"{'='*60}\n")
            
            return JsonResponse({
                "success": True,
                "response": bot_response,
                "uploaded_files": uploaded_files_info
            })
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            import traceback
            traceback.print_exc()
            
            return JsonResponse({
                "success": False,
                "response": f"Error: {str(e)}\n\nMake sure Ollama is running: ollama serve"
            }, status=500)
    
    return render(request, 'chatapp/chat.html')


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
        print("📥 TENDER ANALYSIS REQUEST")
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