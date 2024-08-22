data = request.get_json()
    message = data["message"][:-1]

    from litellm import completion
    import os

    os.environ['GROQ_API_KEY'] = "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"
    response = completion(
        model="groq/llama3-8b-8192", 
        messages=[
        {"role": "user", "content": message}
    ],
    )

    model_response = response.choices[0].message.content

    print(model_response)