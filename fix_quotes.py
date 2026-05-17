import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()
    
    code = code.replace(\"\\'x-forwarded-for\\'\", \"'x-forwarded-for'\")
    code = code.replace(\"\\'127.0.0.1\\'\", \"'127.0.0.1'\")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            fix_file(os.path.join(root, file))
