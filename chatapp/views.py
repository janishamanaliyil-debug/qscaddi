# # from django.shortcuts import render
# # from django.core.files.storage import FileSystemStorage
# # from django.http import JsonResponse
# # # Create your views here.
# # def index(request):
# #     if request.method == 'POST':
# #         message = request.POST.get('message', '')
# #         files = request.FILES.getlist('files')  # get all files

# #         fs = FileSystemStorage()
# #         file_urls = []
# #         for f in files:
# #             filename = fs.save(f.name, f)
# #             file_urls.append(fs.url(filename))

# #         # You can also save the message to DB here

# #         return JsonResponse({'message': message, 'files': file_urls})
# #     return render(request,'chatapp/index.html')

# # def Login(request):
# #     return render(request,'chatapp/login.html')

# from django.shortcuts import render
# from django.http import JsonResponse, FileResponse, HttpResponse
# from django.core.files.storage import FileSystemStorage
# import os
# from .boq_merger import BOQMerger  # import your merger script class
# from django.conf import settings
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# # Create your views here.
# def index(request):
#     # if request.method == 'POST':
#     #         message = request.POST.get('message', '')
#     #         files = request.FILES.getlist('files')  # all uploaded files
#     #         fs = FileSystemStorage(location=os.path.join(BASE_DIR, 'uploads'))
#     #         os.makedirs(fs.location, exist_ok=True)
#     #         saved_files = []

#     #         for f in files:
#     #             filename = fs.save(f.name, f)
#     #             saved_files.append(os.path.join(fs.location, filename))

#     #         # Check if this is a tender analysis submission
#     #         if request.POST.get('upload_source') == 'tender_analysis':
#     #             # Expecting exactly 3 files: template, boq1, boq2
#     #             if len(saved_files) < 3:
#     #                 return JsonResponse({'error': 'Please upload template, BOQ1, and BOQ2.'})

#     #             template_file = saved_files[0]
#     #             boq1_file = saved_files[1]
#     #             boq2_file = saved_files[2]
#     #             output_file = os.path.join(fs.location, 'Merged_Output.xlsx')

#     #             try:
#     #                 merger = BOQMerger(template_file)
#     #                 merger.merge_two_boqs(boq1_file, boq2_file)
#     #                 merger.save(output_file)

#     #                 # Return URL for download
#     #                 file_url = fs.url('Merged_Output.xlsx')
#     #                 return JsonResponse({
#     #                     'message': 'Files merged successfully.',
#     #                     'files': [file_url],
#     #                     'response': '✅ BOQ merged! You can download the file below.'
#     #                 })

#     #             except Exception as e:
#     #                 return JsonResponse({'error': f'Merge failed: {str(e)}'})

#     #         # Regular message/file upload
#     #         file_urls = [fs.url(os.path.basename(f)) for f in saved_files]
#     #         return JsonResponse({'message': message, 'files': file_urls})
   
   
#     return render(request,'chatapp/index.html')

# def Login(request):
#     return render(request,'chatapp/login.html')

# # def tender_analysis(request):
# #     # =============================
# #     # GET → render template
# #     # =============================
# #     if request.method == "GET":
# #         return render(request, "tender_analysis.html")

# #     # =============================
# #     # POST → handle file upload
# #     # =============================
# #     if request.method == "POST":
# #         print("Received POST request for tender analysis")
# #         message = request.POST.get("message", "")
# #         upload_source = request.POST.get("upload_source")

# #         files = request.FILES.getlist("files")  # IMPORTANT

# #         if not files:
# #             return JsonResponse({
# #                 "success": False,
# #                 "error": "No files received"
# #             }, status=400)

# #         fs = FileSystemStorage()
# #         uploaded_files = []

# #         for file in files:
# #             filename = fs.save(file.name, file)
# #             file_url = fs.url(filename)

# #             uploaded_files.append({
# #                 "name": file.name,
# #                 "size": file.size,
# #                 "url": file_url
# #             })

# #         # 👉 You can trigger BOQ merge / analysis here later

# #         return JsonResponse({
# #             "success": True,
# #             "response": "Files received successfully. Tender analysis started.",
# #             "message": message,
# #             "upload_source": upload_source,
# #             "files": [f["url"] for f in uploaded_files],  # JS expects list
# #             "file_details": uploaded_files
# #         })

# def tender_analysis(request):
#     """
#     Handle tender analysis file uploads
#     Expects 3 files: Template, BOQ1, BOQ2
#     """
#     if request.method == "GET":
#         return render(request, "chatapp/index.html")

#     if request.method == "POST":
#         print("\n" + "="*60)
#         print("📥 TENDER ANALYSIS REQUEST RECEIVED")
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
#             output_url = fs.url(output_filename)
            
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
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
from .boq_merger import BOQMerger  # Your merger class

def index(request):
    return render(request, 'chatapp/index.html')

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
            
            # Generate download URL - FIXED PATH
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