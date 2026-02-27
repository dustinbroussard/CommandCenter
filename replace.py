import os

dir_path = '/home/dustin/Projects/CommandCenter'
files_to_process = ['index.html', 'script.js']

replacements = [
    # General UI / Text
    ("PromptForge", "CommandCenter"),
    ("promptForge", "commandCenter"),
    ("AI Prompt Lab", "AI Command Lab"),
    ("AI Prompt Management System", "AI Command Management System"),
    ("AI Enhancement Settings", "AI Recommendation Settings"),
    ("Enhancement Prompt", "Recommendation Prompt"),
    ("Enter system prompt for enhancement...", "Enter system prompt for recommendation..."),
    ("Describe the prompt you want to create or enhance...", "Describe the command you want to create or fix..."),
    ("New Prompt", "New Command"),
    ("Search prompts...", "Search commands..."),
    ("No Prompts Found", "No Commands Found"),
    ("no prompts matching", "no commands matching"),
    ("Prompt Details", "Command Details"),
    ("Copy Prompt", "Copy Command"),
    ("Export All Prompts", "Export All Commands"),
    ("Keeps your current prompts", "Keeps your current commands"),
    ("prompt content to enhance", "command content to fix"),
    ("Prompt Content", "Command"),
    ("e.g., Creative Writing Assistant", "e.g., Start Node.js server"),
    ("e.g., You are a creative writing assistant...", "e.g., node server.js"),
    ("fa-hammer", "fa-terminal"),
    # AI System prompt
    ("You are an expert prompt engineer. Improve the prompt for clarity and effectiveness while preserving intent. Return only the improved prompt text.", "You are an expert Linux sysadmin. Suggest or fix the command described by the user to achieve their goal. Return only the command text, without markdown formatting or code blocks."),
    # JS UI strings
    ("Enhancing...", "Processing..."),
    ("Enhance with AI", "Suggest/Fix Command"),
    ("Prompt enhanced successfully!", "Command fixed successfully!"),
    ("Enhance prompt", "Suggest/Fix command"),
    ("No prompt content to enhance", "No command content to suggest/fix")
]

for filename in files_to_process:
    filepath = os.path.join(dir_path, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        new_content = content
        for old, new in replacements:
            new_content = new_content.replace(old, new)
        
        if content != new_content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filename}")
