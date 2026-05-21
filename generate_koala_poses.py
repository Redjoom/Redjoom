import os
import openai
import requests

BASE_PROMPT = (
    "Cute cartoon koala barista character, deep teal ears #4A90A4, white face, "
    "big black oval eyes, small black nose, soft pink blush on cheeks, wearing "
    "warm brown apron #C8956C with tiny koala face logo, {pose}. "
    "Transparent background, clean vector illustration, premium cafe branding, "
    "chibi proportions but elegant, front-facing, full body visible, "
    "consistent character design"
)

poses = [
    "barista behind espresso machine, steam rising",
    "holding giant coffee cup as umbrella, rain drops",
    "peeking from corner, curious expression",
    "scientist with lab goggles, mixing beaker",
    "taking selfie with smartphone, emojis floating",
    "standing next to map pin, pointing forward",
    "sleeping in giant cup, relaxed expression",
]

client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])

for i, pose in enumerate(poses, start=1):
    print(f"Generating pose {i}/{len(poses)}: {pose}")
    response = client.images.generate(
        model="gpt-image-1",
        prompt=BASE_PROMPT.format(pose=pose),
        size="1024x1024",
        quality="standard",
        n=1,
    )

    img_url = response.data[0].url
    img_data = requests.get(img_url).content
    filename = f"koala_pose_{i}.png"
    with open(filename, "wb") as f:
        f.write(img_data)

    print(f"  Saved → {filename}")

print("Done! All poses generated.")
