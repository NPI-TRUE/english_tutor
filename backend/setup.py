from setuptools import setup

setup(
    name='my_project',
    version='0.1',
    install_requires=[
        'flask[async]',
        'flask_cors',
        'torch',
        'llama-index-llms-ollama',
        'python-dotenv',
        'litellm',
        'llama-index-llms-openai',
        'uuid',
        'openai-whisper',
        'gtts',
        'requests'
    ],
)
