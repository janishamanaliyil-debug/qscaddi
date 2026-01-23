
# from django.shortcuts import render
# from django.http import JsonResponse, HttpResponse
# from django.core.files.storage import FileSystemStorage
# from django.conf import settings
# import os
# import requests  # For calling external API
# from .boq_merger import BOQMerger
# from . import qs_config


# def index(request):
#     """
#     Main page - handles both GET (display) and POST (chat with External API)
#     """
#     if request.method == "POST":
#         return chat(request)
#     return render(request, 'chatapp/index.html')


# def chat(request):
#     """
#     Handle chat messages - Connects to External POMI-trained API
#     """
#     if request.method == "POST":
#         message = request.POST.get("message", "").strip()
#         files = request.FILES.getlist("files")
        
#         print(f"\n{'='*60}")
#         print(f"💬 CHAT REQUEST")
#         print(f"{'='*60}")
#         print(f"Message: '{message}'")
#         print(f"Files: {len(files)}")
        
#         # Handle file uploads
#         uploaded_files_info = []
#         if files:
#             upload_dir = os.path.join(settings.MEDIA_ROOT, 'chat_uploads')
#             os.makedirs(upload_dir, exist_ok=True)
#             fs = FileSystemStorage(location=upload_dir)
            
#             for file in files:
#                 filename = fs.save(file.name, file)
#                 uploaded_files_info.append({
#                     'name': file.name,
#                     'size': file.size,
#                     'url': f'/media/chat_uploads/{filename}'
#                 })
#                 print(f"  ✓ Uploaded: {file.name}")
        
#         # Prepare message
#         if uploaded_files_info:
#             file_context = f"\n\nUser uploaded {len(uploaded_files_info)} file(s): " + \
#                           ", ".join([f['name'] for f in uploaded_files_info])
#             full_message = message + file_context if message else file_context
#         else:
#             full_message = message
        
#         if not full_message:
#             return JsonResponse({
#                 "success": False,
#                 "response": "Please provide a message or upload files."
#             })
        
#         # Check if we should use local Ollama (temporary solution)
#         if qs_config.USE_LOCAL_OLLAMA:
#             print("🔄 Using LOCAL OLLAMA (POMI API not accessible)")
#             try:
#                 import ollama
#                 response = ollama.chat(
#                     model=qs_config.OLLAMA_MODEL,
#                     messages=[
#                         {'role': 'system', 'content': qs_config.QS_SYSTEM_PROMPT_FAST},
#                         {'role': 'user', 'content': full_message},
#                     ],
#                     options=qs_config.OLLAMA_OPTIONS
#                 )
                
#                 bot_response = response['message']['content']
#                 print(f"✅ Ollama Response received")
                
#                 return JsonResponse({
#                     "success": True,
#                     "response": bot_response,
#                     "uploaded_files": uploaded_files_info,
#                     "source": "Local Ollama (Fallback)"
#                 })
#             except Exception as e:
#                 print(f"❌ Ollama Error: {str(e)}")
#                 return JsonResponse({
#                     "success": False,
#                     "response": f"Error: {str(e)}\n\nMake sure Ollama is running: ollama serve"
#                 }, status=500)
        
#         # Try External POMI API
#         try:
#             # Call External POMI API
#             api_url = qs_config.EXTERNAL_API_URL
            
#             print(f"🌐 Calling External POMI API: {api_url}")
#             print(f"Question: {full_message[:200]}...")
            
#             # Try different request formats (API might expect different field names)
#             request_formats = [
#                 {"question": full_message},  # Original format
#                 {"query": full_message},     # Alternative 1
#                 {"prompt": full_message},    # Alternative 2
#                 {"message": full_message},   # Alternative 3
#                 {"text": full_message},      # Alternative 4
#             ]
            
#             response = None
#             last_error = None
            
#             for attempt, payload in enumerate(request_formats, 1):
#                 try:
#                     print(f"  Attempt {attempt}: Trying format {list(payload.keys())[0]}")
                    
#                     response = requests.post(
#                         api_url,
#                         json=payload,
#                         headers={"Content-Type": "application/json"},
#                         timeout=qs_config.API_TIMEOUT
#                     )
                    
#                     # If successful, break the loop
#                     if response.status_code == 200:
#                         print(f"  ✅ Success with format: {list(payload.keys())[0]}")
#                         break
#                     else:
#                         print(f"  ❌ Status {response.status_code}: {response.text[:100]}")
#                         last_error = f"Status {response.status_code}"
                        
#                 except Exception as e:
#                     print(f"  ❌ Error: {str(e)}")
#                     last_error = str(e)
#                     continue
            
#             # Check if any attempt was successful
#             if response is None or response.status_code != 200:
#                 raise Exception(f"All request formats failed. Last error: {last_error}")
            
#             # Parse response - try different response field names
#             data = response.json()
#             print(f"Response data: {data}")
            
#             # Try to find the answer in different possible fields
#             bot_response = (
#                 data.get('answer') or 
#                 data.get('response') or 
#                 data.get('result') or 
#                 data.get('output') or
#                 data.get('text') or
#                 str(data)  # Last resort - convert entire response
#             )
            
#             print(f"✅ Response received ({len(bot_response)} chars)")
#             print(f"Response preview: {bot_response[:200]}...")
#             print(f"{'='*60}\n")
            
#             return JsonResponse({
#                 "success": True,
#                 "response": bot_response,
#                 "uploaded_files": uploaded_files_info
#             })
            
#         except requests.exceptions.Timeout:
#             print(f"❌ API Timeout - Request took longer than {qs_config.API_TIMEOUT} seconds")
#             return JsonResponse({
#                 "success": False,
#                 "response": f"⏱️ Request timed out after {qs_config.API_TIMEOUT} seconds. The POMI API is taking too long to respond."
#             }, status=504)
            
#         except requests.exceptions.ConnectionError:
#             print(f"❌ Connection Error - Cannot reach {api_url}")
#             return JsonResponse({
#                 "success": False,
#                 "response": f"🔌 Cannot connect to POMI API at {api_url}. Please check:\n1. Is the server running?\n2. Is the IP address correct?\n3. Can you ping {api_url.split('//')[1].split(':')[0]}?"
#             }, status=503)
            
#         except requests.exceptions.HTTPError as e:
#             print(f"❌ HTTP Error: {e}")
#             error_details = ""
#             if response:
#                 try:
#                     error_data = response.json()
#                     error_details = f"\nDetails: {error_data}"
#                 except:
#                     error_details = f"\nResponse: {response.text[:200]}"
            
#             return JsonResponse({
#                 "success": False,
#                 "response": f"❌ POMI API Error (Status {response.status_code}){error_details}\n\nThe API might be expecting a different request format."
#             }, status=response.status_code if response else 500)
            
#         except Exception as e:
#             print(f"❌ Error: {str(e)}")
#             import traceback
#             traceback.print_exc()
            
#             return JsonResponse({
#                 "success": False,
#                 "response": f"❌ Error connecting to POMI API: {str(e)}"
#             }, status=500)
    
#     return render(request, 'chatapp/chat.html')


# def Login(request):
#     return render(request, 'chatapp/login.html')


# def tender_analysis(request):
#     """
#     Handle tender analysis file uploads
#     Expects 3 files: Template, BOQ1, BOQ2
#     """
#     if request.method == "GET":
#         return render(request, "chatapp/index.html")

#     if request.method == "POST":
#         print("\n" + "="*60)
#         print("📥 TENDER ANALYSIS REQUEST")
#         print("="*60)
        
#         message = request.POST.get("message", "")
#         upload_source = request.POST.get("upload_source")
#         files = request.FILES.getlist("files")
        
#         print(f"Message: {message}")
#         print(f"Upload Source: {upload_source}")
#         print(f"Files Received: {len(files)}")
        
#         # Validate file count
#         if len(files) != 3:
#             return JsonResponse({
#                 "success": False,
#                 "error": f"Expected 3 files (Template, BOQ1, BOQ2), but received {len(files)} files.",
#                 "response": "❌ Please upload exactly 3 Excel files: Template, BOQ1, and BOQ2"
#             }, status=400)
        
#         # Setup file storage
#         upload_dir = os.path.join(settings.MEDIA_ROOT, 'tender_uploads')
#         os.makedirs(upload_dir, exist_ok=True)
        
#         fs = FileSystemStorage(location=upload_dir)
#         saved_paths = []
        
#         # Save all uploaded files
#         for idx, file in enumerate(files):
#             filename = fs.save(file.name, file)
#             full_path = os.path.join(upload_dir, filename)
#             saved_paths.append(full_path)
#             print(f"  ✓ File {idx+1}: {file.name} ({file.size} bytes)")
        
#         # Assign files (assuming order: Template, BOQ1, BOQ2)
#         template_file = saved_paths[0]
#         boq1_file = saved_paths[1]
#         boq2_file = saved_paths[2]
        
#         # Generate output filename
#         output_filename = 'Merged_BOQ_Output.xlsx'
#         output_path = os.path.join(upload_dir, output_filename)
        
#         print("\n🔧 Starting BOQ Merge Process...")
#         print(f"  Template: {os.path.basename(template_file)}")
#         print(f"  BOQ 1: {os.path.basename(boq1_file)}")
#         print(f"  BOQ 2: {os.path.basename(boq2_file)}")
        
#         try:
#             # Initialize BOQ Merger
#             merger = BOQMerger(template_file)
            
#             # Perform merge
#             merger.merge_two_boqs(boq1_file, boq2_file)
            
#             # Save output
#             merger.save(output_path)
            
#             # Generate download URL
#             output_url = '/media/tender_uploads/' + output_filename
            
#             print(f"\n📁 Output saved to: {output_path}")
#             print(f"🔗 Download URL: {output_url}")
#             print("\n" + "="*60)
#             print("✅ BOQ MERGE SUCCESSFUL!")
#             print("="*60)
            
#             return JsonResponse({
#                 "success": True,
#                 "response": "✅ BOQ files merged successfully! Click below to download the comparison file.",
#                 "message": message,
#                 "upload_source": upload_source,
#                 "files": [output_url],
#                 "output_file": output_filename
#             })
            
#         except Exception as e:
#             print(f"\n❌ ERROR during merge: {str(e)}")
#             import traceback
#             traceback.print_exc()
            
#             return JsonResponse({
#                 "success": False,
#                 "error": str(e),
#                 "response": f"❌ Error during merge: {str(e)}"
#             }, status=500)


from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
import requests
from .boq_merger import BOQMerger
from . import qs_config


def index(request):
    """
    Main page - handles both GET (display) and POST (chat with External API)
    """
    if request.method == "POST":
        return chat(request)
    return render(request, 'chatapp/index.html')


def chat(request):
    """
    Handle chat messages - Connects to External POMI-trained API
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
        
        # Call External POMI API
        try:
            api_url = qs_config.EXTERNAL_API_URL
            
            print(f"🌐 Calling POMI API: {api_url}")
            print(f"Question: {full_message[:200]}...")
            
            # ✅ CORRECT: Send as query parameter (in URL)
            response = requests.post(
                api_url,
                params={"question": full_message},  # ← Query parameter
                timeout=qs_config.API_TIMEOUT
            )
            
            print(f"📤 Request URL: {response.url}")
            print(f"📥 Status Code: {response.status_code}")
            
            # Check response
            if response.status_code != 200:
                print(f"❌ Error Response: {response.text[:500]}")
                return JsonResponse({
                    "success": False,
                    "response": f"❌ POMI API Error (Status {response.status_code})\n\n{response.text[:300]}"
                }, status=response.status_code)
            
            # Parse successful response
            try:
                data = response.json()
                print(f"✅ Response JSON received")
            except Exception as json_error:
                print(f"❌ JSON Parse Error: {json_error}")
                print(f"Raw response: {response.text[:500]}")
                return JsonResponse({
                    "success": False,
                    "response": "❌ Invalid response format from POMI API"
                }, status=500)
            
            # Get answer from response
            bot_response = data.get('answer')
            
            if not bot_response:
                print(f"⚠️ No 'answer' field. Available fields: {list(data.keys())}")
                bot_response = str(data)
            
            print(f"✅ Answer received ({len(bot_response)} chars)")
            print(f"Preview: {bot_response[:200]}...")
            print(f"{'='*60}\n")
            
            return JsonResponse({
                "success": True,
                "response": bot_response,
                "uploaded_files": uploaded_files_info,
                "source": "POMI API"
            })
            
        except requests.exceptions.Timeout:
            print(f"❌ Timeout after {qs_config.API_TIMEOUT}s")
            return JsonResponse({
                "success": False,
                "response": f"⏱️ POMI API timed out. The AI is still processing. This can happen with:\n"
                           f"• First request (loading models)\n"
                           f"• Complex questions\n"
                           f"• Server under load\n\n"
                           f"Try asking a simpler question or wait a moment and try again."
            }, status=504)
            
        except requests.exceptions.ConnectionError as e:
            print(f"❌ Connection Error: {str(e)}")
            return JsonResponse({
                "success": False,
                "response": f"🔌 Cannot connect to POMI server.\n\n"
                           f"Please verify:\n"
                           f"1. POMI server is running at {qs_config.EXTERNAL_API_URL}\n"
                           f"2. Run: uvicorn api:app --host 0.0.0.0 --port 8000\n"
                           f"3. Both computers are on the same network"
            }, status=503)
            
        except Exception as e:
            print(f"❌ Unexpected Error: {str(e)}")
            import traceback
            traceback.print_exc()
            
            return JsonResponse({
                "success": False,
                "response": f"❌ Error: {str(e)}"
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
        
        print(f"Files Received: {len(files)}")
        
        if len(files) != 3:
            return JsonResponse({
                "success": False,
                "error": f"Expected 3 files but received {len(files)}.",
                "response": "❌ Please upload exactly 3 Excel files: Template, BOQ1, and BOQ2"
            }, status=400)
        
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'tender_uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        fs = FileSystemStorage(location=upload_dir)
        saved_paths = []
        
        for idx, file in enumerate(files):
            filename = fs.save(file.name, file)
            full_path = os.path.join(upload_dir, filename)
            saved_paths.append(full_path)
            print(f"  ✓ File {idx+1}: {file.name}")
        
        template_file = saved_paths[0]
        boq1_file = saved_paths[1]
        boq2_file = saved_paths[2]
        
        output_filename = 'Merged_BOQ_Output.xlsx'
        output_path = os.path.join(upload_dir, output_filename)
        
        try:
            merger = BOQMerger(template_file)
            merger.merge_two_boqs(boq1_file, boq2_file)
            merger.save(output_path)
            
            output_url = '/media/tender_uploads/' + output_filename
            
            print("✅ BOQ MERGE SUCCESSFUL!")
            
            return JsonResponse({
                "success": True,
                "response": "✅ BOQ files merged successfully!",
                "files": [output_url],
                "output_file": output_filename
            })
            
        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
            return JsonResponse({
                "success": False,
                "error": str(e),
                "response": f"❌ Error during merge: {str(e)}"
            }, status=500)