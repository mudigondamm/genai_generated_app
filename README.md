# A Stock Dashboard application to compare closing prices of different stock tickers. 
Stock Dashboard application with code generated by Generative AI (LLMs). 

## Introduction 
Created this project with 98% of the code through LLM prompts. Goal of this project is to see how much of code I can generate 
purely with LLM prompts with minimal rewrites of the code. For this exercise, I have generated Stock price comparison dashboard application. 

Prompts used for this project can be found in '/LLM prompts' folder. Please note LLMs are probabilistic and somewhat randomness is present in them. Responses may slightly 
vary for same prompts. 

Tech stack used for this is: Python Flask, D3.js, HTML, CSS, and Javascript. D3.js for visualization gives lot of flexibility for charting. But, with flexibility comes some what complexity in the code. I selected it to see, how easily we can generate D3.js charts. 

I was able to generate almost 98% of the code without any changes. Remaining 2% percent of the time I had to debug configuration, 
and parsing errors in D3.js code. So, it is not 100% but very impressive. I didn't have to Strackoverflow at all to debug issues. 
I was able to resolve and get the app running in couple of hours with minimal issues. 

This code was developed to accompany my Medium article titled "Use of AI for Enhanced Software Engineering Productivity." You can read the full article here: Use of AI for Enhanced Software Engineering Productivity.
## Running the application 

Please follow the steps to run on your local machine. Python version used for the application is 3.9. Best practice is to create a virtual environment. Alos, IDE to go with is Pycharm community version, if you want to give it a try.:
 
 1. Make sure to install python 3.9. It should work on latest versions of Python as well, but not tested. 
 2. Install dependencies using: pip install -r requirements.txt 
 2. python.exe .\run.py
 3. By default app is configured to be reachable at http://localhost:5000/


## Application Home Page Screenshot

![Alt text](app_home_page.png?raw=true "Stock Dashboard App")

## CodeAnt.ai 

For analysing code, I used a another developer tool called CodeAnt.ai. CodeAnt.ai provides analysis, automated fixes and PRs 
of the code on:

1. Code quality
2. Application security
3. Infrastructure security
4. Potential bugs

To learn more visit: https://www.codeant.ai/. Also, I have written a medium on various AI tools with screenshots: https://medium.com/@mudigonda.mm/use-of-ai-for-enhanced-software-engineering-productivity-9d8c96555286.