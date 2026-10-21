import re
import urllib.request

urls = [
    "https://start.caredirect.com/",
    "https://www.caredirect.com/",
]

for url in urls:
    html = urllib.request.urlopen(url, timeout=20).read().decode("utf-8", "ignore")
    print("===", url)
    print("GTM", sorted(set(re.findall(r"GTM-[A-Z0-9]+", html))))
    print("GA4", sorted(set(re.findall(r"G-[A-Z0-9]{8,}", html)))[:10])
    print("UA", sorted(set(re.findall(r"UA-\d+-\d+", html))))
    print("FB", sorted(set(re.findall(r"fbq\(\s*['\"]init['\"]\s*,\s*['\"](\d+)['\"]", html))))
    print("fbevents", "fbevents" in html)
    print("len", len(html))
