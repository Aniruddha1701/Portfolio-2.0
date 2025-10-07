# Uploads Directory

This directory stores uploaded resume files.

## Important Notes:
- Files in this directory are automatically managed by the application
- Old resume files are automatically deleted when new ones are uploaded
- Only PDF, DOC, and DOCX files are allowed
- Maximum file size: 5MB
- Files are named with timestamps to avoid conflicts

## Security:
- Only authenticated admins can upload/delete files
- Files are served through the API with proper headers
- Direct access to files is controlled by the application

Do not manually add or remove files from this directory.
