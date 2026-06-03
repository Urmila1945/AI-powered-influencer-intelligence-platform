import os
import re

def replace_in_file(filepath, old, new):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Case insensitive replace but keeping case for exact matches if needed.
        # Simple replacements for ViralMind, viralmind, VIRALMIND
        new_content = content.replace('ViralMind', 'ViralMind')
        new_content = new_content.replace('viralmind', 'viralmind')
        new_content = new_content.replace('VIRALMIND', 'VIRALMIND')
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        pass

def scan_directory(directory):
    skip_dirs = {'.git', 'node_modules', '__pycache__', 'dist', 'build', '.gemini'}
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for file in files:
            if not file.endswith(('.pyc', '.png', '.jpg', '.jpeg', '.gif', '.zip', '.pdf')):
                filepath = os.path.join(root, file)
                replace_in_file(filepath, 'viralmind', 'viralmind')

if __name__ == '__main__':
    scan_directory('.')
