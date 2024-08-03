import random

from PIL import Image

w, h = size = (200, 100)
image = Image.new("RGB", size, "white")

cache = []
diff = 25
le = 5
li = 255
d = 20

for y in range(h):
    if y % 10 == 0:
        print(y, y / h * 100)
    for x in range(w):
        r, g, b = random.randint(-d, d), random.randint(-d, d), random.randint(-d, d)
        cache.append(random.randint(-diff // 2, diff // 2) + li)
        image.putpixel((x, y), (sum(cache) // len(cache) + r, sum(cache) // len(cache) + g, sum(cache) // len(cache) + b))
        cache = cache[:le]


for x in range(w):
    if x % 10 == 0:
        print(x, x / w * 100)
    for y in range(h):
        r, g, b = random.randint(-d, d), random.randint(-d, d), random.randint(-d, d)
        cache.append(random.randint(-diff // 2, diff // 2) + li)
        pix = sum(cache) / len(cache)
        pix += image.getpixel((x, y))[0]
        pix = int(pix / 2)
        image.putpixel((x, y), (pix + r, pix + g, pix + b))
        cache = cache[:le]


image.save("back-light.png")
