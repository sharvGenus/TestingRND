import os

import openai
import requests

# Add neccesary variables in secrets of the repo
openai.api_type = "azure"
openai.api_key = os.environ.get('AZURE_API_KEY')
openai.api_base = os.environ.get('AZURE_API_BASE')
openai.api_version = os.environ.get('AZURE_API_VERSION')


def review_pull_requests():
     # Add neccesary repo details
    github_token = os.environ.get('GITHUB_TOKEN')
    owner = 'Habilelabs'
    repo_name = 'CustomBot'
    pr_number = os.environ.get('PR_NUMBER')
    url = f'https://api.github.com/repos/{owner}/{repo_name}/pulls/{pr_number}'
    headers = {
        'Authorization': f'token {github_token}'
    }
    # Accesses commits and PRs from Github
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(
            f"GitHub API request failed with status code {response.status_code}")
        return
    else:
        print(f"GitHub API request successful with status code {response.status_code}")
    pr_data = response.json()
    commits_url = pr_data['commits_url']
    commits_response = requests.get(commits_url, headers=headers)
    if commits_response.status_code != 200:
        print(
            f"GitHub API request for PR commits failed with status code {commits_response.status_code}")
        return
    commits_data = commits_response.json()
    # Model prompt
    system_message = """You are `@habilelabs-ai` (aka `github-actions[bot]`), a language model
        trained by OpenAI. Your purpose is to act as a highly experienced
        DevRel (developer relations) professional with focus on cloud-native
        infrastructure.
        Company context -
        HabileLabs is an AI-powered Code reviewer.It boosts code quality and cuts manual effort. Offers context-aware, line-by-line feedback, highlights critical changes,
        enables bot interaction, and lets you commit suggestions directly from GitHub.
        When reviewing or generating content focus on key areas such as -
        - Accuracy
        - Relevance
        - Clarity
        - Technical depth
        - Call-to-action
        - SEO optimization
        - Brand consistency
        - Grammar and prose
        - Typos
        - Hyperlink suggestions
        - Graphics or images (suggest Dall-E image prompts if needed)
        - Empathy
        - Engagement
        
        Keep your answer short and to the point
        """
        
    # Model prompt for summary generation
    system_message_for_summary = """You are `@habilelabs-ai` (aka `github-actions[bot]`), a language model
        trained by OpenAI. Your purpose is to act as a highly experienced
        DevRel (developer relations) professional with focus on cloud-native
        infrastructure.
        Company context -
        HabileLabs is an AI-powered Code reviewer.It boosts code quality and cuts manual effort. Offers context-aware, line-by-line feedback, highlights critical changes,
        enables bot interaction, and lets you commit suggestions directly from GitHub.
        
        You are just checking the recieved functions or code snippets and generate a really short summary of what you think this code is doing
        """
    # Extract and review code changes
    data = []
    changed_files = []
    changes_summary = []
    for commit in commits_data:
        commit_sha = commit['sha']
        commit_url = commit['url']
        # Fetch the code changes in the commit
        commit_response = requests.get(commit_url, headers=headers)
        if commit_response.status_code != 200:
            print(
                f"GitHub API request for commit {commit_sha} failed with status code {commit_response.status_code}")
            continue
        commit_data = commit_response.json()
        files_changed = commit_data['files']
        changed_files.append(files_changed)
    
    try:        
        files = changed_files[0]
        # Review the code changes in each file
        for file_changed in files:
            filename = file_changed['filename']
            patch = file_changed['patch']
            
            chat_completion = openai.ChatCompletion.create(
                messages=[{"role": "system", "content": system_message},
                        {"role": "user", "content": "Review this code for issues, limit your response to only important things. Review only the additions in code, not the deletions"+f" {patch}"},
                        {"role": "user", "content": patch}
                        ],
                engine="GithubCodeReview16K"
            )
            
            summary = chat_completion['choices'][0]['message']['content']
            changes_summary.append(summary)

        # Generate the change summary in each file  
        for file_changed in files:
            filename = file_changed['filename']
            patch = file_changed['patch']
            
            chat_completion = openai.ChatCompletion.create(
                messages=[{"role": "system", "content": system_message_for_summary},
                        {"role": "user", "content": "Review this code to generate a very short summary of what you think this file is doing depending on the functions or code snippet changed. Try to contain everything in less than 40 words"+f" {patch}"},
                        {"role": "user", "content": patch}
                        ],
                engine="GithubCodeReview16K"
            )
            
            short_summary = chat_completion['choices'][0]['message']['content']
            data.append({"filename": filename, "summary": short_summary})
        
        cleaned_data = [
            {
                k: "\n".join([line.strip() for line in v.split('\n')]) if k == "summary" else v
                for k, v in row.items()
            }
            for row in data
        ]
        
        table_rows = "\n".join([f'| {entry["filename"]} | {entry["summary"]} |' for entry in cleaned_data])
        
        comment_data = {
            "commit_id": commit_sha,
            "body": (
                    f'{"".join([line for line in changes_summary])}"\n'
                    ""
                    "  File Changed | Summary\n"
                    "------------ | -------------\n"
                    f'{table_rows}\n'
            ),
        }
        
        comment_url = f'https://api.github.com/repos/{owner}/{repo_name}/issues/{pr_number}/comments'
        response = requests.post(comment_url, headers=headers, json=comment_data)
        if response.status_code == 201:
            print("Comment posted successfully.")
        else:
            print("Failed to post comment.", response.status_code, response.json())
    except:
        comment_data = {
            "commit_id": commit_sha,
            "body": "Token Limit exceeded"
        }
        
        comment_url = f'https://api.github.com/repos/{owner}/{repo_name}/issues/{pr_number}/comments'
        response = requests.post(comment_url, headers=headers, json=comment_data)
        if response.status_code == 201:
            print("Comment posted successfully.")
        else:
            print("Failed to post comment.", response.status_code, response.json())

if __name__ == '__main__':
    review_pull_requests()
