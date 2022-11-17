import os
import argparse

manifest_string = '''{
    "name":"%s",
    "short_name":"%s",
    "start_url":"%s",
    "background_color":"#fff",
    "theme_color":"#2d0",
    "ovr_package_name":"%s",
    "display":"standalone"
}'''
manifest_tag = '<link rel="manifest" href="manifest.json">'
service_worker_js_string = '''<script>if ("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").then (registration => {console.log("SW registered");console.log(registration);}).catch( error => {console.error("SW registration failed");console.error(error);})}</script>'''
sw_js_string = '''self.addEventListener("install", e => {
    console.log("Install!");
    e.waitUntil(
        caches.open('static').then( cache => {
            return cache.addAll([%s])
        })
    )
})
self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then( response => {
            return response || fetch(e.request);
        })
    )
})'''
exclude_list = ['gen.py', 'index.html', 'manifest.json']

def manifestjsongen(longname, shortname, url, packagename):
    # long name can be used immediately
    # short name needs to be checked first
    # url needs to be checked as well
    # packagename needs to be checked

    # check short name
    # short name format will be camel case
    checked_shortname = shortname.split(" ")
    for (i, item) in enumerate(checked_shortname):
        if item[0].islower:
            checked_shortname[i] = item[0].upper() + item[1:]
    checked_shortname = ''.join(checked_shortname)

    # check url
    if url[:7] == 'http://' or url[:8] == 'https://':
        # url is at the correct format
        checked_url = url
    else:
        # using http as default
        checked_url = 'http://{}'.format(url)

    # check packagename
    if len(packagename.split('.')) < 3:
        # package name not long enough, using url
        if checked_url[:7] == 'http://':
            checked_packagename = checked_url[7:]
        elif checked_url[:8] == 'https://':
            checked_packagename = checked_url[8:]
    else:
        checked_packagename = packagename

    global manifest_string
    return manifest_string %(longname, checked_shortname, checked_url, checked_packagename)

# argument parsing
parser = argparse.ArgumentParser()
parser.add_argument('--path', type=str)
parser.add_argument('--long', type=str)
parser.add_argument('--short', type=str)
parser.add_argument('--url', type=str)
parser.add_argument('--pkgname', type=str)
parser.add_argument('--html', type=str)
args = parser.parse_args()

if not args.path:
    args.path = './'
if not args.long:
    print("Error, no long name")
    exit()
if not args.short:
    print("Error, no short name")
    exit()
if not args.url:
    print("No URL, exit")
    exit()
if not args.pkgname:
    args.pkgname = ""
if not args.html:
    args.html = "index.html"
json_string = manifestjsongen(args.long, args.short, args.url, args.pkgname)

# write to the json file
with open("%smanifest.json" % args.path, "w") as f:
    f.write(json_string)

def parsehtmljson(htmldata):
    global manifest_tag
    if manifest_tag in htmldata:
        return htmldata
    # find the insert location
    index = htmldata.index("<html")
    temp = index + len("<html")
    index = htmldata[temp:].index("<head")
    temp = index + temp + len("<head")
    index = htmldata[temp:].index(">")
    temp = index + temp + len(">")
    insert_location = temp

    # shove it in
    return '%s\n    %s%s' % (htmldata[:insert_location], manifest_tag, htmldata[insert_location:])

# add in the register service worker part
def parsehtmljs(htmldata):
    if 'if ("serviceWorker" in navigator)' in htmldata:
        return htmldata
    global manifest_tag, service_worker_js_string
    # add it after manifest tag
    index = htmldata.index(manifest_tag) + len(manifest_tag)
    return '%s\n    %s%s' % (htmldata[:index], service_worker_js_string, htmldata[index:])

# obatain all files in the directory and sub directories
def swjsfilesgen(path):
    global exclude_list
    files = []
    for r,d,f in os.walk(args.path):
        for file in f:
            temp = os.path.join(r, file)[len(args.path):]
            if temp in exclude_list:
                continue
            files.append("'./%s'" % temp)
    return ','.join(files)

# write to sw.js
def swjswrite(path):
    global sw_js_string
    with open("%ssw.js" % path, "w") as f:
        f.write(sw_js_string % swjsfilesgen(path))
    return

# write to the html file
def htmlgen(path, html):
    with open("%s%s" % (path, html), "r") as f:
        html_data = f.read()

    new_html = parsehtmljson(html_data)
    new_html = parsehtmljs(new_html)

    with open("%s%s" % (path, html), "w") as f:
        f.write(new_html)
    return

htmlgen(args.path, args.html)
swjswrite(args.path)
