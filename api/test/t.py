s = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAWCAYAAADNX8xBAAAAKUlEQVQ4EWP4TyXAQCVz/o8aRDgkR8NoNIwIhwBhFaPpaDSMCIcAYRUAT8AqKwH8260AAAAASUVORK5CYII="
s = s.split(',')[1]

import base64
r = base64.b64decode(s)
print(type(r))
